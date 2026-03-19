import LogInForm from '@/components/login-form';
import { getSession } from "@/lib/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataGrid } from "@/components/data-grid";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {!session && (
        <Card className='w-xl max-w-lg mx-auto mt-12'>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <LogInForm />
          </CardContent>
        </Card>
      )}

      {session && (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <DataGrid />
        </div>
      )}
    </main>
  );
}
