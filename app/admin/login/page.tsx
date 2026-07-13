"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Gamepad2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Username atau password salah");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/25">
            <Gamepad2 className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">PSZone Admin</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Masuk untuk mengelola booking
          </p>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-1 gap-2 shadow-lg shadow-primary/20 font-medium"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
