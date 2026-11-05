<?php

namespace Database\Factories;

use App\Models\PpeClassification;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PpeClassification>
 */
class PpeClassificationFactory extends Factory
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
            'code' => Str::upper(Str::slug($name, '-')),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
