import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: NextRequest
) {

  try {

    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          message:
            "Gallery ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!gallery) {
      return NextResponse.json(
        {
          message:
            "Gallery not found",
        },
        {
          status: 404,
        }
      );
    }

    if (gallery.cover_image) {
      try {
        const url =
          new URL(
            gallery.cover_image
          );

        const pathParts =
          url.pathname.split(
            "/gallery_cover_photo/"
          );

        const filePath =
          pathParts[1];

        if (filePath) {

          await supabase.storage
            .from(
              "gallery_cover_photo"
            )
            .remove([filePath]);
        }

      } catch (storageError) {

        console.error(
          "STORAGE DELETE ERROR:",
          storageError
        );
      }
    }

    // =========================
    // DELETE GALLERY
    // =========================
    await prisma.gallery.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Gallery deleted successfully",
    });

  } catch (error: any) {

    console.error(
      "DELETE GALLERY ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to delete gallery",
      },
      {
        status: 500,
      }
    );
  }
}