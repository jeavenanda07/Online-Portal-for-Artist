import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type UsePopupOptions = {
  closeOnRouteChange?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
};

export function usePopup(options?: UsePopupOptions) {
  const {
    closeOnRouteChange = true,
    closeOnOutsideClick = true,
    closeOnEsc = true,
  } = options || {};

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => prev ? false : true);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, closeOnOutsideClick]);

  
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeOnEsc]);


  useEffect(() => {
    if (!closeOnRouteChange) return;
    close();
  }, [pathname]);

  return {
    isOpen,
    open,
    close,
    toggle,
    ref,
  };
}
