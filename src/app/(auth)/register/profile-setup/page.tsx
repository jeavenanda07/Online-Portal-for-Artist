"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { notify } from '@/utils/toastHelper';
import { createSession } from '@/app/actions/auth';
import Logo from '@/app/components/ui/Logo';

const ProfileSetup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    gender: "PREFER_NOT_TO_SAY",
    birthdate: "",
    avatar_pic: "",
  });

  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.email) {
        notify("Session expired", "error");
        router.push("/login");
        return;
      }
  
      try {
        const res = await fetch(`/api/auth/check-email?email=${user.email}`);
        const data = await res.json();
  
        if (data.exists) {
          notify("Account already exists. Please login instead.", "error");
  
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          notify("Please complete your profile setup", "info");
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        notify("Something went wrong", "error");
      }
    };
  
    checkUser();
  }, []);

  useEffect(() => {
    const initSetup = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await fetch('/api/auth/sync-user', {
          method: 'POST',
          body: JSON.stringify({ user_id: user.id, gmail: user.email }),
        });

        setFormData((prev) => ({
          ...prev,
          full_name: user.user_metadata?.full_name || "",
          username: user.user_metadata?.full_name ? `@${user.user_metadata.full_name.replace(/\s+/g, '_').toLowerCase()}` : "",
          avatar_pic: user.user_metadata?.avatar_url || "",
        }));
      }
      setLoading(false);
    };

    initSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Session expired");
    if (!formData.birthdate) return notify("Please enter your birthdate", "error");

    const response = await fetch('/api/profile/create', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        credentials_id: user.id,
        avatar_pic: formData.avatar_pic, // Ensure it gets sent over to create or update correctly
      }),
    });

    if (response.ok) {
      await createSession({
        email: user.email || "",
        role: "User",
      });

      notify("Profile created and session initialized!", "success");

      setTimeout(() => {
        router.push("/register/profile-setup/get-started");
      }, 1500);
    } else {
      notify("Error creating profile. Username might be taken.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white"> 
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen flex flex-col justify-center items-center bg-[url('https://static.vecteezy.com/system/resources/previews/006/595/713/non_2x/silhouettes-of-panoramic-mountains-view-landscape-vector.jpg')] bg-cover bg-center px-4">
      
      <div className="absolute top-12 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 z-30">
        <Logo />
      </div>

      <div className="z-20 flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* LEFT PANEL */}
        <div 
          className="hidden md:flex flex-col justify-center w-1/2 bg-cover p-12 text-white bg-black/40 backdrop-brightness-75" 
          style={{ backgroundImage: "url('/form-background.jpg')" }}
        >
          <h1 className="text-5xl font-bold leading-tight uppercase">
            Join the <br /> Future of <br /> Art & <br /> Creativity
          </h1>
          <p className="mt-8 text-lg opacity-90 leading-relaxed">
            Showcase your talent, connect with fellow artists, and open doors to opportunities. 
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-center text-black mb-2">Help us personalize your experience</h3>

            <div className="space-y-4">
              {/* Display Name Input */}
              <div>
                <label className="block text-zinc-800 font-semibold mb-2 text-sm">Display Name (Full Name)</label>
                <input 
                  required
                  className="w-full border border-zinc-200 p-4 rounded-xl text-black outline-none transition-all focus:border-blue-500" 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Enter your full name" 
                />
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-zinc-800 font-semibold mb-2 text-sm">Username</label>
                <input 
                  required
                  className="w-full border border-zinc-200 p-4 rounded-xl text-black outline-none transition-all focus:border-blue-500" 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g. @art_master" 
                />
              </div>

              {/* Gender and Birth Date Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-800 font-semibold mb-2 text-sm">Gender</label>
                  <select 
                    className="w-full border border-zinc-200 p-4 rounded-xl text-black outline-none transition-all focus:border-blue-500 bg-white"
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
                  <label className="block text-zinc-800 font-semibold mb-2 text-sm">Birth Date</label>
                  <input 
                    className="w-full border border-zinc-200 p-4 rounded-xl text-black outline-none transition-all focus:border-blue-500" 
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isPending}
              type="submit"
              className={`w-full p-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                isPending ? 'bg-zinc-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isPending ? "Creating Profile..." : "Continue to Gallery"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;