<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToKitchen;

class School extends Model
{
    use BelongsToKitchen;

    public $timestamps = false;

    protected $fillable = [
        'school_name', 
        'target_group', 
        'total_beneficiaries', 
        'total_teachers', 
        'large_portion_count', 
        'small_portion_count', 
        'location_address', 
        'kitchen_id',
        'siswa_laki_laki',
        'siswa_perempuan',
        'guru_laki_laki',
        'guru_perempuan',
        'buffer_count',
        'sample_count'
    ];

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function studentProfiles()
    {
        return $this->hasMany(StudentProfile::class);
    }

    public function dailyMenus()
    {
        return $this->hasMany(DailyMenu::class);
    }
}
