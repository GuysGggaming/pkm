import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DosenLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication - in production, this would call backend API
    // Demo account: dede@univ.ac.id or "Dede Handayani" / dedehandayani
    const validEmail = "dede@univ.ac.id";
    const validName = "dede handayani";
    const validPassword = "dedehandayani";

    const inputLower = credentials.identifier.toLowerCase().trim();
    const isEmailLogin = inputLower.includes("@");
    const isValid =
      ((isEmailLogin && inputLower === validEmail) ||
        (!isEmailLogin && inputLower === validName)) &&
      credentials.password === validPassword;

    if (isValid) {
      // Store auth token (in production, use proper JWT)
      localStorage.setItem("dosen_auth", "true");
      localStorage.setItem("dosen_name", "Dede Handayani");

      toast.success("Login berhasil", {
        description: "Selamat datang, Dede Handayani"
      });

      navigate("/dosen/dashboard");
    } else {
      toast.error("Login gagal", {
        description: "Nama/email atau password salah"
      });
    }
  };

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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-full w-24 h-24 flex items-center justify-center shadow-xl border-2 border-primary/30">
                <img src="/unpam_logo.png" alt="UNPAM Logo" className="h-16 w-16 object-contain" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-2">Login Dosen</CardTitle>
            <CardDescription className="text-base">
              Masuk untuk mengakses dashboard validasi kegiatan ilmiah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Nama atau Email</Label>
                <Input
                  id="identifier"
                  placeholder="Masukkan nama atau email"
                  value={credentials.identifier}
                  onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan nama lengkap atau alamat email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>

              <div className="pt-4 text-center border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Demo Account:</p>
                <p className="text-xs text-muted-foreground">
                  Nama: <span className="font-medium">Dede Handayani</span><br />
                  Password: <span className="font-medium">dedehandayani</span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DosenLogin;
