import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import Comments from '@/app/components/shared/Comments';
import ProfileIcon from '@/app/components/ui/ProfileIcon';
import { Sidebar } from '@/app/components/preview/Sidebar';

import artwork from "@/data/artwork.json";
import useProfile from "@/data/user_profile.json"
import GoBackBtn from "@/app/components/ui/GoBackBtn";
import comments from "@/data/comments.json"
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import Menu from "@/app/components/preview/Menu";


const ArtPreview = async(params: String) => {
  const username = await params;
  // const art = artwork.find((u) => u.artwork_id == id);
  // const user = useProfile.find((u) => u.id === art?.user_profile_id);
  // const comment = comments.filter((u) => u.artworkId == art?.artwork_id)
  
  return (
    <div className='px-2 md:px-10 max-md:mt-5 mt-10 lg:flex gap-18 '>
      <div className='md:w-full relative'>
        <div className='w-full md:h-[50em] bg-primary  flex items-center  justify-center'>
            {/* <Image 
              width={800}
              height={800}
              src={art?.art_file || "/placeholder-img.png"}
              alt={art?.artwork_title || "art preview"}
              className='object-contain h-full w-full max:md:rounded-md rounded-xl'  
            /> */}
        </div>

        <div className='flex max-md:px-4 flex-col gap-8 py-4 max-w-[1280px] w-full mx-auto'>
          <div className='flex justify-between items-center w-full'>
            <ul className='flex gap-8'>
              <li className='flex items-center gap-2'>
                <FaRegHeart />
                {/* <p>{art?.likes_count}</p> */}
              </li>

              <li className='flex items-center gap-2'>
                <FaRegCommentAlt />
                <p>12</p>
              </li>
            </ul>

              {/* <Menu art={art}/> */}
          </div>
          
          <div className='flex flex-col gap-4'>
            <div>
                {/* <h2>{art?.artwork_title}</h2>
                <p>{art?.description}</p> */}
            </div>


            <div className='flex items-center gap-4 w-full'>
              {/* <ProfileIcon id={user?.id} profile={user?.profile_picture}/> */}

              <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-4'>
                    <div>
                      {/* <h3 className='font-bold'>{`${user?.first_name} ${user?.last_name}`}</h3> */}
                      <p className='text-xs opacity-50 -mt-1'>20 followers</p>
                    </div>

                    <div>
                      <div className='h-1 w-1 rounded-full m-auto bg-white'></div>
                      <p className='text-blue-500'>Follow</p>
                    </div>
                    
                  </div>

                  {/* <p className='opacity-50 w-fit text-sm'>{art?.created_at}</p> */}
                </div>
              </div>

            <div className='flex gap-4 my-4'>
              {/* {
                art?.tags.map((u, i) => (
                  <p key={i} className="py-2 px-4 bg-primary border-1 border-primary-line rounded-md">{u}</p>
                ))
              } */}
            </div>


            <hr className='text-primary-line'/>
          </div>
        </div>


        <div className='my-4 max-w-[1280px] w-full mx-auto'>

          <div className='flex flex-col gap-8'>
            <div className="flex gap-4 cursor-pointer items-center">
               {/* <p>{comment.length} Comment</p> */}
               <MdKeyboardArrowDown />
            </div>
            
            {/* {
              comment.map(i => (
                <Comments key={i.id} {...i}/>
              ))
            } */}
          </div>
        </div>

          {/* <IoIosArrowForward className='absolute top-[9em] text-4xl -right-10 opacity-50 hover:opacity-100 transition ease-in-out duration-200 cursor-pointer'/>
          <MdKeyboardArrowLeft className='absolute top-[9em] text-4xl -left-10 opacity-50 hover:opacity-100 transition ease-in-out duration-200 cursor-pointer'/> */}
      </div>

      <div className='lg:w-80 ml-auto'>
        {/* <Sidebar {...art}/> */}
      </div>

        <GoBackBtn/>
    </div>
  )
}

export default ArtPreview
