import { useState, useEffect } from "react";
import { LogOut, CheckCircle, XCircle, ExternalLink, RefreshCw, Filter, Search, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyxrASnDA9hb-ZaW-QEy0ojUTLIP8fEQZQhABi6kxWWN1STgyBVhK_VyWooELEhjJ5aA/exec";

const KATEGORI_LABELS: Record<string, string> = {
  ipk: "IPK",
  seminar_internal: "Seminar Internal",
  seminar_nasional: "Seminar Nasional",
  panitia: "Panitia",
  ketua_panitia: "Ketua Panitia",
  penelitian: "Penelitian",
  jurnal_sinta4: "Jurnal SINTA 4",
  jurnal_sinta3: "Jurnal SINTA 3",
  jurnal_sinta12: "Jurnal SINTA 1/2",
  opini_nasional: "Opini Media Nasional",
  opini_lokal: "Opini Media Lokal",
  lomba_lokal: "Lomba Lokal",
  lomba_nasional: "Lomba Nasional",
  pengabdian: "Pengabdian Masyarakat",
  mentoring: "Mentoring",
  sertifikasi: "Sertifikasi",
  jurnal_sinta5: "Jurnal SINTA 5",
  buku_isbn: "Buku ISBN",
  hki: "HKI",
};

interface Dokumen {
  kategori: string;
  judul: string;
  link: string;
  approved: boolean;
  type: "file" | "link";
  catatan: string;
  uploaded_at: number;
}

interface Student {
  nama: string;
  nim: string;
  semester: string;
  dokumentasi: Dokumen[];
}

const DosenDashboard = () => {
  const [dosenName] = useState("Dosen");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [revisionDialog, setRevisionDialog] = useState<{
    open: boolean;
    nim: string | null;
    dokumenIndex: number | null;
    catatan: string;
  }>({
    open: false,
    nim: null,
    dokumenIndex: null,
    catatan: "",
  });
  const [toast, setToast] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

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
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      // console.log("Fetched data:", response);
      const data = await response.json();
      // console.log("Fetched data:", data.data);

      if (data.success && Array.isArray(data.data)) {
        const parsedStudents = data.data.map((student: any) => ({
          ...student,
          dokumentasi: typeof student.dokumentasi === "string" ? JSON.parse(student.dokumentasi) : student.dokumentasi || [],
        }));
        setStudents(parsedStudents);
        showToast("success", "Data berhasil dimuat");
      } else {
        showToast("error", "Gagal memuat data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "Gagal mengambil data dari server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter((student) => student.nama.toLowerCase().includes(searchTerm.toLowerCase()) || student.nim.includes(searchTerm) || student.semester.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterKategori !== "all") {
      filtered = filtered.filter((student) => student.dokumentasi.some((dok) => dok.kategori === filterKategori));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => {
        if (filterStatus === "approved") {
          return student.dokumentasi.some((dok) => dok.approved);
        } else if (filterStatus === "pending") {
          return student.dokumentasi.some((dok) => !dok.approved);
        }
        return true;
      });
    }

    setFilteredStudents(filtered);
  }, [searchTerm, filterKategori, filterStatus, students]);

  const handleApprove = async (nim: string, dokumenIndex: number) => {
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "approve",
          nim: nim,
          dokumenIndex: dokumenIndex,
        }),
      });

      // Since no-cors mode, we can't read response
      // But we can assume success if no error thrown
      showToast("success", "Dokumen berhasil divalidasi dan poin telah ditambahkan");
      setTimeout(() => fetchData(), 1500);
    } catch (error) {
      console.error("Error approving:", error);
      showToast("error", "Terjadi kesalahan saat memvalidasi");
    }
  };

  const handleReject = (nim: string, dokumenIndex: number) => {
    setRevisionDialog({
      open: true,
      nim,
      dokumenIndex,
      catatan: "",
    });
  };

  const handleRevisionSubmit = async () => {
    if (!revisionDialog.nim || revisionDialog.dokumenIndex === null) return;

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "reject",
          nim: revisionDialog.nim,
          dokumenIndex: revisionDialog.dokumenIndex,
          catatan: revisionDialog.catatan,
        }),
      });

      showToast("error", "Catatan revisi telah dikirim dan poin dikurangi (jika sebelumnya approved)");
      setTimeout(() => fetchData(), 1500);
    } catch (error) {
      console.error("Error rejecting:", error);
      showToast("error", "Terjadi kesalahan saat mengirim revisi");
    }

    setRevisionDialog({ open: false, nim: null, dokumenIndex: null, catatan: "" });
  };

  const getTotalDokumen = () => {
    return students.reduce((acc, student) => acc + student.dokumentasi.length, 0);
  };

  const getPendingDokumen = () => {
    return students.reduce((acc, student) => acc + student.dokumentasi.filter((dok) => !dok.approved).length, 0);
  };

  const getApprovedDokumen = () => {
    return students.reduce((acc, student) => acc + student.dokumentasi.filter((dok) => dok.approved).length, 0);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast Notification */}
      {/* {toast.show && <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-5
      0 ${toast.type === "success" ? "bg-green-500" : toast.type === "warning" ? "bg-orange-500" : "bg-red-500"} text-white max-w-md animate-slide-in`}>{toast.message}</div>} */}

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

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header with Refresh */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Daftar Dokumen Mahasiswa</h2>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 inline mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Memuat..." : "Refresh"}
            </button>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/95 border-2 border-blue-100 shadow-xl rounded-xl p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Total Dokumen</p>
              <p className="text-3xl font-bold text-blue-600">{getTotalDokumen()}</p>
            </div>
            <div className="bg-white/95 border-2 border-orange-100 shadow-xl rounded-xl p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Belum Divalidasi</p>
              <p className="text-3xl font-bold text-orange-600">{getPendingDokumen()}</p>
            </div>
            <div className="bg-white/95 border-2 border-green-100 shadow-xl rounded-xl p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Sudah Valid</p>
              <p className="text-3xl font-bold text-green-600">{getApprovedDokumen()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/95 border-2 border-blue-100 shadow-xl rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Cari
                </label>
                <input
                  type="text"
                  placeholder="Nama, NIM, atau semester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Kategori
                </label>
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Kategori</option>
                  {Object.entries(KATEGORI_LABELS).map(([key, label]) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Belum Divalidasi</option>
                  <option value="approved">Sudah Valid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white/95 border-2 border-blue-100 shadow-xl rounded-xl p-12 text-center">
                <RefreshCw className="h-12 w-12 mx-auto text-blue-600 mb-4 animate-spin" />
                <p className="text-slate-600">Memuat data...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white/95 border-2 border-blue-100 shadow-xl rounded-xl p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Belum ada data mahasiswa</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.nim}
                  className="bg-white/95 border-2 border-blue-100 shadow-xl rounded-xl p-6"
                >
                  <div className="space-y-4">
                    {/* Student Info */}
                    <div className="border-b pb-4">
                      <h3 className="font-bold text-lg text-slate-800">{student.nama}</h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600">
                        <span className="font-medium">NIM: {student.nim}</span>
                        <span>•</span>
                        <span>Semester: {student.semester}</span>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-3">
                      <p className="font-semibold text-slate-700">Dokumen yang diupload:</p>
                      {student.dokumentasi.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">Belum ada dokumen</p>
                      ) : (
                        student.dokumentasi.map((dok, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{KATEGORI_LABELS[dok.kategori] || dok.kategori}</span>
                                  {dok.approved ? (
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Valid</span>
                                  ) : dok.catatan && dok.catatan.trim() !== "" ? (
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Ditolak</span>
                                  ) : (
                                    <span className="px-3 py-1 bg-slate-300 text-slate-700 text-xs font-semibold rounded-full">Belum Divalidasi</span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-slate-700">{dok.judul}</p>
                                {dok.catatan && !dok.approved && <p className="text-sm text-red-600">Catatan: {dok.catatan}</p>}
                                <p className="text-xs text-slate-500">Diupload: {formatDate(dok.uploaded_at)}</p>
                              </div>

                              <div className="flex flex-col gap-2 md:w-auto w-full">
                                <button
                                  onClick={() => window.open(dok.link, "_blank")}
                                  className="px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Lihat {dok.type === "file" ? "File" : "Link"}
                                </button>

                                {!dok.approved && (
                                  <div className="flex gap-2">
                                    <button
                                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1"
                                      onClick={() => handleApprove(student.nim, idx)}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Validasi
                                    </button>
                                    <button
                                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1"
                                      onClick={() => handleReject(student.nim, idx)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Revision Dialog */}
      {revisionDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800">Tambahkan Catatan Revisi</h3>
              <p className="text-sm text-slate-600 mt-1">Berikan catatan kepada mahasiswa tentang apa yang perlu diperbaiki</p>
            </div>
            <div className="mb-6">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Catatan</label>
              <textarea
                placeholder="Contoh: Mohon upload dokumen yang lebih jelas atau lengkapi data yang kurang"
                rows={5}
                value={revisionDialog.catatan}
                onChange={(e) => setRevisionDialog({ ...revisionDialog, catatan: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRevisionDialog({ open: false, nim: null, dokumenIndex: null, catatan: "" })}
                className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleRevisionSubmit}
                disabled={!revisionDialog.catatan.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Kirim Catatan
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DosenDashboard;
