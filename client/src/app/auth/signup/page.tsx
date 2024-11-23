// 'use client'
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// export default function Signup() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [userType, setUserType] = useState("candidate");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     const signupData = {
//       fullName,
//       email,
//       userType,
//       username,
//       password,
//     };

//     console.log("Signup data:", signupData);
//     // Perform API call or further signup logic here
//     alert("Signup successful!");
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-2">
//       <div className="w-full max-w-md space-y-2">
//         <div className="flex flex-col items-center space-y-2">
//           <div className="relative h-24 w-24">
//             <Image
//               src="/drdoLogo.png"
//               alt="Recruitment Portal Logo"
//               width={96}
//               height={96}
//               className="rounded-lg p-2"
//             />
//           </div>
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-[#002B5B]">Signup to the</h1>
//             <h2 className="text-2xl font-bold tracking-tight text-[#002B5B]">Recruitment Portal</h2>
//           </div>
//         </div>

//         <form className="space-y-2" onSubmit={handleSubmit}>
//           <div className="space-y-2">
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               id="fullName"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//               type="text"
//               className="border-gray-200"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address</Label>
//             <Input
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               type="email"
//               className="border-gray-200"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-base">User Type</Label>
//             <RadioGroup
//               value={userType}
//               onValueChange={(value) => setUserType(value)}
//               className="flex gap-4"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="candidate" id="candidate" />
//                 <Label htmlFor="candidate">Candidate</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="employer" id="employer" />
//                 <Label htmlFor="employer">Employer</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               type="text"
//               className="border-gray-200"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               type="password"
//               className="border-gray-200"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <Input
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               type="password"
//               className="border-gray-200"
//             />
//           </div>

//           <Button
//             className="w-full bg-[#002B5B] text-white hover:bg-[#003875]"
//             size="lg"
//             type="submit"
//           >
//             Signup
//           </Button>

//           <div className="text-center">
//             <Link
//               href="/auth/signin"
//               className="text-sm text-blue-500 hover:text-blue-600"
//             >
//               Already have an account? SignIn
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(18, {
    message: "You must be at least 18 years old.",
  }).max(100, {
    message: "Age must be less than 100.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
  role: z.enum(["admin", "interviewer", "candidate"], {
    required_error: "Please select a role.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function Signup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      age: undefined,
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Here you would typically send the form data to your backend
    console.log(values)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard-candidate")
    }, 3000)
  }

  return (
    <div className="container mx-auto p-2">



      <Card className="max-w-lg mx-auto">
     
        <CardHeader>
          <CardTitle className="text-lg">Sign Up for <span className="font-bold text-blue-500">DRDO Interview </span>
          <a href="/" className="ml-[200px] text-sm hover:cursor-pointer hover:text-blue-500">Home</a>
        
          </CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your age"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="interviewer">Interviewer</SelectItem>
                        <SelectItem value="candidate">Candidate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose your role in the DRDO interview process
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/auth/signin" className=" text-blue-500  hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


