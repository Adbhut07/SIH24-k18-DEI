import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="text-2xl ml-4 font-bold">
          Skill Matrix
        </Link>
        <div className="space-x-4 mr-5">
          <Link href="#features" className="hover:underline">Features</Link>
          <Link href="#testimonials" className="hover:underline">Testimonials</Link>
          <Link href="#demo" className="hover:underline">Demo</Link>
          <Button variant="outline" className="hover:bg-blue-500 hover:text-white" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

