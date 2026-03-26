<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class InstallService
{
    private const TOTAL_STEPS = 6;
    private const RUNNING_STATUS_STALE_AFTER_SECONDS = 30;

    private ?string $installRunId = null;
    private ?string $generatedAppKey = null;
    private ?string $generatedJwtSecret = null;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function run(array $data, ?string $installRunId = null): array
    {
        $this->installRunId = $installRunId;
        $this->generatedAppKey = null;
        $this->generatedJwtSecret = null;

        $this->disableExecutionTimeLimit();
        $this->logInfo('[install] run_start');
        $this->setStatus('running', 'Initialisation de l’installation...', 2, 0);

        try {
            $this->setStatus('running', 'Vérification des prérequis...', 8, 0);
            $this->assertInstallAllowed();
            $this->ensureEnvironmentFileExists();

            $this->setStatus('running', 'Validation de la connexion base de données...', 16, 0);
            $this->testDatabaseConnection($data);

            $this->setStatus('running', 'Préparation de l’environnement...', 28, 1);
            $this->applyRuntimeInstallConfiguration($data);

            $this->setStatus('running', 'Préparation des secrets d’application...', 46, 2);
            $this->prepareSecretsForInstallation();

            $this->setStatus('running', 'Migration de la base de données...', 70, 3);
            $this->runArtisan('migrate', ['--force' => true]);

            $this->setStatus('running', 'Configuration des liens de stockage...', 78, 3);
            $this->runArtisan('storage:link', ['--force' => true]);

            $this->setStatus('running', 'Injection des données...', 84, 4);
            $summary = $this->seedAccordingToMode($data);

            $this->setStatus('running', 'Validation du compte administrateur...', 92, 5);
            $this->assertAdminExists((string) $summary['admin_email']);

            $this->setStatus('running', 'Finalisation de l’installation...', 97, 5);
            $this->finalizeInstallation($data);

            $this->setStatus('success', 'Installation terminée avec succès.', 100, self::TOTAL_STEPS - 1);
            $this->logInfo('[install] run_success');

            return $summary;
        } catch (Throwable $exception) {
            $message = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : 'Erreur inattendue pendant l’installation.';

            $this->setStatus('error', $message, 100, self::TOTAL_STEPS - 1);
            $this->logError('[install] run_error', [
                'message' => $message,
                'exception_class' => $exception::class,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            if ($exception instanceof RuntimeException) {
                throw $exception;
            }

            throw new RuntimeException($message, 0, $exception);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function getStatus(): array
    {
        $default = [
            'state' => 'idle',
            'message' => 'En attente.',
            'progress' => 0,
            'current_step' => 0,
            'total_steps' => self::TOTAL_STEPS,
            'updated_at' => now()->toIso8601String(),
        ];

        $lockExists = file_exists(storage_path('app/install.lock'));

        if ($lockExists) {
            return array_merge($default, [
                'state' => 'success',
                'message' => 'Application déjà installée.',
                'progress' => 100,
                'current_step' => self::TOTAL_STEPS - 1,
            ]);
        }

        $statusPath = $this->statusFilePath();

        if (file_exists($statusPath)) {
            $content = file_get_contents($statusPath);

            if ($content !== false) {
                $decoded = json_decode($content, true);

                if ($this->isRecentRunningStatus($decoded)) {
                    return array_merge($default, [
                        'state' => 'error',
                        'message' => 'Installation interrompue après une étape incomplète. Relance le processus et consulte les logs.',
                        'progress' => (int) ($decoded['progress'] ?? 0),
                        'current_step' => (int) ($decoded['current_step'] ?? 0),
                        'interrupted' => true,
                    ]);
                }

                if (is_array($decoded)) {
                    return array_merge($default, $decoded);
                }
            }
        }

        return $default;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function testDatabaseConnection(array $data): void
    {
        config([
            'database.default' => $data['db_connection'],
            "database.connections.{$data['db_connection']}.host" => $data['db_host'] ?? null,
            "database.connections.{$data['db_connection']}.port" => $data['db_port'] ?? null,
            "database.connections.{$data['db_connection']}.database" => $data['db_database'],
            "database.connections.{$data['db_connection']}.username" => $data['db_username'] ?? null,
            "database.connections.{$data['db_connection']}.password" => $data['db_password'] ?? null,
        ]);

        DB::purge($data['db_connection']);
        DB::reconnect($data['db_connection']);
        DB::connection($data['db_connection'])->getPdo();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function applyRuntimeInstallConfiguration(array $data): void
    {
        config([
            'database.default' => $data['db_connection'],
            "database.connections.{$data['db_connection']}.host" => $data['db_host'] ?? null,
            "database.connections.{$data['db_connection']}.port" => $data['db_port'] ?? null,
            "database.connections.{$data['db_connection']}.database" => $data['db_database'],
            "database.connections.{$data['db_connection']}.username" => $data['db_username'] ?? null,
            "database.connections.{$data['db_connection']}.password" => $data['db_password'] ?? null,
            'session.driver' => 'file',
            'cache.default' => 'file',
            'queue.default' => 'sync',
        ]);

        DB::purge($data['db_connection']);
        DB::reconnect($data['db_connection']);
    }

    private function prepareSecretsForInstallation(): void
    {
        $this->generatedAppKey = $this->resolveAppKey();
        $this->generatedJwtSecret = $this->resolveJwtSecret();

        config([
            'app.key' => $this->generatedAppKey,
            'jwt.secret' => $this->generatedJwtSecret,
        ]);

        $this->logInfo('[install] secrets_prepared', [
            'app_key_generated' => true,
            'jwt_secret_generated' => true,
        ]);
    }

    private function resolveAppKey(): string
    {
        $existing = (string) config('app.key', '');

        if ($existing !== '') {
            return $existing;
        }

        return 'base64:'.base64_encode(random_bytes(32));
    }

    private function resolveJwtSecret(): string
    {
        $existing = (string) config('jwt.secret', '');

        if ($existing !== '') {
            return $existing;
        }

        return Str::random(64);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function seedAccordingToMode(array $data): array
    {
        $installMode = (string) ($data['install_mode'] ?? 'demo');
        $withDemo = $installMode === 'demo';

        config([
            'install.seed.admin_name' => (string) $data['admin_name'],
            'install.seed.admin_email' => (string) $data['admin_email'],
            'install.seed.admin_password' => (string) $data['admin_password'],
            'install.seed.with_demo_user' => $withDemo,
            'install.seed.with_demo_products' => $withDemo,
        ]);

        $this->runArtisan('db:seed', ['--force' => true]);

        if (! $withDemo) {
            User::query()
                ->where('email', 'user@example.com')
                ->where('role', User::ROLE_USER)
                ->delete();
        }

        Config::set('install.seed.admin_name', null);
        Config::set('install.seed.admin_email', null);
        Config::set('install.seed.admin_password', null);
        Config::set('install.seed.with_demo_user', null);
        Config::set('install.seed.with_demo_products', null);

        return [
            'install_mode' => $installMode,
            'admin_email' => (string) $data['admin_email'],
            'admin_password' => (string) $data['admin_password'],
            'demo_user_enabled' => $withDemo,
            'demo_user_email' => $withDemo ? 'user@example.com' : null,
            'demo_user_password' => $withDemo ? 'userpassword' : null,
        ];
    }

    private function assertAdminExists(string $email): void
    {
        $adminUser = User::query()->where('email', $email)->first();

        if (! $adminUser) {
            throw new RuntimeException('Le compte administrateur est introuvable après l’installation.');
        }

        if ($adminUser->role !== User::ROLE_ADMIN) {
            throw new RuntimeException('Le compte administrateur n\'a pas le rôle attendu.');
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function finalizeInstallation(array $data): void
    {
        if (! is_dir(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }

        if (file_put_contents(storage_path('app/install.lock'), now()->toDateTimeString()) === false) {
            throw new RuntimeException('Impossible de créer le fichier de verrou d\'installation.');
        }

        $this->setStatus('success', 'Installation terminée avec succès.', 100, self::TOTAL_STEPS - 1);

        try {
            $this->persistInstalledEnvironment($data);
        } catch (Throwable $exception) {
            $this->logError('[install] persist_env_warning', [
                'message' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function persistInstalledEnvironment(array $data): void
    {
        $this->updateEnvironmentVariables([
            'DB_CONNECTION' => (string) $data['db_connection'],
            'DB_HOST' => (string) ($data['db_host'] ?? ''),
            'DB_PORT' => (string) ($data['db_port'] ?? ''),
            'DB_DATABASE' => (string) $data['db_database'],
            'DB_USERNAME' => (string) ($data['db_username'] ?? ''),
            'DB_PASSWORD' => (string) ($data['db_password'] ?? ''),
            'APP_KEY' => (string) ($this->generatedAppKey ?? $this->resolveAppKey()),
            'JWT_SECRET' => (string) ($this->generatedJwtSecret ?? $this->resolveJwtSecret()),
            'APP_INSTALLED' => 'true',
            'SESSION_DRIVER' => 'database',
            'CACHE_STORE' => 'database',
            'QUEUE_CONNECTION' => 'database',
        ]);
    }

    /**
     * @param  array<string, string>  $replacements
     */
    private function updateEnvironmentVariables(array $replacements): void
    {
        $envPath = base_path('.env');
        $env = file_get_contents($envPath);

        if ($env === false) {
            throw new RuntimeException('Impossible de lire le fichier .env');
        }

        foreach ($replacements as $key => $value) {
            $normalizedValue = $this->normalizeEnvValue($value);
            $pattern = '/^'.preg_quote($key, '/').'=.*/m';

            if (preg_match($pattern, $env)) {
                $env = preg_replace($pattern, "{$key}={$normalizedValue}", $env) ?? $env;
            } else {
                $env .= PHP_EOL."{$key}={$normalizedValue}";
            }
        }

        if (file_put_contents($envPath, $env) === false) {
            throw new RuntimeException('Impossible d\'écrire dans le fichier .env');
        }
    }

    private function normalizeEnvValue(string $value): string
    {
        if ($value === '') {
            return '';
        }

        if (preg_match('/[\s#="\$]/', $value)) {
            return '"'.addcslashes($value, "\\\"").'"';
        }

        return $value;
    }

    private function runArtisan(string $command, array $parameters = []): void
    {
        $exitCode = Artisan::call($command, $parameters);

        if ($exitCode !== 0) {
            $output = trim(Artisan::output());
            $message = "Échec de la commande artisan '{$command}'.";

            if ($output !== '') {
                $message .= ' '.$output;
            }

            throw new RuntimeException($message);
        }
    }

    private function ensureEnvironmentFileExists(): void
    {
        $envPath = base_path('.env');

        if (file_exists($envPath)) {
            return;
        }

        $examplePath = base_path('.env.example');

        if (! file_exists($examplePath)) {
            throw new RuntimeException('Fichier .env.example introuvable.');
        }

        if (! copy($examplePath, $envPath)) {
            throw new RuntimeException('Impossible de créer le fichier .env');
        }
    }

    private function assertInstallAllowed(): void
    {
        $lockExists = file_exists(storage_path('app/install.lock'));

        if ($lockExists) {
            throw new RuntimeException('Application déjà installée.');
        }

        if (app()->environment('production') && ! filter_var(env('INSTALL_ALLOWED_IN_PRODUCTION', false), FILTER_VALIDATE_BOOL)) {
            throw new RuntimeException('Installation désactivée en production.');
        }
    }

    private function setStatus(string $state, string $message, int $progress, int $currentStep): void
    {
        $statusPath = $this->statusFilePath();

        if (! is_dir(dirname($statusPath))) {
            mkdir(dirname($statusPath), 0755, true);
        }

        $payload = [
            'state' => $state,
            'message' => $message,
            'progress' => max(0, min(100, $progress)),
            'current_step' => max(0, min(self::TOTAL_STEPS - 1, $currentStep)),
            'total_steps' => self::TOTAL_STEPS,
            'updated_at' => now()->toIso8601String(),
        ];

        file_put_contents($statusPath, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

        $this->logInfo('[install] status_update', [
            'state' => $payload['state'],
            'message' => $payload['message'],
            'progress' => $payload['progress'],
            'current_step' => $payload['current_step'],
            'total_steps' => $payload['total_steps'],
        ]);
    }

    private function statusFilePath(): string
    {
        return storage_path('app/install-status.json');
    }

    /**
     * @param  mixed  $decoded
     */
    private function isRecentRunningStatus(mixed $decoded): bool
    {
        if (! is_array($decoded)) {
            return false;
        }

        if (($decoded['state'] ?? null) !== 'running') {
            return false;
        }

        if (! isset($decoded['updated_at']) || ! is_string($decoded['updated_at'])) {
            return false;
        }

        try {
            $updatedAt = Carbon::parse($decoded['updated_at']);
        } catch (Throwable) {
            return false;
        }

        return now()->diffInSeconds($updatedAt) >= self::RUNNING_STATUS_STALE_AFTER_SECONDS;
    }

    private function disableExecutionTimeLimit(): void
    {
        if (function_exists('set_time_limit')) {
            @set_time_limit(0);
        }
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logInfo(string $message, array $context = []): void
    {
        $payload = array_merge($this->baseLogContext(), $context);
        Log::channel('stderr')->info($message, $payload);
        Log::info($message, $payload);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logError(string $message, array $context = []): void
    {
        $payload = array_merge($this->baseLogContext(), $context);
        Log::channel('stderr')->error($message, $payload);
        Log::error($message, $payload);
    }

    /**
     * @return array<string, string|null>
     */
    private function baseLogContext(): array
    {
        return [
            'install_run_id' => $this->installRunId,
        ];
    }
}
