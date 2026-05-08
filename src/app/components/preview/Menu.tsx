'use client'
import classNames from 'clsx';
import ReportArtworkModal from '../ui/ReportArtworkForm';
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineReport } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import SaveToCollectionModal from "./SaveToCollectionModal";
import { LuPlus } from "react-icons/lu";

const Menu = ({ art }: any) => {
  const [open, setOpen] = useState(false);
  const [favoriteIsOpen, setFavoriteIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative z-10 flex items-center gap-4">
     <SaveToCollectionModal
            isOpen={favoriteIsOpen}
            onClose={() => setFavoriteIsOpen(false)}
            artworkId={art?.artwork_id}  // ✅ real artwork id from the page
            />
      <div
        onClick={() => setFavoriteIsOpen((i) => !i)}
        className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-md text-black hover:opacity-100 opacity-80 cursor-pointer"
      >
        <LuPlus />
        <p>Add to Collection</p>
      </div>

      {/* Report modal */}
      <ReportArtworkModal
        isOpen={open}
        onClose={() => setOpen(false)}
        artworkId={art?.artwork_id}
        reportedArtistId={art?.user_profile_id}
        reporterById=""
      />

      <BsThreeDots onClick={() => setOpenMenu((i) => !i)} className="text-2xl cursor-pointer hover:opacity-80" />

      <div className={classNames("absolute top-12 right-0 bg-primary border border-primary-line rounded-xl py-3 transition-all text-nowrap", {
        "opacity-0 hidden": !openMenu,
        "opacity-100 block": openMenu,
      })}>
        <div
          onClick={() => { setOpenMenu((i) => !i); setOpen((i) => !i); }}
          className="flex gap-2 items-center py-2 pr-12 pl-4 hover:bg-secondary cursor-pointer"
        >
          <MdOutlineReport />
          <p>Report Artwork</p>
        </div>
        <div
          onClick={() => setOpenMenu((i) => !i)}
          className="flex gap-2 items-center py-2 pr-12 pl-4 hover:bg-secondary cursor-pointer mt-2"
        >
          <IoIosClose />
          <p>Close</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;