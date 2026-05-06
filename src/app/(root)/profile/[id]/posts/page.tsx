"use client";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import CreatePost from "@/app/components/profile/CreatePost";
import Modal from "@/app/components/ui/Modal"; // Adjust path as needed
import { useState } from "react";

const PostPage = () => {
  const [isPosting, setIsPosting] = useState(false);

  return (
    <div className="-mt-10">

      {/* <Modal
        isOpen={isPosting}
        onClose={() => setIsPosting(false)}
        className="w-full max-w-[550px] p-4" // Centered box width
      >
       
      </Modal> */}

      <div className="flex flex-col justify-center py-10">
        <div className="flex gap-10 text-left w-full mb-4 max-w-screen-xl text-lg font-semibold mx-auto translate-x-[7.4em]">
          <div className="ml-27">All Post 3</div>
          <div className="flex gap-2 items-center cursor-pointer">
            <p>Newest</p>
            <IoIosArrowDown />
          </div>
        </div>

        <div className="w-[800px] mx-auto">
          {/* Trigger Div */}
          <div className="border border-primary-line items-center p-4 flex justify-center bg-primary rounded-md">
            {/* <ProfileIcon /> */}
            <div
              onClick={() => setIsPosting(true)}
              className="border border-primary-line rounded-md bg-primary w-[90%] py-4 ml-4 px-4 cursor-pointer hover:brightness-110 transition-all"
            >
              <p className="text-gray-400">
                What's on your mind, ChristianJay69?
              </p>
            </div>
          </div>

          <br />

          {/* Example Feed Post */}
          <div className="border border-primary-line h-[630px] bg-primary mx-auto p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {/* <ProfileIcon /> */}
                <div>
                  <p className="bold">ChristianJay69</p>
                  <p className="text-sm opacity-50">3 days ago</p>
                </div>
              </div>
              <div className="-translate-y-6 hover:opacity-50 cursor-pointer">
                ...
              </div>
            </div>

            <h6 className="mt-6 mb-2 ">My Art</h6>

            <div className="w-full h-[450px] bg-secondary">
              <img
                src="https://i.redd.it/d99rilognvia1.png"
                alt="Feed content"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-8 items-center mt-3">
              <div className="flex gap-2 items-center cursor-pointer">
                <TiHeartOutline />
                <p>10</p>
              </div>
              <div className="flex gap-2 items-center cursor-pointer">
                <AiOutlineMessage />
                <p>Comments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
