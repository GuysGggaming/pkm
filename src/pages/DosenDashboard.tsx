import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, LogOut, CheckCircle, XCircle, Download, Filter, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Data will be loaded from localStorage key 'activities'

const DosenDashboard = () => {
  const navigate = useNavigate();
  const [dosenName, setDosenName] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [revisionDialog, setRevisionDialog] = useState<{ open: boolean; activityId: number | null; catatan: string }>({
    open: false,
    activityId: null,
    catatan: ""
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("dosen_auth");
    const name = localStorage.getItem("dosen_name");

    if (!isAuth) {
      navigate("/dosen/login");
      return;
    }

    setDosenName(name || "Dosen");

    // Load activities from localStorage
    try {
      const stored = localStorage.getItem("activities");
      const parsed = stored ? JSON.parse(stored) : [];
      setActivities(Array.isArray(parsed) ? parsed : []);
    } catch {
      setActivities([]);
    }

    // Listen for updates from other tabs/pages (e.g., StudentForm submitting)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "activities") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setActivities(Array.isArray(parsed) ? parsed : []);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.nama_mahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.nim.includes(searchTerm) ||
        activity.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterKategori !== "all") {
      filtered = filtered.filter(activity => activity.kategori === filterKategori);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(activity => activity.status_validasi === filterStatus);
    }

    setFilteredActivities(filtered);
  }, [searchTerm, filterKategori, filterStatus, activities]);

  const handleLogout = () => {
    localStorage.removeItem("dosen_auth");
    localStorage.removeItem("dosen_name");
    toast.success("Logout berhasil");
    navigate("/dosen/login");
  };

  const handleValidate = (activityId: number) => {
    const next = activities.map(activity =>
      activity.id === activityId
        ? { ...activity, status_validasi: "valid", catatan: null }
        : activity
    );
    setActivities(next);
    localStorage.setItem("activities", JSON.stringify(next));
    toast.success("Kegiatan berhasil divalidasi", {
      icon: <CheckCircle className="h-4 w-4" />
    });
  };

  const handleReject = (activityId: number) => {
    setRevisionDialog({ open: true, activityId, catatan: "" });
  };

  const handleRevisionSubmit = () => {
    if (!revisionDialog.activityId) return;

    const next = activities.map(activity =>
      activity.id === revisionDialog.activityId
        ? { ...activity, status_validasi: "revisi", catatan: revisionDialog.catatan }
        : activity
    );
    setActivities(next);
    localStorage.setItem("activities", JSON.stringify(next));

    toast.warning("Kegiatan perlu revisi", {
      description: "Catatan telah dikirim ke mahasiswa",
      icon: <XCircle className="h-4 w-4" />
    });

    setRevisionDialog({ open: false, activityId: null, catatan: "" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-success text-success-foreground">✅ Valid</Badge>;
      case "revisi":
        return <Badge variant="destructive">❌ Perlu Revisi</Badge>;
      default:
        return <Badge variant="secondary">⏳ Belum Divalidasi</Badge>;
    }
  };

  const getCategoryLabel = (kategori: string) => {
    const labels: Record<string, string> = {
      publikasi_jurnal: "Publikasi Jurnal",
      seminar: "Seminar",
      workshop: "Workshop",
      lomba_ilmiah: "Lomba Ilmiah",
      laporan_penelitian: "Laporan Penelitian"
    };
    return labels[kategori] || kategori;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-primary/95 backdrop-blur-md border-b-2 border-primary/30 text-primary-foreground shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                <img src="/unpam_logo.png" alt="UNPAM Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Dashboard Dosen</h1>
                <p className="text-xs font-medium opacity-90">Validasi Kegiatan Ilmiah</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden md:inline">Halo, {dosenName}</span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout} 
                className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-primary/15 backdrop-blur-md border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Total Kegiatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{activities.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/15 backdrop-blur-md border-2 border-secondary/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Belum Divalidasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning">
                  {activities.filter(a => a.status_validasi === "belum").length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-success/15 backdrop-blur-md border-2 border-success/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Sudah Valid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">
                  {activities.filter(a => a.status_validasi === "valid").length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/15 backdrop-blur-md border-2 border-accent/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Perlu Revisi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">
                  {activities.filter(a => a.status_validasi === "revisi").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">
                    <Search className="h-4 w-4 inline mr-2" />
                    Cari
                  </Label>
                  <Input
                    id="search"
                    placeholder="Nama mahasiswa, NIM, atau kegiatan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Kategori
                  </Label>
                  <Select value={filterKategori} onValueChange={setFilterKategori}>
                    <SelectTrigger id="kategori">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="publikasi_jurnal">Publikasi Jurnal</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="lomba_ilmiah">Lomba Ilmiah</SelectItem>
                      <SelectItem value="laporan_penelitian">Laporan Penelitian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Status
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="belum">Belum Divalidasi</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="revisi">Perlu Revisi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Daftar Kegiatan Ilmiah</h2>

            {filteredActivities.length === 0 ? (
              <Card className="bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-foreground/60 mb-4" />
                  <p className="text-foreground/70">Belum ada data kegiatan. Data akan muncul setelah mahasiswa mengirim.</p>
                </CardContent>
              </Card>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-6">
                      <div className="md:col-span-7 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{activity.nama_kegiatan}</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge variant="outline">{getCategoryLabel(activity.kategori)}</Badge>
                            {getStatusBadge(activity.status_validasi)}
                          </div>
                        </div>

                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Mahasiswa:</span> {activity.nama_mahasiswa}</p>
                          <p><span className="font-medium">NIM:</span> {activity.nim}</p>
                          <p><span className="font-medium">Penyelenggara:</span> {activity.penyelenggara}</p>
                          <p>
                            <span className="font-medium">Tanggal:</span> {formatDate(activity.tanggal_awal)}
                            {activity.tanggal_akhir && ` - ${formatDate(activity.tanggal_akhir)}`}
                          </p>
                        </div>

                        {activity.catatan && (
                          <div className="bg-destructive/10 p-3 rounded-md">
                            <p className="text-sm font-medium text-destructive mb-1">Catatan Revisi:</p>
                            <p className="text-sm text-muted-foreground">{activity.catatan}</p>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-5 space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Berkas Pendukung:</p>
                          <div className="space-y-2">
                            {activity.berkas.foto && (
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Foto Kegiatan
                              </Button>
                            )}
                            {activity.berkas.jurnal && (
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Jurnal/Makalah
                              </Button>
                            )}
                            {activity.berkas.sertifikat && (
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Sertifikat
                              </Button>
                            )}
                            {activity.berkas.link_publikasi && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => window.open(activity.berkas.link_publikasi, "_blank")}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Link Publikasi
                              </Button>
                            )}
                          </div>
                        </div>

                        {activity.status_validasi === "belum" && (
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-success hover:bg-success/90"
                              onClick={() => handleValidate(activity.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Validasi
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleReject(activity.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Revisi
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Revision Dialog */}
      <Dialog open={revisionDialog.open} onOpenChange={(open) => !open && setRevisionDialog({ open: false, activityId: null, catatan: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambahkan Catatan Revisi</DialogTitle>
            <DialogDescription>
              Berikan catatan kepada mahasiswa tentang apa yang perlu diperbaiki
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                placeholder="Contoh: Mohon melengkapi sertifikat yang lebih jelas dan tambahkan foto kegiatan"
                rows={5}
                value={revisionDialog.catatan}
                onChange={(e) => setRevisionDialog({ ...revisionDialog, catatan: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionDialog({ open: false, activityId: null, catatan: "" })}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRevisionSubmit} disabled={!revisionDialog.catatan.trim()}>
              Kirim Catatan Revisi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DosenDashboard;
