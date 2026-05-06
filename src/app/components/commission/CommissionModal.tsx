"use client";
import classNames from "clsx";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiMiniPaintBrush } from "react-icons/hi2";
import { IoLogoUsd } from "react-icons/io5";
import { FaRegCalendarTimes } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { CommissionRequest } from "@/types/User";
import { FiExternalLink } from "react-icons/fi";

interface CommissionModalProps {
  data: CommissionRequest | undefined;
  modal: boolean;
  modalFunc: React.Dispatch<React.SetStateAction<boolean>>;
}

const tags = ["Anime", "Pixel Art", "Cute girl"];

const CommissionModal = ({ data, modal, modalFunc }: CommissionModalProps) => {
  console.log(data);
  return (
    <section
      className={` ${modal ? "visible mt-4 opacity-100" : "invisible mt-0 opacity-0 none"} transition-all duration-400 ease-in-out z-50 text-xs overflow-hidden fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary border-1 border-primary-line w-full max-w-160 h-160 rounded-xl pb-20`}
    >
      <header className="mb-4 p-4 ">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex gap-4 items-center ">
            <Image
              src="https://i.pinimg.com/originals/4e/f0/d7/4ef0d7022735af8676d0663a9576812a.png"
              width={40}
              height={40}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover bg-secondary"
            />

            <div>
              <p className="opacity-50">From </p>
              <p className="text-md font-bold">
                {data?.commissionToProfile.clientName}
              </p>
            </div>
          </div>

          <p
            className={classNames(
              "text-xs font-semibold px-2  border-1 h-fit rounded-full",
              {
                "border-blue-600 bg-blue-300 text-blue-600":
                  data?.Status == "Pending",
                "border-orange-600 bg-orange-300 text-orange-600":
                  data?.Status == "On Hold",
                "border-blue-400 bg-blue-300 text-blue-500":
                  data?.Status == "Ongoing",
                "border-green-600 bg-green-300 text-green-600":
                  data?.Status == "Completed",
                "border-red-600 bg-red-300 text-red-600":
                  data?.Status == "Declined",
              },
            )}
          >
            {data?.Status}
          </p>
          <IoClose
            onClick={() => modalFunc((i) => !i)}
            className="absolute top-2 right-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-100 ease-in"
          />
        </div>

        <h3 className="text-xl font-semibold">{data?.Title}</h3>
      </header>

      <main className="p-4 h-[79%] overflow-y-scroll">
        <ul className="flex flex-col gap-4">
          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit ">
              <IoDocumentTextOutline />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold mb-1">DESCRIPTION</h5>
              <p className="">{data?.Description}</p>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit ">
              <HiMiniPaintBrush />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">ART TYPE</h5>
              <p className="bg-secondary px-4 py-1 rounded-full font-semibold">
                {data?.ArtType}
              </p>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit">
              <IoLogoUsd />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">BUDGET</h5>
              <p className="text-xl font-semibold text-green-400">
                ${data?.Budget}
              </p>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit">
              <FaRegCalendarTimes />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">DEADLINE</h5>
              <p>{data?.Deadline}</p>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit">
              <MdAccessTime />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">CREATED AT</h5>
              <p>{data?.CreatedAt}</p>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit">
              <MdAccessTime />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">TAGS</h5>
              <ul className="flex gap-4 ">
                {data?.Tags.map((i) => (
                  <li
                    key={i}
                    className="bg-secondary px-4  rounded-full text-nowrap py-1"
                  >
                    #{i}
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li className="flex gap-4 border-b-1 border-primary-line pb-4">
            <div className="p-2 bg-secondary rounded-md text-md h-fit">
              <MdAccessTime />
            </div>

            <div>
              <h5 className="opacity-80 font-semibold  mb-1">REFERENCES</h5>
              <ul className="flex gap-4 ">
                {data?.References.map((i) => (
                  <li
                    key={i}
                    className="relative bg-secondary hover:opacity-50 cursor-pointer overflow-hidden rounded-md text-nowrap h-35 w-35 group"
                  >
                    <img
                      src={i}
                      alt={`Art Reference ${i}`}
                      className="object-cover "
                    />

                    <FiExternalLink className="absolute text-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hidden group-hover:block" />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </main>

      <footer className="absolute bottom-0 border-t-1 border-t-primary-line h-15 left-0 w-full bg-secondary py-2 flex items-center justify-between">
        <p className="opacity-50 text-sm">Manage this commission request</p>

        <div className="flex gap-4">
          <button
            className="border-1 text-red-500 font-semibold cursor-pointer hover:bg-red-400 hover:text-red-600 transition-all duration-150 ease-in border-red-500 py-2 px-6 rounded-xl"
            type="button"
          >
            Decline
          </button>
          <button
            className="border-1 text-black font-semibold cursor-pointer bg-green-400 hover:opacity-80 transition-all duration-150 ease-in border-green-600 py-2 px-6 rounded-xl"
            type="button"
          >
            Accept Request
          </button>
        </div>
      </footer>
    </section>
  );
};

export default CommissionModal;
