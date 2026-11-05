<?php

namespace App\Models;

use Database\Factories\AssetModelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetModel extends Model
{
    /** @use HasFactory<AssetModelFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'models';

    /**
     * @var list<string>
     */
    protected $fillable = ['brand_id', 'name', 'code', 'description'];

    /**
     * @return BelongsTo<Brand, $this>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
