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
            max-width: 420px;
            padding: 36px;
            text-align: center;
        }
        .spinner {
            width: 64px;
            height: 64px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        h1 { margin: 0 0 10px; color: #2d3748; font-size: 24px; }
        p { margin: 8px 0; color: #718096; }
        .link {
            display: inline-block;
            margin-top: 18px;
            padding: 12px 20px;
            background: #667eea;
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .hidden { display: none !important; }
    </style>
</head>
<body>
<div class="container">
    <div class="spinner" id="spinner"></div>
    <h1>Redémarrage du serveur</h1>
    <p id="status">Finalisation en cours...</p>
    <a id="manual" class="link hidden" href="{{ $redirect_url }}">Aller vers installation</a>
</div>

<script>
    const redirectUrl = @json($redirect_url);
    const status = document.getElementById('status');
    const spinner = document.getElementById('spinner');
    const manual = document.getElementById('manual');

    let attempts = 0;
    const maxAttempts = 40;
    const intervalMs = 500;

    async function checkServerAndRedirect() {
        attempts += 1;
        status.textContent = `Attente du redémarrage... (${attempts}/${maxAttempts})`;

        try {
            const response = await fetch(redirectUrl, {
                method: 'GET',
                cache: 'no-store',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });

            if (response.ok || response.redirected || response.status === 302 || response.status === 403) {
                window.location.href = redirectUrl;
                return;
            }
        } catch (error) {
            // serveur indisponible temporairement
        }

        if (attempts < maxAttempts) {
            setTimeout(checkServerAndRedirect, intervalMs);
        } else {
            spinner.classList.add('hidden');
            status.textContent = 'Le serveur a redémarré ou est lent à répondre. Cliquez pour continuer.';
            manual.classList.remove('hidden');
        }
    }

    setTimeout(checkServerAndRedirect, 800);
</script>
</body>
</html>
