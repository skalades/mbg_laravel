<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodConversion extends Model
{
    protected $fillable = ['food_item_id', 'unit_name', 'weight_gram_standard'];

    public function foodItem()
    {
        return $this->belongsTo(FoodItem::class);
    }
}
