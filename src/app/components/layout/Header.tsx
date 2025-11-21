'use client';

import Logo from "../ui/Logo";
import Link from 'next/link';
import { CgMail } from "react-icons/cg";
import { FaShoppingBag } from "react-icons/fa";
import Image from 'next/image';
import { useState } from "react";
import clsx from 'clsx';
import ProfileMenu from '../Menu/ProfileMenu';
import { FaHome } from "react-icons/fa";
import { GoGlobe } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";

export default function Header() {
  const [isLogin, setIsLogin] = useState(true);
  const [isActive, setIsActive] = useState(false)

  const handleProfileMenu = () => {
    setIsActive((prev) => !prev);
  };

  const handleLogOut = () => {
    setIsLogin(false);
    setIsActive(false);
  }

  console.log(isLogin);
  return (
    <header className="z-20 bg-background sticky top-0 h-20 left-0 w-full border-b-primary-line flex justify-between items-center mb-10 px-5 md:px-10 lg:px-20">
      <div className="flex gap-8 items-center">
          <Logo/>

          {/* <div className="grow flex relative">
            <BsSearch className="opacity-80 text-xl absolute top-4 left-4"/>
            <input
              type="text"
              placeholder={`Search arts/artist in ArtistryHub`}
              className="border-1 border-primary-line bg-secondary opacity-80 font-normal py-4 pl-14  w-90 rounded-full active:outline-0 "
            />
          </div>  */}
      </div>


      <div className="flex gap-4">
        <Link href="/">
              <div className='flex items-center gap-4 px-8'>
                  <FaHome />
                  <p>Home</p>
              </div>
        </Link>

        <Link href="/explore">
              <div className='flex items-center gap-4 px-8'>
                  <GoGlobe />
                  <p>Explore</p>
              </div>
        </Link>

        <Link href="/shop">
              <div className='flex items-center gap-4 px-8'>
                  <FaShoppingBag />
                  <p>Shop</p>
              </div>
        </Link>

        <Link href="/commission">
              <div className='flex items-center gap-4 px-8'>
                  <FaRegUser />
                  <p>Commission</p>
              </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">


        {
          isLogin &&  <Link href="/mail"><CgMail className="text-3xl"/></Link>
        }
       

        <div 
          onClick={() => handleProfileMenu()}
          className='cursor-pointer'>
            <Image
              width={40}
              height={40}
              src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
              alt="Picture of the author"
              className={clsx('rounded-full w-11 h-11 ml-6 object-cover border-2 border-white', {
                "block" : isLogin,
                "hidden" : !isLogin
              })}
            />
        </div>

             {
              !isLogin && 
                <div className={clsx('text-right flex justify-end gap-10', {
                  
                })}>
                  <button className="cursor-pointer"><Link href="/register">Sign up</Link></button>
                  <button className="bg-gradient-primary cursor-pointer text-white px-10 py-2 rounded-full "><Link href="/login">Log in</Link></button>
                </div>
             }   

        <div 
          className={clsx('absolute top-20 right-10 z-40', {
          "block" : isActive,
          "hidden" : !isActive 
        })}>
          <ProfileMenu handleLogOut={handleLogOut} handleMenu={handleProfileMenu}/>
        </div>
      </div>
    </header>
  )
}
