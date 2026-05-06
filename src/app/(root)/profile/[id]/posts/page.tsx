"use client";

import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/app/components/ui/Modal";
import { useState, useEffect } from "react";
import CreatePost from "@/app/components/profile/CreatePost";
import { useMyPosts } from "@/hooks/useMyPost";
import formatPostDate from "@/utils/date";

const PostPage = () => {
  const { userDetails, loading } = useUserData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { posts, error } = useMyPosts();

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="-mt-10">
      <div className="flex flex-col justify-center py-10">
        <div className="flex gap-10 text-left w-full mb-4 max-w-screen-xl text-lg font-semibold mx-auto translate-x-[7.4em]">
          <div className="ml-27">All Post {posts.length}</div>
          <div className="flex gap-2 items-center cursor-pointer">
            <p>Newest</p>
            <IoIosArrowDown />
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="w-[30em] h-[20em]"
        >
          <CreatePost />
        </Modal>

        <div className="w-[800px] mx-auto">
          {/* Post Creation Box */}
          <div
            onClick={() => setIsOpen(true)}
            className="border border-primary-line items-center p-4 flex justify-center bg-primary rounded-md"
          >
            <ProfileIcon username={userDetails?.username} />
            <div className="border border-primary-line rounded-md bg-primary w-[90%] py-4 ml-4 px-4 cursor-pointer hover:brightness-110 transition-all">
              <p className="text-gray-400">
                What's on your mind, {userDetails?.username || "Guest"}?
              </p>
            </div>
          </div>

          <br />

          {/* Example Feed Post */}
          <div className="flex flex-col gap-4 w-full">
            {posts?.map((details, index) => {
              return (
                <div
                  key={index}
                  className="border w-full border-primary-line  bg-primary mx-auto p-4 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <ProfileIcon username={userDetails?.username} />
                      <div>
                        <p className="font-bold">
                          {userDetails?.full_name || "Anonymous"}
                        </p>
                        <p className="text-sm opacity-50">
                          {formatPostDate(details?.date_posted)}
                        </p>
                      </div>
                    </div>
                    <div className="-translate-y-6 hover:opacity-50 cursor-pointer text-xl">
                      ...
                    </div>
                  </div>

                  <h6 className="mt-6 mb-2">{details?.content}</h6>

                  {details.media.length > 0 && (
                    <div className="w-full h-[450px] bg-secondary rounded-sm overflow-hidden">
                      <img
                        src="https://i.redd.it/d99rilognvia1.png"
                        alt="Feed content"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex gap-8 items-center mt-3">
                    <div className="flex gap-2 items-center cursor-pointer hover:text-red-500 transition-colors">
                      <TiHeartOutline size={22} />
                      <p>10</p>
                    </div>
                    <div className="flex gap-2 items-center cursor-pointer hover:opacity-70">
                      <AiOutlineMessage size={20} />
                      <p>Comments</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
