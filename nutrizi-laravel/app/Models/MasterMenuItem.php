<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterMenuItem extends Model
{
    protected $fillable = [
        'master_menu_id', 
        'food_item_id', 
        'portion_name', 
        'weight_small', 
        'weight_large', 
        'unit_name', 
        'unit_quantity'
    ];

    public function masterMenu()
    {
        return $this->belongsTo(MasterMenu::class);
    }

    public function foodItem()
    {
        return $this->belongsTo(FoodItem::class);
    }
}
