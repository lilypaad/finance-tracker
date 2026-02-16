"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export default function LogoutButton() {
  async function logoutOnClick() {
    await logout();
  }

  return (
    <Button
      type="submit"
      onClick={logoutOnClick}
      size="sm"
      variant="outline"
      className="w-full lg:w-auto justify-between font-normal bg-transparent hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
    >
        Log Out
    </Button>
  );
}