import React from 'react'
import ArtList from '../shared/ArtList';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";


const artListObj = [
  {
    src: "https://i.pinimg.com/originals/4e/f0/d7/4ef0d7022735af8676d0663a9576812a.png",
    alt: "Picture of arts",
    user: "SamDoesArt",
    avatar: "https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
  },
  {
    src: "https://images.hdqwalls.com/download/anime-art-girl-portrait-5k-78-1280x2120.jpg",
    alt: "Picture of arts",
    user: "Jeaven",
    avatar: "https://www.catconworldwide.com/wp-content/uploads/2023/01/Jiji-1-1017x1024.jpg"
  },
  {
    src: "https://media.licdn.com/dms/image/C5622AQFpLlSL3Mxuow/feedshare-shrink_800/0/1679240444976?e=2147483647&v=beta&t=C5oHhOw_Kvj9DhtiZ4uvA_883e-KEuniGGRUMGsMtxk",
    alt: "Picture of arts",
    user: "Koolen",
    avatar: "https://a.storyblok.com/f/178900/750x422/c23ab48c5c/nyaight_of_the_living_cat_header.jpg/m/filters:quality(95)format(webp)"
  },
  {
    src: "https://i.pinimg.com/originals/ae/3f/15/ae3f15ef5d7503e49acb31b337d0d14e.jpg",
    alt: "Picture of arts",
    user: "BroDraw",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVoatzXKKv3j1CQJMdbOUIzlfO0v763f4Sdw&s"
  },
  {
    src: "https://i.pinimg.com/736x/0b/70/a0/0b70a0c1cf42c938dc941a648eae1091.jpg",
    alt: "Picture of arts",
    user: "Capitano",
    avatar: "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/w9bpqfuxrvm99gujxuvi.jpg"
  }
];

const FeauturedArt = () => {
  return (
    <div className='relative'>
      <div className='w-full flex flex-col gap-4 relative z-10'>
        <h2>Featured Art of the Week</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-x-8 gap-y-14 mt-4">
        {/* {artListObj.map((art) => (
          <ArtList art={art} key={art.src} />
        ))} */}
        </div>


        <div className='w-fit m-auto mt-4'>
          <ul className='flex gap-8'>
              <li className='bg-secondary h-4 w-4 rounded-full'></li>
              <li className='bg-secondary h-4 w-4 rounded-full'></li>
              <li className='bg-gradient-primary h-4 w-20 rounded-full'></li>
              <li className='bg-secondary h-4 w-4 rounded-full'></li>
              <li className='bg-secondary h-4 w-4 rounded-full'></li>
              <li className='bg-secondary h-4 w-4 rounded-full'></li>
          </ul>
       </div>

          <div className='absolute h-73  -left-14 top-11 text-5xl hover:opacity-100 w-28'>
              <MdKeyboardArrowLeft className='translate-y-31 opacity-40 hover:opacity-100 cursor-pointer bg-primary rounded-full transition ease-in-out duration-200'/>
          </div>
          
          <div className='absolute h-73  -right-18 top-11 text-5xl hover:opacity-100 w-28'>
              <MdKeyboardArrowRight className='translate-y-31 ml-12 opacity-40 hover:opacity-100 cursor-pointer bg-primary rounded-full'/>
          </div>
      </div>

          {/* <div className='absolute -top-4 left-0 bg-secondary w-[100vw] h-[98%] z-0'>

          </div> */}
    </div>

  )
}

export default FeauturedArt;
