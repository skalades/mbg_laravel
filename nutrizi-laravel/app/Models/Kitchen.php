<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToKitchen;

class Kitchen extends Model
{
    use BelongsToKitchen;

    protected $fillable = [
        'kitchen_name', 
        'location_address',
        'capacity',
        'default_buffer_count',
        'default_sample_count'
    ];

    public function schools()
    {
        return $this->hasMany(School::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
