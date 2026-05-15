import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Database,
  Flag,
  HeartHandshake,
  LineChart,
  Mail,
  Map,
  MapPinned,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Vote,
  Zap,
} from 'lucide-react';

const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT ?? '';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Why us', href: '#why-us' },
  { label: 'States', href: '#states' },
  { label: 'Updates', href: '#updates' },
];

const proofPoints = [
  { value: '135%', label: 'more efficient turf cutting' },
  { value: '30', label: 'combined political cycles' },
  { value: '2', label: 'states supported today' },
];

const platformFeatures = [
  {
    icon: MapPinned,
    title: 'Cut turf faster',
    text: 'Open source, cutting-edge turf technology helps field teams make smarter walk packets and cover more ground.',
  },
  {
    icon: Database,
    title: 'Modern voter data',
    text: 'A canvassing and voter data system built for the high-tech world campaigns operate in now.',
  },
  {
    icon: BarChart3,
    title: 'Campaign-first reporting',
    text: 'Track field work clearly, learn what is happening quickly, and keep teams focused on winning.',
  },
];

const values = [
  'Built only for Democratic Party campaigns',
  'Made in America, by Americans, and 100% American-owned',
  'Run by people who love campaigns and care whether you win',
  'Product direction shaped by the campaigns using it',
];

const comparisons = [
  {
    label: 'Cost',
    runVoteWin: 'Built to be dramatically cheaper for serious campaigns',
    legacy: 'Expensive contracts that can crowd out field budget',
  },
  {
    label: 'Turf',
    runVoteWin: 'Open source cutting-edge turf technology with 135% more efficient turfs',
    legacy: 'Older workflows that slow down organizers',
  },
  {
    label: 'Product direction',
    runVoteWin: 'Users help decide what gets built next',
    legacy: 'Roadmaps set far from the campaigns doing the work',
  },
  {
    label: 'Ownership',
    runVoteWin: 'American-made and American-owned',
    legacy: 'Too often shaped by private equity incentives',
  },
];

