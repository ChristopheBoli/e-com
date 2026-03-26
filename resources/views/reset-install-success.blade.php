<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation réussie - E-com</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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
            max-width: 500px;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 40px;
        }
        .header h1 {
            margin: 0 0 8px;
            color: #2d3748;
            font-size: 26px;
            font-weight: 700;
        }
        .header p {
            margin: 0;
            color: #718096;
            font-size: 14px;
        }
        .box {
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .success-box {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
        }
        .success-box strong {
            display: block;
            margin-bottom: 8px;
            color: #22543d;
            font-weight: 600;
            font-size: 16px;
        }
        .success-box p {
            color: #276749;
            font-size: 14px;
            margin: 4px 0;
        }
        .info-box {
            background: #ebf8ff;
            border: 1px solid #bee3f8;
        }
        .info-box strong {
            display: block;
            margin-bottom: 12px;
            color: #2c5282;
            font-weight: 600;
        }
        .info-box ul {
            margin: 8px 0 8px 20px;
            padding: 0;
            color: #2b6cb0;
            font-size: 14px;
        }
        .info-box li {
            margin: 6px 0;
        }
        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
        }
        .button {
            flex: 1;
            padding: 14px 24px;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .button-primary {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }
        .button-secondary {
            background: #718096;
        }
        .hidden { display: none !important; }
        .code {
            background: #2d3748;
            color: #faf089;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 13px;
        }
        @media (max-width: 640px) {
            .container {
                padding: 24px;
            }
            .header h1 {
                font-size: 22px;
            }
            .button-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="install-ready" class="hidden">
            <div class="header">
                <div class="logo">✓</div>
                <h1>Réinitialisation réussie !</h1>
                <p>L'application est prête pour une nouvelle installation</p>
            </div>

            <div class="box success-box">
                <strong>🎉 Installation réinitialisée</strong>
                <p>Tous les verrous ont été supprimés et l'application peut être réinstallée.</p>
            </div>

            <div class="box info-box">
                <strong>📋 Actions effectuées :</strong>
                <ul>
                    <li>✓ Fichier de verrou d'installation supprimé</li>
                    <li>✓ Fichier de statut d'installation supprimé</li>
                    <li>✓ Variable <code>APP_INSTALLED</code> définie à <code>false</code></li>
                    <li>✓ Cache de l'application nettoyé</li>
                </ul>
            </div>

            <div class="box info-box">
                <strong>🚀 Étapes suivantes :</strong>
                <ul>
                    <li>Cliquez sur le bouton ci-dessous</li>
                    <li>Configurez votre base de données</li>
                    <li>Créez votre compte administrateur</li>
                </ul>
            </div>

            <div class="button-group">
                <a href="{{ route('install.show') }}" class="button button-primary">Lancer l'installation →</a>
                <a href="/" class="button button-secondary">Accueil</a>
            </div>

            <p style="text-align: center; color: #718096; font-size: 12px; margin-top: 30px;">
                En cas de problème, consultez <code>storage/logs/laravel.log</code>
            </p>
        </div>

        <div id="server-restarting">
            <div class="header">
                <div class="logo" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">⟳</div>
                <h1>Redémarrage<span id="dots"></span></h1>
                <p>Le serveur redémarre suite à la modification</p>
            </div>

            <div class="box info-box">
                <p id="status">Veuillez patienter...</p>
                <p id="timeout-warning" class="hidden" style="color: #dd6b20; margin-top: 12px;">
                    Le serveur prend plus de temps que prévu.
                </p>
            </div>
        </div>
    </div>

    <script>
        const installReady = document.getElementById('install-ready');
        const serverRestarting = document.getElementById('server-restarting');
        const status = document.getElementById('status');
        const timeoutWarning = document.getElementById('timeout-warning');
        const dots = document.getElementById('dots');

        // Animation des points
        let dotCount = 0;
        setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '.'.repeat(dotCount);
        }, 500);

        // Vérifier si /install est accessible (ce qui signifie que le serveur a redémarré)
        function checkInstallReady() {
            return fetch('{{ route('install.show') }}', {
                method: 'HEAD',
                cache: 'no-store',
            })
                .then(response => {
                    // Si on obtient une réponse 200 ou 302, le serveur est prêt
                    return response.ok || response.redirected || response.status === 302;
                })
                .catch(() => false);
        }

        async function waitForServer() {
            let attempts = 0;
            const maxAttempts = 30;
            const interval = 500;

            while (attempts < maxAttempts) {
                attempts++;
                status.textContent = `Vérification... (${attempts}/${maxAttempts})`;

                const ready = await checkInstallReady();
                if (ready) {
                    // Le serveur est prêt, on affiche le contenu normal
                    serverRestarting.classList.add('hidden');
                    installReady.classList.remove('hidden');
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, interval));
            }

            // Timeout - on affiche quand même le contenu avec un avertissement
            timeoutWarning.classList.remove('hidden');
            status.textContent = 'Le serveur semble prêt.';
            serverRestarting.classList.add('hidden');
            installReady.classList.remove('hidden');
        }

        // Commencer par vérifier une fois
        checkInstallReady().then(ready => {
            if (ready) {
                // Le serveur est déjà prêt
                serverRestarting.classList.add('hidden');
                installReady.classList.remove('hidden');
            } else {
                // Le serveur redémarre encore
                waitForServer();
            }
        });
    </script>
</body>
</html>
