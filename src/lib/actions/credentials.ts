'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCredentials() {
    const supabase = await createClient();

    const { data: Credentials, error } = await supabase
        .from("Credentials")
        .select("user_id, gmail, Role"); // Use the actual column names from your DB
    
    if (error) {
        console.error(error);
        throw new Error(`Error fetching credentials: ${error.message}`);
    }

    return Credentials;
}

export async function seedCredentials() {
    const supabase = await createClient();
  
    // Removed 'id' so the database can auto-generate the BigInt
    const placeholderData = [
      { gmail: "admin@gmail.com", password: "Password@1234", role: "Admin", is_logged_in: false, is_remember: false },
      { gmail: "ethanrivera@gmail.com", password: "Ethanrivera@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "avalopez@gmail.com", password: "Avalopez@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "liamsantos@gmail.com", password: "Liamsantos@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "miatorres@gmail.com", password: "Miatorres@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "noahgarcia@gmail.com", password: "Noahgarcia@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "sophiadizon@gmail.com", password: "Sophiadizon@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "lucasmartinez@gmail.com", password: "Lucasmartinez@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "chloetan@gmail.com", password: "Chloetan@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "jacobcruz@gmail.com", password: "Jacobcruz@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "ellareyes@gmail.com", password: "Ellareyes@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "calebvargas@gmail.com", password: "Calebvargas@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "isabellanavarro@gmail.com", password: "Isabellanavarro@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "zanelim@gmail.com", password: "Zanelim@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "harperdelossantos@gmail.com", password: "Harperdelossantos@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "masonsoriano@gmail.com", password: "Masonsoriano@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "laylacastro@gmail.com", password: "Laylacastro@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "owencampos@gmail.com", password: "Owencampos@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "zaraaquino@gmail.com", password: "Zaraaquino@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "leoflores@gmail.com", password: "Leoflores@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "ariamendoza@gmail.com", password: "Ariamendoza@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "jaydenbautista@gmail.com", password: "Jaydenbautista@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "milagonzales@gmail.com", password: "Milagonzales@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "kaifuentes@gmail.com", password: "Kaifuentes@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "novaramos@gmail.com", password: "Novaramos@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "elijahmarquez@gmail.com", password: "Elijahmarquez@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "rileysalazar@gmail.com", password: "Rileysalazar@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "axelsantiago@gmail.com", password: "Axelsantiago@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "skyvaldez@gmail.com", password: "Skyvaldez@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "evanromero@gmail.com", password: "Evanromero@123", role: "User", is_logged_in: false, is_remember: false },
      { gmail: "taliapascual@gmail.com", password: "Taliapascual@123", role: "User", is_logged_in: false, is_remember: false }
    ];
  
    // Use .insert() instead of .upsert() since we are letting the system generate IDs
    const { data, error } = await supabase
      .from("Credentials")
      .insert(placeholderData); 
  
    if (error) {
      console.error("Bulk Insert Error:", error);
      throw new Error(error.message);
    }
  
    revalidatePath("/settings/account");
    return data;
}