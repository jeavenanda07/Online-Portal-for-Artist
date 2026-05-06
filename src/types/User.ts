export interface User {
    userId: string;
    name: string;
    joinedOn: Date;
    soldArts: number;
    followers: number;
    accountStatus: string
}

export interface artList {
    id: number;
    src: string;
    alt: string;
    user: string;
    avatar: string;
}

// For Artwork
export interface artwork  {
  artwork_id: string;
  user_profile_id: string;
  cover_photo: string;
  art_file: string;
  artwork_title: string;
  description: string;
  artwork_type: string;
  tags: string[];
  status: string;
  price: number;
  stocks: number;
  sold: number;
  gallery_id: string | null;
  likes_count: number;
  views: number;
  created_at: string;
  updated_at: string;
  artist_avatar: string;
};


//For violations history
interface userProfile {
  gmail: string;
  profile_icon: string;
  name: string;
}

type ViolationType = "Artwork Violation" | "User Conduct Violation";

type ActionTaken = "Warning" | "Temporary Suspension" | "Permanent Ban" | "Cleared";

interface ViolationHistoryEntry {
  HISTORY_ID: string;
  USER_ID: string;
  reported_user: userProfile;
  reported_by: userProfile;
  VIOLATION_TYPE: ViolationType;
  VIOLATION_LOG_ID: string;
  ACTION_TAKEN: ActionTaken;
  Duration: string;
  NOTES: string;
  DATE_ISSUED: string;
  EXPIRATION: string | null;
}

type ViolationHistory = ViolationHistoryEntry[];


export interface CommissionRequest {
  CommissionId: string;
  UserProfileId: string;
  IdOfCommissionTo: string;
  commissionToProfile: {
    name: string;
    clientName: string;
  };
  References: string[];
  Title: string;
  Description?: string;
  ArtType: string;
  Deadline: string;
  Tags: string[];
  Budget: number;
  Status: string;
  CreatedAt: string;
}


// USER PROFILE
// Address (used for home & shipping)
export interface Address {
  country: string;
  street?: string;
  street_address?: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
}

// Contact info
export interface Contact {
  gmail: string;
  phoneNumber: string;
}

// Shipping Address
export interface ShippingAddress {
  shipping_id: string;
  user_profile_id: string;
  country: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
}

// Main User Profile
export interface UserProfile {
  user_profile_id: string;
  credentials_id: string;
  full_name: string;
  username: string;
  avatar_pic?: string | null;
  background_cover?: string | null;
  specialization?: string | null;
  gender: "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY" | string;
  is_open_for_hire: boolean;
  birthdate?: string | null; // ISO string when serialized from backend
  contact?: string | null;
  about_me?: string | null;
  social_links?: any; // Represents the Prisma Json type
  display_location?: string | null;
  updated_at: string | Date;
}


