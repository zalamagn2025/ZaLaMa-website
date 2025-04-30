import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Testimonial } from "@/components/sections/Testimonial";
import { HomeFeature } from "@/components/sections/HomeFeature";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <HomeFeature/>
      <Testimonial/>
    </div>
    
  );
}
