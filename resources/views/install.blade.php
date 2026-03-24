<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 880px; margin: 30px auto; padding: 0 20px; }
        label { display: block; margin-top: 14px; font-weight: 600; }
        input, select { width: 100%; padding: 10px; margin-top: 6px; }
        button { margin-top: 22px; padding: 12px 16px; cursor: pointer; }
        .error { color: #b00020; margin-top: 12px; }
        .success { color: #0b7a0b; margin-top: 12px; }
    </style>
</head>
<body>
    <h1>Installation de l'application</h1>

    @if ($errors->any())
        <div class="error">
            <strong>Erreurs :</strong>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if (session('status'))
        <div class="success">{{ session('status') }}</div>
    @endif

    <form method="POST" action="{{ route('install.run') }}">
        @csrf

        <h2>Base de données</h2>

        <label for="db_connection">Type de base</label>
        <select name="db_connection" id="db_connection" required>
            <option value="mysql" @selected($defaultConnection === 'mysql')>MySQL</option>
            <option value="mariadb" @selected($defaultConnection === 'mariadb')>MariaDB</option>
            <option value="pgsql" @selected($defaultConnection === 'pgsql')>PostgreSQL</option>
            <option value="sqlite" @selected($defaultConnection === 'sqlite')>SQLite</option>
        </select>

        <label for="db_host">DB Host</label>
        <input type="text" name="db_host" id="db_host" value="{{ old('db_host', '127.0.0.1') }}">

        <label for="db_port">DB Port</label>
        <input type="number" name="db_port" id="db_port" value="{{ old('db_port', 3306) }}">

        <label for="db_database">DB Name</label>
        <input type="text" name="db_database" id="db_database" value="{{ old('db_database') }}" required>

        <label for="db_username">DB User</label>
        <input type="text" name="db_username" id="db_username" value="{{ old('db_username') }}">

        <label for="db_password">DB Password</label>
        <input type="password" name="db_password" id="db_password">

        <h2>Administrateur</h2>

        <label for="admin_name">Nom admin</label>
        <input type="text" name="admin_name" id="admin_name" value="{{ old('admin_name') }}" required>

        <label for="admin_email">Email admin</label>
        <input type="email" name="admin_email" id="admin_email" value="{{ old('admin_email') }}" required>

        <label for="admin_password">Mot de passe admin</label>
        <input type="password" name="admin_password" id="admin_password" required>

        <label for="admin_password_confirmation">Confirmer le mot de passe admin</label>
        <input type="password" name="admin_password_confirmation" id="admin_password_confirmation" required>

        <h2>Sécurité installation</h2>

        <label for="install_token">Install token</label>
        <input type="password" name="install_token" id="install_token" required>

        <button type="submit">Lancer l'installation</button>
    </form>
</body>
</html>
