"use client";

import { Button } from "@/components/ui/button";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { LuRefreshCw, LuPencilLine } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { RiListCheck2, RiListSettingsLine } from "react-icons/ri";
import { FaHubspot } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { MdOutlineGroups } from "react-icons/md";
import { IoAtSharp } from "react-icons/io5";

export default function RightMainSidebar() {
  return (
    <div className="fixed top-14 right-0 w-16 h-[calc(100%-3.5rem)] bg-white flex flex-col items-center py-4 border-l border-gray-200 z-10">
      <div className="flex flex-col items-center flex-grow space-y-2">
        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Expand sidebar">
          <TbLayoutSidebarRightExpandFilled className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Refresh">
          <LuRefreshCw className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Edit">
          <LuPencilLine className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Paragraph">
          <BsTextParagraph className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Checklist">
          <RiListCheck2 className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Hubspot">
          <FaHubspot className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Groups">
          <MdOutlineGroups className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Mentions">
          <IoAtSharp className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Gallery">
          <GrGallery className="h-6 w-6 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="List settings">
          <RiListSettingsLine className="h-6 w-6 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
