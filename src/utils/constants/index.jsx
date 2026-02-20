export const Href = "#";
export const ImagePath = "/assets/images";
export const audioFile = "/assets/audio/multi-pop.mp3";
// Base URL to access uploaded files on the API/server.
// Use NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_STORAGE_URL if provided) so client requests go to the correct host.
export const storageURL =
  process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "";
