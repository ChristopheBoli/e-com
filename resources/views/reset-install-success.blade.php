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
            max-width: 520px;
            padding: 40px;
        }
        .header { text-align: center; margin-bottom: 24px; }
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
            font-size: 40px;
        }
        h1 { margin: 0 0 8px; color: #2d3748; font-size: 26px; }
        .muted { color: #718096; margin: 0; }
        .box { padding: 16px; border-radius: 10px; margin: 14px 0; }
        .ok { background: #f0fff4; border: 1px solid #9ae6b4; color: #22543d; }
        .err { background: #fff5f5; border: 1px solid #fc8181; color: #9b2c2c; }
        .info { background: #ebf8ff; border: 1px solid #bee3f8; color: #2b6cb0; }
        ul { margin: 8px 0 0 18px; }
        .actions { display: grid; gap: 10px; margin-top: 20px; }
        .button {
            width: 100%;
            padding: 14px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .button:disabled { opacity: .7; cursor: not-allowed; }
        a.button-link {
            text-decoration: none;
            text-align: center;
            display: inline-block;
            width: 100%;
            padding: 12px 20px;
            border-radius: 8px;
            color: #fff;
            background: #718096;
            font-weight: 600;
        }
        .hidden { display: none !important; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo">✓</div>
        <h1>Réinitialisation réussie</h1>
        <p class="muted">Les opérations de reset sont terminées.</p>
    </div>

    @if (!empty($finalizeError))
        <div class="box err">
            <strong>Finalisation échouée :</strong>
            <p>{{ $finalizeError }}</p>
        </div>
    @endif

    <div class="box ok">
        <strong>Actions déjà effectuées</strong>
        <ul>
            <li>Suppression des verrous d'installation</li>
            <li>Nettoyage de l'état de reset</li>
            <li>Nettoyage du cache</li>
            <li>Suppression DB (si demandée)</li>
        </ul>
    </div>

    <div class="box info">
        <strong>Étape suivante</strong>
        <p>Cliquez sur « Continuer vers installation » pour finaliser l'environnement. Cette action modifie `.env`, peut redémarrer le serveur, puis vous redirige automatiquement vers `/install`.</p>
    </div>

    <div id="finalizeError" class="box err hidden"></div>

    <div class="actions">
        <form id="finalizeForm" method="POST" action="{{ route('reset-install.finalize') }}">
            @csrf
            <button id="finalizeBtn" type="submit" class="button">Continuer vers installation</button>
        </form>
        <a href="/" class="button-link">Retour accueil</a>
    </div>
</div>

<script>
    const form = document.getElementById('finalizeForm');
    const btn = document.getElementById('finalizeBtn');
    const errorBox = document.getElementById('finalizeError');
    const restartUrl = @json(route('reset-install.restart'));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorBox.classList.add('hidden');
        errorBox.textContent = '';

        btn.disabled = true;
        btn.textContent = 'Finalisation en cours...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': form.querySelector('input[name="_token"]').value,
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Erreur pendant la finalisation.');
            }

            window.location.href = restartUrl;
        } catch (error) {
            if (error instanceof TypeError) {
                // probable redémarrage immédiat: bascule vers page de recovery
                window.location.href = restartUrl;
                return;
            }

            errorBox.textContent = error.message || 'Erreur inattendue.';
            errorBox.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Continuer vers installation';
        }
    });
</script>
</body>
</html>
