import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCtaBar } from "@/components/layout/StickyCtaBar";
import { ExitIntent } from "@/components/lead/ExitIntent";
import { Catalog } from "@/components/sections/Catalog";
import { Faq } from "@/components/sections/Faq";
import { FinalSection } from "@/components/sections/FinalSection";
import { Guarantees } from "@/components/sections/Guarantees";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problems } from "@/components/sections/Problems";
import { QuizSection } from "@/components/sections/QuizSection";
import { Reviews } from "@/components/sections/Reviews";
import { Savings } from "@/components/sections/Savings";
import { Steps } from "@/components/sections/Steps";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <HowItWorks />
        <Catalog />
        <Savings />
        <Steps />
        <QuizSection />
        <Guarantees />
        <Reviews />
        <Faq />
        <FinalSection />
      </main>
      <Footer />
      <StickyCtaBar />
      <ExitIntent />
    </>
  );
}
