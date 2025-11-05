import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen">
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Sistem Validasi</h1>
                <p className="text-xs text-muted-foreground">Kegiatan Ilmiah</p>
              </div>
            </div>
            <Link to="/dosen/login">
              <Button variant="outline" size="sm">Login Dosen</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Sistem Pengumpulan dan Validasi
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Kegiatan Ilmiah Mahasiswa & Dosen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Platform terintegrasi untuk pengumpulan dan validasi kegiatan ilmiah mahasiswa dengan proses yang mudah dan transparan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Upload Mudah</h3>
              <p className="text-sm text-muted-foreground">
                Kirim data kegiatan ilmiah Anda tanpa perlu registrasi atau login
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Validasi Cepat</h3>
              <p className="text-sm text-muted-foreground">
                Dosen dapat memvalidasi atau memberi revisi dengan cepat dan efisien
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-success/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Transparan</h3>
              <p className="text-sm text-muted-foreground">
                Pantau status validasi kegiatan ilmiah Anda secara real-time
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Link to="/kegiatan/form">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                <Upload className="mr-2 h-5 w-5" />
                Kirim Kegiatan Ilmiah
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Tidak perlu login, langsung isi formulir
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-20">
      </footer>
    </div>
  );
};

export default Home;
