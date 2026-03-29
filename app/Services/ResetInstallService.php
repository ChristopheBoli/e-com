<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class ResetInstallService
{
    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function run(array $data): array
    {
        $this->logInfo('[reset] run_start');

        try {
            $this->assertResetAllowed();

            if (! empty($data['drop_database'])) {
                $this->logInfo('[reset] step_drop_tables');
                $this->dropDatabaseTables();
            }

            $this->logInfo('[reset] step_delete_locks');
            $this->deleteLockFiles();

            $this->logInfo('[reset] step_clear_cache');
            $this->clearCache();

            $this->logInfo('[reset] run_success');

            return [
                'success' => true,
                'message' => 'Réinitialisation terminée avec succès.',
                'dropped_database' => ! empty($data['drop_database']),
            ];
        } catch (Throwable $exception) {
            $message = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : 'Erreur inattendue pendant la réinitialisation.';

            $this->logError('[reset] run_error', [
                'message' => $message,
                'exception_class' => $exception::class,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            throw new RuntimeException($message, 0, $exception);
        }
    }

    public function finalizeEnvironmentForInstall(): void
    {
        $this->logInfo('[reset] finalize_start');

        try {
            $this->assertResetAllowed();
            $this->resetEnvironmentVariable();
            $this->logInfo('[reset] finalize_success');
        } catch (Throwable $exception) {
            $message = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : 'Erreur inattendue pendant la finalisation.';

            $this->logError('[reset] finalize_error', [
                'message' => $message,
                'exception_class' => $exception::class,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            throw new RuntimeException($message, 0, $exception);
        }
    }

    private function assertResetAllowed(): void
    {
        if (app()->environment('production') && ! $this->isResetAllowedInProduction()) {
            throw new RuntimeException('Réinitialisation désactivée en production. Définissez RESET_ALLOWED_IN_PRODUCTION=true pour l\'autoriser.');
        }
    }

    private function deleteLockFiles(): void
    {
        $lockFile = storage_path('app/install.lock');
        $statusFile = storage_path('app/install-status.json');

        $deleted = [];

        if (file_exists($lockFile)) {
            if (! unlink($lockFile)) {
                throw new RuntimeException('Impossible de supprimer le fichier de verrou install.lock');
            }
            $deleted[] = 'install.lock';
        }

        if (file_exists($statusFile)) {
            if (! unlink($statusFile)) {
                throw new RuntimeException('Impossible de supprimer le fichier install-status.json');
            }
            $deleted[] = 'install-status.json';
        }

        if (empty($deleted)) {
            throw new RuntimeException('Aucun fichier de verrou trouvé. L\'application ne semble pas être installée.');
        }

        $this->logInfo('[reset] locks_deleted', ['files' => $deleted]);
    }

    private function resetEnvironmentVariable(): void
    {
        $envPath = base_path('.env');
        $env = file_get_contents($envPath);

        if ($env === false) {
            throw new RuntimeException('Impossible de lire le fichier .env');
        }

        $pattern = '/^APP_INSTALLED=.*/m';
        $replacement = 'APP_INSTALLED=false';

        if (preg_match($pattern, $env)) {
            $env = preg_replace($pattern, $replacement, $env) ?? $env;
        } else {
            $env .= PHP_EOL.$replacement;
        }

        if (file_put_contents($envPath, $env) === false) {
            throw new RuntimeException('Impossible d\'écrire dans le fichier .env');
        }

        putenv('APP_INSTALLED=false');
        $_ENV['APP_INSTALLED'] = 'false';
        $_SERVER['APP_INSTALLED'] = 'false';

        $this->logInfo('[reset] env_reset');
    }

    private function dropDatabaseTables(): void
    {
        try {
            $connection = DB::connection();
            $databaseName = $connection->getDatabaseName();

            if (! $databaseName) {
                $this->logInfo('[reset] no_database_configured');
                return;
            }

            $exitCode = Artisan::call('migrate:fresh', [
                '--force' => true,
                '--seed' => false,
            ]);

            if ($exitCode !== 0) {
                $output = trim(Artisan::output());
                throw new RuntimeException("Échec de migrate:fresh. {$output}");
            }

            $this->logInfo('[reset] tables_dropped_and_cleaned');
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression des tables: '.$exception->getMessage(), 0, $exception);
        }
    }

    private function clearCache(): void
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            $this->logInfo('[reset] cache_cleared');
        } catch (Throwable $exception) {
            $this->logError('[reset] cache_clear_warning', [
                'message' => $exception->getMessage(),
            ]);
        }
    }

    private function isResetAllowedInProduction(): bool
    {
        return filter_var(env('RESET_ALLOWED_IN_PRODUCTION', false), FILTER_VALIDATE_BOOL);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logInfo(string $message, array $context = []): void
    {
        Log::channel('stderr')->info($message, $context);
        Log::info($message, $context);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logError(string $message, array $context = []): void
    {
        Log::channel('stderr')->error($message, $context);
        Log::error($message, $context);
    }
}
