import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen">
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
            <Link to="/dosen/login">
              <Button
                variant="secondary"
                size="sm"
                className="font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Login Dosen
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo UNPAM Hero Section */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-full shadow-2xl border-4 border-primary/30">
                <img
                  src="/unpam_logo.png"
                  alt="UNPAM Logo"
                  className="h-32 w-32 md:h-40 md:w-40 object-contain"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">UNIVERSITAS PAMULANG</h1>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Sistem Pengumpulan dan Validasi</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Kegiatan Ilmiah Mahasiswa & Dosen</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">Platform pengumpulan dan validasi</p>
          </div>

          {/* <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="group bg-primary/15 backdrop-blur-md p-8 rounded-2xl border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary/30 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Upload Mudah</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">Kirim data kegiatan ilmiah Anda tanpa perlu registrasi atau login</p>
              </div>
            </div>

            <div className="group bg-secondary/15 backdrop-blur-md p-8 rounded-2xl border-2 border-secondary/30 shadow-xl hover:shadow-2xl hover:border-secondary/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Validasi Cepat</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">Dosen dapat memvalidasi atau memberi revisi dengan cepat dan efisien</p>
              </div>
            </div>

            <div className="group bg-accent/15 backdrop-blur-md p-8 rounded-2xl border-2 border-accent/30 shadow-xl hover:shadow-2xl hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-accent/30 to-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Transparan</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">Pantau status validasi kegiatan ilmiah Anda secara real-time</p>
              </div>
            </div>
          </div> */}

          <div>
            <Link to="/kegiatan/form">
              <Button
                size="lg"
                className="text-lg px-10 py-7 h-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <Upload className="mr-2 h-6 w-6 relative z-10" />
                <span className="relative z-10 font-bold">Kirim Kegiatan Ilmiah</span>
              </Button>
            </Link>
            <p className="text-sm text-foreground/70 mt-5 font-medium">Tidak perlu login, langsung isi formulir</p>
          </div>
        </div>
      </main>

      {/* <footer className="border-t border-border mt-20"></footer> */}
    </div>
  );
};

export default Home;
