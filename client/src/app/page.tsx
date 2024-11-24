import { Navbar } from "@/components/home/navbar"
import { Button } from "@/components/ui/button"
import { Features } from "@/components/home/features"
import { Testimonials } from "@/components/home/testimonials"
import { DemoVideo } from "@/components/home/demo-video"
import { Sidebar } from "@/components/home/sidebar"
import { Footer } from "@/components/home/footer"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <section className="mb-12">
                <h1 className="text-4xl font-bold mb-4">AI-Powered Interviews for <span className="text-blue-500">DRDO</span></h1>
                <p className="text-xl mb-6">
                  Revolutionize your recruitment process with our cutting-edge virtual boardroom and AI-assisted interview platform.
                </p>
                <div className="space-x-4">
                  
                 <a href="/auth/signup"> <Button size="lg" >
                    Get Started
                  </Button> </a>
                  <Button size="lg" variant="outline">
                    Terms & Conditions
                  </Button>
                </div>
              </section>
              <Features />
              <Testimonials />
              <DemoVideo />
            </div>
            <aside className="md:w-1/4">
              <Sidebar />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}