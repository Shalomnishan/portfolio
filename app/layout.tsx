import type { Metadata, Viewport } from "next";
import { Anton, Caveat_Brush, Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const caveat = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — AI & Data Science Student`,
  description: profile.bio,
  openGraph: {
    title: `${profile.name} — AI & Data Science Student`,
    description: profile.bio,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Decides whether the build agents are on and adds
 * the build-mode class so unbuilt content never flashes.
 *   ?agents=on  forces the animation (even with reduced motion)
 *   ?agents=off disables it
 *   otherwise: saved choice in localStorage, else on unless reduced motion
 */
const bootScript = `(function(){var d=document.documentElement,w=window;try{var q=new URLSearchParams(location.search).get('agents'),s=null,t=false;try{s=localStorage.getItem('agents');t=sessionStorage.getItem('tour')==='1';if(t)sessionStorage.removeItem('tour')}catch(e){}var rm=w.matchMedia('(prefers-reduced-motion: reduce)').matches;var on=q==='on'?true:q==='off'?false:s==='on'?true:s==='off'?false:(t||!rm);w.__agents=on;w.__tour=t;if(t){try{history.scrollRestoration='manual'}catch(e){}}if(on){d.classList.add('build-mode');setTimeout(function(){if(!w.__agentsReady){d.classList.remove('build-mode')}},8000)}else if(rm){d.classList.add('rm')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
