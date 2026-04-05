<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyMenuItem extends Model
{
    protected $fillable = [
        'daily_menu_id', 
        'food_item_id', 
        'portion_name', 
        'weight_small', 
        'weight_large', 
        'unit_name', 
        'unit_quantity'
    ];

    public function dailyMenu()
    {
        return $this->belongsTo(DailyMenu::class);
    }

    public function foodItem()
    {
        return $this->belongsTo(FoodItem::class);
    }
}
