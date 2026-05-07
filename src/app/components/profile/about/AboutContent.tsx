'use client';

import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  Pencil, Save, Loader2, Plus, X,
  Facebook, Instagram, Twitter, Send,
  ChevronDown, MapPin, Phone, User
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { notify } from "@/utils/toastHelper";

const PRESET_SKILLS = [
  "UI/UX Design", "Front-end Development", "React", "Next.js",
  "Figma", "TypeScript", "Tailwind CSS", "Digital Art", "Illustration",
];

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];
export default function AboutContent() {
  const params = useParams();
  const router = useRouter();
  const profileId = (params?.id as string)?.replace(/^@/, "");
  const { userDetails, loading: userLoading } = useUserData();
  const isMyAccount =
    !!userDetails?.username &&
    userDetails.username.replace(/^@/, "") === profileId;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    user_profile_id: "",
    full_name: "",
    username: "",
    gender: "PREFER_NOT_TO_SAY",
    birthdate: "",
    contact: "",
    about_me: "",
    specialization: "",
    display_location: "",
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
      telegram: "",
    },
    skills: [] as string[],
  });

  

useEffect(() => {
    if (userDetails && !userLoading && isMyAccount) {
      const socials = (userDetails.social_links as any) || {};
      setFormData((prev) => ({
        ...prev,
        user_profile_id: userDetails.user_profile_id || "",
        full_name: userDetails.full_name || "",
        username: userDetails.username?.replace(/^@/, "") || "",
        gender: userDetails.gender || "PREFER_NOT_TO_SAY",
        birthdate: userDetails.birthdate ? new Date(userDetails.birthdate).toISOString().split("T")[0] : "",
        contact: userDetails.contact || "",
        about_me: userDetails.about_me || "",
        specialization: userDetails.specialization || "",
        display_location: userDetails.display_location || "",
        social_links: {
          facebook: socials.facebook || "",
          instagram: socials.instagram || "",
          twitter: socials.twitter || "",
          telegram: socials.telegram || "",
        },
        skills: Array.isArray(socials.skills) ? socials.skills : [],
      }));
      setFetchLoading(false); // Stop loading if it's our own account
    }
  }, [userDetails, userLoading, isMyAccount]);
  
  // 2. Fetch from API (If it's NOT my account, or as a backup)
  useEffect(() => {
    // If it's my account, we already got data from useUserData, 
    // but we fetch anyway to ensure we have the latest DB state.
    if (!profileId) return;
  
    const fetchProfile = async () => {
      // Only set loading if we don't have data yet
      if (!formData.user_profile_id) setFetchLoading(true);
      
      try {
        // BUG FIX: Changed 'isMyAccount' (boolean) to 'profileId' (string)
        const res = await fetch(`/api/profile/get?username=${profileId}`);
        if (!res.ok) throw new Error("Profile not found");
        
        const data = await res.json();
        const p = data.profile;
        if (!p) return;
  
        const socials = (p.social_links as any) || {};
  
        setFormData({
          user_profile_id: p.user_profile_id,
          full_name: p.full_name || "",
          username: p.username?.replace(/^@/, "") || "",
          gender: p.gender || "PREFER_NOT_TO_SAY",
          birthdate: p.birthdate ? new Date(p.birthdate).toISOString().split("T")[0] : "",
          contact: p.contact || "",
          about_me: p.about_me || "",
          specialization: p.specialization || "",
          display_location: p.display_location || "",
          social_links: {
            facebook: socials.facebook || "",
            instagram: socials.instagram || "",
            twitter: socials.twitter || "",
            telegram: socials.telegram || "",
          },
          skills: Array.isArray(socials.skills) ? socials.skills : [],
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetchLoading(false);
      }
    };
  
    fetchProfile();
  }, [profileId]); // Trigger when the URL username changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value },
    }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
  };

  const handleSave = async () => {
    if (!isMyAccount) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, 
          username: `@${formData.username.replace(/^@/, "")}`,
          social_links: {
            facebook: formData.social_links.facebook,
            instagram: formData.social_links.instagram,
            twitter: formData.social_links.twitter,
            telegram: formData.social_links.telegram,
          },
          skills: formData.skills, 
        }),
      });
  
      const data = await res.json();

      if (!res.ok) {
        notify(data.message || "Update failed.", "error");
        return;
      }

      notify("Profile updated successfully!", "success");

      // If username changed, redirect to new profile URL
      const newUsername = formData.username.replace(/^@/, "");
      if (newUsername !== profileId) {
        router.push(`/profile/${newUsername}/about`);
      }

    } catch (err) {
      console.error("Save error:", err);
      notify("Network error. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || userLoading) {
    return (
      <div className="w-full xl:max-w-[1200px] mx-auto pb-20 px-4 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-primary border border-primary-line rounded-[3.5rem] p-10 animate-pulse h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full xl:max-w-[1200px] mx-auto pb-20 px-4">

      {/* Header */}
      <div className="flex -mt-8 items-center justify-between mb-12 sticky top-24 z-10 p-4 rounded-2xl backdrop-blur-xl bg-primary/40 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {isMyAccount ? "Profile Settings" : `${formData.full_name}'s Profile`}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-50">
            {isMyAccount ? "Configure your Studio presence" : "Viewing profile"}
          </p>
        </div>

        {isMyAccount && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-3 bg-green-400 hover:bg-green-500 text-black px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      <div className="grid gap-10">

        {/* Basic Information */}
        <SectionWrapper title="Basic Information" id="basic-information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} disabled={!isMyAccount} />
            <InputGroup label="Username" name="username" value={formData.username} disabled onChange={handleChange}/>
            <InputGroup label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Digital Artist, Illustrator" disabled={!isMyAccount} />

            <div className="flex flex-col gap-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 group-focus-within:text-green-400 transition-colors">
                Gender
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isMyAccount}
                  className="w-full bg-secondary border border-white/5 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-green-400/30 transition-all appearance-none cursor-pointer disabled:opacity-60"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <InputGroup label="Birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} disabled={!isMyAccount} />
          </div>
        </SectionWrapper>

        {/* Address */}
        <SectionWrapper title="Address" id="address">
          <InputGroup label="Display Location" name="display_location" value={formData.display_location} onChange={handleChange} placeholder="e.g. Atimonan, Quezon, Philippines" disabled={!isMyAccount} />
        </SectionWrapper>

        {/* Contact */}
        <SectionWrapper title="Contact" id="contact">
          <InputGroup label="Phone / Contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="09XXXXXXXXX" disabled={!isMyAccount} />
        </SectionWrapper>

        {/* About Me */}
        <SectionWrapper title="About Me" id="about-me">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2">
              Bio / Description
            </label>
            <textarea
              name="about_me"
              value={formData.about_me}
              onChange={handleChange}
              disabled={!isMyAccount}
              placeholder={isMyAccount ? "Tell the community about your work..." : "No bio yet."}
              className="bg-secondary border border-white/5 rounded-[2.5rem] p-8 text-sm focus:outline-none focus:border-green-400/30 min-h-[200px] transition-all resize-none placeholder:text-zinc-700 disabled:opacity-60"
            />
          </div>
        </SectionWrapper>

        {/* Social Links */}
        <SectionWrapper title="Link Accounts" id="link-accounts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SocialInput icon={<Facebook size={18} />} label="Facebook" name="facebook" value={formData.social_links.facebook} onChange={handleSocialChange} placeholder="facebook.com/username" disabled={!isMyAccount} />
            <SocialInput icon={<Instagram size={18} />} label="Instagram" name="instagram" value={formData.social_links.instagram} onChange={handleSocialChange} placeholder="@username" disabled={!isMyAccount} />
            <SocialInput icon={<Twitter size={18} />} label="Twitter / X" name="twitter" value={formData.social_links.twitter} onChange={handleSocialChange} placeholder="@username" disabled={!isMyAccount} />
            <SocialInput icon={<Send size={18} />} label="Telegram" name="telegram" value={formData.social_links.telegram} onChange={handleSocialChange} placeholder="@username" disabled={!isMyAccount} />
          </div>
        </SectionWrapper>

        {/* Skills */}
        <SectionWrapper title="Skills / Creative Tags" id="skills">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              {formData.skills.length === 0 && (
                <p className="text-xs opacity-40">{isMyAccount ? "No skills added yet." : "No skills listed."}</p>
              )}
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                >
                  {skill}
                  {isMyAccount && (
                    <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add skill input — only for owner */}
            {isMyAccount && (
              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-4 block group-focus-within:text-green-400 transition-colors">
                  Add New Skill
                </label>
                <div className="flex gap-4">
                  <input
                    list="skill-options"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type and press Enter (e.g. Branding)"
                    className="flex-1 bg-secondary border border-white/5 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-green-400/30 transition-all placeholder:text-zinc-700"
                  />
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="p-5 bg-primary border border-white/5 rounded-full hover:bg-green-400 hover:text-black transition-all flex items-center justify-center"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <datalist id="skill-options">
                  {PRESET_SKILLS.map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>
            )}
          </div>
        </SectionWrapper>

      </div>
    </div>
  );
}

// ── Reusable helpers ──────────────────────────────────────────

const SectionWrapper = ({ children, title, id }: any) => (
  <div id={id} className="bg-primary border border-primary-line rounded-[3.5rem] p-10 md:p-16 transition-all hover:border-white/10 group/section">
    <div className="flex items-center mb-14 gap-8">
      <h3 className="text-xl font-black uppercase tracking-[0.2em]">{title}</h3>
      <div className="h-[1px] flex-1 bg-primary group-hover/section:bg-white/10 transition-colors" />
      <div className="p-3 rounded-full bg-primary group-hover/section:text-green-400 transition-colors">
        <Pencil size={18} />
      </div>
    </div>
    {children}
  </div>
);

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text", disabled }: any) => (
  <div className="flex flex-col gap-3 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 group-focus-within:text-green-400 transition-colors">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="off"
      className="bg-secondary border border-white/5 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-green-400/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

const SocialInput = ({ icon, label, name, value, onChange, placeholder, disabled }: any) => (
  <div className="flex flex-col gap-3 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 group-focus-within:text-green-400 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors">
        {icon}
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-secondary border border-white/5 rounded-full pl-16 pr-8 py-5 text-sm focus:outline-none focus:border-green-400/30 transition-all placeholder:text-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);