const states = ['Texas', 'Virginia'];

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant bg-surface/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#" className="flex items-center gap-3 text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-sm">
            <Vote size={22} />
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight">RunVoteWin</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#updates"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container"
        >
          Get updates
          <ArrowRight size={16} />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero pt-32 text-primary md:pt-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 md:px-8 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/70 px-4 py-2 text-sm font-bold text-accent shadow-sm">
            <Flag size={16} />
            For Democratic campaigns ready to win
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary md:text-7xl">
            The modern voter data and canvassing system for campaigns that mean it.
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-on-surface-variant">
            RunVoteWin helps Democratic campaigns organize field programs, cut better turfs, and move faster. We love campaigns, and we actually care if they win.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#updates"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-4 font-display text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-primary-container"
            >
              Get campaign updates
              <ArrowRight size={20} />
            </a>
            <a
              href="#why-us"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-outline-variant bg-white/72 px-7 py-4 font-display text-lg font-bold text-primary transition hover:bg-white"
            >
              See why it is different
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="dashboard-shell overflow-hidden rounded-lg border border-outline-variant bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Map size={18} />
                Field Command
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                Live
              </div>
            </div>

            <div className="grid gap-4 p-4">
              <div className="relative h-72 overflow-hidden rounded-md border border-outline-variant bg-map">
                <div className="absolute left-[16%] top-[22%] h-24 w-28 rounded-md border-2 border-accent/70 bg-accent/12"></div>
                <div className="absolute right-[18%] top-[16%] h-28 w-24 rounded-md border-2 border-purple/70 bg-purple/12"></div>
                <div className="absolute bottom-[16%] left-[38%] h-28 w-32 rounded-md border-2 border-secondary/70 bg-secondary/12"></div>
                <div className="absolute left-[48%] top-[42%] flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <Users size={18} />
                </div>
                <div className="absolute bottom-4 left-4 rounded-md bg-white/94 p-4 shadow-lg">
                  <p className="text-xs font-bold uppercase text-on-surface-variant">Turf efficiency</p>
                  <p className="font-display text-4xl font-extrabold text-primary">135%</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {proofPoints.map((point) => (
                  <div key={point.label} className="rounded-md border border-outline-variant bg-surface-container-low p-4">
                    <p className="font-display text-3xl font-extrabold text-primary">{point.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase leading-5 text-on-surface-variant">{point.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Built for modern field work</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Better tools for the campaigns doing the hard work.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {platformFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-outline-variant bg-white p-7 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-primary">{feature.title}</h3>
                <p className="mt-4 leading-7 text-on-surface-variant">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why-us" className="bg-primary py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1fr] lg:items-start">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">Not legacy campaign software</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Way better and cheaper than NGP VAN.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-primary-container">
            RunVoteWin is not open source, but it uses open source cutting-edge turf technology where it matters most: helping campaigns build more efficient field programs.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/15 bg-white/7">
          {comparisons.map((row) => (
            <div key={row.label} className="grid gap-4 border-b border-white/12 p-5 last:border-b-0 md:grid-cols-[0.38fr_1fr_1fr]">
              <p className="font-display text-xl font-extrabold text-secondary-container">{row.label}</p>
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-secondary-container">RunVoteWin</p>
                <p className="leading-7 text-white">{row.runVoteWin}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-white/45">Legacy tools</p>
                <p className="leading-7 text-on-primary-container">{row.legacy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ownership() {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">American-owned campaign technology</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Made in America, by Americans, and owned 100% by Americans.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            No Saudi wealth fund. No foreign private equity. RunVoteWin is built by people who believe Democratic campaigns should have modern technology aligned with their mission.
          </p>
        </div>

        <div className="grid gap-4">
          {values.map((value) => (
            <div key={value} className="flex gap-4 rounded-lg border border-outline-variant bg-white p-5 shadow-sm">
              <CheckCircle2 className="mt-1 shrink-0 text-accent" size={22} />
              <p className="text-lg font-semibold leading-7 text-primary">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Direction() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div className="rounded-lg border border-outline-variant bg-surface p-7 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-on-surface-variant">Feature voting</p>
              <h3 className="font-display text-3xl font-extrabold text-primary">Next up</h3>
            </div>
            <Sparkles className="text-purple" size={28} />
          </div>

          {[
            ['Smarter turf balancing', '82%'],
            ['Volunteer shift health', '68%'],
            ['Persuasion universe builder', '55%'],
          ].map(([label, value]) => (
            <div key={label} className="mb-6 last:mb-0">
              <div className="mb-2 flex justify-between text-sm font-bold text-primary">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-container">
                <div className="h-full rounded-full bg-purple" style={{ width: value }}></div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Built with campaigns</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Users decide where the product goes next.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Campaigns using RunVoteWin help choose which features get added next. The roadmap is shaped by organizers, data directors, field directors, and campaign managers doing the work every day.
          </p>
        </div>
      </div>
    </section>
  );
}

function States() {
  return (
    <section id="states" className="bg-primary-container py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">Available now</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Supporting Democratic campaigns in Texas and Virginia.
            </h2>
          </div>
          <p className="text-lg leading-8 text-on-primary-container">
            More states are coming soon. We are expanding carefully so the product stays fast, reliable, and useful for the campaigns already depending on it.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {states.map((state) => (
            <div key={state} className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/8 p-7">
              <ShieldCheck className="text-secondary-container" size={30} />
              <div>
                <p className="font-display text-3xl font-extrabold">{state}</p>
                <p className="mt-1 text-sm font-semibold uppercase text-on-primary-container">Supported today</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'needs-endpoint' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signupEndpoint) {
      setStatus('needs-endpoint');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(signupEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'RunVoteWin landing page' }),
      });

      if (!response.ok) {
        throw new Error('Signup request failed');
      }

      setStatus('success');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="updates" className="bg-hero py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Get updates</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Follow the product as we add states and ship new campaign tools.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Drop your name and email and we will send updates when RunVoteWin expands, launches new features, or opens more campaign access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-outline-variant bg-white p-6 shadow-xl">
          <label className="mb-5 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <User size={16} />
              Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-base text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/12"
              placeholder="Jane Organizer"
              type="text"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <Mail size={16} />
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-base text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/12"
              placeholder="jane@campaign.org"
              type="email"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-lg font-extrabold text-white shadow-lg transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? 'Sending...' : 'Get updates'}
            <ArrowRight size={20} />
          </button>

          {status === 'needs-endpoint' && (
            <p className="mt-4 rounded-md bg-surface-container p-3 text-sm font-semibold leading-6 text-primary">
              Signup form is ready. Connect a Google Apps Script endpoint to send this to the spreadsheet.
            </p>
          )}
          {status === 'success' && (
            <p className="mt-4 rounded-md bg-secondary/10 p-3 text-sm font-semibold text-secondary">
              You are on the list.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
            <Vote size={22} />
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold">RunVoteWin</p>
            <p className="text-sm text-on-primary-container">Canvassing and voter data for Democratic campaigns.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-semibold text-on-primary-container">
          <span>Made in America</span>
          <span>American-owned</span>
          <span>Built to win</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Hero />
        <Platform />
        <WhyUs />
        <Ownership />
        <Direction />
        <States />
        <Signup />
      </main>
      <Footer />
    </div>
  );
}
