// Central identity constants for public/demo mode
// These are used throughout the system as default fallbacks

export const DEFAULT_NUTRITIONIST = {
  full_name: "Anissa, SKM",
  username: "anissa_skm",
  role: "NUTRITIONIST",
  title: "Ahli Gizi",
};

export const DEFAULT_ASSIGNMENT = {
  unit_name: "SPPG HAUR PANGGUNG II",
  address: "Jl. Guntur Sari, Haurpanggung, Kec. Tarogong Kidul, Kab. Garut, Jawa Barat",
  institution: "LEC GARUT",
  program: "Program Makan Bergizi Gratis (MBG)",
};

export const getDefaultUser = (): typeof DEFAULT_NUTRITIONIST => {
  if (typeof window === 'undefined') return DEFAULT_NUTRITIONIST;
  const stored = localStorage.getItem('user');
  if (stored) {
    try { return JSON.parse(stored); } catch { return DEFAULT_NUTRITIONIST; }
  }
  return DEFAULT_NUTRITIONIST;
};
