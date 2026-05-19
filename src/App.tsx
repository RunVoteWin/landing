import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Flag,
  HeartHandshake,
  Mail,
  Map,
  MapPinned,
  RadioTower,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
  Vote,
} from 'lucide-react';

const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT ?? '';
const appUrl = 'https://app.runvotewin.com';
const docsUrl = 'https://docs.runvotewin.com';

type SignupFormVariant = 'hero' | 'compact';

type PricingOption = {
  id: string;
  label: string;
  description: string;
  price: number;
};

type RoleOption = {
  id: string;
  label: string;
};

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Compare', href: '#compare' },
  { label: 'Docs', href: docsUrl },
];

const testimonialQuote =
  "After I ran for Congress, I realized how far behind Democratic campaigns were on knowing our voters. I needed RunVoteWin's modern Voter CRM and Canvassing Suite to spend our funding more effectively than any other campaign. It's ages ahead of any other product and is built by Americans.";

const proofPoints = [
  { value: '135%', label: 'more efficient turf cutting' },
  { value: '30', label: 'combined political cycles' },
  { value: 'TX + VA', label: 'supported today' },
];

const platformFeatures = [
  {
    icon: MapPinned,
    title: 'Intelligent turf cutting',
    text: 'Cut walkable, balanced turfs with modern geospatial tools designed to help field teams cover more ground with less rework.',
  },
  {
    icon: Database,
    title: 'Campaign-ready voter data',
    text: 'Bring voter records, canvass results, tags, and universes into a workspace your team can understand without weeks of training.',
  },
  {
    icon: BarChart3,
    title: 'Readable field reporting',
    text: 'Give managers and candidates a clear view of contacts, turf progress, volunteer activity, and what needs attention next.',
  },
];

const campaignOptions: PricingOption[] = [
  {
    id: 'local',
    label: 'Local / county',
    description: 'Municipal, school board, countywide, and targeted local programs.',
    price: 249,
  },
  {
    id: 'legislative',
    label: 'State legislative',
    description: 'State house, senate, and district-level campaigns with serious field plans.',
    price: 599,
  },
  {
    id: 'congressional',
    label: 'Congressional',
    description: 'U.S. House campaigns that need professional field and voter contact infrastructure.',
    price: 1250,
  },
  {
    id: 'coordinated',
    label: 'Coordinated or IE',
    description: 'Multi-district programs, committees, and independent expenditure operations.',
    price: 2500,
  },
];

const roleOptions: RoleOption[] = [
  { id: 'candidate', label: 'Candidate' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'staff', label: 'Campaign staff' },
];

const integrations = [
  {
    icon: Database,
    name: 'NGP VAN',
    text: 'Import voter-file exports, canvass targets, IDs, tags, and contact history into RunVoteWin workflows.',
  },
  {
    icon: Users,
    name: 'Mobilize',
    text: 'Coordinate volunteer lists and event participation data with the rest of your field operation.',
  },
  {
    icon: FileSpreadsheet,
    name: 'Excel',
    text: 'Upload spreadsheets, normalize columns, and turn messy campaign lists into usable universes.',
  },
  {
    icon: RadioTower,
    name: 'ISP',
    text: 'Bring ISP data into the campaign workspace so targeting and reporting stay connected.',
  },
  {
    icon: HeartHandshake,
    name: 'ActBlue',
    text: 'Use supporter and fundraising exports to inform organizing, follow-up, and constituency work.',
  },
];

const comparisonRows = [
  {
    label: 'Ownership',
    runVoteWin: 'Made in America, by Americans, and 100% American-owned.',
    ngp: 'Private-equity ownership with foreign sovereign fund exposure reported in the ownership chain.',
  },
  {
    label: 'Pricing',
    runVoteWin: 'Clear starting prices and an estimate before a sales call.',
    ngp: 'Pricing is often unclear until a campaign goes through a local-party or sales process.',
  },
  {
    label: 'Access',
    runVoteWin: 'Get started directly when your campaign is ready.',
    ngp: 'Access can depend on party approval, local committee timelines, or cycle-specific provisioning.',
  },
  {
    label: 'Vote builder',
    runVoteWin: 'Interactive vote builder designed for fast universe planning and iteration.',
    ngp: 'Less interactive list-building experience for rapid field experimentation.',
  },
  {
    label: 'Turf cutter',
    runVoteWin: 'Intelligent turf cutter built with modern geospatial technology.',
    ngp: 'Traditional turf cutter with partial efficiency gains.',
  },
  {
    label: 'Continuity',
    runVoteWin: 'Keep your access, workspace, and data continuity across future campaigns.',
    ngp: 'Access and data continuity can reset or disappear between campaign cycles.',
  },
];

