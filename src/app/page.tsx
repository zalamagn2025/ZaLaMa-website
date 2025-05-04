
import { CallToAction } from "@/components/sections/Home/CallToAction";
import { Footer } from "@/components/layout/Footer";
import HomeStepper from "@/components/sections/Home/HomeStepper";
import FAQ from "@/components/sections/Home/FAQ";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Home/Hero";

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
