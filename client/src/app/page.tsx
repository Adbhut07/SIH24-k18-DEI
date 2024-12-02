import NeonBackground from "@/components/home/NeonBackground";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import UseCases from "@/components/home/UseCases";
import CallToAction from "@/components/home/CallToAction";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white  relative">
      {/* <NeonBackground /> */}
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Testimonials />
        <UseCases />
        <CallToAction />
        <FAQ />
        <Footer />
      </main>
      
    </div>
  );
}
