import ArtList from "../shared/ArtList";
import { BsSearch } from 'react-icons/bs';
import { ImSpinner2 } from "react-icons/im";
import artworks from "@/data/artwork.json"
import Link from "next/link";

import SearchHeader from '../ui/SearchHeader';


const ExploreLayout = async () => {
  return (
    <div className="flex flex-col gap-4 relative mt-10">
      <div className='fixed top-12 md:left-5 md:right-5 z-20 left-2 right-2 bg-background py-5 pt-10'>
        <div className='relative z-20 '>
          <input 
            type="text" 
            placeholder='Search' 
            className='pl-15 h-[4em] w-full bg-primary rounded-md'
          />
          <BsSearch className='absolute top-4 left-5'/>
        </div>

        <SearchHeader />
      </div>

      <div className="w-full mx-auto
        columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 min-2xl:columns-7
        gap-4 mt-40">
        {artworks.map((art) => (
          <Link href={`/explore/${art.artwork_id}`} key={art.artwork_id} className="break-inside-avoid">
            <ArtList art={art} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <span className="loading loading-dots loading-xl bg-foreground"></span>
      </div>

        <div className="flex items-center gap-4 mt- mx-auto">
          <ImSpinner2 />
          <span>Loading</span>
        </div>
    </div>
  );
};

export default ExploreLayout;
