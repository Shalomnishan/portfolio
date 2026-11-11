import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpRight, Mail, MapPin } from "lucide-react";
import {
  about,
  interests,
  principles,
  profile,
  record,
  softSkills,
  stack,
  stats,
  work,
  type WorkItem,
} from "@/lib/data";
import CopyEmail from "./CopyEmail";

/* ---------- small shared pieces ---------- */

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-.95 1.82-1.95 3.75-1.95 4 0 4.74 2.5 4.74 5.75V21h-4v-5.2c0-1.24-.02-2.84-1.8-2.84-1.8 0-2.08 1.35-2.08 2.75V21h-4z" />
    </svg>
  );
}

function Stat({
  value,
  unit,
  label,
  align = "left",
}: {
  value: string;
  unit: string;
  label: string;
  align?: "left" | "right";
}) {
  return (
    <div data-build="pop" data-label="Stat" className={align === "right" ? "lg:text-right" : ""}>
      <dd className="font-display text-5xl leading-none text-zinc-50 sm:text-6xl">
        {value}
        {unit ? (
          <span className="ml-1.5 font-mono text-[11px] uppercase tracking-widest text-accent">
            {unit}
          </span>
        ) : null}
      </dd>
      <dt className="mt-2 font-mono text-[11px] uppercase leading-snug tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
    </div>
  );
}

function SectionHead({ n, label, title }: { n: string; label: string; title: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <p className="eyebrow w-fit" data-build="type" data-label="Label">
        {`${n} / ${label}`}
      </p>
      <h2 className="section-title mt-4 w-fit" data-build="wipe" data-label="Heading">
        {title}
      </h2>
    </div>
  );
}

const shell = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const sectionPad = "py-24 sm:py-32";

/* ---------- hero ---------- */

