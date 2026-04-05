import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("login"));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <Head title="Masuk ke Nutrizi" />

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-800/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <img 
              src="/assets/logo-nutrizi.png" 
              alt="Nutrizi Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-white font-headline tracking-tight text-center">
            Selamat Datang di Nutrizi
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
            Sistem Manajemen Gizi & Logistik Operasional
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {status && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm font-bold text-emerald-400 animate-pulse">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 ml-1">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                  placeholder="Masukkan username Anda"
                  autoComplete="username"
                  required
                />
              </div>
              {errors.username && <p className="text-rose-400 text-[11px] font-bold ml-1">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              {errors.password && <p className="text-rose-400 text-[11px] font-bold ml-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData("remember", e.target.checked)}
                  className="w-4 h-4 rounded-md border-white/10 bg-white/5 checked:bg-emerald-500 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300">Ingat saya</span>
              </label>

              {canResetPassword && (
                <Link
                  href={route("password.request")}
                  className="text-xs font-bold text-emerald-500/70 hover:text-emerald-400 transition-colors"
                >
                  Lupa password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {processing ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  Masuk Sekarang
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer branding */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            Powered by SKALADES Agentic System
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-500">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-[9px] font-bold uppercase tracking-widest italic opacity-50">Secure Encryption Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
