<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'price_cents' => ['required', 'integer', 'min:1'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ];
    }

    /**
     * Prepare inputs for validation - cast FormData values
     */
    protected function prepareForValidation(): void
    {
        $data = [
            'name' => $this->input('name'),
            'sku' => $this->input('sku'),
            'description' => $this->input('description') ?? '',
            'price_cents' => (int) $this->input('price_cents'),
            'stock_quantity' => (int) $this->input('stock_quantity'),
            'is_active' => $this->boolean('is_active'),
        ];

        if ($this->hasFile('image')) {
            $data['image'] = $this->file('image');
        }

        $this->merge($data);
    }
}
