// "use client";

// import classNames from "clsx";
// import { useState, useEffect } from "react";
// import ImgRef from "./ImgRef";
// import Details from "./Details";
// import Review from "./Review";
// import { notify } from "@/utils/toastHelper";
// import { getOwnerProfile, getUserProfile } from "@/utils/getUser";
// import { FinalCommissionData } from "@/types/commission";
// import { RiArrowRightSLine } from "react-icons/ri";
// import { setData, getData } from "@/utils/storage";

// const nav = [
//   { number: 1, name: "Upload Reference Image" },
//   { number: 2, name: "Information" },
//   { number: 3, name: "Preview" },
// ];

// interface Props {
//   func: (value: boolean) => void;
//   userId: string;
// }

// const CommissionForm = ({ func, userId }: Props) => {
//   const [step, setStep] = useState(1);

//   // Step data
//   const [images, setImages] = useState<{ file: File; url: string }[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState("");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     artType: "Digital Art",
//     deadline: "",
//     budget: "",
//     status: "Pending",
//   });

//   // Final review data
//   const [reviewData, setReviewData] = useState<FinalCommissionData | null>(
//     null,
//   );

//   const handleTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const tag = inputValue.trim();
//       if (tag && !tags.includes(tag)) {
//         setTags((prev) => [...prev, tag]);
//       }
//       setInputValue("");
//     }
//   };

//   const handleSubmit = () => {
//     if (tags.length < 1) {
//       notify("Add at least 1 tag to continue", "error");
//       return;
//     }

//     const finalData: FinalCommissionData = {
//       ...formData,
//       tags,
//       images,
//       commissionTo: getUserProfile(userId),
//       commissionFrom: getOwnerProfile(),
//       createdAt: new Date().toLocaleString(),
//     };

//     setReviewData(finalData);
//     setStep(3);
//   };

//   // Final Submit
//   const handleFinalSubmit = (): FinalCommissionData => {
//     if (!reviewData) {
//       throw new Error("No review data found");
//     }

//     const existing =
//       getData<FinalCommissionData[]>("myCommissionRequest") || [];

//     const updated = [...existing, reviewData];

//     setData("myCommissionRequest", updated);

//     notify("Commission sent successfully", "success");

//     setTimeout(() => {
//       notify("View your order(s) here", "success");
//       window.location.href = "/my-request";
//     }, 1500);
//     return reviewData;
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center  w-full ">
//       <section className="max-w-5xl rounded-lg shadow-lg overflow-hidden">
//         <div className="grid grid-cols-3 px-6 py-4 max-w-[50em] w-full justify-center mx-auto">
//           {nav.map((item) => (
//             <div
//               key={item.number}
//               className="flex items-center gap-2 text-white  justify-evenly"
//             >
//               <div className="flex items-center gap-2 ">
//                 <span
//                   className={classNames(
//                     "h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold",
//                     {
//                       "bg-green-500 text-white": step === item.number,
//                       "border border-primary-line opacity-80 bg-primary text-black":
//                         step !== item.number,
//                     },
//                   )}
//                 >
//                   {item.number}
//                 </span>
//                 <span className="hidden sm:block text-sm font-semibold">
//                   {item.name}
//                 </span>
//               </div>

//               {item.number != 3 && <RiArrowRightSLine className="ml-1/2" />}
//             </div>
//           ))}
//         </div>

//         {/* ===== Content ===== */}
//         <div className="relative overflow-hidden rounded-md bg-primary items-center">
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
//           >
//             {/* STEP 1 */}
//             <div className="w-full my-auto shrink-0 p-6">
//               <ImgRef
//                 images={images}
//                 setImages={setImages}
//                 goNext={() => setStep(2)}
//                 func={func}
//               />
//             </div>

//             {/* STEP 2 */}
//             <div className={classNames("w-full shrink-0 p-6")}>
//               <Details
//                 formData={formData}
//                 tags={tags}
//                 inputValue={inputValue}
//                 setInputValue={setInputValue}
//                 handleTag={handleTag}
//                 removeTag={(tag) =>
//                   setTags((prev) => prev.filter((t) => t !== tag))
//                 }
//                 handleChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     [e.target.name]: e.target.value,
//                   })
//                 }
//                 submit={handleSubmit}
//                 goBack={() => setStep(1)}
//                 images={images}
//               />
//             </div>

//             {/* STEP 3 */}
//             <div className="w-full shrink-0 sm:p-6 my-auto">
//               {reviewData && (
//                 <Review
//                   formData={reviewData}
//                   goBack={() => setStep(2)}
//                   submit={handleFinalSubmit}
//                   userId={userId}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CommissionForm;

