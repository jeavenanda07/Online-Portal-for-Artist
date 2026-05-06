// "use server";

// import { PrismaClient } from "../../generated/prisma/client";

// const prisma = new PrismaClient();

// interface CreateArtworkInput {
//   user_profile_id: string;
//   art_file: string; // URL string from cloud storage
//   artwork_title: string;
//   description?: string | null;
//   artwork_type: "Digital" | "Physical";
//   tags: string[];
//   status: "For Sale" | "Not for Sale" | "Free Download";
//   price: number;
//   stocks: number;
//   gallery_id?: string | null;
// }

// export async function createArtwork(data: CreateArtworkInput) {
//   try {
//     const newArtwork = await prisma.artwork.create({
//       data: {
//         user_profile_id: data.user_profile_id,
//         art_file: data.art_file,
//         artwork_title: data.artwork_title,
//         description: data.description || null,
//         artwork_type: data.artwork_type,
//         tags: data.tags,
//         status: data.status,
//         price: data.price,
//         stocks: data.stocks,
//         sold: 0,
//         likes_count: 0,
//         gallery_id: data.gallery_id || null,
//       },
//     });

//     return { success: true, data: newArtwork };
//   } catch (error) {
//     console.error("Error creating artwork:", error);
//     return { success: false, error: "Failed to create artwork" };
//   }
// }