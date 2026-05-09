import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    console.log("Available buckets:", buckets?.map(b => b.name));
    console.log("Buckets error:", bucketsError);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabaseAdmin.storage
        .from("art_request") 
        .upload(fileName, file, { upsert: false });

      if (error) {
        console.error("Upload error:", error.message);
        return NextResponse.json({ error: error.message, message: error.message }, { status: 500 });
      }

      const { data } = supabaseAdmin.storage
        .from("art_request")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });

  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}