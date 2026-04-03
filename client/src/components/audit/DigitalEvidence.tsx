"use client";

import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Camera, Trash2, CameraOff, PenTool, CheckCircle } from 'lucide-react';

interface DigitalEvidenceProps {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  signatureRef: React.MutableRefObject<any>;
  savedSignature?: string | null;
}

const DigitalEvidence: React.FC<DigitalEvidenceProps> = ({ 
  photo, 
  setPhoto, 
  signatureRef,
  savedSignature 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(!!photo);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setIsPhotoCaptured(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setIsPhotoCaptured(false);
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  useEffect(() => {
    if (savedSignature && signatureRef.current && signatureRef.current.isEmpty()) {
      signatureRef.current.fromDataURL(savedSignature);
    }
  }, [savedSignature, signatureRef]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Photo Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Camera size={20} className="text-emerald-500" />
          Foto Menu Matang
        </h3>
        
        <div className="relative aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group">
          {photo ? (
            <>
              <img src={photo} alt="Menu matang" className="w-full h-full object-cover" />
              <button
                onClick={clearPhoto}
                className="absolute top-4 right-4 bg-rose-500/80 hover:bg-rose-500 text-white p-2 rounded-full transition-all backdrop-blur-sm"
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="bg-emerald-100/50 p-4 rounded-full inline-block mb-3">
                <Camera size={32} className="text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Ambil Foto Produk</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan kamera HP untuk hasil terbaik</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md"
              >
                Buka Kamera
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCapture}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <PenTool size={20} className="text-emerald-500" />
            Tanda Tangan Verifikasi
          </h3>
          <button
            onClick={clearSignature}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Bersihkan
          </button>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden touch-none">
          <SignatureCanvas
            ref={signatureRef}
            penColor="#1e293b" // Slate-800
            canvasProps={{
              className: "w-full h-48 signature-canvas",
              style: { width: '100%', height: '192px' }
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-3 italic text-center">
          Tanda tangan digital sebagai bukti verifikasi mutu harian
        </p>
      </div>
    </div>
  );
};

export default DigitalEvidence;
