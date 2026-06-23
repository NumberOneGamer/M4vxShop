import { prisma } from "@/lib/prisma";
import { verifyPassword } from "better-auth/crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const valid = await verifyPassword({ hash: user.passwordHash!, password });
    return NextResponse.json({
      email: user.email,
      role: user.role,
      hasHash: !!user.passwordHash,
      hashPrefix: user.passwordHash?.substring(0, 20),
      valid,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
