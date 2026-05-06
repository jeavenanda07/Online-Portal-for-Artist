export const uploadMedia = async (file: File, userId: string): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData, 
  });

  if (!res.ok) {
    const data = await res.json();
    console.error("Upload failed:", data.message);
    return null;
  }

  const data = await res.json();
  return data.url;
};