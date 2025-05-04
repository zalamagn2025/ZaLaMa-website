import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Testimonial } from "@/components/sections/Testimonial";
import { HomeFeature } from "@/components/sections/HomeFeature";
import { CallToAction } from "@/components/sections/CallToAction";
import { Footer } from "@/components/layout/Footer";
import HomeStepper from "@/components/sections/HomeStepper";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <HomeStepper/>
      <CallToAction/>
      <FAQ/>
      <Footer/>
    </div>
    
  );
}
