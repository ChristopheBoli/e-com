<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstallationAllowed
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lockExists = file_exists(storage_path('app/install.lock'));

        if ($lockExists) {
            return response()->view('errors.install-blocked', [
                'title' => 'Application déjà installée',
                'message' => 'Cette application est déjà installée. Pour relancer l’assistant d’installation, réinitialisez d’abord l’état d’installation.',
                'primaryActionUrl' => route('reset-install.show'),
                'primaryActionLabel' => 'Ouvrir /reset-install',
                'secondaryActionUrl' => url('/'),
                'secondaryActionLabel' => 'Retour à l’accueil',
            ], 403);
        }

        if (app()->environment('production') && ! filter_var(env('INSTALL_ALLOWED_IN_PRODUCTION', false), FILTER_VALIDATE_BOOL)) {
            return response()->view('errors.install-blocked', [
                'title' => 'Installation non autorisée en production',
                'message' => 'L’installation est désactivée en production. Définissez INSTALL_ALLOWED_IN_PRODUCTION=true dans .env uniquement si vous devez exceptionnellement relancer l’installation.',
                'primaryActionUrl' => url('/'),
                'primaryActionLabel' => 'Retour à l’accueil',
                'secondaryActionUrl' => route('install.status'),
                'secondaryActionLabel' => 'Voir le statut',
            ], 403);
        }

        return $next($request);
    }
}
