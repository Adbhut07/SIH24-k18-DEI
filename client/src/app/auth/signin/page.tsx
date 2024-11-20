'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Signin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here (API call, etc.)
    console.log('Logging in with:', { username, password, userType });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-24 w-24">
            <Image
              src="/drdoLogo.png"
              alt="Recruitment Portal Logo"
              width={96}
              height={96}
              className="rounded-full border bg-white p-2 shadow-sm"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#002B5B]">Welcome to the</h1>
            <h2 className="text-2xl font-bold tracking-tight text-[#002B5B]">Recruitment Portal</h2>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-base">User Type</Label>





            <RadioGroup
              defaultValue={userType}
             onValueChange={(value) => setUserType(value as 'candidate' | 'employer')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidate" id="candidate" />
                <Label htmlFor="candidate">Candidate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-200"
            />
          </div>

          <Button
            className="w-full bg-[#002B5B] text-white hover:bg-[#003875]"
            size="lg"
            type="submit"
          >
            Login
          </Button>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              New account? Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
