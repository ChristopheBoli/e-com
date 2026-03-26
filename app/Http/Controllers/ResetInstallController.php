<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResetInstallRequest;
use App\Services\ResetInstallService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;
use RuntimeException;
use Throwable;

class ResetInstallController extends Controller
{
    public function __construct(
        private readonly ResetInstallService $resetInstallService,
    ) {
    }

    public function show(): View
    {
        $isInstalled = filter_var(env('APP_INSTALLED', false), FILTER_VALIDATE_BOOL);
        $lockExists = file_exists(storage_path('app/install.lock'));

        if (! $isInstalled && ! $lockExists) {
            return view('reset-install', [
                'notInstalled' => true,
            ]);
        }

        return view('reset-install', [
            'notInstalled' => false,
            'isProduction' => app()->environment('production'),
        ]);
    }

    public function reset(ResetInstallRequest $request): RedirectResponse|JsonResponse
    {
        $resetId = (string) Str::uuid();

        Log::channel('stderr')->info('[reset] start', [
            'reset_id' => $resetId,
            'expects_json' => $request->expectsJson(),
            'drop_database' => $request->input('drop_database', false),
        ]);

        Log::info('[reset] start', [
            'reset_id' => $resetId,
            'expects_json' => $request->expectsJson(),
            'drop_database' => $request->input('drop_database', false),
        ]);

        try {
            $result = $this->resetInstallService->run($request->validated());

            Log::channel('stderr')->info('[reset] success', [
                'reset_id' => $resetId,
            ]);

            Log::info('[reset] success', [
                'reset_id' => $resetId,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Réinitialisation terminée avec succès.',
                    'redirect' => route('reset-install.done'),
                    'dropped_database' => $result['dropped_database'] ?? false,
                    'server_restart' => true,
                ]);
            }

            // Le serveur va redémarrer suite à la modification du .env
            // On renvoie une page HTML avec JavaScript qui redirige automatiquement
            return response(view('reset-restart', [
                'redirect_url' => route('reset-install.done'),
            ]))->header('Content-Type', 'text/html');
        } catch (RuntimeException $exception) {
            Log::channel('stderr')->warning('[reset] runtime_error', [
                'reset_id' => $resetId,
                'message' => $exception->getMessage(),
            ]);

            Log::warning('[reset] runtime_error', [
                'reset_id' => $resetId,
                'message' => $exception->getMessage(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage(),
                ], 422);
            }

            return back()
                ->withInput()
                ->withErrors([
                    'reset' => $exception->getMessage(),
                ]);
        } catch (Throwable $exception) {
            Log::channel('stderr')->error('[reset] fatal_error', [
                'reset_id' => $resetId,
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            Log::error('Reset fatal error', [
                'reset_id' => $resetId,
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur inattendue pendant la réinitialisation. Consulte storage/logs/laravel.log.',
                ], 500);
            }

            return back()
                ->withInput()
                ->withErrors([
                    'reset' => 'Erreur inattendue pendant la réinitialisation. Consulte storage/logs/laravel.log.',
                ]);
        }
    }

    public function done(): View
    {
        return view('reset-install-success');
    }
}
