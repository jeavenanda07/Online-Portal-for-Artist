"use client";

import React from "react";
import ArtList from "../shared/ArtList";
import Suggestion from "./Suggestion";
import { BsSearch } from 'react-icons/bs';
import FilterIcon from "../ui/FilterIcon";
import { ImSpinner2 } from "react-icons/im";

const artListObj = [
  {
    id: 1,
    src: "https://i.pinimg.com/originals/4e/f0/d7/4ef0d7022735af8676d0663a9576812a.png",
    alt: "Picture of arts",
    user: "SamDoesArt",
    avatar: "https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
  },
  {
    id: 2,
    src: "https://images.hdqwalls.com/download/anime-art-girl-portrait-5k-78-1280x2120.jpg",
    alt: "Picture of arts",
    user: "Jeaven",
    avatar: "https://www.catconworldwide.com/wp-content/uploads/2023/01/Jiji-1-1017x1024.jpg"
  },
  {
    id: 3,
    src: "https://media.licdn.com/dms/image/C5622AQFpLlSL3Mxuow/feedshare-shrink_800/0/1679240444976?e=2147483647&v=beta&t=C5oHhOw_Kvj9DhtiZ4uvA_883e-KEuniGGRUMGsMtxk",
    alt: "Picture of arts",
    user: "Koolen",
    avatar: "https://a.storyblok.com/f/178900/750x422/c23ab48c5c/nyaight_of_the_living_cat_header.jpg/m/filters:quality(95)format(webp)"
  },
  {
    id: 4,
    src: "https://i.pinimg.com/originals/ae/3f/15/ae3f15ef5d7503e49acb31b337d0d14e.jpg",
    alt: "Picture of arts",
    user: "BroDraw",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVoatzXKKv3j1CQJMdbOUIzlfO0v763f4Sdw&s"
  },
  {
    id: 5,
    src: "https://i.pinimg.com/736x/0b/70/a0/0b70a0c1cf42c938dc941a648eae1091.jpg",
    alt: "Picture of arts",
    user: "Capitano",
    avatar: "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/w9bpqfuxrvm99gujxuvi.jpg"
  },
  {
    id: 6,
    src: "https://i.pinimg.com/750x/e4/6b/22/e46b2274a385c6a4f464687d5336a3c3.jpg",
    alt: "Picture of arts",
    user: "Tyaon",
    avatar: "https://otakuusamagazine.com/wp-content/uploads/2023/10/ousa_cat_hero.png"
  },
  {
    id: 7,
    src: "https://i.pinimg.com/originals/11/7e/d2/117ed2fa28a303c166a05115209444eb.png",
    alt: "Picture of arts",
    user: "Jeven",
    avatar: "https://t4.ftcdn.net/jpg/14/62/82/15/360_F_1462821545_cZ2VApsWn2u9xvSr5UwRgDtbGOQUrJXs.jpg"
  },
  {
    id: 8,
    src: "https://i.pinimg.com/originals/e3/50/49/e35049593eace2264601e51e0a567b9c.jpg",
    alt: "Picture of arts",
    user: "Kristena",
    avatar: "https://i.pinimg.com/1200x/95/cf/0b/95cf0b0894ac9afdb1ebc3c486a2b0ca.jpg"
  },
  {
    id: 9,
    src: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/07/Genshin-Impact-Albedo-Painting-1.jpg",
    alt: "Picture of arts",
    user: "Malbert",
    avatar: "https://krita-artists.org/uploads/default/original/3X/c/f/cfc4990e32f31acd695481944f2163e96ff7c6ba.jpeg"
  },
  {
    id: 10,
    src: "https://tse2.mm.bing.net/th/id/OIP.K2SvYXX2WKFKF83WiuLnVwHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Picture of arts",
    user: "Bongay",
    avatar: "https://play-lh.googleusercontent.com/_qUtBpMVsGY-CLPx2DreAENHAbr4KHwBGn2w_3jhGSzoRVFRKn0SXUaK0wXSU0SJ7A"
  },
  {
    id: 11,
    src: "https://www.animesenpai.net/wp-content/uploads/2022/10/PicsArt_10-15-06.36.41_compress56.jpg",
    alt: "Picture of arts",
    user: "Ace",
    avatar: "https://wallpapers.com/images/hd/cute-anime-profile-pictures-0lifptfs0jd9fml3.jpg"
  },
  {
    id: 12,
    src: "https://i.pinimg.com/736x/f9/27/28/f92728ac44be1efe813b63d157d92fea.jpg",
    alt: "Picture of arts",
    user: "BroonyJames",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiBH-QVQZpxo7kbjRO-JsEp6c-9I35cJsBkw&s"
  },
{
    id: 13,
    src: "https://i.pinimg.com/originals/4e/f0/d7/4ef0d7022735af8676d0663a9576812a.png",
    alt: "Picture of arts",
    user: "SamDoesArt",
    avatar: "https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
  },
  {
    id: 14,
    src: "https://images.hdqwalls.com/download/anime-art-girl-portrait-5k-78-1280x2120.jpg",
    alt: "Picture of arts",
    user: "Jeaven",
    avatar: "https://www.catconworldwide.com/wp-content/uploads/2023/01/Jiji-1-1017x1024.jpg"
  },
  {
    id: 15,
    src: "https://media.licdn.com/dms/image/C5622AQFpLlSL3Mxuow/feedshare-shrink_800/0/1679240444976?e=2147483647&v=beta&t=C5oHhOw_Kvj9DhtiZ4uvA_883e-KEuniGGRUMGsMtxk",
    alt: "Picture of arts",
    user: "Koolen",
    avatar: "https://a.storyblok.com/f/178900/750x422/c23ab48c5c/nyaight_of_the_living_cat_header.jpg/m/filters:quality(95)format(webp)"
  },
  {
    id: 16,
    src: "https://i.pinimg.com/originals/ae/3f/15/ae3f15ef5d7503e49acb31b337d0d14e.jpg",
    alt: "Picture of arts",
    user: "BroDraw",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVoatzXKKv3j1CQJMdbOUIzlfO0v763f4Sdw&s"
  },
  {
    id: 17,
    src: "https://i.pinimg.com/736x/0b/70/a0/0b70a0c1cf42c938dc941a648eae1091.jpg",
    alt: "Picture of arts",
    user: "Capitano",
    avatar: "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/w9bpqfuxrvm99gujxuvi.jpg"
  },
  {
    id: 18,
    src: "https://i.pinimg.com/750x/e4/6b/22/e46b2274a385c6a4f464687d5336a3c3.jpg",
    alt: "Picture of arts",
    user: "Tyaon",
    avatar: "https://otakuusamagazine.com/wp-content/uploads/2023/10/ousa_cat_hero.png"
  },
  {
    id: 19,
    src: "https://i.pinimg.com/originals/11/7e/d2/117ed2fa28a303c166a05115209444eb.png",
    alt: "Picture of arts",
    user: "Jeven",
    avatar: "https://t4.ftcdn.net/jpg/14/62/82/15/360_F_1462821545_cZ2VApsWn2u9xvSr5UwRgDtbGOQUrJXs.jpg"
  },
  {
    id: 20,
    src: "https://i.pinimg.com/originals/e3/50/49/e35049593eace2264601e51e0a567b9c.jpg",
    alt: "Picture of arts",
    user: "Kristena",
    avatar: "https://i.pinimg.com/1200x/95/cf/0b/95cf0b0894ac9afdb1ebc3c486a2b0ca.jpg"
  },
  {
    id: 21,
    src: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/07/Genshin-Impact-Albedo-Painting-1.jpg",
    alt: "Picture of arts",
    user: "Malbert",
    avatar: "https://krita-artists.org/uploads/default/original/3X/c/f/cfc4990e32f31acd695481944f2163e96ff7c6ba.jpeg"
  },
  {
    id: 22,
    src: "https://tse2.mm.bing.net/th/id/OIP.K2SvYXX2WKFKF83WiuLnVwHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Picture of arts",
    user: "Bongay",
    avatar: "https://play-lh.googleusercontent.com/_qUtBpMVsGY-CLPx2DreAENHAbr4KHwBGn2w_3jhGSzoRVFRKn0SXUaK0wXSU0SJ7A"
  },
  {
    id: 23,
    src: "https://www.animesenpai.net/wp-content/uploads/2022/10/PicsArt_10-15-06.36.41_compress56.jpg",
    alt: "Picture of arts",
    user: "Ace",
    avatar: "https://wallpapers.com/images/hd/cute-anime-profile-pictures-0lifptfs0jd9fml3.jpg"
  },
  {
    id: 24,
    src: "https://i.pinimg.com/736x/f9/27/28/f92728ac44be1efe813b63d157d92fea.jpg",
    alt: "Picture of arts",
    user: "BroonyJames",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiBH-QVQZpxo7kbjRO-JsEp6c-9I35cJsBkw&s"
  },
    {
    id: 25,
    src: "https://i.pinimg.com/736x/f9/27/28/f92728ac44be1efe813b63d157d92fea.jpg",
    alt: "Picture of arts",
    user: "BroonyJames",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiBH-QVQZpxo7kbjRO-JsEp6c-9I35cJsBkw&s"
  },
];


const ExploreLayout = () => {
  return (
    <div className="flex flex-col gap-4 relative px-4">
      {/* <h3 className="text-lg font-bold mt-4">Explore Arts</h3> */}
      <div className="w-[full] bg-background z-10 pt-10 pb-3 border-b-1 border-primary-line">
          <div className="flex gap-4 items-center space-between">
            <div className="bg-secondary flex items-center border-1 border-primary-line justify-center gap-2 py-3 px-8 cursor-pointer rounded-full">
                <FilterIcon />
                <p>Filter</p>
            </div>

            <div className="grow flex relative">
              <BsSearch className="opacity-80 text-xl absolute top-4 left-4"/>
              <input
                type="text"
                placeholder={`Search arts/artist in ArtistryHub`}
                className="border-1 border-primary-line bg-secondary opacity-80 font-normal py-3 pl-14 w-full rounded-full active:outline-0 "
              />
            </div>
          </div>
      

          <Suggestion />
      </div>
     

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 cursor-pointer w-full justify-between">
        {artListObj.map((art) => (
          <ArtList art={art} key={art.id} />
        ))}
      </div>

      {/* Loader (visible if DaisyUI installed) */}
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
