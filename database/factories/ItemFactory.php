<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\PpeClassification;
use App\Models\AssetModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => Str::title($name),
            'stock_number' => fake()->unique()->bothify('STK-####??'),
            'brand_id' => Brand::factory(),
            'asset_model_id' => AssetModel::factory(),
            'category_id' => Category::factory(),
            'ppe_classification_id' => PpeClassification::factory(),
            'unit' => fake()->randomElement(['pcs', 'unit', 'set']),
            'unit_cost' => fake()->randomFloat(2, 100, 50000),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
