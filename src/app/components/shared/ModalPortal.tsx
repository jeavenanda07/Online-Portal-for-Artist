// ModalPortal.tsx — should look like this
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const el = useRef<HTMLDivElement | null>(null);

  if (!el.current) {
    el.current = document.createElement("div");
  }

  useEffect(() => {
    document.body.appendChild(el.current!);
    return () => {
      document.body.removeChild(el.current!);
    };
  }, []);

  return createPortal(children, el.current);
};

export default ModalPortal;