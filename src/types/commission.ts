import {UserProfile} from "./User"

export interface ImageRef {
    file: File;
    url: string;
}
  
export interface CommissionFormData {
    title: string;
    description: string;
    artType: string;
    deadline: string;
    budget: string;
  }

  export interface FinalCommissionData {
    title: string;
    description: string;
    artType: string;
    deadline: string;
    budget: string;
    shippingName?: string;
    shippingAddress?: string;
    shippingContact?: string;
    tags: string[];
    images: { file: File; url: string }[];   // blob previews for UI
    uploadedImageUrls: string[];              // ✅ real Supabase public URLs
    commissionTo: string;
    createdAt: string;
  }