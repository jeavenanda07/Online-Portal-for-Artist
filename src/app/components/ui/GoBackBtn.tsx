'use client'; 

import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const GoBackBtn = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };

  return (
      <div onClick={handleBack} className="absolute max-md:text-4xl max-md:bg-white max-md:rounded-md hover:opacity-100 opacity-50 h transition duration-200 ease-in-out max-md:top-22 max-md:left-3  top-8 left-10 flex gap-2 cursor-pointer items-center">
            <MdOutlineKeyboardArrowLeft />
            <p className="max-md:hidden">Back</p>
      </div>
  )
}

export default GoBackBtn
