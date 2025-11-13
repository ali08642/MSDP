import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, role, organization } = await request.json()

    // In a real app, this would save to database
    // For now, we just validate and return success
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      user: {
        id: email,
        email,
        fullName,
        role,
        organization,
      },
      token,
      message: "Signup successful. Please login to continue.",
    })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
