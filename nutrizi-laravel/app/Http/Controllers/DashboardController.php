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
        $kitchenId = $user->kitchen_id;

        // Basic Stats
        $stats = [
            'total_schools' => School::when($kitchenId, fn($q) => $q->where('kitchen_id', $kitchenId))->count(),
            'total_menus' => DailyMenu::when($kitchenId, function($q) use ($kitchenId) {
                return $q->whereHas('school', fn($sq) => $sq->where('kitchen_id', $kitchenId));
            })->count(),
            'active_beneficiaries' => School::when($kitchenId, fn($q) => $q->where('kitchen_id', $kitchenId))->sum('total_beneficiaries'),
            'compliance_rate' => 98 // Still placeholder for now
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
