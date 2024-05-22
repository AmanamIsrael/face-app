"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (image: string) => void;
}

export const ImageUpload = (props: ImageUploadProps) => {
  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(null);
    const file = e.target.files;

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (file[0].size > 2 * 1024 * 1024) {
      toast.error("Image size exceeds 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setSelectedImage(result);

      props.onUpload(result);
    };

    reader.readAsDataURL(file[0]);
  };

  return (
    <div className="grid gap-4 mt-8">
      <input
        ref={uploadImageInputRef}
        className="hidden pointer-events-none"
        type="file"
        onChange={handleUploadImage}
      />

      {/* Image Preview */}
      <button
        type="button"
        onClick={() => uploadImageInputRef.current?.click()}
        className="w-full relative min-h-[300px] h-20 rounded-lg bg-transparent border">
        {selectedImage ? (
          <Image
            src={selectedImage}
            className="rounded-lg object-cover"
            alt="Image Preview"
            fill
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">Click to upload an image</span>
          </div>
        )}
      </button>
    </div>
  );
};
