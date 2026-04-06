<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToKitchen;

class AuditLog extends Model
{
    use BelongsToKitchen;

    protected $fillable = [
        'kitchen_id',
        'audit_date',
        'photo_path',
        'taste_score',
        'appearance_score',
        'aroma_score',
        'texture_score',
        'notes',
        'audited_by'
    ];

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function auditor()
    {
        return $this->belongsTo(User::class, 'audited_by');
    }
}
