import { getSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


import SignupForm from "@/components/signup-form";
import { redirect } from "next/navigation";
import { HeaderLogo } from "@/components/header-logo";

export default async function SignUpPage() {
  const session = await getSession();
  
  if(session) {
    redirect("/");
  }

  return (
    <>
    <header className="bg-linear-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
          </div>
        </div>
      </div>
    </header>
    <main className="flex h-full flex-col items-center justify-center">
      <Card className='w-xl max-w-lg mx-auto mt-12'>
        <CardHeader>
          <CardTitle className="font-semibold text-xl">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </main>
    </>
  )
}