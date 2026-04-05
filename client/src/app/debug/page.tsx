'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';

export default function DebugPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envUrl, setEnvUrl] = useState<string>('');

  useEffect(() => {
    setEnvUrl(process.env.NEXT_PUBLIC_API_URL || 'NOT SET (Defaults to localhost:3000)');
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test hitting a public or status endpoint if possible
      const response = await axios.get('/auth/status').catch(err => err.response || err);
      setStatus(response);
    } catch (err: any) {
      setError(err.message || 'Unknown Error');
      setStatus(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-mono text-sm bg-background min-h-screen text-on-surface">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined">bug_report</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Nutrizi Debug Console</h1>
      </div>
      
      <div className="grid gap-6">
        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings</span>
            Environment Configuration
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 font-bold">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">NEXT_PUBLIC_API_URL</p>
              <code className="text-primary text-base break-all">{envUrl}</code>
            </div>
            <p className="text-xs text-on-surface-variant italic p-3 bg-primary-fixed-dim/30 rounded-xl border border-primary-fixed">
              <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
              Jika alamat di atas tertulis <span className="font-bold">localhost</span>, berarti build Anda belum mengambil perubahan produksi. Harap jalankan 
              <span className="font-bold bg-primary/10 px-1 rounded ml-1 italic">Force Build</span> di terminal.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">lan</span>
            Connectivity & CORS Test
          </h2>
          <button 
            onClick={testConnection}
            disabled={loading}
            className="w-full sm:w-auto bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></span>
            ) : <span className="material-symbols-outlined text-[20px]">send</span>}
            {loading ? 'Menguji API...' : 'Test Connection to Backend'}
          </button>
          
          {status && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-bold">Raw Response Detail</p>
              <pre className="bg-surface-container p-4 rounded-xl overflow-x-auto text-[11px] border border-outline-variant max-h-[300px]">
                {JSON.stringify({
                  status: status.status,
                  statusText: status.statusText,
                  data: status.data,
                  config: {
                    url: status.config?.url,
                    baseURL: status.config?.baseURL,
                    withCredentials: status.config?.withCredentials
                  }
                }, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600">error</span>
              <div>
                <p className="font-bold">Error Connection:</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Client Session (LocalStorage)
          </h2>
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold font-headline pl-1 border-l-2 border-primary">Stored User Data</p>
            <pre className="overflow-x-auto text-[11px] text-emerald-800 font-bold">
              {typeof window !== 'undefined' ? localStorage.getItem('user') || 'Empty (No User Logged In)' : 'Server Rendering Phase'}
            </pre>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center pb-12">
        <a href="/login" className="inline-flex items-center gap-2 text-primary hover:text-emerald-900 transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke Login
        </a>
      </div>
    </div>
  );
}
