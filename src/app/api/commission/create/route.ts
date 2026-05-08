import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      artistUsername,
      title,
      description,
      artType,
      budget,
      deadline,
      tags,
      referenceImages,
      shippingName,
      shippingAddress,
      shippingContact,
    } = body;

    // Validate required fields
    if (!artistUsername || !title || !description || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get client (me)
    const client = await prisma.userProfile.findFirst({
      where: {
        OR: [
          { username: session.username },
          { username: `@${session.username}` },
        ],
      },
      select: { user_profile_id: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Get artist (target)
    const artist = await prisma.userProfile.findFirst({
      where: {
        OR: [
          { username: artistUsername },
          { username: `@${artistUsername}` },
        ],
      },
      select: { user_profile_id: true },
    });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    if (client.user_profile_id === artist.user_profile_id) {
      return NextResponse.json({ error: "Cannot commission yourself" }, { status: 400 });
    }

    const artRequest = await prisma.artRequest.create({
      data: {
        artist_id: artist.user_profile_id,
        client_id: client.user_profile_id,
        title,
        description,
        art_type: artType ?? "DigitalArt",
        budget: parseFloat(budget),
        deadline: deadline ? new Date(deadline) : null,
        tags: tags ?? [],
        reference_images: referenceImages ?? [],
        shipping_name: shippingName ?? null,
        shipping_address: shippingAddress ?? null,
        shipping_contact: shippingContact ?? null,
      },
    });

    return NextResponse.json({ success: true, artRequest });
  } catch (error) {
    console.error("Commission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}