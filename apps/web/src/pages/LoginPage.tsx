import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <SignIn routing="path" path="/login" signUpUrl="/register" />
      </div>
    </div>
  );
}
