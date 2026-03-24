<?php

namespace App\Http\Controllers;

use App\Http\Requests\Install\InstallRequest;
use App\Services\InstallService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use RuntimeException;

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
        ]);
    }

    public function install(InstallRequest $request): RedirectResponse
    {
        try {
            $this->installService->run($request->validated());

            return redirect('/')->with('status', 'Installation terminée avec succès.');
        } catch (RuntimeException $exception) {
            return back()
                ->withInput($request->except(['db_password', 'admin_password', 'admin_password_confirmation', 'install_token']))
                ->withErrors([
                    'install' => $exception->getMessage(),
                ]);
        }
    }
}
