import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Upload, FileText, Award, File, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const StudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_mahasiswa: "",
    nim: "",
    nama_kegiatan: "",
    kategori: "",
    tanggal_awal: "",
    tanggal_akhir: "",
    jumlah_peserta: "",
    penyelenggara: "",
    link_publikasi: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nama_mahasiswa || !formData.nim || !formData.nama_kegiatan || !formData.kategori) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Build submission object compatible with DosenDashboard
    const fotoFile = (document.getElementById("foto") as HTMLInputElement)?.files?.[0] || null;
    const jurnalFile = (document.getElementById("jurnal") as HTMLInputElement)?.files?.[0] || null;
    const sertifikatFile = (document.getElementById("sertifikat") as HTMLInputElement)?.files?.[0] || null;
    const suratTugasFile = (document.getElementById("surat_tugas") as HTMLInputElement)?.files?.[0] || null;
    const suratUndanganFile = (document.getElementById("surat_undangan") as HTMLInputElement)?.files?.[0] || null;

    const buildPreviewUrl = (f: File | null) => (f ? URL.createObjectURL(f) : null);

    const newActivity = {
      id: Date.now(),
      nama_mahasiswa: formData.nama_mahasiswa,
      nim: formData.nim,
      nama_kegiatan: formData.nama_kegiatan,
      kategori: formData.kategori,
      tanggal_awal: formData.tanggal_awal || null,
      tanggal_akhir: formData.tanggal_akhir || null,
      penyelenggara: formData.penyelenggara || "",
      status_validasi: "belum",
      catatan: null as string | null,
      berkas: {
        foto: buildPreviewUrl(fotoFile),
        jurnal: buildPreviewUrl(jurnalFile),
        sertifikat: buildPreviewUrl(sertifikatFile),
        surat_tugas: buildPreviewUrl(suratTugasFile),
        surat_undangan: buildPreviewUrl(suratUndanganFile),
        link_publikasi: formData.link_publikasi || null,
      },
    };

    // Persist to localStorage
    try {
      const stored = localStorage.getItem("activities");
      const arr = stored ? JSON.parse(stored) : [];
      const next = Array.isArray(arr) ? [...arr, newActivity] : [newActivity];
      localStorage.setItem("activities", JSON.stringify(next));
    } catch {
      localStorage.setItem("activities", JSON.stringify([newActivity]));
    }
    
    toast.success("Data berhasil dikirim. Menunggu validasi dosen.", {
      description: "Kegiatan ilmiah Anda telah tersimpan dalam sistem"
    });

    setTimeout(() => {
      navigate("/dosen/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-12">
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistem Validasi</h1>
              <p className="text-xs text-muted-foreground">Kegiatan Ilmiah</p>
            </div>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Form Pengumpulan Kegiatan Ilmiah</h1>
            <p className="text-muted-foreground">
              Isi formulir di bawah ini untuk mengirimkan data kegiatan ilmiah Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identitas Mahasiswa</CardTitle>
                <CardDescription>Data diri mahasiswa yang mengikuti kegiatan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_mahasiswa">Nama Mahasiswa *</Label>
                  <Input
                    id="nama_mahasiswa"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama_mahasiswa}
                    onChange={(e) => setFormData({ ...formData, nama_mahasiswa: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nim">NIM *</Label>
                  <Input
                    id="nim"
                    placeholder="Masukkan NIM"
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Kegiatan Ilmiah</CardTitle>
                <CardDescription>Informasi lengkap tentang kegiatan yang diikuti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_kegiatan">Nama Kegiatan Ilmiah *</Label>
                  <Input
                    id="nama_kegiatan"
                    placeholder="Contoh: Seminar Nasional AI 2024"
                    value={formData.nama_kegiatan}
                    onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori Kegiatan *</Label>
                  <Select value={formData.kategori} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori kegiatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publikasi_jurnal">Publikasi Jurnal</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="lomba_ilmiah">Lomba Ilmiah</SelectItem>
                      <SelectItem value="laporan_penelitian">Laporan Penelitian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_awal">Tanggal Mulai</Label>
                    <Input
                      id="tanggal_awal"
                      type="date"
                      value={formData.tanggal_awal}
                      onChange={(e) => setFormData({ ...formData, tanggal_awal: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tanggal_akhir">Tanggal Selesai</Label>
                    <Input
                      id="tanggal_akhir"
                      type="date"
                      value={formData.tanggal_akhir}
                      onChange={(e) => setFormData({ ...formData, tanggal_akhir: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jumlah_peserta">Jumlah Peserta</Label>
                  <Input
                    id="jumlah_peserta"
                    type="number"
                    min="1"
                    placeholder="Masukkan jumlah peserta"
                    value={formData.jumlah_peserta}
                    onChange={(e) => setFormData({ ...formData, jumlah_peserta: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penyelenggara">Penyelenggara</Label>
                  <Input
                    id="penyelenggara"
                    placeholder="Nama institusi/organisasi penyelenggara"
                    value={formData.penyelenggara}
                    onChange={(e) => setFormData({ ...formData, penyelenggara: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Berkas Pendukung</CardTitle>
                <CardDescription>
                  Upload dokumen pendukung kegiatan ilmiah (opsional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foto">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Foto Kegiatan
                    </div>
                  </Label>
                  <Input id="foto" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Format: JPG, PNG (Maks. 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurnal">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Makalah / Jurnal / Artikel / Laporan
                    </div>
                  </Label>
                  <Input id="jurnal" type="file" accept=".pdf,.doc,.docx" />
                  <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX (Maks. 10MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sertifikat">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Sertifikat
                    </div>
                  </Label>
                  <Input id="sertifikat" type="file" accept=".pdf,image/*" />
                  <p className="text-xs text-muted-foreground">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surat_tugas">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      Surat Tugas
                    </div>
                  </Label>
                  <Input id="surat_tugas" type="file" accept=".pdf" />
                  <p className="text-xs text-muted-foreground">Format: PDF (Maks. 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surat_undangan">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Surat Undangan
                    </div>
                  </Label>
                  <Input id="surat_undangan" type="file" accept=".pdf" />
                  <p className="text-xs text-muted-foreground">Format: PDF (Maks. 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link_publikasi">URL Link Publikasi / Link OJS</Label>
                  <Input
                    id="link_publikasi"
                    type="url"
                    placeholder="https://example.com/publication"
                    value={formData.link_publikasi}
                    onChange={(e) => setFormData({ ...formData, link_publikasi: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Link ke publikasi online (jika ada)</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Kirim Data
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StudentForm;
