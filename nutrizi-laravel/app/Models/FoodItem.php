<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodItem extends Model
{
    protected $fillable = [
        'name', 
        'category', 
        'base_unit',
        'base_quantity',
        'urt_unit',
        'urt_weight',
        'energy_kcal', 
        'protein_g', 
        'fat_g', 
        'carbs_g', 
        'yield_factor',
        'image_url'
    ];

    public function conversions()
    {
        return $this->hasMany(FoodConversion::class);
    }
}
