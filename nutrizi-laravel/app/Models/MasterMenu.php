<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterMenu extends Model
{
    protected $fillable = ['menu_name', 'target_group', 'created_by'];

    public function items()
    {
        return $this->hasMany(MasterMenuItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
