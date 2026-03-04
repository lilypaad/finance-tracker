import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import LogoutButton from "@/components/logout-button";
import { getSession } from "@/lib/auth";

export async function Header() {
  const session = await getSession();

  return (
    <header className="bg-linear-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          {session && <LogoutButton />}
        </div>
      {session && (
          <h1 className="text-2xl lg:text-4xl text-white font-medium">
            Welcome back, {session.user.firstName}
          </h1>
      )}
      </div>
    </header>
  );
};