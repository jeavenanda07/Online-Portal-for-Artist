"use client";

import Link from "next/link";
import { MdOutlineMail } from "react-icons/md";
import { MessageCircle } from "lucide-react";
import CommissionForm from "../commission/CommissionForm";
import DarkBlur from "../ui/DarkBlur";
import Menu from "./Menu";
import { usePopup } from "@/hooks/usePopup";
import ModalPortal from "../shared/ModalPortal";

interface ButtonSubmissionProps {
  username: String | undefined;
  isMyAccount: Boolean;
}

const ButtonSubmission = ({ username, isMyAccount }: ButtonSubmissionProps) => {
  const commissionPopup = usePopup({
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnRouteChange: true,
  });

  if (isMyAccount) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Menu />

        <Link
          href="/messages"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95"
        >
          <MessageCircle size={14} />
          <span className="hidden sm:inline">Message</span>
        </Link>

        {/* Commission */}
        <button
          onClick={commissionPopup.open}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#00d26a] hover:bg-[#00b85a] text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95"
        >
          <MdOutlineMail size={14} />
          <span className="hidden sm:inline">Commission</span>
        </button>
      </div>

      {commissionPopup.isOpen && (
        <ModalPortal>
          <div ref={commissionPopup.ref as any}>
            {/* <CommissionForm func={commissionPopup.close} username={username} /> */}
          </div>
          <DarkBlur />
        </ModalPortal>
      )}
    </>
  );
};

export default ButtonSubmission;