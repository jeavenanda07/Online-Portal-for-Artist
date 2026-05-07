import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(
  req: NextRequest
) {

  try {

    const body = await req.json();

    const {
      id,
      title,
      description,
      visibility,
    } = body;

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

    // =========================
    // NEW SLUG
    // =========================
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    const slug =
      `${baseSlug}-${Date.now()}`;

    // =========================
    // UPDATE GALLERY
    // =========================
    const updatedGallery =
      await prisma.gallery.update({
        where: {
          id,
        },

        data: {
          title,
          slug,
          description,
          visibility,
        },
      });

    return NextResponse.json(
      updatedGallery
    );

  } catch (error: any) {

    console.error(
      "UPDATE GALLERY ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to update gallery",
      },
      {
        status: 500,
      }
    );
  }
}