"use client";

import { useState } from "react";
import Modal from "../../ui/Modal";
import { TbFolderUp } from "react-icons/tb";
import Image from "next/image";
import { notify } from "@/utils/toastHelper";
import {setData, getData} from "@/utils/storage"
import {CreateGalleryData} from "@/types/gallery"
import { IoMdClose } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateGalleryData) => void;
}

const CreateGalleryModal = ({ isOpen, onClose, onCreate }: Props) => {
    const [form, setForm] = useState<CreateGalleryData>({
        title: "",
        description: "",
        visibility: "public",
        coverImageFile: undefined,
        coverImagePreview: undefined,
    });

    const handleCreate = () => {
        if (!form.title.trim()) return notify("Gallery title is required", "error");
      
        const existingGalleries = getData<CreateGalleryData>("gallery") || [];
        // const titleExists = existingGalleries.some(
        //     (gallery) => gallery.title.toLowerCase() === form.title.trim().toLowerCase()
        // );
      
        // if (titleExists) {
        //     return notify("Title is already exist", "error");
        // }

        const updatedGalleries = Array.isArray(existingGalleries) 
          ? [...existingGalleries, form] 
          : [form];
      
        setData("gallery", updatedGalleries);
        
        notify("Gallery Created Successfully", 'success')
        setTimeout(() => {
            onCreate(form);
            onClose();
            setForm({
              title: "",
              description: "",
              visibility: "public",
              coverImageFile: undefined,
              coverImagePreview: undefined,
            });
        }, 1500)
    
      };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) {
      notify("File size must be under 5MB", "error");
      return;
    }
  
    const previewUrl = URL.createObjectURL(file);
  
    setForm((prev) => ({
      ...prev,
      coverImageFile: file,
      coverImagePreview: previewUrl,
    }));

    console.log(form.coverImagePreview)
  };

  const handleClose = () => {
    setForm({
        title: "",
        description: "",
        visibility: "public",
        coverImageFile: undefined,
        coverImagePreview: undefined,
      });
      onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="md:m-4 max-w-[700px] w-full bg-primary overflow-hidden">

      <div className="flex justify-between  bg-secondary items-center px-6 py-4 border-b border-primary-line">
        <h2 className="text-lg font-semibold">Create new Gallery</h2>
        <button onClick={handleClose} className="text-xl opacity-60 hover:opacity-100 cursor-pointer">
             <IoMdClose />
        </button>
      </div>

      {/* BODY */}
      <div className="md:flex gap-6 p-6">
        {/* COVER IMAGE */}
        <div className="md:w-[300px] h-60 bg-secondary relative border border-primary-line rounded-md flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-80 transition">
            {
                form.coverImageFile 
                ? <div className="overflow-hidden h-full">
                    <Image
                        height={40}
                        width={40}
                        src={form?.coverImagePreview || ""}
                        alt="photo_not_found"
                        className="object-cover h-full w-full hover:opacity-40 transition-opacity"
                    />

                    <label htmlFor="img-reference" className="opacity-0 hover:opacity-100 h-full flex flex-col text-bold  transition-all w-full z-10 absolute inset-0 items-center justify-center"> <TbFolderUp className="text-7xl mx-auto opacity-50" />Upload new Image</label>
                 </div> 
                : <div className="">
                    <label className="h-full cursor-pointer w-full p-4 text-center" htmlFor="img-reference">
                        <TbFolderUp className="text-7xl mx-auto opacity-50" />
                        <p className="text-md mt-4 font-bold">Click to upload or drag and drop</p>
                        <p className="opacity-50 font-400 text-sm mt-4">Maximum file size 5mb</p>
                    </label>    
                </div>
            }
            
            <input
                className="hidden"
                id="img-reference"
                name="img-reference"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
            />
        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col gap-4">
          {/* TITLE + VISIBILITY */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-semibold">Gallery Title</label>
              <input
                type="text"
                maxLength={100}
                placeholder='e.g. "anime"'
                className="mt-1 w-full bg-secondary border border-primary-line rounded-md px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Visibility</label>
              <select
                className="mt-1 w-full bg-secondary border border-primary-line rounded-md px-3 py-2 text-sm"
                value={form.visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visibility: e.target.value as "public" | "private",
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-semibold">Gallery Description</label>
            <textarea
              maxLength={300}
              placeholder="description here"
              className="mt-1 w-full min-h-[120px] bg-secondary border border-primary-line rounded-md px-3 py-2 text-sm resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-4 px-6 py-4 border-t border-primary-line">
        <button
          onClick={onClose}
          className="text-sm px-4 py-2 rounded-md hover:opacity-80 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="text-sm px-6 py-2 rounded-md cursor-pointer bg-green-400 text-black font-semibold hover:opacity-80"
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default CreateGalleryModal;
