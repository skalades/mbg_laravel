<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuditController extends Controller
{
    public function index()
    {
        return Inertia::render('Audit/Index');
    }
}
