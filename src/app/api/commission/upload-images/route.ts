import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/app/actions/auth";

// Use service role key so uploads bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 3) {
      return NextResponse.json({ error: "Max 3 images allowed" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 5MB" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Unique path: username/timestamp-filename
      const cleanUsername = session.username.replace(/^@/, "");
      const ext = file.name.split(".").pop();
      const fileName = `${cleanUsername}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("art_request")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: `Upload failed: ${error.message}` },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("art_request")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}