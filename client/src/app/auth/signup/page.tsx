'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("candidate");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const signupData = {
      fullName,
      email,
      userType,
      username,
      password,
    };

    console.log("Signup data:", signupData);
    // Perform API call or further signup logic here
    alert("Signup successful!");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-2">
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative h-24 w-24">
            <Image
              src="/drdoLogo.png"
              alt="Recruitment Portal Logo"
              width={96}
              height={96}
              className="rounded-lg p-2"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#002B5B]">Signup to the</h1>
            <h2 className="text-2xl font-bold tracking-tight text-[#002B5B]">Recruitment Portal</h2>
          </div>
        </div>

        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              type="text"
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">User Type</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value)}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              type="text"
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              type="password"
              className="border-gray-200"
            />
          </div>

          <Button
            className="w-full bg-[#002B5B] text-white hover:bg-[#003875]"
            size="lg"
            type="submit"
          >
            Signup
          </Button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Already have an account? SignIn
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
