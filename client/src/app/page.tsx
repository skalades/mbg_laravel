"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    schools: 0,
    students: 0,
    menus: 42
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const schools = await api.get("/schools");
        setStats({
          schools: schools.data.length,
          students: schools.data.reduce((acc: number, s: any) => acc + s.total_beneficiaries, 0),
          menus: 42 // Simulated for now
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Dashboard Left Column */}
      <div className="col-span-12 lg:col-span-9 space-y-8">
        
        {/* Summary Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl transition-all hover:translate-y-[-4px] shadow-sm border border-black/5">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-primary-fixed text-primary rounded-lg material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold text-on-tertiary-container bg-tertiary-fixed/30 px-2 py-1 rounded">+12%</span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Beneficiaries</p>
            <p className="text-2xl font-extrabold font-headline text-primary mt-1">{stats.students.toLocaleString()}</p>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-xl transition-all hover:translate-y-[-4px] shadow-sm border border-black/5">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-secondary-fixed text-secondary rounded-lg material-symbols-outlined">school</span>
              <span className="text-xs text-on-surface-variant font-medium">Active</span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Schools</p>
            <p className="text-2xl font-extrabold font-headline text-primary mt-1">{stats.schools}</p>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-xl transition-all hover:translate-y-[-4px] shadow-sm border border-black/5">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-tertiary-fixed text-tertiary rounded-lg material-symbols-outlined">description</span>
              <span className="text-xs text-on-surface-variant font-medium">Current</span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Published Menus</p>
            <p className="text-2xl font-extrabold font-headline text-primary mt-1">{stats.menus}</p>
          </div>
          
          <div className="bg-primary p-5 rounded-xl shadow-lg shadow-primary/10">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-white/10 text-white rounded-lg material-symbols-outlined">verified_user</span>
              <span className="text-[10px] font-bold text-white/80 border border-white/20 px-2 py-1 rounded">HEALTHY</span>
            </div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">QC Status</p>
            <p className="text-2xl font-extrabold font-headline text-white mt-1">98%</p>
          </div>
        </section>

        {/* Hero CTA Section */}
        <section className="relative overflow-hidden rounded-xl bg-primary-container p-10 flex items-center min-h-[300px]">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 font-headline">Optimalkan Rencana Nutrisi Sekolah Hari Ini.</h2>
            <p className="text-on-primary-container mb-8 text-lg">Mulai siklus menu baru dengan deteksi alergi otomatis dan analisis biaya yang akurat.</p>
            <Link href="/planner" className="inline-flex bg-primary-fixed text-on-primary-fixed px-8 py-4 rounded-full font-bold text-md hover:scale-105 transition-transform items-center gap-3">
              Start Meal Planning
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              alt="Healthy meal" 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
          </div>
        </section>

        {/* Activity Feed Section */}
        <section className="bg-surface-container-low p-8 rounded-xl border border-black/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-headline text-primary">Recent Activity</h3>
            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-black/5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 shrink-0">
                <span className="material-symbols-outlined">publish</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface hover:text-primary transition-colors cursor-pointer">Menu Siklus A - Minggu 1 Berhasil Dipublikasikan</p>
                <p className="text-xs text-on-surface-variant mt-1">Terbit ke 12 sekolah di wilayah Jakarta Selatan.</p>
                <p className="text-[10px] text-outline mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> 12 mins ago
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded uppercase tracking-wider">System</span>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-black/5">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">edit_document</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface hover:text-secondary transition-colors cursor-pointer">Pembaruan Data Sekolah: SDN 01 Kebayoran</p>
                <p className="text-xs text-on-surface-variant mt-1">Profil nutrisi siswa diperbarui oleh Petugas Lapangan.</p>
                <p className="text-[10px] text-outline mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> 2 hours ago
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase tracking-wider">Data Entry</span>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl opacity-80 shadow-sm border border-black/5">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary shrink-0">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface hover:text-error transition-colors cursor-pointer">Peringatan: Stok Bahan Habis</p>
                <p className="text-xs text-on-surface-variant mt-1">Pemasok daging ayam melaporkan keterlambatan untuk Siklus B.</p>
                <p className="text-[10px] text-outline mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> 5 hours ago
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded uppercase tracking-wider">Alert</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Dashboard Right Column (Secondary Sidebar) */}
      <div className="col-span-12 lg:col-span-3 space-y-8">
        
        {/* Schedule Widget */}
        <section className="bg-primary text-white p-6 rounded-xl shadow-2xl shadow-primary/20">
          <div className="flex items-center gap-2 mb-6 text-primary-fixed">
            <span className="material-symbols-outlined">calendar_today</span>
            <h3 className="font-bold text-xs tracking-widest uppercase">Upcoming Schedule</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black font-headline">Senin, 01 April</p>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
              <span>Cycle A</span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span>Week 1</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="bg-white/10 p-4 rounded-lg border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Breakfast</p>
              <p className="text-sm font-semibold mt-1">Bubur Ayam Organik + Telur</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Lunch</p>
              <p className="text-sm font-semibold mt-1 leading-snug">Nasi Merah, Ikan Bakar, Sayur Bayam</p>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 border border-white/30 rounded-full text-xs font-bold hover:bg-white/10 transition-colors">
            View Full Calendar
          </button>
        </section>

        {/* Important Reminders */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 relative font-headline">
            Reminders
            <span className="absolute -bottom-1 left-2 w-4 h-0.5 bg-primary/20 rounded-full"></span>
          </h3>
          
          <div className="bg-error-container/40 p-5 rounded-xl border border-error/10 hover:shadow-sm transition-all shadow-error/5 cursor-default">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <div>
                <p className="text-sm font-bold text-on-error-container relative">Allergy Detection
                  <span className="absolute -right-2 -top-1 w-2 h-2 rounded-full bg-error animate-pulse"></span>
                </p>
                <p className="text-[11px] text-on-error-container/80 mt-1.5 leading-relaxed font-medium">Ditemukan 12 siswa dengan alergi kacang pada Menu Rabu.</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-error text-white hover:bg-error/90 transition-colors rounded-lg text-xs font-bold shadow-sm">Review Changes</button>
          </div>
          
          <div className="bg-secondary-container/50 p-5 rounded-xl border border-secondary/10 hover:shadow-sm transition-all cursor-default">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">trending_down</span>
              <div>
                <p className="text-sm font-bold text-on-secondary-container">Target Not Met</p>
                <p className="text-[11px] text-on-secondary-container/80 mt-1.5 leading-relaxed font-medium">Protein intake untuk SD Sukamaju di bawah target 15%.</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 bg-secondary text-white hover:bg-secondary/90 transition-colors rounded-lg text-xs font-bold">Details</button>
              <button className="p-2 border border-secondary/20 hover:bg-secondary/10 transition-colors rounded-lg text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Small Info Cards */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-black/5">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-4 font-headline">System Health</p>
            <div className="flex items-center justify-between mb-3 border-b border-outline-variant/30 pb-3">
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                 <span className="material-symbols-outlined text-[14px]">api</span> API Connectivity
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">sync</span> Data Sync Status
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">99.2% Sync</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
