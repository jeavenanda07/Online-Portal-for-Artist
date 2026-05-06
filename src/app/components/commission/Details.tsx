// "use client";

// import Image from "next/image";
// import React from "react";
// import { CommissionFormData } from "@/types/commission";

// interface DetailsProps {
//   formData: CommissionFormData;
//   tags: string[];
//   inputValue: string;
//   setInputValue: (v: string) => void;
//   handleTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   removeTag: (tag: string) => void;
//   handleChange: (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => void;
//   submit: () => void;
//   goBack: () => void;
//   images: { file: File; url: string }[];
// }

// const Details = ({
//   formData,
//   tags,
//   inputValue,
//   setInputValue,
//   handleTag,
//   removeTag,
//   handleChange,
//   submit,
//   goBack,
//   images,
// }: DetailsProps) => {
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         submit();
//       }}
//       className="flex flex-col gap-4"
//     >
//       <div className="bg-primary rounded-md md:flex gap-6 p-6">
//         {/* LEFT FORM */}
//         <div className="flex flex-col gap-6 md:w-[70%]">
//           {/* Title */}
//           <div>
//             <label className="font-semibold">Title</label>
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm"
//               placeholder="e.g. Illustration, character design, etc.."
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="font-semibold">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               placeholder="Your assets descriptions"
//               rows={4}
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm resize-none"
//             />
//           </div>

//           {/* Art Type & Deadline */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold">Art Type</label>
//               <select
//                 name="artType"
//                 value={formData.artType}
//                 onChange={handleChange}
//                 className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm"
//               >
//                 <option value="Digital Art">Digital Art</option>
//                 <option value="Physical Art">Physical Art</option>
//               </select>
//             </div>

//             <div>
//               <label className="font-semibold">Deadline</label>
//               <input
//                 type="date"
//                 name="deadline"
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm"
//               />
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="font-semibold">Tags</label>
//             <div className="flex flex-wrap gap-2 p-2 border border-primary-line rounded-sm bg-secondary mt-1">
//               {tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="flex items-center gap-1 bg-green-700 text-white px-3 py-1 rounded text-sm"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     onClick={() => removeTag(tag)}
//                     className="ml-1 text-xs"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               ))}
//               <input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleTag}
//                 placeholder="Press Enter to add"
//                 className="bg-transparent outline-none flex-1 text-sm"
//               />
//             </div>
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="font-semibold">Budget</label>
//             <input
//               name="budget"
//               value={formData.budget}
//               onChange={handleChange}
//               required
//               type="number"
//               placeholder="₱500"
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm"
//             />
//           </div>
//         </div>

//         {/* RIGHT IMAGE PREVIEW */}
//         <div className="md:w-[30%] flex flex-col gap-3">
//           <p className="text-sm font-semibold opacity-70">
//             Image Preview ({images.length})
//           </p>

//           {images.length > 0 ? (
//             <>
//               <div className="relative aspect-square w-full">
//                 <Image
//                   src={images[0].url}
//                   alt="main-preview"
//                   fill
//                   className="object-cover rounded-md border border-primary-line"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 {images.slice(1).map((img, i) => (
//                   <div key={i} className="relative aspect-square">
//                     <Image
//                       src={img.url}
//                       alt={`thumb-${i}`}
//                       fill
//                       className="object-cover rounded-md border border-primary-line"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="aspect-square border border-dashed border-primary-line flex items-center justify-center text-xs opacity-50">
//               No images uploaded
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex justify-between">
//         <button
//           type="button"
//           onClick={goBack}
//           className="border px-6 py-2 rounded-md text-sm cursor-pointer hover:opacity-80 transition-all"
//         >
//           Back
//         </button>
//         <button
//           type="submit"
//           className="bg-white text-black px-6 py-2 rounded-md text-sm font-semibold cursor-pointer hover:opacity-80 transition-all"
//         >
//           Review
//         </button>
//       </div>
//     </form>
//   );
// };

// export default Details;

// "use client";

// import Image from "next/image";
// import React from "react";
// import { CommissionFormData } from "@/types/commission";

