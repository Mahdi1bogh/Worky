"use client";
import Image from "next/image";
import { ImCancelCircle } from "react-icons/im";
import { v4 as uuidv4 } from "uuid"; // Use UUID for unique naming
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChangeEvent } from "react";
import { createClient } from "@/supabase/supabaseClient";
import { toast } from "sonner";

const supabase = createClient();

const ImageUpload = () => {
  const { imageUrl, updateImageUrl } = useCreateWorkspaceValues();

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const avatarFile =
      event.target.files && event.target.files.length > 0
        ? event.target.files[0]
        : null;

    if (!avatarFile) {
      console.log("NO FILE");
      return;
    }

    const uniqueFileName = `workspaces/${uuidv4()}-${avatarFile.name}`;

    const { data, error } = await supabase.storage
      .from("worky_bucket")
      .upload(uniqueFileName, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error("Upload error. Please try again.");
    } else {
      toast.success("Image uploaded successfully");
      updateImageUrl(
        "https://ilmphwjiwgcagmhysfat.supabase.co/storage/v1/object/public/worky_bucket/" +
          data.path
      );
    }
  };

  if (imageUrl) {
    return (
      <div className="flex items-center justify-center h-32 w-32 relative">
        <Image
          src={imageUrl}
          className="object-cover w-full h-full rounded-md"
          alt="workspace"
          width={320}
          height={320}
        />
        <ImCancelCircle
          size={30}
          onClick={() => updateImageUrl("")}
          className="absolute cursor-pointer -right-2 -top-2 z-10 hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">workspace picture</Label>
      <Input onChange={(e) => handleImageUpload(e)} id="picture" type="file" />
    </div>
  );
};

export default ImageUpload;
