"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Clock, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/lib/actions/admin";

export default function AdminSettingsPage() {
  const [jamBuka, setJamBuka] = useState("10:00");
  const [jamTutup, setJamTutup] = useState("23:00");
  const [savingJam, setSavingJam] = useState(false);

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [showPw, setShowPw] = useState({ passwordLama: false, passwordBaru: false, konfirmasi: false });
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSettings().then((s) => {
      setJamBuka(s.jamBuka);
      setJamTutup(s.jamTutup);
    });
  }, []);

  async function handleSaveJam() {
    if (jamBuka >= jamTutup) {
      toast.error("Jam tutup harus lebih besar dari jam buka");
      return;
    }
    setSavingJam(true);
    try {
      await updateSettings({ jamBuka, jamTutup });
      toast.success("Jam operasional berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSavingJam(false);
    }
  }

  async function handleSavePassword() {
    const errs: Record<string, string> = {};
    if (!passwordLama) errs.passwordLama = "Password lama wajib diisi";
    if (!passwordBaru || passwordBaru.length < 6)
      errs.passwordBaru = "Password baru minimal 6 karakter";
    if (passwordBaru !== konfirmasi)
      errs.konfirmasi = "Konfirmasi password tidak cocok";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordLama, passwordBaru }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Gagal mengubah password");
        return;
      }
      toast.success("Password berhasil diubah");
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasi("");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Kelola jam operasional dan keamanan akun</p>
      </div>

      {/* Jam operasional */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Jam Operasional</p>
              <p className="text-xs text-muted-foreground">Atur waktu buka dan tutup</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jamBuka" className="text-sm font-medium">Jam Buka</Label>
              <Input
                id="jamBuka"
                type="time"
                value={jamBuka}
                onChange={(e) => setJamBuka(e.target.value)}
                className="bg-background/50 border-border/60 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jamTutup" className="text-sm font-medium">Jam Tutup</Label>
              <Input
                id="jamTutup"
                type="time"
                value={jamTutup}
                onChange={(e) => setJamTutup(e.target.value)}
                className="bg-background/50 border-border/60 focus:border-primary/50"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveJam}
            disabled={savingJam}
            size="sm"
            className="gap-2 shadow-md shadow-primary/15"
          >
            {savingJam ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {savingJam ? "Menyimpan..." : "Simpan Jam"}
          </Button>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ubah Password</p>
              <p className="text-xs text-muted-foreground">Perbarui password akun admin</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {(["passwordLama", "passwordBaru", "konfirmasi"] as const).map((field) => {
            const labels = {
              passwordLama: "Password Lama",
              passwordBaru: "Password Baru",
              konfirmasi: "Konfirmasi Password",
            };
            const values = { passwordLama, passwordBaru, konfirmasi };
            const setters = {
              passwordLama: setPasswordLama,
              passwordBaru: setPasswordBaru,
              konfirmasi: setKonfirmasi,
            };
            const isVisible = showPw[field];
            return (
              <div key={field} className="space-y-2">
                <Label className="text-sm font-medium">{labels[field]}</Label>
                <div className="relative">
                  <Input
                    type={isVisible ? "text" : "password"}
                    value={values[field]}
                    onChange={(e) => {
                      setters[field](e.target.value);
                      setPwErrors((p) => ({ ...p, [field]: "" }));
                    }}
                    placeholder="••••••••"
                    className={`bg-background/50 border-border/60 focus:border-primary/50 pr-10 ${
                      pwErrors[field] ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwErrors[field] && (
                  <p className="text-xs text-destructive">{pwErrors[field]}</p>
                )}
              </div>
            );
          })}

          <Button
            onClick={handleSavePassword}
            disabled={savingPassword}
            size="sm"
            variant="outline"
            className="gap-2 border-border/60 hover:border-primary/40 hover:text-primary mt-1"
          >
            {savingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {savingPassword ? "Menyimpan..." : "Simpan Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