// interface DetailsProps {
//   formData: CommissionFormData;
//   tags: string[];
//   inputValue: string;
//   setInputValue: (v: string) => void;
//   handleTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   removeTag: (tag: string) => void;
//   handleChange: (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => void;
//   submit: () => void;
//   goBack: () => void;
//   images: { file: File; url: string }[];
// }

// const Details = ({
//   formData,
//   tags,
//   inputValue,
//   setInputValue,
//   handleTag,
//   removeTag,
//   handleChange,
//   submit,
//   goBack,
//   images,
// }: DetailsProps) => {
//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Helper: Convert File to Base64
//     const toBase64 = (file: File) =>
//       new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = (error) => reject(error);
//       });

//     try {
//       // SAFETY: I-save lang ang UNANG image para hindi lumampas sa 5MB limit ng browser
//       let savedReferences = [];
//       if (images.length > 0) {
//         const base64Img = await toBase64(images[0].file);
//         savedReferences.push(base64Img);
//       }

//       const newRequest = {
//         Title: formData.title,
//         Description: formData.description,
//         ArtType: formData.artType,
//         Budget: formData.budget,
//         Deadline: formData.deadline,
//         CreatedAt: new Date().toLocaleString(),
//         Status: "Pending",
//         Tags: tags,
//         References: savedReferences,
//         commissionToProfile: { clientName: "Ethan Rivera" },
//       };

//       // Kunin ang luma, pero limitahan lang sa huling 3 requests para hindi mapuno ang storage
//       const existing = JSON.parse(localStorage.getItem("all_requests") || "[]");
//       const updated = [newRequest, ...existing].slice(0, 3);

//       localStorage.setItem("all_requests", JSON.stringify(updated));

//       window.dispatchEvent(new Event("newCommissionAdded"));
//       submit();
//     } catch (err) {
//       // Kapag puno na talaga, ituro sa console
//       alert(
//         "Storage is full! I-type ang 'localStorage.clear()' sa console para ma-reset.",
//       );
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
//       <div className="bg-primary rounded-md md:flex gap-6 p-6">
//         <div className="flex flex-col gap-6 md:w-[70%]">
//           <div>
//             <label className="font-semibold text-white uppercase text-xs tracking-widest">
//               Title
//             </label>
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white focus:border-green-500 outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-white uppercase text-xs tracking-widest">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={4}
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm resize-none text-white focus:border-green-500 outline-none transition-all"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold text-white uppercase text-xs tracking-widest">
//                 Art Type
//               </label>
//               <select
//                 name="artType"
//                 value={formData.artType}
//                 onChange={handleChange}
//                 className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
//               >
//                 <option value="Digital Art">Digital Art</option>
//                 <option value="Physical Art">Physical Art</option>
//               </select>
//             </div>
//             <div>
//               <label className="font-semibold text-white uppercase text-xs tracking-widest">
//                 Deadline
//               </label>
//               <input
//                 type="date"
//                 name="deadline"
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="font-semibold text-white uppercase text-xs tracking-widest">
//               Tags
//             </label>
//             <div className="flex flex-wrap gap-2 p-2 border border-primary-line rounded-sm bg-secondary mt-1">
//               {tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="flex items-center gap-1 bg-green-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase"
//                 >
//                   {tag}
//                   <button type="button" onClick={() => removeTag(tag)}>
//                     ✕
//                   </button>
//                 </span>
//               ))}
//               <input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleTag}
//                 placeholder="Add tag..."
//                 className="bg-transparent outline-none flex-1 text-sm text-white p-1"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="font-semibold text-white uppercase text-xs tracking-widest">
//               Budget (₱)
//             </label>
//             <input
//               name="budget"
//               value={formData.budget}
//               onChange={handleChange}
//               required
//               type="number"
//               className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
//             />
//           </div>
//         </div>

//         <div className="md:w-[30%] flex flex-col gap-3">
//           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//             Image Preview
//           </p>
//           {images.length > 0 ? (
//             <div className="relative aspect-square w-full border-2 border-green-500 rounded-xl overflow-hidden shadow-lg">
//               <Image
//                 src={images[0].url}
//                 alt="preview"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           ) : (
//             <div className="aspect-square border border-dashed border-primary-line flex items-center justify-center text-[10px] opacity-40 text-white uppercase">
//               No Image Uploaded
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-between mt-4">
//         <button
//           type="button"
//           onClick={goBack}
//           className="border border-white/20 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5"
//         >
//           Back
//         </button>
//         <button
//           type="submit"
//           className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-500 transition-all"
//         >
//           Review Details
//         </button>
//       </div>
//     </form>
//   );
// };

