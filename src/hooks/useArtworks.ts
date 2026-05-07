// import { useState, useEffect } from "react";
// import { getSession } from "@/app/actions/auth";
// import { getUserInfo } from "@/app/actions/user";


// export const useArtworks = () => {
//   const [artworks, setArtworks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const userSession = getSession();
//   const userId = getUserInfo() 

//   useEffect(() => {

  
//     const fetchArtworks = async () => {  // 👈 renamed from "fetch" to "fetchArtworks"
//         const userDetails = await getUserInfo()

//         if (!userDetails?.user_profile_id) return;
//       try {
//         const res = await fetch(`/api/artwork/get?user_profile_id=${userDetails.user_profile_id}`);
//         const data = await res.json();
//         setArtworks(data.artworks || []);
//       } catch {
//         notify("Failed to load artworks.", "error");
//       } finally {
//         setLoadingArtworks(false);
//       }
//     };
  
//     fetchArtworks();  // 👈 call the renamed function
//   }, [userDetails?.user_profile_id]);

//   return { artworks, setArtworks, loading, error };
// };