<?php

namespace Database\Factories;

use App\Models\AssetModel;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<AssetModel>
 */
class AssetModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->bothify('Model-####??');

        return [
            'brand_id' => Brand::factory(),
            'name' => $name,
            'code' => Str::upper(Str::slug($name, '-')),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
