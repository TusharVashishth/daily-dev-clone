import Image from "next/image";
import React from "react";
import SearchInput from "./SearchInput";
import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import ProfileMenu from "./ProfileMenu";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";

export default function Navbar({ user }: { user: CustomUser }) {
  return (
    <nav className="flex justify-between items-center p-2 border-b">
      <MobileSidebar />

      <Image src="/logo.svg" width={120} height={120} alt="logo" />
      <SearchInput />
      <div className="flex space-x-2 items-center">
        <Button size="icon" variant="secondary" className="rounded-lg">
          <BellIcon className="w-5 h-5" />
        </Button>
        <ProfileMenu user={user} />
      </div>
    </nav>
  );
}
