"use client"

import Link from "next/link";
import {LOGGED_IN_USER_ID} from "@/lib/auth"
import { MdOutlineMail } from "react-icons/md";
import { GoPlusCircle } from "react-icons/go";
import CommissionForm from "../commission/CommissionForm";
import DarkBlur from "../ui/DarkBlur";
import Menu from './Menu';
import { usePopup } from '@/hooks/usePopup';
import ModalPortal from '../shared/ModalPortal';

interface NavLinksProps {
    username: String | undefined;
    isMyAccount: Boolean;
}

const ButtonSubmission = ({username, isMyAccount} : NavLinksProps) => {
 const commissionPopup = usePopup({
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnRouteChange: true,
  });

  return (
    <div>
        {
        !isMyAccount && 
            <div className="flex gap-4 items-center">
            <Menu />
            <button className="flex bg-white px-4 py-2 text-nowrap items-center text-black rounded-md gap-2 cursor-pointer hover:opacity-80 transition duration-200 ease-in-out hover:scale-102">
            <GoPlusCircle /> 
                <Link href="/messages">Sent Message</Link>
                </button>

                <button 
                    onClick={commissionPopup.open}
                    className="flex bg-green-400 px-4 py-2 text-nowrap items-center text-black rounded-md gap-2 cursor-pointer hover:opacity-80 transition duration-200 ease-in-out hover:scale-102">
                    <MdOutlineMail /> 
                    <span>Send Commission</span>
                </button>
            </div>
        }

        {
        }

        {commissionPopup.isOpen && (
            <>
            {/* Modal */}
            <ModalPortal>
                <div ref={commissionPopup.ref}>
                    {/* <CommissionForm func={commissionPopup.close} username={username} /> */}
                </div>

                {/* Backdrop */}
                    <DarkBlur />
            </ModalPortal>

            </>
        )}
    </div>
  )
}

export default ButtonSubmission
