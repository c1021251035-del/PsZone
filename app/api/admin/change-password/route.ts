import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { passwordLama, passwordBaru } = await req.json();

  if (!passwordLama || !passwordBaru) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const admin = await prisma.admin.findFirst();
  if (!admin) {
    return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
  }

  const valid = await bcrypt.compare(passwordLama, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Password lama tidak sesuai" }, { status: 400 });
  }

  const hash = await bcrypt.hash(passwordBaru, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: hash },
  });

  return NextResponse.json({ success: true });
}
