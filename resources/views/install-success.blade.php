<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation terminée - E-com</title>
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
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #c6f6d5;
            color: #22543d;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
        }
        .cred-section {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .cred-section h3 {
            margin: 0 0 16px;
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cred-section h3 .icon {
            font-size: 20px;
        }
        .cred-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .cred-row:last-child {
            border-bottom: none;
        }
        .cred-row label {
            flex: 0 0 100px;
            font-weight: 500;
            color: #4a5568;
            font-size: 14px;
        }
        .cred-row .value {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cred-row .value code {
            background: #2d3748;
            color: #faf089;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-family: monospace;
            flex: 1;
            word-break: break-all;
        }
        .copy-btn {
            background: #e2e8f0;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 12px;
            color: #4a5568;
            transition: all 0.2s;
        }
        .copy-btn:hover {
            background: #cbd5e0;
        }
        .copy-btn.copied {
            background: #48bb78;
            color: white;
        }
        .button {
            display: block;
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(72, 187, 120, 0.4);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(72, 187, 120, 0.6);
        }
        .demo-info {
            background: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 8px;
            padding: 12px;
            margin-top: 20px;
            font-size: 13px;
            color: #2b6cb0;
        }
        .demo-info strong {
            display: block;
            margin-bottom: 6px;
        }
        @media (max-width: 640px) {
            .container {
                padding: 24px;
            }
            .header h1 {
                font-size: 22px;
            }
            .cred-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            .cred-row label {
                flex: 0 0 auto;
            }
            .cred-row .value {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✓</div>
            <h1>Installation terminée !</h1>
            <div class="badge">{{ $installMode === 'demo' ? 'Mode démo' : 'Installation simple' }}</div>
        </div>

        <!-- <div class="cred-section">
            <h3>Compte administrateur</h3>
            <div class="cred-row">
                <label>Email</label>
                <div class="value">
                    <code id="admin-email">{{ $adminEmail }}</code>
                    <button class="copy-btn" onclick="copyToClipboard('admin-email')">Copier</button>
                </div>
            </div>
            <div class="cred-row">
                <label>Mot de passe</label>
                <div class="value">
                    <code id="admin-password">{{ $adminPassword }}</code>
                    <button class="copy-btn" onclick="copyToClipboard('admin-password')">Copier</button>
                </div>
            </div>
        </div> -->

        @if ($demoUserEnabled)
            <div class="cred-section">
                <h3>Compte utilisateur démo</h3>
                <div class="cred-row">
                    <label>Email</label>
                    <div class="value">
                        <code id="demo-email">{{ $demoUserEmail }}</code>
                        <button class="copy-btn" onclick="copyToClipboard('demo-email')">Copier</button>
                    </div>
                </div>
                <div class="cred-row">
                    <label>Mot de passe</label>
                    <div class="value">
                        <code id="demo-password">{{ $demoUserPassword }}</code>
                        <button class="copy-btn" onclick="copyToClipboard('demo-password')">Copier</button>
                    </div>
                </div>
            </div>
        @else
            <div class="demo-info">
                <strong>Installation simple</strong>
                <p>Aucun compte utilisateur de démonstration n'a été créé.</p>
            </div>
        @endif

        <div class="demo-info">
            <strong>Sécurité</strong>
            <p>Pensez à changer les identifiants de démonstration après votre première connexion.</p>
        </div>

        <a href="{{ url('/') }}" class="button" style="margin-top: 24px;">Ouvrir l'application →</a>
    </div>

    <script>
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent;
            const button = element.nextElementSibling;

            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copié !';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = 'Copier';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback pour les anciens navigateurs
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                button.textContent = 'Copié !';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = 'Copier';
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>
