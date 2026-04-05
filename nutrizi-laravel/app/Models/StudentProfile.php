<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    protected $fillable = ['school_id', 'student_name', 'allergens'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
