import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.VERCEL_ACCESS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    // Jika berjalan di lokal, kita pura-pura saja
    if (!token || !projectId) {
      return NextResponse.json({ status: "READY" });
    }

    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return NextResponse.json({ status: "ERROR" });
    }

    const data = await res.json();
    const latestDeployment = data.deployments?.[0];

    if (!latestDeployment) {
      return NextResponse.json({ status: "READY" });
    }

    // state bisa berupa: INITIALIZING, ANALYZING, BUILDING, DEPLOYING, READY, ERROR, CANCELED
    const state = latestDeployment.state;

    return NextResponse.json({ status: state });
  } catch (error) {
    console.error("Vercel status error:", error);
    return NextResponse.json({ status: "ERROR" });
  }
}
