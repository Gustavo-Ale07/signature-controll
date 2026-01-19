import { SignUp } from '@clerk/clerk-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <SignUp routing="path" path="/register" signInUrl="/login" />
      </div>
    </div>
  );
}
