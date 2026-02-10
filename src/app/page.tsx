import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutPreview from "@/components/sections/AboutPreview";
import EventsPreview from "@/components/sections/EventsPreview";
import WhyIEEE from "@/components/sections/WhyIEEE";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutPreview />
      <WhyIEEE />
      <EventsPreview />
      <Footer />
    </main>
  );
}
