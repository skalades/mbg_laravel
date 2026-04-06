<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToKitchen;

class DailyMenu extends Model
{
    use BelongsToKitchen;

    protected $fillable = [
        'school_id', 
        'menu_date', 
        'status', 
        'buffer_portions', 
        'organoleptic_portions', 
        'master_menu_id', 
        'created_by',
        'kitchen_id'
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function items()
    {
        return $this->hasMany(DailyMenuItem::class);
    }

    public function masterMenu()
    {
        return $this->belongsTo(MasterMenu::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
