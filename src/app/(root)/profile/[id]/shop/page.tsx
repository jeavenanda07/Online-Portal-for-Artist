'use client';
// import ShopCard from "@/app/components/profile/shop/ShopCard";
import CreateArtwork from "@/app/components/profile/CreateArtwork";
import Modal from "@/app/components/ui/Modal";
import { useState } from "react";
import { FaRegStar } from "react-icons/fa";

const ShopPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div>
      <h4 className="text-xl font-bold -mt-6 ">
        Your Artshop <span className="ml-4">2</span>
      </h4>


      <div className="flex my-4 gap-6 ">
        <div className="shop-card p-2 w-90 bg-primary rounded-sm opacity-80 ease-in-out duration-200 hover:opacity-100 cursor-pointer">
          <div className="w-full h-full cursor-pointer">
            <div>
              <img
                className="rounded-md object-cover h-50 w-100"
                src="https://tse4.mm.bing.net/th/id/OIP.r03K4YiCBfm-WMh0NQmLDwHaGI?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt=""
              />
            </div>
            <div className="flex items-center gap-2 mt-2 px-2">
              <FaRegStar className="opacity-50" />
              <p className="opacity-80"> 42</p>
            </div>
            <div className="flex justify-between gap-43 mt-2 px-2 pb-1">
              <p>
                <b>Acrylics</b>
              </p>
              <p>
                <b>$3</b>
              </p>
            </div>
          </div>
        </div>


        <div onClick={() => setIsCreateOpen(i => !i)} className="shop-card w-90 bg-primary rounded-sm cursor-pointer">
          <div className="opacity-50 hover:opacity-100 duration-200 ease-in-out">
            <p className="text-center mt-25 text-5xl">+</p>
            <p className="text-center">
              <b>Create new Art Shop</b>
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="w-full  max-w-[900px] p-4">
        <CreateArtwork onClose={() => setIsCreateOpen(false)}/>
      </Modal>
    </div>
  );
};

export default ShopPage;
