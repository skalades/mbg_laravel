<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToKitchen;

class MasterMenu extends Model
{
    use BelongsToKitchen;

    protected $fillable = ['menu_name', 'target_group', 'cooking_instructions', 'created_by', 'kitchen_id'];

    protected $casts = [
        'target_group' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(MasterMenuItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
