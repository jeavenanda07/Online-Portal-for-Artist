// app/components/ui/Loading.tsx
"use client";

import React from "react";
import ReactLoading from "react-loading";

interface LoadingProps {
  type?: any;
  color?: string;
  height?: number;
  width?: number;
}

export default function Loading({ 
  type = "spin", 
  color = "#4ade80", // Matches your green-400 theme
  height = 24, 
  width = 24 
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
}