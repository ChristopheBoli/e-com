<?php

namespace App\Http\Controllers;

use App\Http\Requests\Install\InstallRequest;
use App\Services\InstallService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;
use RuntimeException;
use Throwable;

class InstallController extends Controller
{
    public function __construct(
        private readonly InstallService $installService,
    ) {
    }

    public function show(): View
    {
        return view('install', [
            'defaultConnection' => old('db_connection', 'mysql'),
            'defaultInstallMode' => old('install_mode', 'demo'),
        ]);
    }

    public function status(): JsonResponse
    {
        return response()->json($this->installService->getStatus());
    }

    public function done(): View
    {
        $summary = session('install_summary', [
            'admin_email' => 'admin@example.com',
            'admin_password' => 'adminpassword',
            'demo_user_enabled' => true,
            'demo_user_email' => 'user@example.com',
            'demo_user_password' => 'userpassword',
            'install_mode' => 'demo',
        ]);

        return view('install-success', [
            'adminEmail' => (string) ($summary['admin_email'] ?? 'admin@example.com'),
            'adminPassword' => (string) ($summary['admin_password'] ?? 'adminpassword'),
            'demoUserEnabled' => (bool) ($summary['demo_user_enabled'] ?? false),
            'demoUserEmail' => (string) ($summary['demo_user_email'] ?? 'user@example.com'),
            'demoUserPassword' => (string) ($summary['demo_user_password'] ?? 'userpassword'),
            'installMode' => (string) ($summary['install_mode'] ?? 'simple'),
        ]);
    }

    public function install(InstallRequest $request): RedirectResponse|JsonResponse
    {
        $installRunId = (string) Str::uuid();

        Log::channel('stderr')->info('[install] start', [
            'install_run_id' => $installRunId,
            'expects_json' => $request->expectsJson(),
            'db_connection' => $request->input('db_connection'),
            'db_database' => $request->input('db_database'),
            'install_mode' => $request->input('install_mode'),
            'admin_email' => $request->input('admin_email'),
        ]);

        Log::info('[install] start', [
            'install_run_id' => $installRunId,
            'expects_json' => $request->expectsJson(),
            'db_connection' => $request->input('db_connection'),
            'db_database' => $request->input('db_database'),
            'install_mode' => $request->input('install_mode'),
            'admin_email' => $request->input('admin_email'),
        ]);

        try {
            $summary = $this->installService->run($request->validated(), $installRunId);

            Log::channel('stderr')->info('[install] success', [
                'install_run_id' => $installRunId,
            ]);

            Log::info('[install] success', [
                'install_run_id' => $installRunId,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Installation terminée avec succès.',
                    'redirect' => route('install.done'),
                    'install_summary' => [
                        'install_mode' => $summary['install_mode'],
                        'admin_email' => $summary['admin_email'],
                        'demo_user_enabled' => $summary['demo_user_enabled'],
                        'demo_user_email' => $summary['demo_user_email'],
                    ],
                ]);
            }

            return redirect()->route('install.done')->with('install_summary', $summary);
        } catch (RuntimeException $exception) {
            Log::channel('stderr')->warning('[install] runtime_error', [
                'install_run_id' => $installRunId,
                'message' => $exception->getMessage(),
            ]);

            Log::warning('[install] runtime_error', [
                'install_run_id' => $installRunId,
                'message' => $exception->getMessage(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage(),
                ], 422);
            }

            return back()
                ->withInput($request->except(['db_password', 'admin_password', 'admin_password_confirmation', 'install_token']))
                ->withErrors([
                    'install' => $exception->getMessage(),
                ]);
        } catch (Throwable $exception) {
            Log::channel('stderr')->error('[install] fatal_error', [
                'install_run_id' => $installRunId,
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            Log::error('Install fatal error', [
                'install_run_id' => $installRunId,
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur inattendue pendant l’installation. Consulte storage/logs/laravel.log.',
                ], 500);
            }

            return back()
                ->withInput($request->except(['db_password', 'admin_password', 'admin_password_confirmation', 'install_token']))
                ->withErrors([
                    'install' => 'Erreur inattendue pendant l’installation. Consulte storage/logs/laravel.log.',
                ]);
        }
    }
}
