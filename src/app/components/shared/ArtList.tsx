import Image from "next/image";
import {artwork, UserProfile} from "@/types/User"
import { FaRegHeart } from "react-icons/fa";
import { LiaCommentDotsSolid } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";
import { getSession } from "@/app/actions/auth";
import {prisma} from "@/lib/prisma"

export default async function ArtList({ art }: { art: artwork }) {
  const getSessionData = await getSession();
  console.log("Session Data in ExploreLayout:", getSessionData);

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      username: getSessionData.username,
    },
  });

  console.log("User Profile Data in ArtList:", userProfile);

  return (
    <div className="mb-4 w-full break-inside-avoid relative">
      <div className="art-item-wrapper rounded-md overflow-hidden relative group ">
          <Image
            src={art?.art_file}
            alt={art?.artwork_title || "Artwork"}
            width={400}
            height={400}
            className="artlist-card w-full h-auto rounded-md transition-transform duration-700 group-hover:scale-105"
          />

        <div className="artlist-description absolute bottom-0 left-0  text-white p-2 text-sm w-full">
          <h6 className="font-semibold text-md mb-2">{art?.artwork_title || "Abstract Dreams"}</h6>
          <div className="flex items-center gap-2 mb-2">
            {/* <Link href={`/profile/`}>
            </Link> */}
            <Image
              width={150}
              height={150}
              src={userProfile?.avatar_pic || ""}
              alt={art?.artist_avatar}
              className="h-6 w-6 object-cover rounded-full"
            />

            <p className="text-xs ">{`${userProfile?.full_name}`}</p>
          </div>

        <section className="flex justify-between text-xs">
          <section className="flex items-center gap-4 opacity-60">
            <div className="flex items-center gap-2">
              <FaRegHeart />
              <p>{art.likes_count}</p> 
            </div>

            <div className="flex items-center gap-2">
              <LiaCommentDotsSolid />
              <p>{art?.views}</p> 
            </div>
          </section>

          <div className="flex items-center gap-2 bg-orange-600 w-fit px-2 rounded-full py-1 text-xs">
              <IoCartOutline />
              <p>{art?.sold}</p> 
          </div>
        </section>
      </div>

      {
        art?.status == "For Sale" && 
          <div className="absolute top-2 right-2">
            <p className="bg-orange-500 py-1 px-2 rounded-full text-xs text-black">
              {art?.status}
            </p>
          </div>
      }

    </div>
    </div>
  );
}