<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $auditLog ? 'Sertifikat QC' : 'Lembar Kerja Persiapan' }} - {{ $date }}</title>
    <style>
        @page {
            margin: 1.5cm 1.5cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        /* Header / Kop Surat Symmetry Fix */
        .kop-surat-table {
            width: 100%;
            border-bottom: 3px double #064e3b;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .logo-col {
            width: 80px;
            vertical-align: middle;
        }
        .header-text-col {
            text-align: center;
            vertical-align: middle;
        }
        .spacer-col {
            width: 80px;
        }
        .kitchen-name {
            font-size: 20px;
            font-weight: 800;
            color: #064e3b;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin: 0;
        }
        .kitchen-address {
            font-size: 9px;
            color: #64748b;
            margin-top: 5px;
            font-style: italic;
        }
        
        .report-title {
            text-align: center;
            margin: 25px 0;
            text-decoration: underline;
            font-size: 15px;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
            letter-spacing: 1px;
        }
        .section-header {
            background-color: #f8fafc;
            border-left: 5px solid #064e3b;
            padding: 8px 15px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #064e3b;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .data-grid {
            width: 100%;
            margin-bottom: 25px;
        }
        .data-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 2px;
        }
        .data-value {
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
        }
        .score-table {
            width: 100%;
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
            border-collapse: collapse;
        }
        .score-table th {
            font-size: 9px;
            background: #f1f5f9;
            padding: 10px;
            text-align: center;
            border: 1px solid #e2e8f0;
            text-transform: uppercase;
        }
        .score-table td {
            font-size: 14px;
            font-weight: 800;
            padding: 15px;
            text-align: center;
            border: 1px solid #e2e8f0;
            color: #064e3b;
        }
        /* Photo Box Optimization */
        .photo-box {
            text-align: center;
            margin: 15px 0;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 15px;
            background-color: #fcfcfc;
        }
        .photo {
            max-width: 100%;
            max-height: 280px; 
            border-radius: 10px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .instruction-card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 15px 20px;
            border-radius: 15px;
            font-size: 10px;
            color: #166534;
            margin-bottom: 30px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 40px;
        }
        .table th {
            text-align: left;
            background: #f8fafc;
            padding: 10px;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
        }
        .table td {
            padding: 12px 10px;
            border-bottom: 1px solid #f1f5f9;
        }
        /* Signature Area & Page Break Fix */
        .signature-area {
            margin-top: 80px;
            width: 100%;
            page-break-inside: avoid;
        }
        .signature-box {
            float: right;
            text-align: center;
            width: 250px;
        }
        .signature-title {
            font-size: 11px;
            margin-bottom: 70px; 
            font-weight: 700;
        }
        .signature-name {
            font-size: 13px;
            font-weight: 800;
            border-bottom: 2px solid #0f172a;
            display: inline-block;
            padding-bottom: 2px;
            margin-bottom: 5px;
            color: #0f172a;
        }
        .signature-id {
            font-size: 8px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer-note {
            margin-top: 50px;
            font-size: 8px;
            color: #94a3b8;
            font-style: italic;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 15px;
            clear: both;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>
    <table class="kop-surat-table">
        <tr>
            <td class="logo-col">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" style="width: 75px;">
                @endif
            </td>
            <td class="header-text-col">
                <div class="kitchen-name">{{ $kitchen->kitchen_name }}</div>
                <div class="kitchen-address">
                    {{ $kitchen->location_address ?? 'Alamat unit dapur belum dikonfigurasi' }}
                </div>
            </td>
            <td class="spacer-col"></td>
        </tr>
    </table>

    @php $sectionCount = 1; @endphp

    <div class="report-title">
        {{ $auditLog ? 'Sertifikat Quality Control & Laporan Pengadaan' : 'Lembar Kerja Persiapan Dapur & Logistik' }}
    </div>

    <table class="data-grid">
        <tr>
            <td width="30%">
                <div class="data-label">Handled Date</div>
                <div class="data-value">{{ \Carbon\Carbon::parse($date)->translatedFormat('l, d F Y') }}</div>
            </td>
            <td width="40%">
                <div class="data-label">Production Unit</div>
                <div class="data-value">{{ $kitchen->kitchen_name }}</div>
            </td>
            <td width="30%">
                <div class="data-label">Document Type</div>
                <div class="data-value">{{ $auditLog ? 'Final QC Certificate' : 'Pre-Cooking Worksheet' }}</div>
            </td>
        </tr>
    </table>

    @if($auditLog)
        <div class="section-header">{{ $sectionCount++ }}. Dokumentasi Foto Menu (Visual Proof)</div>
        <div class="photo-box">
            @if($photoBase64)
                <img src="{{ $photoBase64 }}" class="photo">
            @else
                <div style="padding: 50px; color: #cbd5e1; font-style: italic; font-size: 11px;">Dokumentasi visual tidak tersedia dalam sistem</div>
            @endif
        </div>

        <div class="section-header">{{ $sectionCount++ }}. Uji Kelayakan Organoleptic</div>
        <table class="score-table">
            <tr>
                <th width="25%">Rasa</th>
                <th width="25%">Penampilan</th>
                <th width="25%">Aroma</th>
                <th width="25%">Tekstur</th>
            </tr>
            <tr>
                <td>{{ $auditLog->taste_score }} / 5</td>
                <td>{{ $auditLog->appearance_score }} / 5</td>
                <td>{{ $auditLog->aroma_score }} / 5</td>
                <td>{{ $auditLog->texture_score }} / 5</td>
            </tr>
        </table>
    @endif

    @if(count($instructions) > 0)
        <div class="section-header">{{ $sectionCount++ }}. Instruksi Khusus Dapur & Prosedur</div>
        <div class="instruction-card">
            @foreach($instructions as $inst)
                <div style="margin-bottom: 8px;">
                    <span style="font-weight: 800; color: #166534; text-decoration: underline;">• {{ $inst['menu_name'] }}:</span>
                    <div style="margin-top: 3px; line-height: 1.6;">{!! nl2br(e($inst['content'])) !!}</div>
                </div>
            @endforeach
        </div>
    @endif

    @if(count($nutritionSummary) > 0)
        <div class="section-header">{{ $sectionCount++ }}. Analisis Kandungan Gizi Per Porsi</div>
        
        @foreach($nutritionSummary as $nutri)
            <!-- Detailed Table for Small Portion -->
            <div style="margin-bottom: 5px; font-size: 10px; font-weight: 800; color: #064e3b; text-transform: uppercase;">
                {{ $nutri['menu_name'] }} - Porsi Kecil (SD)
            </div>
            <table class="table" style="margin-bottom: 20px;">
                <thead>
                    <tr>
                        <th width="40%">Komponen Bahan</th>
                        <th width="15%" style="text-align: right;">Energi</th>
                        <th width="15%" style="text-align: right;">Protein</th>
                        <th width="15%" style="text-align: right;">Lemak</th>
                        <th width="15%" style="text-align: right;">Karbo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($nutri['small_items'] as $sit)
                        <tr>
                            <td>{{ $sit['name'] }} <small style="color: #94a3b8;">({{ $sit['weight'] }}g)</small></td>
                            <td style="text-align: right;">{{ number_format($sit['kcal'], 1) }}</td>
                            <td style="text-align: right;">{{ number_format($sit['protein'], 1) }}g</td>
                            <td style="text-align: right;">{{ number_format($sit['fat'], 1) }}g</td>
                            <td style="text-align: right;">{{ number_format($sit['carbs'], 1) }}g</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr style="background-color: #f1f5f9; font-weight: 800;">
                        <td style="text-transform: uppercase;">Total Kandungan Gizi</td>
                        <td style="text-align: right;">{{ number_format($nutri['small_total']['kcal'], 1) }}</td>
                        <td style="text-align: right;">{{ number_format($nutri['small_total']['protein'], 1) }}g</td>
                        <td style="text-align: right;">{{ number_format($nutri['small_total']['fat'], 1) }}g</td>
                        <td style="text-align: right;">{{ number_format($nutri['small_total']['carbs'], 1) }}g</td>
                    </tr>
                    <tr style="background-color: #f8fafc; color: #64748b; font-size: 8px;">
                        <td>Target Standar Gizi (SD)</td>
                        <td style="text-align: right;">469.9</td>
                        <td style="text-align: right;">10.5g</td>
                        <td style="text-align: right;">16.0g</td>
                        <td style="text-align: right;">72.0g</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Detailed Table for Large Portion -->
            <div style="margin-bottom: 5px; font-size: 10px; font-weight: 800; color: #064e3b; text-transform: uppercase;">
                {{ $nutri['menu_name'] }} - Porsi Besar (SMP)
            </div>
            <table class="table" style="margin-bottom: 30px;">
                <thead>
                    <tr>
                        <th width="40%">Komponen Bahan</th>
                        <th width="15%" style="text-align: right;">Energi</th>
                        <th width="15%" style="text-align: right;">Protein</th>
                        <th width="15%" style="text-align: right;">Lemak</th>
                        <th width="15%" style="text-align: right;">Karbo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($nutri['large_items'] as $lit)
                        <tr>
                            <td>{{ $lit['name'] }} <small style="color: #94a3b8;">({{ $lit['weight'] }}g)</small></td>
                            <td style="text-align: right;">{{ number_format($lit['kcal'], 1) }}</td>
                            <td style="text-align: right;">{{ number_format($lit['protein'], 1) }}g</td>
                            <td style="text-align: right;">{{ number_format($lit['fat'], 1) }}g</td>
                            <td style="text-align: right;">{{ number_format($lit['carbs'], 1) }}g</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr style="background-color: #f1f5f9; font-weight: 800;">
                        <td style="text-transform: uppercase;">Total Kandungan Gizi</td>
                        <td style="text-align: right;">{{ number_format($nutri['large_total']['kcal'], 1) }}</td>
                        <td style="text-align: right;">{{ number_format($nutri['large_total']['protein'], 1) }}g</td>
                        <td style="text-align: right;">{{ number_format($nutri['large_total']['fat'], 1) }}g</td>
                        <td style="text-align: right;">{{ number_format($nutri['large_total']['carbs'], 1) }}g</td>
                    </tr>
                    <tr style="background-color: #f8fafc; color: #64748b; font-size: 8px;">
                        <td>Target Standar Gizi (SMP)</td>
                        <td style="text-align: right;">644.5</td>
                        <td style="text-align: right;">18.3g</td>
                        <td style="text-align: right;">21.3g</td>
                        <td style="text-align: right;">95.3g</td>
                    </tr>
                </tfoot>
            </table>
        @endforeach
    @endif

    <div class="section-header">{{ $sectionCount++ }}. Agregasi Kebutuhan Bahan (Logistik)</div>
    <table class="table">
        <thead>
            <tr>
                <th width="25%">Kategori</th>
                <th width="45%">Item Bahan Makanan</th>
                <th width="30%" style="text-align: right;">Total (Kg/Unit)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($requirements as $req)
                <tr>
                    <td style="color: #64748b;">{{ $req['category'] }}</td>
                    <td style="font-weight: 700;">{{ $req['name'] }}</td>
                    <td style="text-align: right; font-weight: 800;">{{ number_format($req['total_weight'] / 1000, 2) }} kg</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-header">{{ $sectionCount++ }}. Rincian Distribusi Porsi Per Sekolah</div>
    <table class="table">
        <thead>
            <tr>
                <th width="40%">Nama Unit Sekolah</th>
                <th width="15%" style="text-align: center;">Porsi Kecil</th>
                <th width="15%" style="text-align: center;">Porsi Besar</th>
                <th width="15%" style="text-align: center;">Buffer/Sample</th>
                <th width="15%" style="text-align: right;">Total Porsi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($distribution as $dist)
                <tr>
                    <td style="font-weight: 700;">{{ $dist['school_name'] }}</td>
                    <td style="text-align: center;">{{ $dist['small_count'] }}</td>
                    <td style="text-align: center;">{{ $dist['large_count'] }}</td>
                    <td style="text-align: center;">+{{ $dist['buffer'] + $dist['sample'] }}</td>
                    <td style="text-align: right; font-weight: 800;">{{ $dist['total'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-title">{{ $auditLog ? 'Ahli Gizi Penanggung Jawab,' : 'Koordinator Unit Dapur,' }}</div>
            <div class="signature-name">
                @if($auditLog)
                    {{ $auditLog->auditor->full_name }}{{ $auditLog->auditor->title ? ', '.$auditLog->auditor->title : '' }}
                @else
                    (__________________________)
                @endif
            </div>
            <div class="signature-id">
                @if($auditLog)
                    Digital Signature ID: #{{ strtoupper(substr(md5($auditLog->id . $auditLog->audited_by), 0, 10)) }}
                @else
                    Manual Signature Required for Worksheet
                @endif
            </div>
        </div>
        <div class="clear"></div>
    </div>

    <div class="footer-note">
        Laporan ini diproses oleh Sistem Nutrizi untuk keperluan operasional unit dapur.<br>
        Waktu Cetak: {{ now()->translatedFormat('d F Y, H:i') }} | Unit Produksi: {{ $kitchen->kitchen_name }}
    </div>
</body>
</html>
