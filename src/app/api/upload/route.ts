import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    // 👇 Check 1: Are file and userId arriving?
    console.log("file:", file?.name, "| size:", file?.size, "| userId:", userId);

    if (!file || !userId) {
      return NextResponse.json({ message: "Missing file or userId." }, { status: 400 });
    }

    // 👇 Check 2: Are env vars set?
    console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ set" : "❌ missing");
    console.log("SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ set" : "❌ missing");

    const ext = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    console.log("Uploading to path:", fileName);
    console.log("ext", ext)
    console.log("file name", )

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from("posts")
      .upload(fileName, file, { upsert: false });

    // 👇 Check 3: What does Supabase return?
    console.log("Upload data:", uploadData);
    console.log("Upload error:", error);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from("posts").getPublicUrl(fileName);
    
    console.log("Public URL:", data.publicUrl);

    return NextResponse.json({ url: data.publicUrl }, { status: 200 });

  } catch (err: any) {
    console.error("Caught error:", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}