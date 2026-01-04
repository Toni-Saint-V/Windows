import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import PortfolioCarousel from "@/components/sections/PortfolioCarousel";
import Features from "@/components/sections/Features";
import Portfolio from "@/components/sections/Portfolio";
import Prices from "@/components/sections/Prices";
import Calculator from "@/components/sections/Calculator";
import MeasurementForm from "@/components/sections/MeasurementForm";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PortfolioCarousel />
        <Features />
        <Portfolio />
        <Prices />
        <Calculator />
        <MeasurementForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
