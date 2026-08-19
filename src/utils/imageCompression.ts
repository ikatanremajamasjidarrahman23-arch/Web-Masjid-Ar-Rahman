import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File, customMaxSizeMB?: number): Promise<File> => {
  // Hanya kompres jika file adalah gambar
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: customMaxSizeMB || 0.5, // 500KB default
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Convert Blob to File
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Kembalikan file asli jika gagal kompres
  }
};
