<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation - E-com</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #667eea;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 1200px;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #2d3748;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            color: #718096;
            font-size: 14px;
        }
        .header .logo {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }
        /* Layout en colonnes */
        .form-columns {
            display: flex;
            gap: 24px;
            margin-top: 20px;
        }
        .form-column {
            flex: 1;
            background: #f7fafc;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        .form-column .form-section {
            margin-bottom: 0;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .form-column .form-section:last-of-type {
            border-bottom: none;
            padding-bottom: 0;
            flex: 1;
        }
        .form-section h2 {
            margin: 0 0 12px;
            color: #2d3748;
            font-size: 15px;
            font-weight: 600;
        }
        .form-group { margin-bottom: 16px; }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #4a5568;
            font-size: 14px;
        }
        .form-column label {
            font-size: 13px;
        }
        input, select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
            background: white;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        input[type="password"] {
            letter-spacing: 2px;
        }
        .hint {
            color: #718096;
            font-size: 12px;
            margin-top: 6px;
        }
        .form-column .hint {
            font-size: 11px;
        }
        .button {
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
        }
        .button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .button:active:not(:disabled) {
            transform: translateY(0);
        }
        .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .error-box {
            background: #fed7d7;
            border: 1px solid #fc8181;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            color: #9b2c2c;
        }
        .error-box strong {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .error-box ul {
            margin: 0;
            padding-left: 20px;
        }
        .error-box li {
            margin: 4px 0;
        }
        .hidden { display: none !important; }
        .progress-container {
            margin-top: 20px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 12px;
        }
        .progress-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .progress-status {
            color: #718096;
            font-size: 14px;
            margin-bottom: 16px;
        }
        .progress-track {
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 16px;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.4s ease;
        }
        .step-list {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .step-list li {
            padding: 8px 0;
            color: #718096;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .step-list li::before {
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #cbd5e0;
            flex-shrink: 0;
        }
        .step-list li.step-done {
            color: #2f855a;
        }
        .step-list li.step-done::before {
            background: #48bb78;
            border-color: #48bb78;
            content: '✓';
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        /* Responsive */
        @media (max-width: 1024px) {
            .form-columns {
                flex-wrap: wrap;
            }
            .form-column {
                min-width: calc(50% - 12px);
            }
        }
        @media (max-width: 640px) {
            .container {
                padding: 24px;
            }
            .form-columns {
                flex-direction: column;
                gap: 16px;
            }
            .form-column {
                min-width: 100%;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Installation E-com</h1>
        </div>

        @if ($errors->any())
            <div class="error-box">
                <strong>Erreurs :</strong>
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div id="installError" class="error-box hidden"></div>
        <div id="installSuccess" class="hidden" style="background: #c6f6d5; border-color: #68d391; color: #22543d; padding: 16px; border-radius: 8px; margin-bottom: 20px;"></div>

        <form id="installForm" method="POST" action="{{ route('install.run') }}">
            @csrf

            <div class="form-columns">
                <!-- Colonne 1: Base de données -->
                <div class="form-column">
                    <div class="form-section">
                        <h2>Base de données</h2>
                        <div class="form-group">
                            <label for="db_connection">Type de base</label>
                            <select name="db_connection" id="db_connection" required>
                                <option value="mysql" @selected($defaultConnection === 'mysql')>MySQL</option>
                                <option value="mariadb" @selected($defaultConnection === 'mariadb')>MariaDB</option>
                                <option value="pgsql" @selected($defaultConnection === 'pgsql')>PostgreSQL</option>
                                <option value="sqlite" @selected($defaultConnection === 'sqlite')>SQLite</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="db_host">Hôte</label>
                            <input type="text" name="db_host" id="db_host" value="{{ old('db_host', '127.0.0.1') }}">
                        </div>
                        <div class="form-group">
                            <label for="db_port">Port</label>
                            <input type="number" name="db_port" id="db_port" value="{{ old('db_port', 3306) }}">
                        </div>
                        <div class="form-group">
                            <label for="db_database">Nom de la base de données *</label>
                            <input type="text" name="db_database" id="db_database" value="{{ old('db_database') }}" required>
                        </div>
                        <div class="form-group">
                            <label for="db_username">Nom d'utilisateur de la base de données *</label>
                            <input type="text" name="db_username" id="db_username" value="{{ old('db_username') }}" required>
                        </div>
                        <div class="form-group">
                            <label for="db_password">Mot de passe de la base de données *</label>
                            <input type="password" name="db_password" id="db_password" required>
                        </div>
                    </div>
                </div>

                <!-- Colonne 2: Compte administrateur -->
                <div class="form-column">
                    <div class="form-section">
                        <h2>Compte administrateur</h2>
                        <div class="form-group">
                            <label for="admin_name">Nom *</label>
                            <input type="text" name="admin_name" id="admin_name" value="{{ old('admin_name') }}" required>
                        </div>
                        <div class="form-group">
                            <label for="admin_email">Email *</label>
                            <input type="email" name="admin_email" id="admin_email" value="{{ old('admin_email') }}" required>
                        </div>
                        <div class="form-group">
                            <label for="admin_password">Mot de passe *</label>
                            <input type="password" name="admin_password" id="admin_password" required>
                        </div>
                        <div class="form-group">
                            <label for="admin_password_confirmation">Confirmer le mot de passe *</label>
                            <input type="password" name="admin_password_confirmation" id="admin_password_confirmation" required>
                        </div>
                    </div>
                </div>

                <!-- Colonne 3: Configuration et Sécurité + Bouton -->
                <div class="form-column" style="display: flex; flex-direction: column;">
                    <div class="form-section">
                        <h2>Configuration</h2>
                        <div class="form-group">
                            <label for="install_mode">Mode d'installation</label>
                            <select name="install_mode" id="install_mode" required>
                                <option value="demo" @selected($defaultInstallMode === 'demo')>Mode démo (avec données de test)</option>
                                <option value="simple" @selected($defaultInstallMode === 'simple')>Installation simple (vide)</option>
                            </select>
                            <p class="hint">Le mode démo ajoute des articles de test et un utilisateur de démonstration.</p>
                        </div>
                    </div>

                    <div class="form-section" style="border-bottom: none; padding-bottom: 0; flex: 1;">
                        <h2>Sécurité</h2>
                        <div class="form-group">
                            <label for="install_token">Token d'installation *</label>
                            <input type="password" name="install_token" id="install_token" required placeholder="Entrez votre token d'installation">
                            <p class="hint">Token requis pour sécuriser l'installation.</p>
                        </div>
                    </div>

                    <button id="installSubmit" type="submit" class="button" style="margin-top: 16px;">Lancer l'installation</button>
                </div>
            </div>
        </form>

        <div id="progressBox" class="progress-container hidden">
            <div class="progress-title">
                <span id="progressIcon">⚙️</span>
                <span id="progressTitle">Installation en cours...</span>
            </div>
            <div id="progressStatus" class="progress-status">Initialisation...</div>
            <div class="progress-track">
                <div id="progressBar" class="progress-bar"></div>
            </div>
            <ul id="progressSteps" class="step-list">
                <li>Vérification de la configuration</li>
                <li>Préparation de l'environnement</li>
                <li>Génération des clés de sécurité</li>
                <li>Migration de la base de données</li>
                <li>Injection des données</li>
                <li>Finalisation</li>
            </ul>
        </div>
    </div>

    <script>
        const installForm = document.getElementById('installForm');
        const submitButton = document.getElementById('installSubmit');
        const progressBox = document.getElementById('progressBox');
        const progressBar = document.getElementById('progressBar');
        const progressStatus = document.getElementById('progressStatus');
        const progressSteps = Array.from(document.querySelectorAll('#progressSteps li'));
        const progressIcon = document.getElementById('progressIcon');
        const progressTitle = document.getElementById('progressTitle');
        const installError = document.getElementById('installError');
        const installSuccess = document.getElementById('installSuccess');
        const statusUrl = '{{ route('install.status') }}';

        let progressInterval = null;
        let statusPollInterval = null;
        let startedAt = null;
        let pollErrorCount = 0;
        let installFinalized = false;

        const POLL_INTERVAL_MS = 1000;
        const POLL_ERROR_NOTICE_THRESHOLD = 3;
        const RECOVERY_DELAYS_MS = [0, 1200, 2500];

        const fallbackProgressStates = [
            { width: 8, text: 'Vérification de la configuration...', step: 0 },
            { width: 22, text: 'Préparation de l\'environnement...', step: 1 },
            { width: 38, text: 'Génération des clés...', step: 2 },
            { width: 62, text: 'Migration de la base de données...', step: 3 },
            { width: 82, text: 'Injection des données...', step: 4 },
            { width: 94, text: 'Finalisation...', step: 5 },
        ];

        function logInfo(event, context = {}) {
            console.info('[install]', event, context);
        }

        function logWarn(event, context = {}) {
            console.warn('[install]', event, context);
        }

        function logError(event, context = {}) {
            console.error('[install]', event, context);
        }

        function wait(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        function resetMessages() {
            installError.classList.add('hidden');
            installError.textContent = '';
            installSuccess.classList.add('hidden');
            installSuccess.textContent = '';
        }

        function resetProgressUi() {
            installForm.classList.add('hidden');
            progressBox.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressStatus.textContent = 'Préparation...';
            progressIcon.textContent = '⚙️';
            progressTitle.textContent = 'Installation en cours...';
            progressSteps.forEach((step) => step.classList.remove('step-done'));
        }

        function markStepDone(index) {
            for (let i = 0; i <= index; i += 1) {
                progressSteps[i]?.classList.add('step-done');
            }
        }

        function stopFallbackProgress() {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        }

        function startFallbackProgress() {
            stopFallbackProgress();
            let index = 0;

            progressInterval = setInterval(() => {
                if (installFinalized) {
                    stopFallbackProgress();
                    return;
                }

                const state = fallbackProgressStates[Math.min(index, fallbackProgressStates.length - 1)];
                progressBar.style.width = `${state.width}%`;
                progressStatus.textContent = state.text;
                markStepDone(state.step);

                if (index < fallbackProgressStates.length - 1) {
                    index += 1;
                }
            }, 1400);
        }

        function stopStatusPolling() {
            if (statusPollInterval) {
                clearInterval(statusPollInterval);
                statusPollInterval = null;
            }
        }

        function showFatalError(message) {
            installFinalized = true;
            stopStatusPolling();
            stopFallbackProgress();
            progressBox.classList.add('hidden');
            installForm.classList.remove('hidden');
            installError.innerHTML = '<strong>Erreur :</strong> ' + message;
            installError.classList.remove('hidden');
            progressIcon.textContent = '❌';
        }

        function completeInstallation(message, redirectUrl = '/') {
            if (installFinalized) {
                return;
            }

            installFinalized = true;
            stopStatusPolling();
            stopFallbackProgress();
            progressBar.style.width = '100%';
            progressStatus.textContent = message || 'Installation terminée avec succès.';
            progressSteps.forEach((step) => step.classList.add('step-done'));
            progressIcon.textContent = '✅';
            progressTitle.textContent = 'Installation réussie !';

            submitButton.disabled = true;
            submitButton.textContent = 'Redirection...';

            logInfo('ui_install_success', {
                duration_ms: startedAt ? Date.now() - startedAt : null,
                redirect: redirectUrl,
            });

            setTimeout(() => {
                window.location.href = redirectUrl || '/';
            }, 1500);
        }

        function applyStatus(status) {
            if (status && typeof status.progress === 'number') {
                progressBar.style.width = `${Math.max(0, Math.min(100, status.progress))}%`;
            }

            if (status && typeof status.message === 'string' && status.message !== '') {
                progressStatus.textContent = status.message;
            }

            if (status && typeof status.current_step === 'number') {
                markStepDone(status.current_step);
            }

            if (status?.state === 'error') {
                const error = new Error(status.message || 'Installation échouée.');
                error.isInstallStateError = true;
                throw error;
            }

            if (status?.state === 'success') {
                completeInstallation(status.message || 'Installation terminée avec succès.', '{{ route('install.done') }}');
            }
        }

        async function fetchStatus() {
            const response = await fetch(statusUrl, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} pendant le suivi de progression.`);
            }

            const status = await response.json();
            applyStatus(status);
            return status;
        }

        function startStatusPolling() {
            stopStatusPolling();

            statusPollInterval = setInterval(async () => {
                if (installFinalized) {
                    return;
                }

                try {
                    const status = await fetchStatus();
                    pollErrorCount = 0;
                    logInfo('status_poll_ok', {
                        state: status?.state,
                        progress: status?.progress,
                        current_step: status?.current_step,
                    });
                } catch (error) {
                    if (error?.isInstallStateError) {
                        logError('status_poll_install_error', {
                            message: error.message,
                        });
                        showFatalError(error.message || 'Installation échouée.');
                        return;
                    }

                    pollErrorCount += 1;
                    logWarn('status_poll_network_error', {
                        count: pollErrorCount,
                        message: error?.message,
                    });

                    if (pollErrorCount >= POLL_ERROR_NOTICE_THRESHOLD) {
                        progressStatus.textContent = 'Connexion instable. Tentative de récupération...';
                    }
                }
            }, POLL_INTERVAL_MS);
        }

        async function recoverAfterPostFetchFailure() {
            logWarn('post_fetch_failed_recovery_start');

            for (const delay of RECOVERY_DELAYS_MS) {
                if (delay > 0) {
                    await wait(delay);
                }

                try {
                    const status = await fetchStatus();
                    logInfo('post_fetch_failed_recovery_status', {
                        delay,
                        state: status?.state,
                        progress: status?.progress,
                    });

                    if (status?.state === 'success') {
                        return true;
                    }

                    if (status?.state === 'running' || status?.state === 'idle') {
                        progressStatus.textContent = 'Connexion interrompue. Installation en cours, récupération active...';
                        return true;
                    }
                } catch (error) {
                    if (error?.isInstallStateError) {
                        throw error;
                    }

                    logWarn('post_fetch_failed_recovery_attempt_error', {
                        delay,
                        message: error?.message,
                    });
                }
            }

            return false;
        }

        installForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            resetMessages();
            installFinalized = false;
            pollErrorCount = 0;

            submitButton.disabled = true;
            submitButton.textContent = 'Installation en cours...';

            startedAt = Date.now();
            resetProgressUi();
            startFallbackProgress();
            startStatusPolling();

            let keepSubmitLocked = false;

            try {
                logInfo('submit_start');

                const response = await fetch(installForm.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new FormData(installForm),
                });

                const contentType = response.headers.get('content-type') || '';
                let payload = null;

                if (contentType.includes('application/json')) {
                    payload = await response.json();
                }

                if (!response.ok) {
                    const message = payload?.message || `Erreur HTTP ${response.status}. Vérifie storage/logs/laravel.log.`;
                    throw new Error(message);
                }

                if (!payload || payload.success === false) {
                    throw new Error(payload?.message || 'Installation échouée.');
                }

                keepSubmitLocked = true;
                completeInstallation(payload.message || 'Installation réussie.', payload.redirect || '{{ route('install.done') }}');
            } catch (error) {
                if (error?.isInstallStateError) {
                    showFatalError(error.message || 'Installation échouée.');
                } else if (error instanceof TypeError) {
                    logWarn('submit_type_error_failed_to_fetch', {
                        message: error.message,
                    });

                    try {
                        const recovered = await recoverAfterPostFetchFailure();

                        if (recovered) {
                            keepSubmitLocked = true;
                            logInfo('submit_recovered_after_failed_fetch');
                        } else {
                            showFatalError('Connexion interrompue avec le serveur. Vérifie la console serveur et storage/logs/laravel.log.');
                        }
                    } catch (recoveryError) {
                        if (recoveryError?.isInstallStateError) {
                            showFatalError(recoveryError.message || 'Installation échouée.');
                        } else {
                            showFatalError('Erreur inattendue après échec réseau. Vérifie la console serveur et storage/logs/laravel.log.');
                        }
                    }
                } else {
                    logError('submit_error', {
                        message: error?.message,
                    });
                    showFatalError(error?.message || 'Une erreur est survenue pendant l\'installation.');
                }
            } finally {
                if (!keepSubmitLocked && !installFinalized) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Lancer l\'installation';
                }
            }
        });
    </script>
</body>
</html>
