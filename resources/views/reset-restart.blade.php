<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redémarrage - E-com</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            max-width: 400px;
            padding: 40px;
            text-align: center;
        }
        .spinner {
            width: 64px;
            height: 64px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 24px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            margin: 0 0 12px;
            color: #2d3748;
            font-size: 22px;
            font-weight: 700;
        }
        p {
            margin: 8px 0;
            color: #718096;
            font-size: 14px;
        }
        .link {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
        }
        .link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .hidden { display: none !important; }
        .dots::after {
            content: '';
            animation: dots 1.5s infinite;
        }
        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h1>Redémarrage<span class="dots"></span></h1>
        <p id="status">La réinitialisation est en cours.</p>
        <a id="manual-link" href="{{ $redirect_url }}" class="link hidden">Continuer →</a>
    </div>

    <script>
        const redirectUrl = '{{ $redirect_url }}';
        const status = document.getElementById('status');
        const manualLink = document.getElementById('manual-link');
        const spinner = document.querySelector('.spinner');

        let retryCount = 0;
        const maxRetries = 30;
        const checkInterval = 500;

        function checkServerReady() {
            fetch(window.location.origin + '/favicon.ico', {
                mode: 'no-cors',
                cache: 'no-store',
            })
                .then(() => {
                    // Le serveur répond, on redirige
                    status.textContent = 'Le serveur est prêt.';
                    spinner.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 500);
                })
                .catch(() => {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        status.textContent = `Attente du redémarrage... (${retryCount}/${maxRetries})`;
                        setTimeout(checkServerReady, checkInterval);
                    } else {
                        // Timeout, on montre le lien manuel
                        status.textContent = 'Cliquez sur le bouton ci-dessous pour continuer.';
                        spinner.style.display = 'none';
                        manualLink.classList.remove('hidden');
                    }
                });
        }

        // Démarrer la vérification après un court délai
        setTimeout(checkServerReady, 1000);

        // Fallback: rediriger après 10 secondes quoi qu'il arrive
        setTimeout(() => {
            if (window.location.href !== redirectUrl) {
                status.textContent = 'Redirection forcée...';
                window.location.href = redirectUrl;
            }
        }, 10000);
    </script>
</body>
</html>
