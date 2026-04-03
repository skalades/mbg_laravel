"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isSaving: boolean;
  defaultGroup: string;
}

export default function SaveTemplateModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isSaving,
  defaultGroup 
}: SaveTemplateModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">bookmark_add</span>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 font-headline">Simpan Templat Baru</h3>
            <p className="text-slate-500 text-sm mt-1">Simpan racikan menu ini ke Master Library Anda.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Templat</label>
              <input 
                autoFocus
                type="text" 
                placeholder="Contoh: Menu Ayam Bakar SD"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-900 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && name && !isSaving) onSave(name);
                }}
              />
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600">info</span>
                <p className="text-[11px] text-emerald-800 font-medium">Ini akan disimpan dengan target sasaran: <span className="font-bold underline">{defaultGroup}</span></p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              disabled={!name || isSaving}
              onClick={() => onSave(name)}
              className="w-full bg-slate-900 hover:bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Konfirmasi Simpan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
