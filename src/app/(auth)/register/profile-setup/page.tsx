"use client";

import React, { useEffect, useState } from 'react';
import Logo from '@/app/components/ui/Logo';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const ProfileSetup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    gender: "PREFER_NOT_TO_SAY",
    birthdate: "",
  });

  // 1. READ: Get Google Data on Mount
  useEffect(() => {
    const initSetup = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Sync Credentials first
        await fetch('/api/auth/sync-user', {
          method: 'POST',
          body: JSON.stringify({ user_id: user.id, gmail: user.email }),
        });

        setFormData((prev) => ({
          ...prev,
          full_name: user.user_metadata?.full_name || "",
          username: user.user_metadata?.full_name ? `@${user.user_metadata.full_name.replace(/\s+/g, '_').toLowerCase()}` : ""
        }));
      }
      setLoading(false);
    };

    initSetup();
  }, []);

  // 2. CREATE: Submit Profile to Prisma
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Session expired");

    const response = await fetch('/api/profile/create', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        credentials_id: user.id,
      }),
    });

    if (response.ok) {
      router.push("/register/profile-setup/get-started");
    } else {
      alert("Error creating profile. Username might be taken.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Artist Profile...</div>;

  return (
    <div className="w-full relative shadow-xl border-white border-2 shadow-white flex flex-col justify-center items-center h-[100dvh] bg-[url('https://static.vecteezy.com/system/resources/previews/006/595/713/non_2x/silhouettes-of-panoramic-mountains-view-landscape-vector.jpg')] bg-cover bg-center">
      <div className="z-20 flex justify-center h-[40em] max-w-[60em] w-full rounded-md overflow-hidden">
        
        {/* Left Side Branding */}
        <div className="hidden md:block w-1/2 bg-cover p-8 pt-24 leading-6" style={{backgroundImage: `url(../form-background.jpg)`}}>
          <h1 className="text-5xl text-white text-start font-bold leading-[1.2em]">JOIN THE <br />FUTURE OF <br /> ART & <br />CREATIVITY</h1>
          <p className="text-lg text-white text-start mt-8 leading-[2em] pr-8">
            Showcase your talent and connect with fellow artists.
          </p>
        </div>

        {/* Right Side Form */}
        <div className="w-1/2 bg-white py-10 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7 p-10">
            <h5 className="text-3xl font-bold ">Help us personalize your experience</h5>

            {/* Combined Full Name Input */}
            <div>
              <label className="block text-gray-900 font-semibold mb-2">Display Name (Full Name)</label>
              <input 
                required
                className="border border-cyan-500 p-3 w-full rounded-lg outline-none text-black" 
                type="text" 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Enter your full name" 
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2">Username</label>
              <input 
                required
                className="border border-cyan-500 p-3 w-full rounded-lg text-black outline-none" 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="e.g. @art_master" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Gender</label>
                <select 
                  className="border border-cyan-500 p-3 w-full rounded-lg text-black outline-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-2">Birth Date</label>
                <input 
                  className="border border-cyan-500 p-3 rounded-lg text-black outline-none w-full" 
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                />
              </div>
            </div>

            <button className="border p-5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition" type="submit">
              Continue to Gallery
            </button>
          </form>
        </div>
      </div>

      <div className="absolute top-12 left-12">
        <Logo />
      </div>
    </div>
  );
};

export default ProfileSetup;