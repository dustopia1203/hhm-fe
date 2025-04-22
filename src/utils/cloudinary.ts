import axios from "axios";

async function uploadFile(file: File): Promise<string> {
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_REACT_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_REACT_CLOUDINARY_UPLOAD_PRESET;

  try {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file');
  }
}

export default uploadFile;
