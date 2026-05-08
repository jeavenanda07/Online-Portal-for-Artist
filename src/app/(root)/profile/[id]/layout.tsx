import { ReactNode } from "react";
import NavLinks from "@/app/components/profile/NavLinks";
import Image from "next/image";
import { MdDownload } from "react-icons/md";
import ButtonSubmission from "@/app/components/profile/ButtonSubmission";
import FollowButton from "@/app/components/ui/FollowButton";
import { getSession } from "@/app/actions/auth";
import { getTheme } from "@/app/actions/theme";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function Layout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;

  if (!id || id === "undefined" || id === "null") {
    return notFound();
  }

  const session = await getSession();

  // GET CURRENT THEME
  const theme = await getTheme();

  const userProfile = await prisma.userProfile.findFirst({
    where: {
      OR: [{ username: id }, { username: `@${id}` }],
    },
  });

  if (!userProfile) return notFound();

  const cleanUsername = userProfile.username.replace(/^@/, "");

  const sessionUsername =
    session?.username?.replace(/^@/, "") ?? "";

  const isMyAccount =
    sessionUsername !== "" &&
    cleanUsername === sessionUsername;

  const [followersCount, followingCount] =
    await Promise.all([
      prisma.follow.count({
        where: {
          following_id: userProfile.user_profile_id,
        },
      }),

      prisma.follow.count({
        where: {
          follower_id: userProfile.user_profile_id,
        },
      }),
    ]);

  let myDbId: string | null = null;

  if (!isMyAccount && session?.username) {
    const me = await prisma.userProfile.findFirst({
      where: {
        OR: [
          { username: sessionUsername },
          { username: `@${sessionUsername}` },
        ],
      },

      select: {
        user_profile_id: true,
      },
    });

    myDbId = me?.user_profile_id ?? null;
  }

  const defaultBanner =
    theme === "light"
      ? "/banner-light-mode.jpg"
      : "/banner-dark-mode.jpg";

  return (
    <div className="relative min-h-screen">
      <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 max-sm:h-60 -mt-2">
        <Image
            fill
            priority
            quality={85}
            sizes="100vw"
            src={
              userProfile.background_cover ||
              defaultBanner
            }
            alt="Profile background cover"
            className="object-cover object-center transition-opacity duration-500 ease-in-out"
          />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />

            <input
              className="hidden"
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
            />

        <div className="absolute bottom-2 left-0 right-0 px-4 sm:px-8 lg:px-12 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 -transition-y-4 sm:w-24 lg:h-28 lg:w-28 rounded-md overflow-hidden border-3 border-[#00d26a] bg-primary shadow-lg shadow-black/50">
                <Image
                  height={112}
                  width={112}
                  src={
                    userProfile.avatar_pic ||
                    "/avatar_placeholder.png"
                  }
                  alt={`${userProfile.full_name} profile picture`}
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#00d26a] border-2 border-black" />
            </div>

            {/* NAME + STATS + BUTTONS */}
            <div className="flex-1 min-w-0 pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* NAME */}
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight truncate">
                    {userProfile.full_name}
                  </h2>

                  <p className="text-[#00d26a] text-xs sm:text-sm font-mono">
                    @{cleanUsername}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-2 shrink-0">
                  {isMyAccount ? (
                    <ButtonSubmission
                      username={cleanUsername}
                      isMyAccount={isMyAccount}
                    />
                  ) : (
                    <>
                      {myDbId && (
                        <FollowButton
                          targetUserId={
                            userProfile.user_profile_id
                          }
                          myId={myDbId}
                        />
                      )}

                      <ButtonSubmission
                        username={cleanUsername}
                        isMyAccount={isMyAccount}
                      />
                    </>
                  )}
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                <li className="text-white text-xs sm:text-sm">
                  <span className="font-bold text-white">
                    {followersCount >= 1000
                      ? `${(
                          followersCount / 1000
                        ).toFixed(1)}k`
                      : followersCount}
                  </span>

                  <span className="text-white/50 ml-1">
                    followers
                  </span>
                </li>

                <li className="text-white text-xs sm:text-sm">
                  <span className="font-bold text-white">
                    {followingCount}
                  </span>

                  <span className="text-white/50 ml-1">
                    following
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── NAV LINKS ── */}
      <div className="bg-primary border-b border-white/5 px-4 sm:px-8 lg:px-12">
        <NavLinks
          username={cleanUsername}
          isMyAccount={isMyAccount}
        />
      </div>

      <div className="px-4 sm:px-8 lg:px-18 py-12">
        {children}
      </div>
    </div>
  );
}