"use client";

import classNames from "clsx";
import { useState } from "react";
import ImgRef from "./ImgRef";
import Details from "./Details";
import Review from "./Review";
import { notify } from "@/utils/toastHelper";
import { getOwnerProfile, getUserProfile } from "@/utils/getUser";
import { FinalCommissionData } from "@/types/commission";
import { RiArrowRightSLine } from "react-icons/ri";
import { setData, getData } from "@/utils/storage";

const nav = [
  { number: 1, name: "Upload Reference Image" },
  { number: 2, name: "Information" },
  { number: 3, name: "Preview" },
];

interface Props {
  func: (value: boolean) => void;
  userId: string;
}

const CommissionForm = ({ func, userId }: Props) => {
  const [step, setStep] = useState(1);

  // Step data
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artType: "Digital Art",
    deadline: "",
    budget: "",
    status: "Pending",
  });

  // Final review data
  const [reviewData, setReviewData] = useState<FinalCommissionData | null>(
    null,
  );

  const handleTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = inputValue.trim();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setInputValue("");
    }
  };

  const handleSubmit = () => {
    if (tags.length < 1) {
      notify("Add at least 1 tag to continue", "error");
      return;
    }

    // Gagawa ng permanenteng timestamp para sa chat display
    const now = new Date();
    const shortTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Inayos ang mapping ng profiles gamit ang "as any" para sa type safety
    const finalData: FinalCommissionData = {
      ...formData,
      tags,
      images,
      commissionTo: getUserProfile(userId) as any,
      commissionFrom: getOwnerProfile() as any,
      createdAt: now.toLocaleString(),
      // Idinagdag para sa Messenger-style display
      timestamp: shortTime,
    } as FinalCommissionData;

    setReviewData(finalData);
    setStep(3);
  };

  // Final Submit
  const handleFinalSubmit = (): FinalCommissionData => {
    if (!reviewData) {
      throw new Error("No review data found");
    }

    // Kinukuha muna ang fresh data para hindi bumalik ang mga deleted
    const existing =
      getData<FinalCommissionData[]>("myCommissionRequest") || [];

    // Idinaragdag ang bago sa dulo ng listahan
    const updated = [...existing, reviewData];

    setData("myCommissionRequest", updated);

    notify("Commission sent successfully", "success");

    setTimeout(() => {
      notify("View your order(s) here", "success");
      window.location.href = "/my-request";
    }, 1500);

    return reviewData;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center w-full bg-black/40 backdrop-blur-sm">
      <section className="max-w-5xl w-full rounded-lg shadow-lg overflow-hidden bg-primary">
        <div className="grid grid-cols-3 px-6 py-4 max-w-[50em] w-full justify-center mx-auto">
          {nav.map((item) => (
            <div
              key={item.number}
              className="flex items-center gap-2 text-white justify-evenly"
            >
              <div className="flex items-center gap-2">
                <span
                  className={classNames(
                    "h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold",
                    {
                      "bg-green-500 text-white": step === item.number,
                      "border border-primary-line opacity-80 bg-primary text-black":
                        step !== item.number,
                    },
                  )}
                >
                  {item.number}
                </span>
                <span className="hidden sm:block text-sm font-semibold">
                  {item.name}
                </span>
              </div>

              {item.number !== 3 && (
                <RiArrowRightSLine className="ml-1/2 text-white" />
              )}
            </div>
          ))}
        </div>

        {/* ===== Content ===== */}
        <div className="relative overflow-hidden rounded-md bg-primary items-center">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* STEP 1 */}
            <div className="w-full my-auto shrink-0 p-6">
              <ImgRef
                images={images}
                setImages={setImages}
                goNext={() => setStep(2)}
                func={func}
              />
            </div>

            {/* STEP 2 */}
            <div className={classNames("w-full shrink-0 p-6")}>
              <Details
                formData={formData}
                tags={tags}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleTag={handleTag}
                removeTag={(tag) =>
                  setTags((prev) => prev.filter((t) => t !== tag))
                }
                handleChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                submit={handleSubmit}
                goBack={() => setStep(1)}
                images={images}
              />
            </div>

            {/* STEP 3 */}
            <div className="w-full shrink-0 sm:p-6 my-auto">
              {reviewData && (
                <Review
                  formData={reviewData}
                  goBack={() => setStep(2)}
                  submit={handleFinalSubmit}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommissionForm;
