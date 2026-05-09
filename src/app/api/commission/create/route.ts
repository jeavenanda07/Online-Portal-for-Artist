import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";
import { getUserInfo } from "@/app/actions/user";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clientInfo = await getUserInfo(session.username);
    if (!clientInfo) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const body = await req.json();
    console.log("Create commission body:", body);          // 👈 log full body
    console.log("referenceImages received:", body.referenceImages); // 👈 check this

    const {
      artistUsername,
      title,
      description,
      artType,
      budget,
      deadline,
      tags,
      referenceImages,   // ✅ camelCase from frontend
      shippingName,
      shippingAddress,
      shippingContact,
    } = body;

    // Find the artist
    const artistInfo = await prisma.userProfile.findFirst({
      where: {
        OR: [
          { username: artistUsername },
          { username: `@${artistUsername}` },
        ],
      },
    });

    if (!artistInfo) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const artRequest = await prisma.artRequest.create({
      data: {
        artist_id: artistInfo.user_profile_id,
        client_id: clientInfo.user_profile_id,
        title,
        description,
        art_type: artType,
        budget: parseFloat(budget),
        deadline: deadline ? new Date(deadline) : null,
        tags: tags ?? [],
        reference_images: referenceImages ?? [], // ✅ maps camelCase → snake_case
        shipping_name: shippingName || null,
        shipping_address: shippingAddress || null,
        shipping_contact: shippingContact || null,
      },
    });

    console.log("Created art request:", artRequest.art_request_id);
    console.log("Stored reference_images:", artRequest.reference_images); // 👈 verify

    return NextResponse.json(artRequest, { status: 201 });

  } catch (err: any) {
    console.error("Commission create error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}