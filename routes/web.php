<?php

use App\Http\Controllers\InstallController;
use App\Http\Controllers\ResetInstallController;
use Illuminate\Support\Facades\Route;

// Routes d'installation (doivent être définies avant le catch-all)
Route::get('/install/status', [InstallController::class, 'status'])->name('install.status');
Route::get('/install/done', [InstallController::class, 'done'])->name('install.done');

Route::middleware('install.allowed')->group(function (): void {
    Route::get('/install', [InstallController::class, 'show'])->name('install.show');
    Route::post('/install', [InstallController::class, 'install'])->name('install.run');
});

Route::get('/reset-install', [ResetInstallController::class, 'show'])->name('reset-install.show');
Route::post('/reset-install', [ResetInstallController::class, 'reset'])->name('reset-install.run');
Route::post('/reset-install/finalize', [ResetInstallController::class, 'finalize'])->name('reset-install.finalize');
Route::get('/reset-install/restart', [ResetInstallController::class, 'restart'])->name('reset-install.restart');
Route::get('/reset-install/done', [ResetInstallController::class, 'done'])->name('reset-install.done');

// Routes React SPA - catch-all pour toutes les routes frontend
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!install|reset-install|api|storage|_ignition).*$');

// Route racine
Route::get('/', function () {
    return view('app');
})->name('home');

