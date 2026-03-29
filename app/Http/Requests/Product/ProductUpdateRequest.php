<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductUpdateRequest extends FormRequest
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
        $productId = (int) $this->route('id');

        $rules = [
            'name' => ['filled', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($productId)],
            'description' => ['nullable', 'string'],
            'price_cents' => ['filled', 'integer', 'min:1'],
            'stock_quantity' => ['filled', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ];

        // Si l'image n'est pas un fichier uploadé, retirer la règle de validation image
        if (! $this->hasFile('image')) {
            unset($rules['image']);
        }

        return $rules;
    }

    /**
     * Prepare inputs for validation - cast FormData values
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('name')) {
            $data['name'] = $this->input('name');
        }
        if ($this->has('sku')) {
            $data['sku'] = $this->input('sku');
        }
        if ($this->has('description')) {
            $data['description'] = $this->input('description');
        }
        if ($this->has('price_cents')) {
            $data['price_cents'] = (int) $this->input('price_cents');
        }
        if ($this->has('stock_quantity')) {
            $data['stock_quantity'] = (int) $this->input('stock_quantity');
        }
        if ($this->has('is_active')) {
            $data['is_active'] = $this->boolean('is_active');
        }
        if ($this->hasFile('image')) {
            $data['image'] = $this->file('image');
        }

        $this->merge($data);
    }
}
