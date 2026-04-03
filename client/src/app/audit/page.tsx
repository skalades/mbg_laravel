"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  Calendar, Loader2, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, Search, Package, Printer, Share2, Activity, PlayCircle, Eye
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { generateKitchenInstructionPDF } from '@/utils/ExportPDF';

const AuditDashboard = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [logistics, setLogistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<string>('SEMUA');
  const [printing, setPrinting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menusRes, logisticsRes] = await Promise.all([
        api.get('/menus/daily', { params: { date: selectedDate } }),
        api.get('/menus/daily/logistics/summary', { params: { date: selectedDate } })
      ]);
      setMenus(menusRes.data);
      setLogistics(logisticsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintIndividual = async (id: string) => {
    try {
      setPrinting(id);
      const res = await api.get(`/menus/daily/${id}`);
      generateKitchenInstructionPDF(res.data);
    } catch (error) {
      console.error('Error printing menu:', error);
      alert('Gagal mendownload instruksi dapur.');
    } finally {
      setPrinting(null);
    }
  };

  const handlePrintAll = async () => {
    if (filteredMenus.length === 0) return;
    
    setPrinting('ALL');
    try {
      for (const menu of filteredMenus) {
        const res = await api.get(`/menus/daily/${menu.id}`);
        generateKitchenInstructionPDF(res.data);
        // Add small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error printing multiple menus:', error);
      alert('Beberapa instruksi gagal didownload.');
    } finally {
      setPrinting(null);
    }
  };

  const handleShareWA = (menu: any) => {
    const dateStr = format(new Date(menu.menu_date), 'dd/MM/yyyy');
    const text = `📋 *NUTRIZI - LAPORAN MENU*\n\n🏫 *Sekolah:* ${menu.school_name}\n📅 *Tanggal:* ${dateStr}\n✅ *Status QC:* ${menu.organoleptic_status || 'Belum Diuji'}\n🍽️ *Produksi:* ${menu.total_production} Porsi\n\nLihat Detail: http://localhost:3001/audit/${menu.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DIPUBLIKASIKAN':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-200 flex items-center gap-1 uppercase tracking-tighter"><CheckCircle2 size={12} /> Selesai</span>;
      case 'DISETUJUI':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black border border-blue-200 flex items-center gap-1 uppercase tracking-tighter"><CheckCircle2 size={12} /> Terverifikasi</span>;
      case 'SIAP_AUDIT':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black border border-purple-200 flex items-center gap-1 uppercase tracking-tighter animate-pulse"><Eye size={12} /> Siap QC</span>;
      case 'PRODUKSI':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black border border-amber-200 flex items-center gap-1 uppercase tracking-tighter"><PlayCircle size={12} /> Memasak</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black border border-slate-200 flex items-center gap-1 uppercase tracking-tighter"><Clock size={12} /> Persiapan</span>;
    }
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.school_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'MENUNGGU_QC') {
      matchesTab = menu.organoleptic_status === 'TERTUNDA' || menu.status === 'SIAP_AUDIT';
    } else if (activeTab === 'TERVERIFIKASI') {
      matchesTab = menu.organoleptic_status === 'LULUS';
    } else if (activeTab === 'GAGAL') {
      matchesTab = menu.organoleptic_status === 'GAGAL';
    }

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Sinkronisasi Pusat Komando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mb-2">
            <Activity size={16} className="text-emerald-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Dashboard Operasional</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pusat Komando Dapur 🍳</h1>
          <p className="text-slate-500 max-w-lg">Skenario Ahli Gizi: Pantau logistik, kelola alur produksi, dan verifikasi mutu makanan dalam satu pintu.</p>
        </div>

        <div className="flex gap-4 min-w-[320px] max-w-xl w-full">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Cari sekolah atau klaster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm font-medium"
            />
          </div>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm font-bold text-slate-700 min-w-[150px]"
          />
        </div>
      </header>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['SEMUA', 'MENUNGGU_QC', 'TERVERIFIKASI', 'GAGAL'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all",
              activeTab === tab 
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
            )}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Logistics Aggregation Widget */}
      {logistics.length > 0 && (
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Ringkasan Logistik Harian</h2>
                  <p className="text-slate-400 text-xs uppercase font-black tracking-widest mt-1">Total Kebutuhan Bahan Hari Ini</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {logistics.slice(0, 4).map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 px-5 py-4 rounded-3xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{item.food_name}</p>
                    <p className="text-2xl font-black">{Math.round(item.total_weight_gram / 1000)} <span className="text-xs opacity-50 font-medium">KG</span></p>
                  </div>
                ))}
                {logistics.length > 4 && (
                   <div className="flex items-center justify-center px-4">
                      <p className="text-xs font-bold text-slate-500">+{logistics.length - 4} item lainnya</p>
                   </div>
                )}
              </div>
            </div>

            <button 
              onClick={handlePrintAll}
              disabled={printing === 'ALL'}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-5 rounded-3xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3 group/btn disabled:opacity-50"
            >
              {printing === 'ALL' ? <Loader2 className="animate-spin" size={20} /> : <Printer size={20} className="group-hover/btn:scale-110 transition-transform" />}
              {printing === 'ALL' ? 'MENGUNDUH...' : 'CETAK SEMUA INSTRUKSI'}
            </button>
          </div>
        </section>
      )}

      {/* Production List */}
      <div className="grid gap-6">
        <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Alur Produksi SDN / SMP</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{filteredMenus.length} Lokasi Aktif</span>
        </div>

        {filteredMenus.length > 0 ? (
          filteredMenus.map((menu) => (
            <div 
              key={menu.id} 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all group overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 border border-slate-100 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-100 transition-all">
                  <span className="text-[10px] uppercase font-black tracking-widest leading-none">{format(new Date(menu.menu_date), 'MMM', { locale: localeID })}</span>
                  <span className="text-3xl font-black leading-tight">{format(new Date(menu.menu_date), 'dd')}</span>
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-slate-800">{menu.school_name}</h3>
                      {getStatusBadge(menu.status)}
                   </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-bold">{menu.total_production} Porsi</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                        <CheckCircle2 size={16} className={menu.organoleptic_status === 'LULUS' ? 'text-emerald-500' : 'text-slate-300'} />
                        <span className="font-medium">QC: <span className={cn(menu.organoleptic_status === 'LULUS' ? 'text-emerald-600 font-bold' : '')}>{menu.organoleptic_status || 'Tertunda'}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link 
                    href={`/audit/${menu.id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all"
                >
                    <Activity size={16} /> Verifikasi QC
                </Link>
                
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button 
                      onClick={() => handlePrintIndividual(menu.id)}
                      disabled={printing === menu.id}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all disabled:opacity-50" 
                      title="Instruksi PDF"
                    >
                        {printing === menu.id ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
                    </button>
                    <button 
                      onClick={() => handleShareWA(menu)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all" 
                      title="Share WhatsApp"
                    >
                        <Share2 size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <Link 
                      href={`/audit/${menu.id}`}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tidak ada jadwal operasional</h3>
            <p className="text-slate-500 font-medium">Pastikan perencanaan menu sudah dikirim ke dapur hari ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditDashboard;
