import React from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import Image from "next/image";

type ArtItem = {
  src: string;
  alt: string;
  user: string;
  avatar: string
};

export default function ArtList({art, children,}: { art: ArtItem; children?: React.ReactNode;}) {   
  return (
    <div className="w-full overflow-hidden text-sm  max-w-80 h-80 max-h-80">
      <div className="art-list-card relative hover:shadow-xl transition duration-700 ease-in-out mb-4 overflow-hidden h-[80%] cursor-pointer group w-full">
        {art?.src ? (
            <Image
                src={art?.avatar}
                alt={"User avatar"}
                width={400}
                height={200}
                className="images object-cover h-full w-full rounded-md border-primary-line border-1 "
            />
            ) : (
         <div className="" />
        )}
   
        <div className="art-info transition duration-700 ease-in-out   font-bold items-end p-2 text-sm absolute bottom-0 left-0 w-full h-[100%]">
            <h6>Art Cats Here</h6>
        </div>
      </div>
 
      <div className="flex justify-between items-center w-full px-1">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-primary overflow-hidden">
            {/* <img src={art?.avatar} alt="user avatar" className="w-full h-full object-cover"/> */}

            {art?.src ? (
                <Image
                    src={art?.src}
                    alt={"User avatar"}
                    width={40}
                    height={40}
                    className="object-cover h-full w-full hover:scale-3d"
                />
                ) : (
                <div className="" />
                )}


          </div>
          <p className="font-semibold text-sm">{art?.user}</p>
        </div>

        <div className="flex gap-4 opacity-70 text-xs">
          <div className="flex gap-2 items-center"> 
            <FaHeart />
            <p>221</p>
          </div>

          <div className="flex gap-2 items-center">
            <MdOutlineComment />
            <p>20</p>
          </div>
        </div>
      </div>


    </div>
  );
}
