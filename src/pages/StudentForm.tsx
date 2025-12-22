import { useState } from "react";
import { User, Hash, Calendar, FileText, FolderOpen, FileUp, ArrowLeft, Send, Link as LinkIcon, Plus, Trash2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// ========================================
// KONFIGURASI
// ========================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyxrASnDA9hb-ZaW-QEy0ojUTLIP8fEQZQhABi6kxWWN1STgyBVhK_VyWooELEhjJ5aA/exec";

// Mapping kategori kegiatan
const KATEGORI_OPTIONS = [
  { value: "ipk", label: "IPK", requireFile: true, requireLink: false },
  { value: "seminar_internal", label: "Seminar Internal", requireFile: true, requireLink: false },
  { value: "seminar_nasional", label: "Seminar Nasional", requireFile: true, requireLink: false },
  { value: "panitia", label: "Panitia", requireFile: true, requireLink: false },
  { value: "ketua_panitia", label: "Ketua Panitia", requireFile: true, requireLink: false },
  { value: "penelitian", label: "Penelitian", requireFile: true, requireLink: true },
  { value: "jurnal_sinta4", label: "Jurnal SINTA 4", requireFile: true, requireLink: true },
  { value: "jurnal_sinta3", label: "Jurnal SINTA 3", requireFile: true, requireLink: true },
  { value: "jurnal_sinta12", label: "Jurnal SINTA 1/2", requireFile: true, requireLink: true },
  { value: "opini_nasional", label: "Opini Media Nasional", requireFile: false, requireLink: true },
  { value: "opini_lokal", label: "Opini Media Lokal", requireFile: false, requireLink: true },
  { value: "lomba_lokal", label: "Lomba Lokal", requireFile: true, requireLink: false },
  { value: "lomba_nasional", label: "Lomba Nasional", requireFile: true, requireLink: false },
  { value: "pengabdian", label: "Pengabdian Masyarakat", requireFile: true, requireLink: false },
  { value: "mentoring", label: "Mentoring", requireFile: true, requireLink: false },
  { value: "sertifikasi", label: "Sertifikasi", requireFile: true, requireLink: false },
  { value: "jurnal_sinta5", label: "Jurnal SINTA 5", requireFile: true, requireLink: true },
  { value: "buku_isbn", label: "Buku ISBN", requireFile: true, requireLink: false },
  { value: "hki", label: "HKI", requireFile: true, requireLink: false },
];

interface LinkItem {
  judul: string;
  url: string;
}

interface FormData {
  nim: string;
  semester: string;
  kategori: string;
}

const StudentForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nim: "",
    semester: "",
    kategori: "",
  });
  const [links, setLinks] = useState<LinkItem[]>([{ judul: "", url: "" }]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Get current kategori config
  const currentKategori = KATEGORI_OPTIONS.find((k) => k.value === formData.kategori);
  const getKategoriLabel = () => currentKategori?.label || (formData.kategori ? formData.kategori.toUpperCase() : "-");
  const getValidLinks = () => links.filter((l) => l.judul.trim() && l.url.trim());

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Get file extension
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "pdf";
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add link field
  const addLink = () => {
    setLinks([...links, { judul: "", url: "" }]);
  };

  // Remove link field
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Update link field
  const updateLink = (index: number, field: "judul" | "url", value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const showToast = (type: "success" | "error", message: string, description?: string) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white max-w-md animate-slide-in`;
    toast.innerHTML = `
      <div class="font-semibold">${message}</div>
      ${description ? `<div class="text-sm mt-1 opacity-90">${description}</div>` : ""}
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const submitForm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Prepare files array
      const filesData = [];
      for (const file of selectedFiles) {
        const base64 = await fileToBase64(file);
        filesData.push({
          name: file.name,
          ext: getFileExtension(file.name),
          data: base64,
        });
      }

      // Prepare links array (only valid links)
      const validLinks = getValidLinks();

      // Prepare payload
      const payload = {
        nim: formData.nim.trim(),
        semester: formData.semester,
        dokumen: {
          kategori: formData.kategori,
          files: filesData,
          links: validLinks,
        },
      };

      console.log("Payload:", {
        ...payload,
        dokumen: {
          ...payload.dokumen,
          files: payload.dokumen.files.map((f) => ({ ...f, data: `[BASE64_${f.ext}]` })),
        },
      });

      console.log("Sending to:", APPS_SCRIPT_URL);

      // Send to Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      showToast("success", "Data berhasil dikirim!", "Dokumen telah disimpan");

      // Reset form
      setFormData({ nim: "", semester: "", kategori: "" });
      setLinks([{ judul: "", url: "" }]);
      setSelectedFiles([]);

      const fileInput = document.getElementById("dokumen-files") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Navigate ke home
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Gagal mengirim data", "Periksa koneksi internet Anda");
    } finally {
      setIsSubmitting(false);
      console.log("[END] Submission process");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 [START] Form submission");

    // Validation
    if (!formData.nim || !formData.semester || !formData.kategori) {
      showToast("error", "Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Validate based on kategori requirements
    if (currentKategori?.requireFile && selectedFiles.length === 0) {
      showToast("error", "File dokumen wajib diupload untuk kategori ini");
      return;
    }

    if (currentKategori?.requireLink) {
      const validLinks = getValidLinks();
      if (validLinks.length === 0) {
        showToast("error", "Link eksternal wajib diisi untuk kategori ini");
        return;
      }
    }

    setConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-primary/95 backdrop-blur-md border-b-2 border-primary/30 text-primary-foreground shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                <img
                  src="/unpam_logo.png"
                  alt="UNPAM Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">UNIVERSITAS PAMULANG</h1>
                <p className="text-xs font-medium opacity-90">Sistem Validasi KIP-K Unpam</p>
              </div>
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
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/90 p-4 rounded-full shadow-xl border-2 border-blue-200">
                  <FileText className="h-12 w-12 md:h-16 md:w-16 text-blue-600" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Upload Dokumen</h1>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl shadow-2xl border-2 border-blue-100 p-6 md:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* NIM */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Hash className="h-4 w-4 text-blue-600" />
                  NIM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan NIM Anda"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Pilih semester</option>
                  <option value="GANJIL 2024/2025">GANJIL 2024/2025</option>
                  <option value="GENAP 2024/2025">GENAP 2024/2025</option>
                  <option value="GANJIL 2025/2026">GANJIL 2025/2026</option>
                  <option value="GENAP 2025/2026">GENAP 2025/2026</option>
                </select>
              </div>

              {/* Kategori Kegiatan */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                  Kategori Kegiatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Pilih kategori</option>
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Files - Show if kategori selected and requires file */}
              {formData.kategori && currentKategori?.requireFile && (
                <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border-2 border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileUp className="h-4 w-4 text-blue-600" />
                    Upload File Dokumen {currentKategori.requireFile && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="dokumen-files"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600"
                  />
                  <p className="text-xs text-slate-500">Format: PDF, DOC, DOCX, JPG, PNG (Maks. 10MB per file)</p>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm font-semibold text-slate-700">File terpilih:</p>
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200"
                        >
                          <span className="text-sm text-slate-600 truncate flex-1">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Links - Show if kategori selected and requires link */}
              {formData.kategori && currentKategori?.requireLink && (
                <div className="space-y-3 p-4 bg-green-50/50 rounded-xl border-2 border-green-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <LinkIcon className="h-4 w-4 text-green-600" />
                      Link Eksternal {currentKategori.requireLink && <span className="text-red-500">*</span>}
                    </label>
                    <button
                      type="button"
                      onClick={addLink}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                    >
                      <Plus className="h-3 w-3" />
                      Tambah Link
                    </button>
                  </div>

                  {links.map((link, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 p-3 bg-white rounded-lg border border-green-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">Link #{idx + 1}</span>
                        {links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLink(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Judul link (contoh: Link Jurnal)"
                        value={link.judul}
                        onChange={(e) => updateLink(idx, "judul", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <input
                        type="url"
                        placeholder="URL (contoh: https://...)"
                        value={link.url}
                        onChange={(e) => updateLink(idx, "url", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 font-semibold border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  <ArrowLeft className="inline h-5 w-5 mr-2" />
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "⏳ Mengirim..."
                  ) : (
                    <>
                      <Send className="inline h-5 w-5 mr-2" />
                      Kirim Dokumen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kirim kegiatan sekarang?</AlertDialogTitle>
            <AlertDialogDescription>Pastikan data, file, dan link sudah benar. Setelah dikirim, data akan diproses oleh tim validasi.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 text-sm text-foreground/80">
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <span className="font-semibold text-foreground/90">NIM</span>
              <span className="font-medium">{formData.nim || "-"}</span>
              <span className="font-semibold text-foreground/90">Semester</span>
              <span className="font-medium">{formData.semester || "-"}</span>
              <span className="font-semibold text-foreground/90">Kategori</span>
              <span className="font-medium">{getKategoriLabel()}</span>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-foreground/90">File terpilih</p>
              {selectedFiles.length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5">
                  {selectedFiles.map((file, idx) => (
                    <li
                      key={idx}
                      className="truncate"
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/60">Belum ada file terpilih</p>
              )}
            </div>

            {formData.kategori && currentKategori?.requireLink && (
              <div className="space-y-1">
                <p className="font-semibold text-foreground/90">Link eksternal</p>
                {getValidLinks().length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {getValidLinks().map((link, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{link.judul}</span> <span className="text-foreground/60">{link.url}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/60">Belum ada link valid</p>
                )}
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={submitForm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Sekarang"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentForm;
