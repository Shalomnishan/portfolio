import BuildAgents from "@/components/BuildAgents";
import { About, Contact, Hero, Record, Stack, Work } from "@/components/sections";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Work />
        <Stack />
        <Record />
        <About />
        <Contact />
      </main>
      <BuildAgents />
    </>
  );
}
