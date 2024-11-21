import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginCard from "./LoginForm";

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

export function LoginForm() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <LoginCard />
      </Card>
    </div>
  );
}
