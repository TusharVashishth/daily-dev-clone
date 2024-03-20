import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
export default function UserAvatar({ image }: { image?: string }) {
  return (
    <div>
      {image ? (
        <Image src={getImageUrl(image)} width={30} height={30} alt="user" />
      ) : (
        <Image src="/avatar.png" width={40} height={40} alt="logo" />
      )}
    </div>
  );
}
