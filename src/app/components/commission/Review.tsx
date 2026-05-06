"use client";

import Image from "next/image";
import { FinalCommissionData } from "@/types/commission";

interface Props {
  formData: FinalCommissionData;
  goBack: () => void;
  submit: () => void;
  userId: string;
}

const Review = ({ formData, goBack, submit, userId }: Props) => {
  const { tags, title, description, artType, budget, deadline } = formData;
  const images = formData.images ?? [];

  const info = [
    { label: "Art Type", value: artType },
    { label: "Budget", value: budget },
    {
      label: "Deadline",
      value: deadline ? new Date(deadline).toLocaleDateString("en-US") : "N/A",
    },
  ];

  return (
    <div className="bg-secondary p-6 rounded-md border border-primary-line flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">{title || "Untitled Commission"}</h3>
          </div>
          <p className="text-sm opacity-80">{description || "No description provided."}</p>
        </div>
      </div>

      <hr className="border-primary-line" />

      {/* BODY */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* IMAGES */}
        <div className="lg:w-[40%] flex flex-col gap-3">
          <p className="font-semibold">
            Photo Reference ({images.length})
          </p>

          <div className="relative h-60 border border-primary-line rounded-md overflow-hidden">
            {images.length > 0 ? (
              <Image
                src={images[0].url}
                alt="main"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs opacity-40">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative h-20 w-20 shrink-0">
                  <Image
                    src={img.url}
                    alt={`thumb-${i}`}
                    fill
                    sizes="80px"
                    className="object-cover rounded-md border border-primary-line"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <p><strong>Tags: </strong></p>
            {tags?.length ? (
              tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-700 text-white px-3 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs opacity-40">No tags</span>
            )}
          </div>

          {info.map((item) => (
            <p key={item.label} className="text-sm">
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center border-t border-primary-line pt-4">
        <p className="text-sm opacity-70">
          Please review your commission details
        </p>
        <div className="flex gap-3">
          <button 
            onClick={goBack} 
            className="border px-6 py-2 rounded-md text-sm cursor-pointer hover:opacity-80 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={submit}
            className="bg-white text-black px-6 py-2 rounded-md text-sm font-semibold cursor-pointer hover:opacity-80 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;