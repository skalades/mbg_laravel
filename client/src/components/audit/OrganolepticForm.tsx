"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface OrganolepticFormProps {
  scores: {
    warna: number;
    aroma: number;
    tekstur: number;
    rasa: number;
    suhu: number;
  };
  setScores: (scores: any) => void;
  suhuPemasakan: number | '';
  setSuhuPemasakan: (val: number | '') => void;
  suhuDistribusi: number | '';
  setSuhuDistribusi: (val: number | '') => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const OrganolepticForm: React.FC<OrganolepticFormProps> = ({ 
  scores, setScores, 
  suhuPemasakan, setSuhuPemasakan, 
  suhuDistribusi, setSuhuDistribusi, 
  notes, setNotes 
}) => {
  const parameters = [
    { key: 'warna', label: 'Warna (Visual)', description: 'Menarik & Sesuai Standar' },
    { key: 'aroma', label: 'Aroma (Smell)', description: 'Segar & Menggugah Selera' },
    { key: 'tekstur', label: 'Tekstur (Texture)', description: 'Tingkat kematangan pas' },
    { key: 'rasa', label: 'Rasa (Taste)', description: 'Enak & Sesuai Bumbu' },
    { key: 'suhu', label: 'Suhu (Temperature)', description: 'Hangat saat disajikan' },
  ];

  const handleScoreChange = (key: string, score: number) => {
    setScores((prev: any) => ({ ...prev, [key]: score }));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg text-sm">👅</span>
        Uji Organoleptik (QC)
      </h3>

      <div className="grid gap-6">
        {parameters.map((param) => (
          <div key={param.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-medium text-slate-900">{param.label}</p>
              <p className="text-sm text-slate-500">{param.description}</p>
            </div>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleScoreChange(param.key, star)}
                  className={`p-1 transition-all ${
                    (scores as any)[param.key] >= star ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-200'
                  }`}
                >
                  <Star size={24} fill={(scores as any)[param.key] >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Input Suhu Numerik */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div>
            <p className="font-medium text-amber-900 flex items-center gap-2">
              🌡️ Suhu Pemasakan Internal (Wajib {'>'}75°C)
            </p>
            <p className="text-sm text-amber-800">Suhu tengah daging/makanan setelah matang</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={suhuPemasakan}
              onChange={(e) => setSuhuPemasakan(e.target.value ? Number(e.target.value) : '')}
              placeholder="0"
              className="w-24 px-4 py-2 text-center font-bold text-lg rounded-xl border border-amber-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="font-bold text-amber-900">°C</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <div>
            <p className="font-medium text-orange-900 flex items-center gap-2">
              🌡️ Suhu Distribusi / Holding (Wajib {'>'}60°C)
            </p>
            <p className="text-sm text-orange-800">Suhu terjaga sebelum diberikan ke siswa</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={suhuDistribusi}
              onChange={(e) => setSuhuDistribusi(e.target.value ? Number(e.target.value) : '')}
              placeholder="0"
              className="w-24 px-4 py-2 text-center font-bold text-lg rounded-xl border border-orange-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="font-bold text-orange-900">°C</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tuliskan catatan khusus mengenai kualitas makanan hari ini..."
          className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
};

export default OrganolepticForm;
