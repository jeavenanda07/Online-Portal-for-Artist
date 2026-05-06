import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const formData = await req.formData();
    const file = formData.get("art_file") as File;
    const user_profile_id = formData.get("user_profile_id") as string;
    const artwork_title = formData.get("artwork_title") as string;
    const description = formData.get("description") as string;
    const artwork_type = formData.get("artwork_type") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const status = formData.get("status") as string;
    const price = parseFloat(formData.get("price") as string);
    const stocks = parseInt(formData.get("stocks") as string);

    if (!file || !user_profile_id || !artwork_title) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `${user_profile_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("artworks")
      .upload(fileName, file, { upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return NextResponse.json({ message: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("artworks")
      .getPublicUrl(fileName);

    const artwork = await prisma.artwork.create({
      data: {
        user_profile_id,
        art_file: publicData.publicUrl,
        artwork_title,
        description,
        artwork_type,
        tags,
        status,
        price,
        stocks,
      },
    });

    return NextResponse.json({ artwork }, { status: 201 });

  } catch (err: any) {
    console.error("Create artwork error:", err.message);
    return NextResponse.json({ message: err.message || "Failed to create artwork." }, { status: 500 });
  }
}