import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { User, Hash, Calendar, FileText, FolderOpen, Image as ImageIcon, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// ========================================
// KONFIGURASI - GANTI URL INI!
// ========================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyxrASnDA9hb-ZaW-QEy0ojUTLIP8fEQZQhABi6kxWWN1STgyBVhK_VyWooELEhjJ5aA/exec";

// Mapping kategori dan poin
const KATEGORI_POIN = {
  ipk: { label: "IPK", poin: 15 },
  seminar_internal: { label: "Seminar Internal", poin: 10 },
  seminar_nasional: { label: "Seminar Nasional", poin: 10 },
  panitia: { label: "Panitia", poin: 10 },
  ketua_panitia: { label: "Ketua Panitia", poin: 15 },
  penelitian: { label: "Penelitian", poin: 15 },
  jurnal_sinta4: { label: "Jurnal SINTA 4", poin: 20 },
  jurnal_sinta3: { label: "Jurnal SINTA 3", poin: 35 },
  jurnal_sinta12: { label: "Jurnal SINTA 1/2", poin: 50 },
  opini_nasional: { label: "Opini Media Nasional", poin: 20 },
  opini_lokal: { label: "Opini Media Lokal", poin: 10 },
  lomba_lokal: { label: "Lomba Lokal", poin: 10 },
  lomba_nasional: { label: "Lomba Nasional", poin: 50 },
  pengabdian: { label: "Pengabdian Masyarakat", poin: 15 },
  mentoring: { label: "Mentoring", poin: 10 },
} as const;

type KategoriKey = keyof typeof KATEGORI_POIN;

interface FormData {
  nama: string;
  nim: string;
  nama_kegiatan: string;
  kategori: KategoriKey | "";
  semester: string;
}

const StudentForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nim: "",
    nama_kegiatan: "",
    kategori: "",
    semester: "",
  });

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Calculate points
  const calculatePoints = (kategori: KategoriKey | ""): number => {
    if (!kategori) return 0;
    return KATEGORI_POIN[kategori]?.poin || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 [START] Form submission");

    // Validation
    if (!formData.nama || !formData.nim || !formData.nama_kegiatan || !formData.kategori) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get foto file
      const fotoInput = document.getElementById("foto") as HTMLInputElement;
      const fotoFile = fotoInput?.files?.[0];

      if (!fotoFile) {
        toast.error("Foto kegiatan wajib diupload!");
        setIsSubmitting(false);
        return;
      }

      console.log("📸 Converting foto to base64...");
      const fotoBase64 = await fileToBase64(fotoFile);

      // Calculate points
      const poin = calculatePoints(formData.kategori as KategoriKey);

      // Prepare payload - EXACT sesuai Apps Script
      const payload = {
        nama: formData.nama.trim(),
        nim: formData.nim.trim(),
        nama_kegiatan: formData.nama_kegiatan.trim(),
        kategori: formData.kategori,
        semester: formData.semester,
        poin: poin,
        foto: fotoBase64,
      };

      console.log("📦 Payload:", { ...payload, foto: "[BASE64_DATA]" });
      console.log("🌐 Sending to:", APPS_SCRIPT_URL);

      // Send to Apps Script - USE NO-CORS for Google Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response:", response.type, response.status);

      // With no-cors, we can't read the response
      // Assume success if no error thrown
      console.log("✅ Request sent (no-cors mode - cannot verify response)");

      toast.success("Data berhasil dikirim! 🎉", {
        description: "Silakan cek Google Sheets untuk verifikasi",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Gagal mengirim data. Cek console untuk detail.");
    } finally {
      setIsSubmitting(false);
      console.log("🏁 [END] Submission process");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-primary/95 backdrop-blur-md border-b-2 border-primary/30 text-primary-foreground shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                <img src="/unpam_logo.png" alt="UNPAM Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">UNIVERSITAS PAMULANG</h1>
                <p className="text-xs font-medium opacity-90">Form Pengumpulan Kegiatan Ilmiah</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="sm" className="font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl border-2 border-primary/30">
                  <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Form Kegiatan Ilmiah
              </h1>
              <p className="text-lg text-foreground/70">
                Lengkapi data kegiatan ilmiah Anda
              </p>
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-primary/30 p-6 md:p-10 hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
            
            <div className="relative z-10">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Nama Mahasiswa */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Nama Mahasiswa <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* NIM */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Hash className="h-4 w-4 text-primary" />
                  NIM <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan NIM"
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50"
                  />
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  Semester <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50 appearance-none"
                  >
                    <option value="">Pilih semester</option>
                    <option value="GANJIL 2024/2025">GANJIL 2024/2025</option>
                    <option value="GENAP 2024/2025">GENAP 2024/2025</option>
                    <option value="GANJIL 2025/2026">GANJIL 2025/2026</option>
                    <option value="GENAP 2025/2026">GENAP 2025/2026</option>
                  </select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Nama Kegiatan */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Nama Kegiatan <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Seminar Nasional AI 2024"
                    value={formData.nama_kegiatan}
                    onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Kategori Kegiatan <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriKey })}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50 appearance-none"
                  >
                    <option value="">Pilih kategori</option>
                    {Object.entries(KATEGORI_POIN).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {value.label} (+{value.poin} poin)
                      </option>
                    ))}
                  </select>
                  <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                {formData.kategori && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/30 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-success" />
                      Poin yang akan didapat: <span className="text-lg text-success font-bold">{calculatePoints(formData.kategori as KategoriKey)}</span> poin
                    </p>
                  </div>
                )}
              </div>

              {/* Foto */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Foto Kegiatan <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-input rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-xs text-muted-foreground ml-1">Format: JPG, PNG (Maks. 5MB)</p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-primary font-bold">ℹ️</span>
                  <span><strong>Info:</strong> Data akan dikirim ke Google Sheets dan divalidasi oleh dosen pembimbing.</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-6 text-base font-semibold border-2 hover:bg-accent hover:border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-6 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  {isSubmitting ? (
                    <>
                      <span className="relative z-10">⏳ Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5 relative z-10" />
                      <span className="relative z-10">Kirim Data</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentForm;
