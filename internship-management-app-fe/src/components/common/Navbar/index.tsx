import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import React, { useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { ExportDialog } from "@/components/Export/ExportDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import Notification from "@/components/Notification/NotificationBell";

const Navbar = () => {
  const { isOpen, toggle } = useSidebarStore();
  const [isOpenExport, setIsOpenExport] = useState(false);
  const { userDetails } = useAuthStore();

  return (
    <div className="sticky top-0 z-50 w-full bg-white backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold size={28} />}
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:inline-block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 transform -translate-y-01/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search interns, mentors, or plans..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpenExport(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Notification />

          <Avatar className="w-8 h-8">
            <AvatarImage src=""></AvatarImage>
            <AvatarFallback>{userDetails?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <ExportDialog
        isOpen={isOpenExport}
        onClose={() => setIsOpenExport(false)}
      />
    </div>
  );
};

export default Navbar;
