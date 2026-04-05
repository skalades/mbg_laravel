<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortionConfig extends Model
{
    protected $fillable = [
        'name', 
        'multiplier', 
        'meal_energy', 
        'meal_protein', 
        'meal_fat', 
        'meal_carbs'
    ];
}
