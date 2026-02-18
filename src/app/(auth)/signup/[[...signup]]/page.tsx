import { getSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


import SignupForm from "@/components/signup-form";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getSession();
  
  if(session) {
    redirect("/");
  }

  return (
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
  )
}