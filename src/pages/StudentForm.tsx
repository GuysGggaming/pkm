import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-600">Sistem Validasi PKM</h1>
          <p className="text-sm text-gray-600">Form Pengumpulan Kegiatan Ilmiah</p>
        </div>
      </nav>

      {/* Main Form */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Kegiatan Ilmiah</h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Nama Mahasiswa */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nama Mahasiswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* NIM */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  NIM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan NIM"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Pilih semester</option>
                  <option value="GANJIL 2024/2025">GANJIL 2024/2025</option>
                  <option value="GENAP 2024/2025">GENAP 2024/2025</option>
                  <option value="GANJIL 2025/2026">GANJIL 2025/2026</option>
                  <option value="GENAP 2025/2026">GENAP 2025/2026</option>
                </select>
              </div>

              {/* Nama Kegiatan */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nama Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Seminar Nasional AI 2024"
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kategori Kegiatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriKey })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                {formData.kategori && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      ✨ Poin yang akan didapat: <span className="text-lg">{calculatePoints(formData.kategori as KategoriKey)}</span> poin
                    </p>
                  </div>
                )}
              </div>

              {/* Foto */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Foto Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (Maks. 5MB)</p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Info:</strong> Data akan dikirim ke Google Sheets dan divalidasi oleh dosen pembimbing.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "⏳ Mengirim..." : "📤 Kirim Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentForm;
