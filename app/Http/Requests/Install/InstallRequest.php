<?php

namespace App\Http\Requests\Install;

use Illuminate\Foundation\Http\FormRequest;

class InstallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'db_connection' => ['required', 'in:mysql,mariadb,pgsql,sqlite'],
            'db_host' => ['nullable', 'string', 'max:255'],
            'db_port' => ['nullable', 'integer', 'min:1'],
            'db_database' => ['required', 'string', 'max:255'],
            'db_username' => ['nullable', 'string', 'max:255'],
            'db_password' => ['nullable', 'string', 'max:255'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email', 'max:255'],
            'admin_password' => ['required', 'string', 'min:8', 'confirmed'],
            'install_token' => ['required', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $expected = (string) env('INSTALL_TOKEN', '');
            $provided = (string) $this->input('install_token', '');

            if ($expected === '' || ! hash_equals($expected, $provided)) {
                $validator->errors()->add('install_token', 'Install token invalide.');
            }
        });
    }
}
