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
        $isInstalled = filter_var(env('APP_INSTALLED', false), FILTER_VALIDATE_BOOL);
        $lockExists = file_exists(storage_path('app/install.lock'));

        if ($isInstalled || $lockExists) {
            abort(403, 'Application déjà installée.');
        }

        if (app()->environment('production') && ! filter_var(env('INSTALL_ALLOWED_IN_PRODUCTION', false), FILTER_VALIDATE_BOOL)) {
            abort(403, 'Installation non autorisée en production.');
        }

        return $next($request);
    }
}
