<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Accès refusé' }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: #111827;
        }
        .card {
            width: 100%;
            max-width: 640px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
            overflow: hidden;
        }
        .top {
            padding: 22px 24px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #fff;
        }
        .top h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .top p {
            margin: 8px 0 0;
            opacity: 0.95;
            font-size: 14px;
        }
        .content {
            padding: 24px;
        }
        .message {
            margin: 0;
            color: #374151;
            line-height: 1.6;
            font-size: 15px;
        }
        .meta {
            margin-top: 16px;
            padding: 12px 14px;
            border-radius: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            color: #4b5563;
            font-size: 13px;
        }
        .actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }
        .btn {
            text-align: center;
            text-decoration: none;
            padding: 12px 14px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
        }
        .btn.primary {
            background: #2563eb;
            color: #fff;
        }
        .btn.secondary {
            background: #e5e7eb;
            color: #111827;
        }
        @media (max-width: 640px) {
            .actions { grid-template-columns: 1fr; }
            .top h1 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="top">
            <h1>{{ $title ?? 'Accès refusé' }}</h1>
            <p>Erreur HTTP 403</p>
        </div>

        <div class="content">
            <p class="message">{{ $message ?? 'Vous n’êtes pas autorisé à accéder à cette ressource.' }}</p>

            <div class="meta">
                Si vous êtes en phase de test, utilisez l’outil de réinitialisation pour relancer l’installation proprement.
            </div>

            <div class="actions">
                <a class="btn primary" href="{{ $primaryActionUrl ?? url('/') }}">{{ $primaryActionLabel ?? 'Continuer' }}</a>
                <a class="btn secondary" href="{{ $secondaryActionUrl ?? url('/') }}">{{ $secondaryActionLabel ?? 'Retour' }}</a>
            </div>
        </div>
    </div>
</body>
</html>
