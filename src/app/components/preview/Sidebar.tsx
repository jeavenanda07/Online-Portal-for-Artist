// 'use client';

// import Link from "next/link";
// import { useState } from "react";
// import { IoIosArrowForward } from "react-icons/io";
// import { CardFeatured } from "./CardFeatured";
// import { FaPaperclip } from "react-icons/fa";
// import { MdProductionQuantityLimits } from "react-icons/md";
// import { HiOutlineComputerDesktop } from "react-icons/hi2";
// import { artwork } from "@/types/User";
// import Checkout from "@/app/components/ui/Checkout";


// export function Sidebar(art: artwork) {
//   const [checkOutIsOpen, setCheckOutIsOpen] = useState(false); // Start closed

//   return (
//     <div>
//       {art?.status == "For Sale" && (
//         <div className="w-full mt-5 p-4 rounded-md border-1 border-primary-line flex flex-col gap-4 bg-primary mb-10">
//           <button onClick={() => setCheckOutIsOpen(true)} className="p-2 rounded-full cursor-pointer bg-green-500">
//             Buy for $10
//           </button>
//           <div className="flex items-center gap-2">
//             <FaPaperclip />
//             <p>1 attached file</p>
//           </div>

//           <div className="flex items-center gap-2">
//             <MdProductionQuantityLimits />
//             <p>310 Available stocks</p>
//           </div>

//           <div className="flex items-center gap-2">
//             <HiOutlineComputerDesktop />
//             <p>Digital Art</p>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <h3>
//           More arts by{" "}
//           <Link href="#" className="font-bold">
//             SamDoesArt
//           </Link>
//         </h3>
//         <IoIosArrowForward />
//       </div>

//       <div className="grid grid-cols-2 gap-2 mt-4">
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//       </div>

//       <div className="flex justify-between items-center mt-20 mb-4">
//         <h3>
//           More to explore 
//         </h3>
//         <IoIosArrowForward />
//       </div>

//       <div className="grid grid-cols-2 gap-2 ">
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//         <CardFeatured />
//       </div>

  
//       <Checkout
//         isOpen={checkOutIsOpen} 
//         onClose={() => setCheckOutIsOpen(false)}
        
//       />
//     </div>
//   );
// }
