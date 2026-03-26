<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation - E-com</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
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
        .header h1 {
            margin: 0;
            color: #2d3748;
            font-size: 24px;
            font-weight: 700;
        }
        .header .logo {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
            font-size: 32px;
        }
        .form-section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        .form-section:last-of-type {
            border-bottom: none;
        }
        .form-section h3 {
            margin: 0 0 12px;
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
        }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #4a5568;
            font-size: 14px;
        }
        input, select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
            background: #f7fafc;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #e53e3e;
            background: white;
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
        }
        .checkbox-wrapper input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        .checkbox-wrapper label {
            margin: 0;
            font-weight: normal;
        }
        .hint {
            color: #718096;
            font-size: 12px;
            margin-top: 6px;
        }
        .button {
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(229, 62, 62, 0.4);
        }
        .button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(229, 62, 62, 0.6);
        }
        .button:active:not(:disabled) {
            transform: translateY(0);
        }
        .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .box {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .danger-box {
            background: #fed7d7;
            border-left: 4px solid #fc8181;
        }
        .danger-box strong {
            display: block;
            margin-bottom: 8px;
            color: #9b2c2c;
            font-weight: 600;
        }
        .danger-box p, .danger-box li {
            color: #742a2a;
            font-size: 14px;
            margin: 6px 0;
        }
        .danger-box ul {
            margin: 8px 0 8px 20px;
            padding: 0;
        }
        .warning-box {
            background: #fefcbf;
            border-left: 4px solid #f6e05e;
        }
        .warning-box strong {
            display: block;
            margin-bottom: 8px;
            color: #975a16;
            font-weight: 600;
        }
        .warning-box p {
            color: #744210;
            font-size: 14px;
            margin: 6px 0;
        }
        .info-box {
            background: #bee3f8;
            border-left: 4px solid #4299e1;
        }
        .info-box strong {
            display: block;
            margin-bottom: 8px;
            color: #2c5282;
            font-weight: 600;
        }
        .info-box p, .info-box li {
            color: #2b6cb0;
            font-size: 14px;
            margin: 6px 0;
        }
        .info-box ul {
            margin: 8px 0 8px 20px;
            padding: 0;
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
        code {
            background: #2d3748;
            color: #faf089;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
        }
        .link-button {
            display: inline-block;
            padding: 12px 24px;
            background: #48bb78;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 14px rgba(72, 187, 120, 0.4);
            transition: all 0.2s;
        }
        .link-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(72, 187, 120, 0.6);
        }
        @media (max-width: 640px) {
            .container {
                padding: 24px;
            }
            .header h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">↺</div>
            <h1>Réinitialiser l'installation</h1>
        </div>

        @if ($notInstalled)
            <div class="box info-box">
                <strong>ℹ️ Information</strong>
                <p>L'application n'est pas installée. Vous pouvez directement lancer une nouvelle installation.</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="/install" class="link-button">Lancer l'installation →</a>
            </div>

            <script>
                // Redirection automatique vers /install
                setTimeout(function() {
                    window.location.href = '/install';
                }, 1500);
            </script>
        @else
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

            @if (session('error'))
                <div class="error-box">{{ session('error') }}</div>
            @endif

            <div class="box danger-box">
                <strong>⚠️ Action destructive</strong>
                <p>Cette action va réinitialiser l'installation de l'application.</p>
                <ul>
                    <li>Suppression du fichier de verrou d'installation</li>
                    <li>Suppression du fichier de statut d'installation</li>
                    <li>Modification de la variable <code>APP_INSTALLED</code> à <code>false</code></li>
                    <li>Nettoyage du cache de l'application</li>
                </ul>
                <p><strong>Optionnel :</strong> Si cochée, toutes les tables de la base de données seront supprimées.</p>
            </div>

            @if ($isProduction)
                <div class="box warning-box">
                    <strong>🚨 Environnement de production</strong>
                    <p>Vous êtes actuellement en environnement de production. La réinitialisation nécessite de définir <code>RESET_ALLOWED_IN_PRODUCTION=true</code> dans votre fichier <code>.env</code>.</p>
                    <p><strong>Cette action est fortement déconseillée en production.</strong></p>
                </div>
            @endif

            <div class="form-section">
                <h3>📝 Informations conservées</h3>
                <p style="color: #718096; font-size: 14px; margin: 8px 0;">
                    Les éléments suivants seront conservés (sauf si l'option ci-dessous est cochée) :
                </p>
                <ul>
                    <li>Fichier <code>.env</code> (sauf APP_INSTALLED)</li>
                    <li>Tables de la base de données</li>
                    <li>Fichiers de logs</li>
                </ul>
            </div>

            <form id="resetForm" method="POST" action="{{ route('reset-install.run') }}">
                @csrf

                <div class="form-section" style="border-bottom: none; padding-bottom: 0;">
                    <label for="confirm">Confirmation *</label>
                    <input type="text" name="confirm" id="confirm" placeholder="Saisissez RESET pour confirmer" required autocomplete="off">
                    <p class="hint">Veuillez saisir "RESET" pour confirmer cette action.</p>

                    <div class="checkbox-wrapper">
                        <input type="checkbox" name="drop_database" id="drop_database" value="1">
                        <label for="drop_database">Supprimer toutes les tables de la base de données</label>
                    </div>

                    <div id="dbWarning" class="box warning-box hidden">
                        <strong>⚠️ Attention</strong>
                        <p>Toutes les tables de la base de données seront supprimées. Cette action est irréversible.</p>
                    </div>
                </div>

                <button id="resetSubmit" type="submit" class="button">Réinitialiser l'installation</button>
            </form>
        @endif
    </div>

    <script>
        const resetForm = document.getElementById('resetForm');
        const submitButton = document.getElementById('resetSubmit');
        const confirmInput = document.getElementById('confirm');
        const dropDatabaseCheckbox = document.getElementById('drop_database');
        const dbWarning = document.getElementById('dbWarning');

        dropDatabaseCheckbox.addEventListener('change', function() {
            if (this.checked) {
                dbWarning.classList.remove('hidden');
            } else {
                dbWarning.classList.add('hidden');
            }
        });

        resetForm.addEventListener('submit', function(event) {
            const confirmValue = confirmInput.value.trim();
            const dropDatabaseValue = dropDatabaseCheckbox.checked;

            if (confirmValue !== 'RESET') {
                event.preventDefault();
                alert('Veuillez saisir "RESET" (en majuscules) pour confirmer l\'action.');
                return;
            }

            if (dropDatabaseValue) {
                if (!confirm('ATTENTION : Vous êtes sur le point de supprimer toutes les tables de la base de données.\n\nCette action est IRRÉVERSIBLE.\n\nÊtes-vous vraiment sûr de vouloir continuer ?')) {
                    event.preventDefault();
                    return;
                }
            } else {
                if (!confirm('Êtes-vous sûr de vouloir réinitialiser l\'installation ?\n\nCela permettra de relancer l\'assistant d\'installation.')) {
                    event.preventDefault();
                    return;
                }
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Réinitialisation en cours...';
        });
    </script>
</body>
</html>
