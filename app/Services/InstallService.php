<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class InstallService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function run(array $data): void
    {
        $this->assertInstallAllowed();

        $this->testDatabaseConnection($data);
        $this->writeEnvironmentFile($data);

        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);

        User::query()->updateOrCreate(
            ['email' => $data['admin_email']],
            [
                'name' => $data['admin_name'],
                'password' => Hash::make($data['admin_password']),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ]
        );

        $this->markInstalled();
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
    private function writeEnvironmentFile(array $data): void
    {
        $envPath = base_path('.env');
        $env = file_get_contents($envPath);

        if ($env === false) {
            throw new RuntimeException('Impossible de lire le fichier .env');
        }

        $replacements = [
            'DB_CONNECTION' => (string) $data['db_connection'],
            'DB_HOST' => (string) ($data['db_host'] ?? ''),
            'DB_PORT' => (string) ($data['db_port'] ?? ''),
            'DB_DATABASE' => (string) $data['db_database'],
            'DB_USERNAME' => (string) ($data['db_username'] ?? ''),
            'DB_PASSWORD' => (string) ($data['db_password'] ?? ''),
            'APP_INSTALLED' => 'true',
        ];

        foreach ($replacements as $key => $value) {
            $quoted = str_contains($value, ' ') ? '"'.$value.'"' : $value;
            $pattern = "/^{$key}=.*/m";

            if (preg_match($pattern, $env)) {
                $env = preg_replace($pattern, "{$key}={$quoted}", $env) ?? $env;
            } else {
                $env .= PHP_EOL."{$key}={$quoted}";
            }
        }

        if (file_put_contents($envPath, $env) === false) {
            throw new RuntimeException('Impossible d\'écrire dans le fichier .env');
        }
    }

    private function markInstalled(): void
    {
        if (! is_dir(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }

        if (file_put_contents(storage_path('app/install.lock'), now()->toDateTimeString()) === false) {
            throw new RuntimeException('Impossible de créer le fichier de verrou d\'installation.');
        }
    }

    private function assertInstallAllowed(): void
    {
        $isInstalled = filter_var(env('APP_INSTALLED', false), FILTER_VALIDATE_BOOL);
        $lockExists = file_exists(storage_path('app/install.lock'));

        if ($isInstalled || $lockExists) {
            throw new RuntimeException('Application déjà installée.');
        }

        if (app()->environment('production') && ! filter_var(env('INSTALL_ALLOWED_IN_PRODUCTION', false), FILTER_VALIDATE_BOOL)) {
            throw new RuntimeException('Installation désactivée en production.');
        }
    }
}
