import Hero from "../components/Homesections/Hero";
import WhyUs from "../components/Homesections/WhyUs";
import Brands from "../components/Homesections/Brands";
import About from "../components/Homesections/About";
import Faq from "../components/Homesections/Faq";
import Process from "../components/Homesections/Process";
import Testimonials from "../components/Homesections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Process />
      <Faq />
      <Brands />
      <Testimonials />
    </>
  );
}
