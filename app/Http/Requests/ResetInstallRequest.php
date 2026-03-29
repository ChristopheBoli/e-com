<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ResetInstallRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'confirm' => [
                'required',
                'string',
                'in:RESET',
            ],
            'drop_database' => [
                'sometimes',
                'boolean',
            ],
            'force' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'confirm.required' => 'Le champ de confirmation est requis.',
            'confirm.in' => 'Veuillez saisir "RESET" pour confirmer.',
            'drop_database.boolean' => 'Le champ drop_database doit être un booléen.',
            'force.boolean' => 'Le champ force doit être un booléen.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        if ($this->expectsJson()) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation.',
                    'data' => null,
                    'errors' => $validator->errors(),
                ], 422)
            );
        }

        throw new HttpResponseException(
            redirect()
                ->back()
                ->withErrors($validator)
                ->withInput($this->except('password'))
                ->with('error', 'Erreur de validation.')
        );
    }
}
