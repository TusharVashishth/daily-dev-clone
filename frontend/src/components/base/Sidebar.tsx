"use client";

import React from "react";

import SidebarLinks from "./SidebarLinks";

export default function Sidebar() {
  return (
    <div className="hidden lg:block border-r w-[260px] p-4">
      <SidebarLinks />
    </div>
  );
}
