<?php

namespace App\Http\Controllers;

use App\Models\DailyMenu;
use App\Models\AuditLog;
use App\Models\Kitchen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ImageService;
use App\Http\Requests\StoreAuditRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class AuditController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    private function getAuditData($kitchenId, $date)
    {
        // Get daily menus and instructions
        $dailyMenusQuery = DailyMenu::with(['school', 'items.foodItem', 'masterMenu'])
            ->where('menu_date', $date);

        if ($kitchenId) {
            $dailyMenusQuery->whereHas('school', fn($q) => $q->where('kitchen_id', $kitchenId));
        }

        $dailyMenus = $dailyMenusQuery->get();

        $requirements = [];
        $instructions = [];
        $distribution = [];
        $nutritionSummary = [];
        $processedMenus = [];

        foreach ($dailyMenus as $menu) {
            // Calculate nutrition summary for each unique master menu in the schedule
            $masterMenuId = $menu->master_menu_id;
            if (!in_array($masterMenuId, $processedMenus)) {
                $smallItems = [];
                $largeItems = [];
                $smallNutri = ['kcal' => 0, 'protein' => 0, 'fat' => 0, 'carbs' => 0];
                $largeNutri = ['kcal' => 0, 'protein' => 0, 'fat' => 0, 'carbs' => 0];

                foreach ($menu->items as $item) {
                    $food = $item->foodItem;
                    if ($food) {
                        $sKcal = ($item->weight_small / 100) * $food->energy_kcal;
                        $sProt = ($item->weight_small / 100) * $food->protein_g;
                        $sFat = ($item->weight_small / 100) * $food->fat_g;
                        $sCarb = ($item->weight_small / 100) * $food->carbs_g;

                        $lKcal = ($item->weight_large / 100) * $food->energy_kcal;
                        $lProt = ($item->weight_large / 100) * $food->protein_g;
                        $lFat = ($item->weight_large / 100) * $food->fat_g;
                        $lCarb = ($item->weight_large / 100) * $food->carbs_g;

                        $smallItems[] = [
                            'name' => $food->name . ' (' . $item->portion_name . ')',
                            'weight' => $item->weight_small,
                            'kcal' => $sKcal,
                            'protein' => $sProt,
                            'fat' => $sFat,
                            'carbs' => $sCarb
                        ];
                        
                        $largeItems[] = [
                            'name' => $food->name . ' (' . $item->portion_name . ')',
                            'weight' => $item->weight_large,
                            'kcal' => $lKcal,
                            'protein' => $lProt,
                            'fat' => $lFat,
                            'carbs' => $lCarb
                        ];

                        $smallNutri['kcal'] += $sKcal;
                        $smallNutri['protein'] += $sProt;
                        $smallNutri['fat'] += $sFat;
                        $smallNutri['carbs'] += $sCarb;

                        $largeNutri['kcal'] += $lKcal;
                        $largeNutri['protein'] += $lProt;
                        $largeNutri['fat'] += $lFat;
                        $largeNutri['carbs'] += $lCarb;
                    }
                }

                $nutritionSummary[] = [
                    'menu_name' => $menu->masterMenu->menu_name,
                    'small_items' => $smallItems,
                    'large_items' => $largeItems,
                    'small_total' => $smallNutri,
                    'large_total' => $largeNutri
                ];
                $processedMenus[] = $masterMenuId;
            }

            if ($menu->masterMenu && $menu->masterMenu->cooking_instructions) {
                $instructions[$menu->master_menu_id] = [
                    'menu_name' => $menu->masterMenu->menu_name,
                    'content' => $menu->masterMenu->cooking_instructions
                ];
            }

            $smallCount = $menu->school->small_portion_count;
            $largeCount = $menu->school->large_portion_count;
            $buffer = $menu->buffer_portions;
            $sample = $menu->organoleptic_portions;

            $distribution[] = [
                'school_name' => $menu->school->school_name,
                'small_count' => $smallCount,
                'large_count' => $largeCount,
                'buffer' => $buffer,
                'sample' => $sample,
                'total' => $smallCount + $largeCount + $buffer + $sample
            ];

            $totalLargeBase = $largeCount + $buffer + $sample;

            foreach ($menu->items as $item) {
                $foodId = $item->food_item_id;
                if (!isset($requirements[$foodId])) {
                    $requirements[$foodId] = [
                        'name' => $item->foodItem->name,
                        'category' => $item->foodItem->category,
                        'unit' => $item->foodItem->base_unit,
                        'total_weight' => 0,
                    ];
                }
                $weight = ($smallCount * $item->weight_small) + ($totalLargeBase * $item->weight_large);
                $requirements[$foodId]['total_weight'] += $weight;
            }
        }

        $auditLog = AuditLog::with('auditor')
            ->where('kitchen_id', $kitchenId)
            ->where('audit_date', $date)
            ->first();

        $kitchen = Kitchen::find($kitchenId);

        return [
            'requirements' => array_values($requirements),
            'instructions' => array_values($instructions),
            'distribution' => $distribution,
            'nutritionSummary' => $nutritionSummary,
            'auditLog' => $auditLog,
            'kitchen' => $kitchen,
            'date' => $date
        ];
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', now()->toDateString());
        $kitchenId = $request->input('kitchen_id', $user->kitchen_id);

        if (!$kitchenId && $user->role !== 'ADMIN') {
             return redirect()->route('dashboard')->with('error', 'Anda harus ditugaskan ke sebuah unit dapur.');
        }

        $data = $this->getAuditData($kitchenId, $date);

        return Inertia::render('Audit/Index', [
            'requirements' => $data['requirements'],
            'instructions' => $data['instructions'],
            'auditLog' => $data['auditLog'],
            'selectedDate' => $date,
            'kitchenId' => $kitchenId
        ]);
    }

    public function exportPdf(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', now()->toDateString());
        $kitchenId = $request->input('kitchen_id', $user->kitchen_id);

        if (!$kitchenId && $user->role !== 'ADMIN') {
            abort(403);
        }

        $data = $this->getAuditData($kitchenId, $date);

        // Prepare photo base64
        $photoBase64 = null;
        if ($data['auditLog'] && $data['auditLog']->photo_path && Storage::disk('public')->exists($data['auditLog']->photo_path)) {
            $photoPath = Storage::disk('public')->path($data['auditLog']->photo_path);
            $type = pathinfo($photoPath, PATHINFO_EXTENSION);
            $imageData = file_get_contents($photoPath);
            $photoBase64 = 'data:image/' . $type . ';base64,' . base64_encode($imageData);
        }

        // Prepare Logo base64
        $logoBase64 = null;
        $logoPath = public_path('assets/logo-pdf.png');
        if (file_exists($logoPath)) {
            $logoType = pathinfo($logoPath, PATHINFO_EXTENSION);
            $logoData = file_get_contents($logoPath);
            $logoBase64 = 'data:image/' . $logoType . ';base64,' . base64_encode($logoData);
        }

        $data['photoBase64'] = $photoBase64;
        $data['logoBase64'] = $logoBase64;

        $pdf = Pdf::loadView('pdf.audit_report', $data);
        
        $filename = $data['auditLog'] ? "QC_REPORT_{$kitchenId}_{$date}.pdf" : "KITCHEN_WORKSHEET_{$kitchenId}_{$date}.pdf";
        return $pdf->download($filename);
    }

    public function store(StoreAuditRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        $kitchenId = $request->input('kitchen_id', $user->kitchen_id);

        if (!$kitchenId && $user->role !== 'ADMIN') {
             return redirect()->back()->with('error', 'Anda harus ditugaskan ke sebuah unit dapur.');
        }

        $photoPath = $this->imageService->compressAndStore($request->file('photo'));

        $audit = AuditLog::updateOrCreate(
            [
                'kitchen_id' => $kitchenId,
                'audit_date' => $validated['audit_date'],
            ],
            [
                'photo_path' => $photoPath,
                'taste_score' => $validated['taste_score'],
                'appearance_score' => $validated['appearance_score'],
                'aroma_score' => $validated['aroma_score'],
                'texture_score' => $validated['texture_score'],
                'notes' => $validated['notes'],
                'audited_by' => $user->id,
            ]
        );

        return redirect()->back()->with('success', 'Audit QC berhasil disimpan.');
    }
}
