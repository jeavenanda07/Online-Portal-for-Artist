import { ReactNode } from "react";
import NavLinks from "@/app/components/profile/NavLinks";
import userProfile from "@/data/user_profile.json";
import { UserProfile } from "@/types/User";
import Image from "next/image";
import { MdDownload } from "react-icons/md";
import ButtonSubmission from "@/app/components/profile/ButtonSubmission";
import { getSession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma"

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;
  const session = await getSession();
  const isMyAccount = id == session.username.replace(/^@/, '')


  const myProfile = await prisma.userProfile.findUnique({
    where: {
      username: session.username, 
    },
  });

  const cleanUsername = myProfile?.username.replace(/^@/, '').toString();


  console.log("My Profile Datas:",myProfile?.avatar_pic);

  return (
    <div className="relative z-10">
      <div className="h-[23rem] w-full -mt-10 relative backdrop-grayscale-75 bg-no-repeat">
        {myProfile?.background_cover !== "" ? (
          <img
            src={myProfile?.background_cover || "/form-background.jpg"}
            alt="Profile background cover"
            className="inset-0 top-0 h-95 w-full object-cover object-center -z-10 absolute"
          />
        ) : (
          <img
            src="/form-background.jpg"
            alt="Default background cover"
            className="inset-0 h-95 w-full object-cover -z-20 absolute"
          />
        )}

        {isMyAccount && (
          <div>
            <label
              htmlFor="banner"
              className="text-white absolute inset-0 opacity-50 hover:opacity-100 transition duration-200 ease-in-out h-50 cursor-pointer z-10 flex flex-col items-center justify-center pt-20"
            >
              <div className="bg-white text-green-500 p-4 rounded-full text-4xl">
                <MdDownload />
              </div>
              {myProfile?.background_cover === "" ? (
                <p className="text-xl font-semibold">Add a banner image</p>
              ) : (
                <p className="text-xl font-semibold">Change banner image</p>
              )}
              <p>Optimal dimensions 3200 x 410px</p>
            </label>
            <input
              className="opacity-0 hidden"
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
            />
          </div>
        )}

        <div className="flex gap-4 pt-50 items-center px-10 pl-12 z-10 pb-5 banner text-white">
          <div className="h-25 w-25 bg-primary rounded-full overflow-hidden border-2 border-green-600">
            <Image
              height={80}
              width={80}
              src={myProfile?.avatar_pic || "/avatar_placeholder.png"}
              alt={`${myProfile?.full_name}_profile_picture`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col text-white">
            <h2 className="text-3xl font-bold">{`${myProfile?.full_name}`}</h2>
            <p>{myProfile?.username}</p>

            <ul className="flex gap-4">
              <li>1.8m followers</li>
              <li>59 following</li>
              <li>102 appreciation</li>
            </ul>
          </div>
        </div>

        <div className="px-12 bg-primary flex justify-between items-center">
          <NavLinks username={cleanUsername} isMyAccount={isMyAccount}/>
        </div>
      </div>

      {isMyAccount && (
        <div className="absolute top-84 right-20">
          <ButtonSubmission username={cleanUsername} isMyAccount={isMyAccount}/>
        </div>
      )}

      <div className="p-18">{children}</div>
    </div>
  );
}