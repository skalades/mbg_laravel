<?php
namespace App\Http\Controllers;

use App\Models\School;
use App\Models\DailyMenu;
use App\Models\MasterMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Global Scopes from BelongsToKitchen trait will automatically handle 
        // the filtering for non-admins based on their kitchen_id.
        $stats = [
            'total_schools' => School::count(),
            'total_menus' => DailyMenu::count(),
            'active_beneficiaries' => School::sum('total_beneficiaries'),
            'compliance_rate' => 98 // Placeholder for now
        ];

        // Mock Activity for now, will be replaced with real audit/menu logs
        $recentActivity = [
            [
                'type' => 'menu_published',
                'title' => 'Menu Harian Terbit',
                'description' => 'Menu untuk hari esok telah diterbitkan untuk semua sekolah.',
                'time' => '10 menit yang lalu',
                'icon' => 'description',
                'color' => 'emerald'
            ],
            [
                'type' => 'audit_completed',
                'title' => 'Audit Selesai',
                'description' => 'Audit QC Kitchen telah diverifikasi oleh koordinator.',
                'time' => '2 jam yang lalu',
                'icon' => 'verified_user',
                'color' => 'blue'
            ]
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'upcomingSchedule' => [
                'title' => 'Pengiriman Makan Siang',
                'time' => '11:00 AM',
                'location' => 'Semua Sekolah Mitra'
            ],
            'allergyAlerts' => [],
            'kitchenName' => $user->kitchen?->kitchen_name
        ]);
    }

    public function placeholder()
    {
        return Inertia::render('Dashboard', [
            'message' => 'This module is coming soon in the Laravel transition.'
        ]);
    }
}