const nav = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#record", label: "Record" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <header className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white"
          data-build="type"
          data-label="Logo"
        >
          {profile.name}
        </a>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-1 sm:flex"
          data-build="pop"
          data-label="Nav"
        >
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav-link sm:hidden" data-build="pop" data-label="Nav">
          Contact
        </a>
      </header>

      {/* Giant metallic word behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[72px] z-0 flex justify-center lg:top-[8svh]"
      >
        <span className="hero-word" data-build="wipe" data-label="Display">
          PORTFOLIO
        </span>
      </div>

      {/* Portrait */}
      <div
        data-build="pop"
        data-label="Portrait"
        className="relative z-10 mx-auto mt-[15vw] h-[46svh] w-fit lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:h-[82svh] lg:-translate-x-1/2"
      >
        <div className="hero-glow" aria-hidden="true" />
        <Image
          src="/headshot.png"
          alt={`Portrait of ${profile.name}`}
          width={1157}
          height={1360}
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="hero-photo relative h-full w-auto max-w-[92vw] object-contain object-bottom lg:max-w-[46vw]"
        />
      </div>

      {/* Bottom fade into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-40 bg-gradient-to-t from-[#09090b] to-transparent lg:block"
      />

      <div className="relative z-20 -mt-12 grid gap-12 px-5 pb-28 sm:px-8 lg:mt-auto lg:grid-cols-2 lg:items-end lg:pb-16">
        <div className="max-w-md lg:max-w-[min(28rem,27vw)]">
          <p
            className="w-fit origin-left -rotate-3 font-brush text-3xl text-zinc-100 sm:text-4xl"
            data-build="type"
            data-label="Greeting"
          >
            Hello, I&apos;m
          </p>
          <h1
            className="mt-2 font-display text-[clamp(3.5rem,15vw,5.25rem)] uppercase leading-[0.92] text-zinc-50 lg:text-[clamp(3.75rem,6.4vw,7rem)]"
            data-build="type"
            data-label="Name"
          >
            {profile.name.split(" ")[0]}
            <br />
            {profile.name.split(" ").slice(1).join(" ")}
          </h1>
          <p
            className="mt-5 font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-accent"
            data-build="type"
            data-label="Role"
          >
            {profile.role}
          </p>
          <p
            className="mt-4 text-[15px] leading-relaxed text-zinc-400"
            data-build="type"
            data-label="Bio"
          >
            {profile.bio}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
            <a href="#work" className="btn btn-primary" data-build="pop" data-label="Button">
              View work
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <p
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400"
              data-build="pop"
              data-label="Location"
            >
              <MapPin size={14} className="text-accent" aria-hidden="true" />
              Based in {profile.city}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-5 lg:ml-auto lg:w-56 lg:grid-cols-1 lg:gap-9">
          {stats.map((s) => (
            <Stat key={s.label} {...s} align="right" />
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- work ---------- */

function WorkCard({ item, featured }: { item: WorkItem; featured?: boolean }) {
  return (
    <article
      data-build="pop"
      data-label="Card"
      className={`card flex flex-col p-6 sm:p-8 ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
        <span className="text-accent">{item.kind}</span>
        <span className="text-zinc-500">{item.meta}</span>
      </div>
      <h3
        className="mt-5 w-fit font-display text-3xl uppercase leading-none text-zinc-50 sm:text-4xl"
        data-build="type"
        data-label="Title"
      >
        {item.title}
      </h3>
      {item.org ? <p className="mt-2 text-sm text-zinc-400">{item.org}</p> : null}

      <ul className={`mt-6 grid gap-3 ${featured ? "lg:grid-cols-3 lg:gap-6" : ""}`}>
        {item.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-zinc-300">
            <span className="mt-[9px] size-1.5 shrink-0 bg-accent" aria-hidden="true" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-8">
        <ul className="flex flex-wrap gap-2">
          {item.chips.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
        {item.link ? (
          <a href={item.link.href} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <GitHubIcon />
            {item.link.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className={sectionPad}>
      <div className={shell}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow w-fit" data-build="type" data-label="Label">
              01 / Work
            </p>
            <h2 className="section-title mt-4 w-fit" data-build="wipe" data-label="Heading">
              Work that ships
            </h2>
          </div>
          <dl className="grid grid-cols-3 gap-5 sm:gap-10 lg:pb-3">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </dl>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-2">
          {work.map((item, i) => (
            <WorkCard key={item.title} item={item} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- stack ---------- */

function MarqueeRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden ? "true" : undefined}>
      {stack.map((s) => (
        <li key={s}>
          <span>{s}</span>
          <i aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export function Stack() {
  return (
    <section id="stack" className={`${sectionPad} border-y border-zinc-900`}>
      <div className={shell}>
        <SectionHead n="02" label="Stack" title="Tools I use" />
      </div>
      <div className="marquee" data-build="wipe" data-label="Marquee">
        <div className="marquee-track">
          <MarqueeRow />
          <MarqueeRow hidden />
        </div>
      </div>
    </section>
  );
}

/* ---------- record ---------- */

export function Record() {
  return (
    <section id="record" className={sectionPad}>
      <div className={`${shell} grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHead n="03" label="Record" title="The record" />
        </div>

        <div>
          {record.map((group) => (
            <div key={group.group}>
              <h3
                className="timeline-group w-fit"
                data-build="type"
                data-label="Group"
              >
                {group.group}
              </h3>
              <ol>
                {group.items.map((it) => (
                  <li
                    key={`${it.title}-${it.org}`}
                    className="timeline-item"
                    data-build="pop"
                    data-label="Entry"
                  >
                    <span className="timeline-dot" aria-hidden="true" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      {it.when}
                    </p>
                    <p className="mt-1.5 text-lg font-medium leading-snug text-zinc-100">
                      {it.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-zinc-400">{it.org}</p>
                    {it.note ? (
                      <p className="mt-3 inline-block border border-accent/40 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                        {it.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- about ---------- */

export function About() {
  return (
    <section id="about" className={`${sectionPad} border-t border-zinc-900`}>
      <div className={shell}>
        <SectionHead n="04" label="About" title="About me" />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {about.map((p, i) => (
              <p
                key={p}
                className={`text-lg leading-relaxed sm:text-xl ${i === 0 ? "text-zinc-100" : "mt-6 text-zinc-400"}`}
                data-build="type"
                data-label="Paragraph"
              >
                {p}
              </p>
            ))}
            <div className="mt-8 w-fit" data-build="pop" data-label="Interests">
              <p className="eyebrow">Interests</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {interests.map((x) => (
                  <li key={x} className="chip chip-accent">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow w-fit" data-build="type" data-label="Label">
              Soft skills
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {softSkills.map((x, i) => (
                <li key={x} className="card px-4 py-5" data-build="pop" data-label="Skill">
                  <span className="font-mono text-[11px] text-zinc-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-medium leading-snug text-zinc-100">{x}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20">
          <p className="eyebrow w-fit" data-build="type" data-label="Label">
            Principles I work by
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="card p-6" data-build="pop" data-label="Principle">
                <span className="font-display text-4xl leading-none text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-lg font-medium text-zinc-100">{p.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

export function Contact() {
  const links = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <Mail size={18} aria-hidden="true" />,
      external: false,
    },
    {
      label: "LinkedIn",
      value: profile.linkedinHandle,
      href: profile.linkedin,
      icon: <LinkedInIcon size={18} />,
      external: true,
    },
    {
      label: "GitHub",
      value: profile.githubHandle,
      href: profile.github,
      icon: <GitHubIcon size={18} />,
      external: true,
    },
  ];

  return (
    <section id="contact" className="border-t border-zinc-900 pt-24 sm:pt-32">
      <div className={shell}>
        <p className="eyebrow w-fit" data-build="type" data-label="Label">
          05 / Contact
        </p>

        <div className="cta mt-6 p-7 sm:p-12 lg:p-16" data-build="pop" data-label="CTA">
          <h2
            className="w-fit font-display text-[clamp(3.25rem,11vw,9rem)] uppercase leading-[0.92] text-zinc-50"
            data-build="wipe"
            data-label="Heading"
          >
            Let&apos;s build <span className="text-accent">something</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
            Got an idea, a project or a question? Send me an email.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              <Mail size={16} aria-hidden="true" />
              Email me
            </a>
            <CopyEmail email={profile.email} />
          </div>
        </div>

        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {links.map((l) => (
            <li key={l.label} data-build="pop" data-label="Link">
              <a
                href={l.href}
                className="contact-link"
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="flex size-10 shrink-0 items-center justify-center border border-zinc-800 text-zinc-200">
                  {l.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    {l.label}
                  </span>
                  <span className="mt-0.5 block break-all text-sm text-zinc-100">{l.value}</span>
                </span>
                <ArrowUpRight size={18} className="contact-arrow shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex flex-col gap-4 border-t border-zinc-900 pb-28 pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="w-fit" data-build="type" data-label="Footer">
            {`© ${new Date().getFullYear()} ${profile.name}`}
          </p>
          <p className="w-fit" data-build="type" data-label="Footer">
            {profile.location}
          </p>
          <a href="#top" className="nav-link -ml-3 w-fit sm:ml-0" data-build="pop" data-label="Link">
            Back to top
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