const states = ['Texas', 'Virginia'];

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function postLead(payload: Record<string, unknown>) {
  return fetch(signupEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      ...payload,
      submittedAt: new Date().toISOString(),
      page: window.location.href,
    }),
  });
}

function SignupForm({ variant }: { variant: SignupFormVariant }) {
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
      await postLead({ formType: 'updates', name, email, source: 'RunVoteWin landing page' });

      setStatus('success');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg border border-outline-variant bg-white p-5 shadow-xl ${isHero ? 'max-w-xl' : ''}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
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

        <label className="block">
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
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-lg font-extrabold text-white shadow-lg transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? 'Sending...' : 'Get campaign updates'}
        <ArrowRight size={20} />
      </button>

      {status === 'needs-endpoint' && (
        <p className="mt-4 rounded-md bg-surface-container p-3 text-sm font-semibold leading-6 text-primary">
          This form is ready for the Google Sheets endpoint.
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
  );
}

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant bg-surface/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-8">
        <a href="#" className="flex min-w-0 items-center gap-3 text-primary">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-white shadow-sm">
            <Vote size={22} />
          </span>
          <span className="truncate font-display text-xl font-extrabold tracking-tight sm:text-2xl">RunVoteWin</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
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
          href={appUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container sm:px-4"
        >
          Access App
          <ArrowRight size={16} />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero pt-32 text-primary md:pt-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="min-w-0"
        >
          <div className="mb-6 inline-flex max-w-full items-start gap-2 rounded-full border border-accent/25 bg-white/75 px-4 py-2 text-left text-sm font-bold leading-5 text-accent shadow-sm">
            <Flag className="mt-0.5 shrink-0" size={16} />
            <span className="min-w-0">Built for Democratic campaigns competing to win</span>
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary md:text-7xl">
            Modern voter contact software for serious Democratic campaigns.
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-on-surface-variant">
            RunVoteWin brings voter data, intelligent turf cutting, canvassing, and reporting into one fast workspace for congressional, state, and local campaigns.
          </p>

          <div className="mt-8">
            <SignupForm variant="hero" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative min-w-0"
        >
          <div className="dashboard-shell overflow-hidden rounded-lg border border-outline-variant bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Map size={18} />
                Turf Cutter
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                Austin, TX
              </div>
            </div>

            <div className="grid gap-4 p-4">
              <div className="relative h-72 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low sm:aspect-[16/9] sm:h-auto">
                <img
                  src="turf-cutter-hero.png"
                  alt="RunVoteWin turf cutter showing optimized campaign turfs on a map of Austin"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-primary/10"></div>
                <div className="absolute left-4 top-4 rounded-md border border-white/70 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="text-xs font-bold uppercase text-on-surface-variant">Walkable turfs generated</p>
                  <p className="font-display text-3xl font-extrabold text-primary">6 field loops</p>
                </div>
                <div className="absolute bottom-4 right-4 max-w-48 rounded-md border border-white/70 bg-primary/92 p-4 text-white shadow-lg backdrop-blur">
                  <p className="text-xs font-bold uppercase text-on-primary-container">Turf efficiency</p>
                  <p className="font-display text-4xl font-extrabold">135%</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-on-primary-container">
                    More efficient turfs from modern geospatial cutting.
                  </p>
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
            Professional campaign infrastructure without the legacy drag.
          </h2>
          <p className="mt-5 text-lg leading-8 text-on-surface-variant">
            Created by a team with 30 combined political cycles, RunVoteWin is built for the pressure of real races: messy data, late nights, volunteer churn, and decisions that cannot wait.
          </p>
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

function Pricing() {
  const [campaignId, setCampaignId] = useState('congressional');
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'needs-endpoint' | 'error'>('idle');

  const selectedCampaign = campaignOptions.find((option) => option.id === campaignId) ?? campaignOptions[2];

  const monthlyTotal = useMemo(() => selectedCampaign.price, [selectedCampaign.price]);

  async function handlePricingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signupEndpoint) {
      setStatus('needs-endpoint');
      return;
    }

    setStatus('loading');

    try {
      await postLead({
        formType: 'pricing',
        name,
        email,
        role,
        campaignSize: selectedCampaign.id,
        campaignSizeLabel: selectedCampaign.label,
        estimateMonthly: monthlyTotal,
        estimateFormatted: `${formatPrice(monthlyTotal)}/mo`,
        source: 'RunVoteWin pricing estimator',
      });

      setStatus('success');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Transparent pricing</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Get a clear campaign estimate by email.
            </h2>
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">
              Campaigns deserve straightforward numbers. Choose the size of your campaign, tell us who you are, and we will send a pricing estimate you can share with the team.
            </p>
            <p className="mt-4 text-sm font-semibold leading-6 text-on-surface-variant">
              Final pricing depends on state availability, data needs, and compliance requirements. This gives you a serious planning number before a sales call.
            </p>
          </div>

          <form onSubmit={handlePricingSubmit} className="rounded-lg border border-outline-variant bg-surface p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3 text-primary">
              <SlidersHorizontal size={24} />
              <h3 className="font-display text-3xl font-extrabold">Pricing estimator</h3>
            </div>

            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-primary">Campaign size</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {campaignOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setCampaignId(option.id)}
                    className={`rounded-md border p-4 text-left transition ${
                      campaignId === option.id
                        ? 'border-accent bg-white shadow-md'
                        : 'border-outline-variant bg-surface-container-low hover:bg-white'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-xl font-extrabold text-primary">{option.label}</span>
                      <span className="text-sm font-bold text-accent">{formatPrice(option.price)}/mo</span>
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-on-surface-variant">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-bold text-primary">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/12"
                    placeholder="Jane Organizer"
                    type="text"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-primary">Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/12"
                    placeholder="jane@campaign.org"
                    type="email"
                  />
                </label>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-primary">Your role</p>
                <div className="grid gap-2">
                  {roleOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm font-bold transition ${
                        role === option.id
                          ? 'border-purple bg-white text-primary shadow-sm'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.id}
                        checked={role === option.id}
                        onChange={() => setRole(option.id)}
                        className="accent-primary"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-lg bg-primary p-6 text-white">
              <p className="text-sm font-bold uppercase text-secondary-container">Estimated platform price</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-display text-5xl font-extrabold">{formatPrice(monthlyTotal)}</p>
                  <p className="text-sm font-semibold text-on-primary-container">per month during the campaign</p>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-primary transition hover:bg-secondary-container disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? 'Sending estimate...' : 'Email my estimate'}
                  <ArrowRight size={18} />
                </button>
              </div>
              <p className="mt-5 text-sm leading-6 text-on-primary-container">
                Includes canvassing, intelligent turf cutting, voter-data workspace, imports and exports, reporting, and standard support.
              </p>
              {status === 'needs-endpoint' && (
                <p className="mt-4 rounded-md bg-white/10 p-3 text-sm font-semibold leading-6 text-white">
                  Pricing email automation is ready. Add the Google Apps Script web app URL as VITE_SIGNUP_ENDPOINT to turn it on.
                </p>
              )}
              {status === 'success' && (
                <p className="mt-4 rounded-md bg-secondary-container/20 p-3 text-sm font-semibold text-secondary-container">
                  Estimate request received. Check your inbox in a moment.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 rounded-md bg-red-500/20 p-3 text-sm font-semibold text-white">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-xl lg:grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[360px] bg-primary lg:min-h-full">
            <img
              src="joe-schiarizzi-headshot.jpg"
              alt="Joe Schiarizzi, U.S. Congressional candidate for Virginia's 7th District"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>

          <div className="p-8 md:p-12 lg:p-14">
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Trusted by candidates</p>
            <blockquote className="font-display text-3xl font-extrabold leading-tight text-primary md:text-4xl">
              “{testimonialQuote}”
            </blockquote>
            <div className="mt-8 border-t border-outline-variant pt-6">
              <p className="font-display text-2xl font-extrabold text-primary">Joe Schiarizzi</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
                U.S. Congressional candidate, VA-07
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="bg-surface-container-low py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Integrations</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              RunVoteWin plays well with others.
            </h2>
          </div>
          <p className="text-lg leading-8 text-on-surface-variant">
            Campaigns already have data scattered across tools. RunVoteWin helps consolidate the sources your team actually uses so field planning moves faster.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="rounded-lg border border-outline-variant bg-white p-5 shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-primary">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section id="compare" className="bg-primary py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">RunVoteWin vs. NGP VAN</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            A modern alternative for campaigns that need speed, clarity, and continuity.
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/15 bg-white/7">
          <div className="grid gap-4 border-b border-white/15 bg-white/10 p-5 md:grid-cols-[0.32fr_1fr_1fr]">
            <div className="hidden md:block"></div>
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-label="United States flag">🇺🇸</span>
              <p className="font-display text-2xl font-extrabold">RunVoteWin</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-label="Saudi Arabia flag">🇸🇦</span>
              <img src="ngpvan-logo.svg" alt="NGP VAN" className="h-7 w-auto rounded bg-white px-2 py-1" />
            </div>
          </div>

          {comparisonRows.map((row) => (
            <div key={row.label} className="grid gap-5 border-b border-white/12 p-5 last:border-b-0 md:grid-cols-[0.32fr_1fr_1fr]">
              <p className="font-display text-xl font-extrabold text-secondary-container">{row.label}</p>
              <div className="rounded-md bg-white/8 p-4">
                <p className="leading-7 text-white">{row.runVoteWin}</p>
              </div>
              <div className="rounded-md bg-black/12 p-4">
                <p className="leading-7 text-on-primary-container">{row.ngp}</p>
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
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Campaign-aligned ownership</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Made in America, by Americans, and owned 100% by Americans.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            RunVoteWin is built by people who understand that campaign software is not just another SaaS category. The product exists to help Democratic campaigns make progress and win elections.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            'Built only for Democratic Party campaigns',
            'Created by a team with 30 combined political cycles',
            'Users help decide which features get built next',
            'Designed to preserve access and data continuity beyond one cycle',
          ].map((value) => (
            <div key={value} className="flex gap-4 rounded-lg border border-outline-variant bg-surface p-5 shadow-sm">
              <CheckCircle2 className="mt-1 shrink-0 text-accent" size={22} />
              <p className="text-lg font-semibold leading-7 text-primary">{value}</p>
            </div>
          ))}
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
              Supporting campaigns in Texas and Virginia.
            </h2>
          </div>
          <p className="text-lg leading-8 text-on-primary-container">
            More states are coming soon. We are expanding deliberately so the product stays reliable, responsive, and useful to the campaigns already depending on it.
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

function FinalCTA() {
  return (
    <section className="bg-hero py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Ready when your campaign is</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Build a field program your staff and volunteers can actually use.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Get updates on state expansion, product releases, and campaign onboarding.
          </p>
        </div>

        <div className="grid gap-4">
          <SignupForm variant="compact" />
          <a
            href={appUrl}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-outline-variant bg-white px-6 py-4 font-display text-lg font-extrabold text-primary shadow-sm transition hover:bg-surface-container-low"
          >
            Access App
            <ArrowRight size={20} />
          </a>
        </div>
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
            <p className="text-sm text-on-primary-container">Modern voter contact software for Democratic campaigns.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-semibold text-on-primary-container">
          <a href={docsUrl} className="transition hover:text-white">
            Docs
          </a>
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
        <Pricing />
        <Testimonials />
        <Integrations />
        <Comparison />
        <Ownership />
        <States />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
