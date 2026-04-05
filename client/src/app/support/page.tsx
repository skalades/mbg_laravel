"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageCircle, 
  HelpCircle, 
  ShieldCheck, 
  Activity, 
  FileText, 
  Smartphone,
  ChefHat,
  Truck,
  ClipboardCheck
} from "lucide-react";
import api from "@/lib/axios";

export default function SupportPage() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const checkApi = async () => {
      try {
        await api.get("/");
        setApiStatus("online");
      } catch (err) {
        setApiStatus("offline");
      }
    };
    checkApi();
  }, []);

  const faqs = [
    {
      icon: <ChefHat className="w-5 h-5" />,
      title: "Cara Menentukan Menu Harian",
      content: "Buka menu Meal Planner, pilih tanggal dan sekolah, lalu klik Tambahkan Menu. Pastikan porsi sudah sesuai dengan jumlah siswa yang terdaftar."
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      title: "Audit QC Berhasil (LULUS)",
      content: "Foto menu harus jelas dan skor organoleptik minimum adalah 3. Pastikan tanda tangan digital sudah dibubuhkan oleh Ahli Gizi penanggung jawab."
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Rekap Logistik Belanja",
      content: "Data logistik ditarik otomatis dari Meal Planner yang sudah diterbitkan. Gunakan fitur Smart Rounding untuk membulatkan berat belanja ke satuan KG terdekat."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 text-primary shadow-xl shadow-emerald-900/5 mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight font-headline">Pusat Bantuan & Layanan IT</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg italic">
          Kami siap membantu kelancaran operasional gizi dan logistik Nutrizi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Status */}
        <div className="lg:col-span-1 space-y-8">
          {/* Developer Card */}
          <div className="rounded-[2rem] p-8 bg-emerald-900 text-white border-none shadow-2xl shadow-emerald-900/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Lead Developer</p>
                <h3 className="text-2xl font-black italic">Nadir</h3>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">SKALADES Group</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-emerald-100/80 leading-relaxed font-medium">
                  Hubungi IT Support jika Anda mengalami kendala login, error aplikasi, atau memerlukan kustomisasi fitur.
                </p>
                
                <a 
                  href="https://wa.me/6285188449304?text=Halo%20Nadir%2C%20saya%20memerlukan%20bantuan%20teknis%20pada%20aplikasi%20Nutrizi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  WHATSAPP IT SUPPORT
                </a>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="premium-card p-6 border-slate-100 bg-slate-50">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              Sistem Health Check
            </h4>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-500">API Nutrizi</span>
              {apiStatus === "checking" ? (
                <span className="text-xs font-bold text-slate-400 animate-pulse">CHECKING...</span>
              ) : apiStatus === "online" ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-600">CONNECTED</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-xs font-bold text-rose-600">OFFLINE</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 text-center italic">Terdeteksi otomatis melalui modul SKALADES-Net</p>
          </div>
        </div>

        {/* Right Column: FAQ & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-slate-800">Panduan Penggunaan Cepat</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="premium-card p-6 hover:border-primary/20 transition-all group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {faq.icon}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900">{faq.title}</h5>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {faq.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-emerald-900">Dokumentasi Teknis Lengkap</h5>
                <p className="text-sm text-emerald-700">Pelajari detail fitur gizi dan rekap harian.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10">
              <Smartphone className="w-4 h-4" />
              Download Manual Book
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
          Developed by Nadir under SKALADES Group &copy; 2026
        </p>
      </div>
    </div>
  );
}
