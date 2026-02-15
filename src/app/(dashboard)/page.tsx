import { Button } from "@/components/ui/button";
import LogInForm from '@/components/login-form';
import { getSession } from "@/lib/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {!session && 
      <Card className='w-xl max-w-lg mx-auto mt-12'>
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <LogInForm />
        </CardContent>
      </Card>
      }

      {session && 
      <pre>{ JSON.stringify(session, null, 2) }</pre>
      }
    </main>
  );
}
