<?php

namespace App\Models;

use Database\Factories\PpeClassificationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpeClassification extends Model
{
    /** @use HasFactory<PpeClassificationFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ppe_classifications';

    /**
     * @var list<string>
     */
    protected $fillable = ['name', 'code', 'description'];
}
