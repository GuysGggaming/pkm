import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary/95 backdrop-blur-md border-b-2 border-primary/30 text-primary-foreground shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
              <img src="/unpam_logo.png" alt="UNPAM Logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">UNIVERSITAS PAMULANG</h1>
              <p className="text-xs font-medium opacity-90">Sistem Validasi Kegiatan Ilmiah</p>
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-12 shadow-2xl max-w-md w-full">
          <div className="relative mb-8 flex justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl border-2 border-primary/30">
              <img 
                src="/unpam_logo.png" 
                alt="UNPAM Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-2 text-2xl font-semibold text-foreground">Oops! Halaman Tidak Ditemukan</p>
          <p className="mb-8 text-foreground/70">Halaman yang Anda cari tidak tersedia</p>
          <Link to="/">
            <Button size="lg" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
