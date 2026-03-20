import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="/logo.svg" alt="Logo" height={32} width={32} />
        <p className="font-semibold text-white text-2xl ml-2 5">
          Budgie
        </p>
      </div>
    </Link>
  );
}