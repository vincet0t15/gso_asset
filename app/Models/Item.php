<?php

namespace App\Models;

use Database\Factories\ItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    /** @use HasFactory<ItemFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'stock_number',
        'brand_id',
        'asset_model_id',
        'category_id',
        'ppe_classification_id',
        'unit',
        'unit_cost',
        'description',
    ];

    /**
     * @return BelongsTo<Brand, $this>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * @return BelongsTo<AssetModel, $this>
     */
    public function assetModel(): BelongsTo
    {
        return $this->belongsTo(AssetModel::class, 'asset_model_id');
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<PpeClassification, $this>
     */
    public function ppeClassification(): BelongsTo
    {
        return $this->belongsTo(PpeClassification::class, 'ppe_classification_id');
    }
}
