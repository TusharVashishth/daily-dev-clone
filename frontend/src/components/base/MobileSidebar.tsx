"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarLinks from "./SidebarLinks";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Menu className="lg:hidden cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left">
        <SidebarLinks />
      </SheetContent>
    </Sheet>
  );
}
