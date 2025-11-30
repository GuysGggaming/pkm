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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login Dosen</CardTitle>
            <CardDescription>
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
