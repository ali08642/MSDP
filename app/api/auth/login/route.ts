import { type NextRequest, NextResponse } from "next/server"

const USERS_DB: Record<string, { password: string; role: string; fullName: string }> = {
  "admin@msdp.pk": { password: "admin123", role: "admin", fullName: "Admin User" },
  "official@msdp.pk": { password: "official123", role: "health_official", fullName: "Health Official" },
  "pharmacist@msdp.pk": { password: "pharmacist123", role: "pharmacist", fullName: "Pharmacist" },
  "lab@msdp.pk": { password: "lab123", role: "lab_technician", fullName: "Lab Technician" },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = USERS_DB[email]
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      user: {
        id: email,
        email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