// export default Details;

"use client";

import Image from "next/image";
import React from "react";
import { CommissionFormData } from "@/types/commission";

interface DetailsProps {
  formData: CommissionFormData;
  tags: string[];
  inputValue: string;
  setInputValue: (v: string) => void;
  handleTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  submit: () => void;
  goBack: () => void;
  images: { file: File; url: string }[];
}

const Details = ({
  formData,
  tags,
  inputValue,
  setInputValue,
  handleTag,
  removeTag,
  handleChange,
  submit,
  goBack,
  images,
}: DetailsProps) => {
  // Function para i-compress ang bawat image para magkasya lahat sa storage
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600; // Binabaan pa natin para mas maraming images ang magkasya
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Mas mataas na compression (0.5) para sa multi-image support
          resolve(canvas.toDataURL("image/jpeg", 0.5));
        };
      };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Pinoproseso ang LAHAT ng images mula sa upload array
      const compressedReferences = await Promise.all(
        images.map((img) => compressImage(img.file)),
      );

      const newRequest = {
        Title: formData.title,
        Description: formData.description,
        ArtType: formData.artType,
        Budget: formData.budget,
        Deadline: formData.deadline,
        CreatedAt: new Date().toLocaleString(),
        Status: "Pending",
        Tags: tags,
        References: compressedReferences, // Dito na naka-save lahat ng pictures
        commissionToProfile: { clientName: "Ethan Rivera" },
      };

      const existing = JSON.parse(localStorage.getItem("all_requests") || "[]");

      // Pinapanatili ang huling 5 requests para sa performance
      const updated = [newRequest, ...existing].slice(0, 5);

      localStorage.setItem("all_requests", JSON.stringify(updated));

      window.dispatchEvent(new Event("newCommissionAdded"));
      submit();
    } catch (err) {
      alert(
        "Masyadong malaki ang files! I-clear ang storage o bawasan ang pictures.",
      );
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <div className="bg-primary rounded-md md:flex gap-6 p-6">
        <div className="flex flex-col gap-6 md:w-[70%]">
          <div>
            <label className="font-semibold text-white uppercase text-xs tracking-widest">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="font-semibold text-white uppercase text-xs tracking-widest">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm resize-none text-white focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-white uppercase text-xs tracking-widest">
                Art Type
              </label>
              <select
                name="artType"
                value={formData.artType}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
              >
                <option value="Digital Art">Digital Art</option>
                <option value="Physical Art">Physical Art</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-white uppercase text-xs tracking-widest">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-white uppercase text-xs tracking-widest">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-primary-line rounded-sm bg-secondary mt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-green-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    ✕
                  </button>
                </span>
              ))}
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTag}
                placeholder="Add tag..."
                className="bg-transparent outline-none flex-1 text-sm text-white p-1"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-white uppercase text-xs tracking-widest">
              Budget (₱)
            </label>
            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              type="number"
              className="w-full mt-1 p-3 bg-secondary border border-primary-line rounded-sm text-white outline-none"
            />
          </div>
        </div>

        {/* IMAGE PREVIEW NG UNANG IMAGE PARA SA FORM */}
        <div className="md:w-[30%] flex flex-col gap-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
            Main Reference Preview
          </p>
          {images.length > 0 ? (
            <div className="relative aspect-square w-full border-2 border-green-500 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={images[0].url}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square border border-dashed border-primary-line flex items-center justify-center text-[10px] opacity-40 text-white uppercase">
              No Image Uploaded
            </div>
          )}
          <p className="text-[9px] text-center text-slate-500 uppercase font-bold">
            Total Images: {images.length}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={goBack}
          className="border border-white/20 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-500 transition-all"
        >
          Review Details
        </button>
      </div>
    </form>
  );
};

export default Details;
