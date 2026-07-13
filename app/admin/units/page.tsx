"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Power, Loader2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/helpers";
import {
  getAllUnits,
  createUnit,
  updateUnit,
  toggleUnitStatus,
} from "@/lib/actions/units";

type Unit = {
  id: string;
  nama: string;
  tipe: string;
  hargaPerJam: number;
  deskripsi: string | null;
  status: string;
};

type FormData = {
  nama: string;
  tipe: "PS4" | "PS5";
  hargaPerJam: string;
  deskripsi: string;
};

const emptyForm: FormData = {
  nama: "",
  tipe: "PS5",
  hargaPerJam: "",
  deskripsi: "",
};

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Unit | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function loadUnits() {
    setLoading(true);
    try {
      const data = await getAllUnits();
      setUnits(data as Unit[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUnits();
  }, []);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditTarget(unit);
    setForm({
      nama: unit.nama,
      tipe: unit.tipe as "PS4" | "PS5",
      hargaPerJam: String(unit.hargaPerJam),
      deskripsi: unit.deskripsi ?? "",
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.nama.trim()) errs.nama = "Nama unit wajib diisi";
    const harga = Number(form.hargaPerJam);
    if (!form.hargaPerJam || isNaN(harga) || harga <= 0)
      errs.hargaPerJam = "Harga harus lebih dari 0";
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        nama: form.nama.trim(),
        tipe: form.tipe,
        hargaPerJam: Number(form.hargaPerJam),
        deskripsi: form.deskripsi.trim() || undefined,
      };
      if (editTarget) {
        await updateUnit(editTarget.id, payload);
        toast.success("Unit berhasil diperbarui");
      } else {
        await createUnit(payload);
        toast.success("Unit berhasil ditambahkan");
      }
      setModalOpen(false);
      loadUnits();
    } catch {
      toast.error("Gagal menyimpan unit");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(unit: Unit) {
    try {
      await toggleUnitStatus(unit.id);
      toast.success(
        unit.status === "AKTIF" ? "Unit dinonaktifkan" : "Unit diaktifkan"
      );
      loadUnits();
    } catch {
      toast.error("Gagal mengubah status unit");
    }
  }

  const ps5Units = units.filter((u) => u.tipe === "PS5");
  const ps4Units = units.filter((u) => u.tipe === "PS4");

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Unit PS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola unit PlayStation yang tersedia
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Unit
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : units.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <Gamepad2 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada unit</p>
            <Button onClick={openCreate} size="sm" variant="outline" className="mt-4 gap-2">
              <Plus className="w-3.5 h-3.5" />
              Tambah Unit Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* PS5 */}
          {ps5Units.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="text-xs font-bold bg-primary text-primary-foreground px-2.5">PS5</Badge>
                <span className="text-xs text-muted-foreground">PlayStation 5</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ps5Units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    onEdit={openEdit}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PS4 */}
          {ps4Units.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs font-bold px-2.5">PS4</Badge>
                <span className="text-xs text-muted-foreground">PlayStation 4</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ps4Units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    onEdit={openEdit}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editTarget ? "Edit Unit" : "Tambah Unit Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Nama Unit</Label>
              <Input
                placeholder="Contoh: PS5 Unit 1"
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                className={errors.nama ? "border-destructive" : ""}
              />
              {errors.nama && (
                <p className="text-xs text-destructive">{errors.nama}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tipe</Label>
              <Select
                value={form.tipe}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, tipe: v as "PS4" | "PS5" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PS5">PS5 — PlayStation 5</SelectItem>
                  <SelectItem value="PS4">PS4 — PlayStation 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Harga per Jam (Rp)</Label>
              <Input
                type="number"
                placeholder="Contoh: 15000"
                value={form.hargaPerJam}
                onChange={(e) =>
                  setForm((p) => ({ ...p, hargaPerJam: e.target.value }))
                }
                className={errors.hargaPerJam ? "border-destructive" : ""}
              />
              {errors.hargaPerJam && (
                <p className="text-xs text-destructive">{errors.hargaPerJam}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Deskripsi (opsional)</Label>
              <Input
                placeholder="Contoh: TV 65 inch, 2 controller"
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editTarget ? "Simpan Perubahan" : "Tambah Unit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UnitCard({
  unit,
  onEdit,
  onToggle,
}: {
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onToggle: (unit: Unit) => void;
}) {
  const isPS5 = unit.tipe === "PS5";
  const isAktif = unit.status === "AKTIF";

  return (
    <Card className={`border-border transition-all duration-150 ${!isAktif ? "opacity-60" : ""}`}>
      <div className={`h-1 w-full rounded-t-xl ${isPS5 ? "bg-primary" : "bg-muted"}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">{unit.nama}</p>
            {unit.deskripsi && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{unit.deskripsi}</p>
            )}
          </div>
          <Badge
            variant={isAktif ? "default" : "secondary"}
            className={`ml-2 shrink-0 text-xs ${
              isAktif
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                : ""
            }`}
          >
            {isAktif ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="text-base font-bold text-foreground mb-3">
          {formatRupiah(unit.hargaPerJam)}
          <span className="text-xs font-normal text-muted-foreground ml-1">/jam</span>
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            onClick={() => onEdit(unit)}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 gap-1.5 text-xs ${
              isAktif
                ? "text-destructive hover:text-destructive hover:bg-destructive/8 border-destructive/30"
                : "text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            }`}
            onClick={() => onToggle(unit)}
          >
            <Power className="w-3 h-3" />
            {isAktif ? "Nonaktifkan" : "Aktifkan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
