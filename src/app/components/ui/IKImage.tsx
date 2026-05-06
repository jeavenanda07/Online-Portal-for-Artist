// // components/IKImage.tsx
// import { Image } from "@imagekit/next";

// interface IKImageProps {
//   path: string; // Changed from src to path
//   width: number;
//   height: number;
//   className?: string;
//   alt: string;
// }

// export default function MyIKImage({ path, width, height, className, alt }: IKImageProps) {
//   console.log(`Testing path ${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${path}`);
//   console.log("Test src", path); 
//   console.log("Test width", width);
//   console.log("Test height", height);
//   console.log("Test alt", alt);

//   return (
//     <Image
//       // urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
//       path={`${path}`} // Use path instead of src
//       width={width}
//       height={height}
//       alt={alt}
//       className={className}
//     />
//   );
// }