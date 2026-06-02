import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  Database,
  Flag,
  Infinity,
  LifeBuoy,
  Mail,
  Map,
  MapPinned,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Vote,
} from 'lucide-react';

const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT ?? '';
const victoryPassCheckoutUrl = 'https://buy.stripe.com/7sY00jf8Jehde2acL75ZC00';
const lifetimeCheckoutUrl = import.meta.env.VITE_WIN_FOR_LIFE_CHECKOUT_URL ?? victoryPassCheckoutUrl;
const appUrl = 'https://app.runvotewin.com';
const docsUrl = 'https://docs.runvotewin.com';

type SignupFormVariant = 'hero' | 'compact';

type RoleOption = {
  id: string;
  label: string;
};

type PricingTier = 'Basic' | 'Pro' | 'Premium';

type PricingConfig = {
  states: Array<{ code: string; label: string }>;
  races: Array<{ id: string; label: string }>;
  terms: Array<{ id: string; label: string }>;
  tiers: PricingTier[];
};

type PricingResult = {
  state: string;
  stateLabel: string;
  race: string;
  raceLabel: string;
  term: string;
  termLabel: string;
  tier: PricingTier;
  voters: number;
  voterBucket: string;
  cycleMonths: number;
  monthly: number;
  discountPct: number;
  discountAmount: number;
  monthlyTotal: number;
  orderTotal: number;
  savings: {
    voterFile: { monthly: number; cycle: number };
    relationalOrganizing: { monthly: number; cycle: number };
    canvasserSuit: { monthly: number; cycle: number };
    totalMonthly: number;
    totalCycle: number;
  };
};

type Integration = {
  name: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName?: string;
  text: string;
};

const navItems = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Proof', href: '/#proof' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Careers', href: '/#careers' },
  { label: 'Compare', href: '/#compare' },
];

const organizingPhotoUrl =
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85';
const protestPhotoUrl = 'hero-crowd.jpg';

const testimonialQuote =
  "After I ran for Congress, I realized how far behind Democratic campaigns were on knowing our voters. I needed RunVoteWin's modern Voter CRM and Canvassing Suite to spend our funding more effectively than any other campaign. It's ages ahead of any other product and is built by Americans.";

const proofPoints = [
  { value: 'Fast', label: 'launches without legacy drag' },
  { value: 'Reliable', label: 'built for election-day pressure' },
  { value: 'Modern', label: 'better field ops than NGP VAN' },
];

const platformFeatures = [
  {
    icon: MapPinned,
    title: 'Fast turf cutting',
    text: 'Draw walkable, balanced turfs in minutes instead of losing a field day to clunky legacy workflows.',
  },
  {
    icon: Database,
    title: 'Reliable voter infrastructure',
    text: 'Keep voter records, contact history, tags, universes, and imports in a clean system built for high-stakes campaigns.',
  },
  {
    icon: BarChart3,
    title: 'Modern command center',
    text: 'Give candidates, managers, and organizers live clarity on contacts, turf progress, volunteer output, and the next move.',
  },
];

const tierDescriptions: Record<PricingTier, string> = {
  Basic: 'Core voter file, dashboard, turf cutter, scripts, canvasser + volunteer management.',
  Pro: 'Everything in Basic plus enhanced voter file, canvasser geo-location, and field office suite.',
  Premium: 'Everything in Pro plus customized voter file, relational organizing, and network data.',
};

const roleOptions: RoleOption[] = [
  { id: 'candidate', label: 'Candidate' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'staff', label: 'Campaign staff' },
];

const integrations: Integration[] = [
  {
    name: 'NGP VAN',
    logoSrc: 'logos/ngpvan.svg',
    logoAlt: 'NGP VAN logo',
    logoClassName: 'max-h-9 max-w-36',
    text: 'Import voter-file exports, canvass targets, IDs, tags, and contact history into RunVoteWin workflows.',
  },
  {
    name: 'Mobilize',
    logoSrc: 'logos/mobilize.png',
    logoAlt: 'Mobilize logo',
    logoClassName: 'max-h-10 max-w-36',
    text: 'Coordinate volunteer lists and event participation data with the rest of your field operation.',
  },
  {
    name: 'Microsoft Excel',
    logoSrc: 'logos/excel.svg',
    logoAlt: 'Microsoft Excel logo',
    logoClassName: 'max-h-10 max-w-44',
    text: 'Upload spreadsheets, normalize columns, and turn messy campaign lists into usable universes.',
  },
  {
    name: 'ISPolitical',
    logoSrc: 'logos/ispolitical.webp',
    logoAlt: 'ISPolitical logo',
    logoClassName: 'max-h-10 max-w-40',
    text: 'Bring ISPolitical data into the campaign workspace so targeting and reporting stay connected.',
  },
  {
    name: 'ActBlue',
    logoSrc: 'logos/actblue.svg',
    logoAlt: 'ActBlue logo',
    logoClassName: 'max-h-9 max-w-36',
    text: 'Use supporter and fundraising exports to inform organizing, follow-up, and constituency work.',
  },
  {
    name: 'Scale to Win',
    logoSrc: 'logos/scale-to-win.svg',
    logoAlt: 'Scale to Win logo',
    logoClassName: 'max-h-14 max-w-36',
    text: 'Connect Scale to Win texting, calling, and organizing exports with RunVoteWin field workflows.',
  },
  {
    name: 'Switchboard',
    logoSrc: 'logos/switchboard.svg',
    logoAlt: 'Switchboard logo',
    logoClassName: 'max-h-8 max-w-full',
    text: 'Bring Switchboard digital, texting, forms, and supporter engagement data into your campaign workspace.',
  },
];

const comparisonRows = [
  { label: 'American-owned', runVoteWin: true, ngp: false },
  { label: 'Transparent pricing', runVoteWin: true, ngp: false },
  { label: 'Direct campaign signup', runVoteWin: true, ngp: false },
  { label: 'Modern vote builder', runVoteWin: true, ngp: false },
  { label: 'Smart turf cutter', runVoteWin: true, ngp: false },
  { label: 'Data continuity across cycles', runVoteWin: true, ngp: false },
  { label: 'Built-in campaign workspace', runVoteWin: true, ngp: false },
];

const states = ['Texas', 'Virginia'];

const lifetimeBenefits = [
  'One candidate seat covered for every future campaign',
  'All RunVoteWin features available today',
  'All future product features included as they ship',
  'Keep your campaign data at the end of each cycle',
  'Premium launch-partner support and onboarding',
  'Feature requests reviewed directly by the product team',
];

const currentFeatures = [
  'Voter CRM and campaign workspace',
  'Fast turf cutting and walk-list planning',
  'Canvassing workflows and contact history',
  'Imports from spreadsheets, VAN exports, and supporter lists',
  'Readable field reporting for managers and candidates',
  'Data continuity across supported campaign cycles',
];

const plannedFeatures = [
  'Google login and account workspaces',
  'Role-based permissions for candidates, managers, staff, and volunteers',
  'Scalable Supabase-backed API for fast feature development',
  'React Native contact-import app for iOS and Android',
  'Deeper reporting, targeting, and voter-universe tools',
  'More integrations and more supported states',
];

const careers = [
  {
    title: 'Data Scientist',
    description:
      'Build the models, analytics, and geospatial insights campaigns use to make sharper field decisions. Strong linear algebra required; cartography or campaign data experience is a bonus.',
  },
  {
    title: 'Database Engineer',
    description:
      'Own the data layer behind modern campaign operations. Must have PostgreSQL experience and be comfortable working in TypeScript.',
  },
  {
    title: 'Software Sales',
    description:
      'Help campaigns understand what better tooling makes possible. You should be a pro at working on campaigns and know how campaign teams buy, decide, and move.',
  },
  {
    title: 'Open Role',
    description:
      'Do not see the exact fit? Send a resume and a note about how you want to help Democrats win.',
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMoney(value: number) {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatVoters(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return value.toString();
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
      const formData = new FormData(event.currentTarget);
      await postLead({
        formType: 'updates',
        name,
        email,
        source: 'RunVoteWin landing page',
        website: formData.get('website') ?? '',
      });

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
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

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
        {status === 'loading' ? 'Sending...' : 'Get a sales demo'}
        <ArrowRight size={20} />
      </button>

      {status === 'needs-endpoint' && (
        <p className="mt-4 rounded-md bg-surface-container p-3 text-sm font-semibold leading-6 text-primary">
          This form is ready. Add the Apps Script web app URL as VITE_SIGNUP_ENDPOINT to turn it on.
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

function LifetimeBanner() {
  return (
    <a
      href="/win-for-life"
      className="block bg-secondary-container px-4 py-2 text-center text-xs font-extrabold leading-5 text-primary transition hover:bg-white sm:text-sm"
    >
      For a limited time, before July 2026, buy a lifetime license — no subscription needed. Keep your data between all campaigns forever.{' '}
      <span className="underline underline-offset-2">Learn more →</span>
    </a>
  );
}

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant bg-surface/88 backdrop-blur-xl">
      <LifetimeBanner />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3 text-primary">
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
      <div className="absolute inset-0">
        <img
          src={protestPhotoUrl}
          alt="Crowd of people marching with signs and American flags"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/66" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/61 to-accent/38" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="min-w-0"
        >
          <div className="mb-6 inline-flex max-w-full items-start gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-left text-sm font-bold leading-5 text-white shadow-sm backdrop-blur">
            <Flag className="mt-0.5 shrink-0" size={16} />
            <span className="min-w-0">Built for campaigns that play to win</span>
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl">
            The modern campaign machine built to beat NGP VAN.
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-white/90">
            RunVoteWin is fast, reliable voter-contact infrastructure for teams that cannot afford slow software, broken exports, or stale field reports. Built for serious Democratic campaigns that want the best version — not legacy baggage.
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
                Field command
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
                  <p className="text-xs font-bold uppercase text-on-surface-variant">Campaign workspace online</p>
                  <p className="font-display text-3xl font-extrabold text-primary">Ready today</p>
                </div>
                <div className="absolute bottom-4 right-4 max-w-48 rounded-md border border-white/70 bg-primary/92 p-4 text-white shadow-lg backdrop-blur">
                  <p className="text-xs font-bold uppercase text-on-primary-container">Legacy software beaten</p>
                  <p className="font-display text-4xl font-extrabold">135%</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-on-primary-container">
                    Field tools that move as fast as the race does.
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
    <section id="platform" className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Fast. Reliable. Ruthlessly modern.</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            A voter-contact machine for campaigns that do not play softball.
          </h2>
          <p className="mt-5 text-lg leading-8 text-on-surface-variant">
            RunVoteWin is the operating system for modern field teams: cleaner data, faster decisions, sharper turf, and reporting that keeps up when the race gets ugly. It is not an open-source science project. It is the best version of campaign software, built to win.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
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

function HumanProof() {
  const moments = [
    {
      src: organizingPhotoUrl,
      alt: 'Campaign organizers working together around a table',
      eyebrow: 'For the staff room',
      title: 'When the plan changes, the software keeps up.',
      text: 'Field directors should be able to adjust universes, cut turf, and read the day without begging a consultant for another export.',
    },
    {
      src: protestPhotoUrl,
      alt: 'People gathered together at a civic protest',
      eyebrow: 'For the ground game',
      title: 'Built around people, pressure, and momentum.',
      text: 'Campaigns are won by organizers, volunteers, candidates, and supporters moving together. RunVoteWin gives them infrastructure that does not flinch.',
    },
  ];

  return (
    <section id="proof" className="bg-primary py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">Human field operations</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Modern software for the people doing the brutal work of winning.
            </h2>
          </div>
          <p className="text-lg leading-8 text-on-primary-container">
            The best campaigns do not need more tabs, more mystery exports, or another brittle legacy workflow. They need a fast command center that lets humans organize harder and move faster.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {moments.map((moment) => (
            <article key={moment.title} className="group relative min-h-[430px] overflow-hidden rounded-2xl border border-white/15 bg-white/8 shadow-2xl">
              <img src={moment.src} alt={moment.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/12" />
              <div className="relative flex h-full min-h-[430px] flex-col justify-end p-7 md:p-9">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-secondary-container">{moment.eyebrow}</p>
                <h3 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{moment.title}</h3>
                <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-on-primary-container">{moment.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [raceId, setRaceId] = useState<string | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [tier, setTier] = useState<PricingTier | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<PricingResult | null>(null);
  const [resultStatus, setResultStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'needs-endpoint' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/pricing/config')
      .then((res) => {
        if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: PricingConfig) => {
        if (cancelled) return;
        setConfig(data);
        if (data.states.length === 1) setStateCode(data.states[0]!.code);
      })
      .catch((err: Error) => {
        if (!cancelled) setConfigError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!stateCode || !raceId || !termId || !tier) return;
    let cancelled = false;
    setResultStatus('loading');
    fetch('/api/pricing/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: stateCode, race: raceId, term: termId, tier }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Calculate failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data: PricingResult) => {
        if (cancelled) return;
        setResult(data);
        setResultStatus('idle');
      })
      .catch(() => {
        if (!cancelled) setResultStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [stateCode, raceId, termId, tier]);

  const selectedState = useMemo(
    () => config?.states.find((s) => s.code === stateCode) ?? null,
    [config, stateCode],
  );
  const selectedRace = useMemo(
    () => config?.races.find((r) => r.id === raceId) ?? null,
    [config, raceId],
  );
  const selectedTerm = useMemo(
    () => config?.terms.find((t) => t.id === termId) ?? null,
    [config, termId],
  );

  const currentStep = !stateCode || !raceId ? 1 : !termId || !tier ? 2 : 3;

  function resetTo(step: 1 | 2) {
    if (step <= 1) {
      setStateCode(config && config.states.length === 1 ? config.states[0]!.code : null);
      setRaceId(null);
    }
    setTermId(null);
    setTier(null);
    setResult(null);
    setResultStatus('idle');
    setStatus('idle');
  }

  async function handlePricingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!result || !role) return;

    if (!signupEndpoint) {
      setStatus('needs-endpoint');
      return;
    }

    setStatus('loading');

    try {
      const formData = new FormData(event.currentTarget);
      await postLead({
        formType: 'pricing',
        name,
        email,
        role,
        state: result.state,
        stateLabel: result.stateLabel,
        race: result.race,
        raceLabel: result.raceLabel,
        term: result.term,
        termLabel: result.termLabel,
        tier: result.tier,
        voters: result.voters,
        voterBucket: result.voterBucket,
        cycleMonths: result.cycleMonths,
        monthly: result.monthly,
        discountPct: result.discountPct,
        discountAmount: result.discountAmount,
        monthlyTotal: result.monthlyTotal,
        orderTotal: result.orderTotal,
        savings: result.savings,
        estimateFormatted: `${formatMoney(result.monthlyTotal)}/mo · ${formatMoney(result.orderTotal)} total`,
        source: 'RunVoteWin pricing estimator',
        website: formData.get('website') ?? '',
      });

      setStatus('success');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="pricing" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Transparent pricing</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Get a clear campaign estimate by email.
            </h2>
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">
              Campaigns deserve straightforward numbers. Tell us the race, the term, and the tier — we will send a pricing estimate you can share with the team.
            </p>
            <p className="mt-4 text-sm font-semibold leading-6 text-on-surface-variant">
              Final pricing depends on state availability, data needs, and compliance requirements. This gives you a serious planning number before a sales call.
            </p>
          </div>

          <form onSubmit={handlePricingSubmit} className="rounded-lg border border-outline-variant bg-surface p-6 shadow-xl">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="mb-6 flex items-center gap-3 text-primary">
              <SlidersHorizontal size={24} />
              <h3 className="font-display text-3xl font-extrabold">Pricing estimator</h3>
            </div>

            <div className="mb-6 flex gap-2 text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`rounded-full px-3 py-1 ${currentStep === step ? 'bg-primary text-white' : currentStep > step ? 'bg-primary/12 text-primary' : 'bg-surface-container-low'}`}
                >
                  Step {step}
                </div>
              ))}
            </div>

            {configError && (
              <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
                Pricing service unavailable: {configError}
              </p>
            )}

            {!config && !configError && (
              <p className="mb-4 rounded-md bg-surface-container-low p-3 text-sm font-semibold text-on-surface-variant">
                Loading pricing options…
              </p>
            )}

            {config && currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-extrabold uppercase text-primary">Step 1 · Race</p>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    Pick the state and race. We will use it to size the estimate.
                  </p>
                </div>

                {config.states.length > 1 && (
                  <div>
                    <span className="mb-2 block text-sm font-bold text-primary">State</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {config.states.map((option) => (
                        <button
                          type="button"
                          key={option.code}
                          onClick={() => {
                            setStateCode(option.code);
                            setRaceId(null);
                          }}
                          className={`rounded-md border bg-white p-4 text-left transition hover:border-accent hover:shadow-sm ${
                            stateCode === option.code ? 'border-accent shadow-sm' : 'border-outline-variant'
                          }`}
                        >
                          <span className="block font-display text-xl font-extrabold text-primary">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {stateCode && (
                  <div>
                    <span className="mb-2 block text-sm font-bold text-primary">Race</span>
                    <div className="rounded-md border border-outline-variant bg-white p-4">
                      <select
                        value={raceId ?? ''}
                        onChange={(event) => setRaceId(event.target.value || null)}
                        className="w-full bg-white text-base font-bold text-primary outline-none"
                      >
                        <option value="" disabled>
                          Select a race…
                        </option>
                        {config.races.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {config && currentStep === 2 && selectedState && selectedRace && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold uppercase text-primary">Step 2 · Term and tier</p>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      <span className="font-bold text-primary">{selectedState.label}</span> · <span className="font-bold text-primary">{selectedRace.label}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => resetTo(1)}
                    className="text-sm font-bold text-accent"
                  >
                    Back
                  </button>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-bold text-primary">Term length</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {config.terms.map((option) => (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => setTermId(option.id)}
                        className={`rounded-md border bg-white p-4 text-left transition hover:border-accent hover:shadow-sm ${
                          termId === option.id ? 'border-accent shadow-sm' : 'border-outline-variant'
                        }`}
                      >
                        <span className="block font-display text-lg font-extrabold text-primary">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {termId && (
                  <div>
                    <span className="mb-2 block text-sm font-bold text-primary">Tier</span>
                    <div className="grid gap-3">
                      {config.tiers.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setTier(option)}
                          className={`rounded-md border bg-white p-4 text-left transition hover:border-accent hover:shadow-sm ${
                            tier === option ? 'border-accent shadow-sm' : 'border-outline-variant'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span>
                              <span className="block font-display text-xl font-extrabold text-primary">{option}</span>
                              <span className="mt-1 block text-sm leading-6 text-on-surface-variant">{tierDescriptions[option]}</span>
                            </span>
                            <ArrowRight className="shrink-0 text-accent" size={18} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {config && currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold uppercase text-primary">Step 3 · Send the estimate</p>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      <span className="font-bold text-primary">{selectedState?.label}</span> · {selectedRace?.label} · {selectedTerm?.label} · {tier}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => resetTo(2)}
                    className="text-sm font-bold text-accent"
                  >
                    Back
                  </button>
                </div>

                {resultStatus === 'loading' && (
                  <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5 text-sm font-semibold text-on-surface-variant">
                    Calculating your estimate…
                  </div>
                )}

                {resultStatus === 'error' && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
                    Could not load pricing. Please go back and try again.
                  </div>
                )}

                {result && resultStatus === 'idle' && (
                  <>
                    <div className="rounded-lg bg-primary p-5 text-white">
                      <p className="text-sm font-bold uppercase text-secondary-container">Estimated platform price</p>
                      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="font-display text-5xl font-extrabold">{formatMoney(result.monthlyTotal)}</p>
                          <p className="text-sm font-semibold text-on-primary-container">per month during the campaign</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase text-secondary-container">Order total</p>
                          <p className="font-display text-2xl font-extrabold">{formatMoney(result.orderTotal)}</p>
                          <p className="text-xs font-semibold text-on-primary-container">over {result.cycleMonths} months</p>
                        </div>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div>
                          <dt className="text-xs font-bold uppercase text-secondary-container">List price</dt>
                          <dd className="font-display text-lg font-extrabold">{formatMoney(result.monthly)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-secondary-container">Term discount</dt>
                          <dd className="font-display text-lg font-extrabold">{(result.discountPct * 100).toFixed(0)}%</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-secondary-container">Voter bucket</dt>
                          <dd className="font-display text-lg font-extrabold">{result.voterBucket}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-secondary-container">Voters</dt>
                          <dd className="font-display text-lg font-extrabold">{formatVoters(result.voters)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-lg border border-outline-variant bg-white p-5">
                      <p className="text-sm font-extrabold uppercase text-accent">Estimated savings vs legacy tools</p>
                      <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                        Replaces NGP VAN voter file, a relational organizing tool, and a separate canvasser suite.
                      </p>
                      <div className="mt-4 overflow-hidden rounded-md border border-outline-variant">
                        <div className="grid grid-cols-[1fr_6rem_7rem] items-center gap-3 border-b border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-on-surface-variant sm:grid-cols-[1fr_8rem_9rem]">
                          <span>Tool replaced</span>
                          <span className="text-right">Monthly</span>
                          <span className="text-right">Across cycle</span>
                        </div>
                        {(
                          [
                            ['Voter file (NGP VAN)', result.savings.voterFile],
                            ['Relational organizing', result.savings.relationalOrganizing],
                            ['Canvasser suite', result.savings.canvasserSuit],
                          ] as const
                        ).map(([label, row]) => (
                          <div
                            key={label}
                            className="grid grid-cols-[1fr_6rem_7rem] items-center gap-3 border-b border-outline-variant px-4 py-2 text-sm last:border-b-0 sm:grid-cols-[1fr_8rem_9rem]"
                          >
                            <span className="font-semibold text-primary">{label}</span>
                            <span className="text-right font-bold text-primary">{formatMoney(row.monthly)}</span>
                            <span className="text-right font-bold text-primary">{formatMoney(row.cycle)}</span>
                          </div>
                        ))}
                        <div className="grid grid-cols-[1fr_6rem_7rem] items-center gap-3 bg-secondary-container/30 px-4 py-3 text-sm sm:grid-cols-[1fr_8rem_9rem]">
                          <span className="font-display text-base font-extrabold text-primary">You save</span>
                          <span className="text-right font-display text-base font-extrabold text-primary">{formatMoney(result.savings.totalMonthly)}</span>
                          <span className="text-right font-display text-base font-extrabold text-primary">{formatMoney(result.savings.totalCycle)}</span>
                        </div>
                      </div>
                    </div>

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

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-primary">Your role</span>
                      <select
                        value={role ?? ''}
                        onChange={(event) => setRole(event.target.value || null)}
                        required
                        className="w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base font-bold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/12"
                      >
                        <option value="" disabled>
                          Select your role…
                        </option>
                        {roleOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="submit"
                      disabled={status === 'loading' || !role}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === 'loading' ? 'Sending estimate...' : 'Email my estimate'}
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>
            )}

            {status === 'needs-endpoint' && (
              <p className="mt-4 rounded-md bg-primary/8 p-3 text-sm font-semibold leading-6 text-primary">
                Pricing email automation is ready. Add the Google Apps Script web app URL as VITE_SIGNUP_ENDPOINT to turn it on.
              </p>
            )}
            {status === 'success' && (
              <p className="mt-4 rounded-md bg-secondary/10 p-3 text-sm font-semibold text-secondary">
                Estimate request received. Check your inbox in a moment.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonial = {
    quote: testimonialQuote,
    name: 'Joe Schiarizzi',
    role: 'U.S. Congressional candidate, VA-07',
    image: 'joe-schiarizzi-headshot.jpg',
    alt: "Joe Schiarizzi, U.S. Congressional candidate for Virginia's 7th District",
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Trusted by candidates and operators</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Built for the people who have to win the race.
          </h2>
        </div>

        <article className="rounded-2xl border border-outline-variant bg-surface p-6 shadow-lg md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <img
              src={testimonial.image}
              alt={testimonial.alt}
              className="h-16 w-16 shrink-0 rounded-full object-cover object-center shadow-md"
            />
            <div className="min-w-0">
              <blockquote className="text-lg font-semibold leading-8 text-primary md:text-xl">
                “{testimonial.quote}”
              </blockquote>
              <div className="mt-4">
                <p className="font-display text-xl font-extrabold text-primary">{testimonial.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="bg-surface-container-low py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Integrations</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Plug in your data. Move faster immediately.
            </h2>
          </div>
          <p className="text-lg leading-8 text-on-surface-variant">
            Campaigns inherit messy spreadsheets, VAN exports, donor files, volunteer lists, and last-minute targeting changes. RunVoteWin turns that mess into usable field infrastructure without slowing the team down.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {integrations.map((item) => (
            <article key={item.name} className="min-w-0 rounded-lg border border-outline-variant bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-16 min-w-0 items-center justify-center overflow-hidden rounded-md border border-outline-variant bg-surface px-4">
                <img
                  src={`${import.meta.env.BASE_URL}${item.logoSrc}`}
                  alt={item.logoAlt}
                  loading="lazy"
                  decoding="async"
                  className={`h-auto w-auto object-contain ${item.logoClassName ?? 'max-h-10 max-w-36'}`}
                />
              </div>
              <h3 className="font-display text-2xl font-extrabold text-primary">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section id="compare" className="bg-primary py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">RunVoteWin vs. NGP VAN</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            A brutally better alternative for campaigns that need speed, reliability, and control.
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/15 bg-white/7">
          <div className="grid grid-cols-[1fr_6rem_6rem] items-center gap-3 border-b border-white/15 bg-white/10 p-4 sm:grid-cols-[1fr_10rem_10rem] sm:p-5">
            <div className="text-sm font-extrabold uppercase tracking-wide text-secondary-container">Feature</div>
            <div className="flex items-center justify-center gap-2">
              <span className="hidden text-2xl sm:inline" aria-label="United States flag">🇺🇸</span>
              <p className="font-display text-lg font-extrabold sm:text-2xl">RunVoteWin</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="hidden text-2xl sm:inline" aria-label="Saudi Arabia flag">🇸🇦</span>
              <img src="ngpvan-logo.svg" alt="NGP VAN" className="h-6 w-auto rounded bg-white px-2 py-1 sm:h-7" />
            </div>
          </div>

          {comparisonRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[1fr_6rem_6rem] items-center gap-3 border-b border-white/12 p-4 last:border-b-0 sm:grid-cols-[1fr_10rem_10rem] sm:p-5">
              <p className="font-display text-lg font-extrabold text-white sm:text-xl">{row.label}</p>
              <div className="flex justify-center">
                <span className="rounded-full bg-emerald-400/18 px-3 py-1 text-3xl leading-none" aria-label="RunVoteWin supports this feature">
                  {row.runVoteWin ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-center">
                <span className="rounded-full bg-black/16 px-3 py-1 text-3xl leading-none" aria-label="NGP VAN does not support this feature">
                  {row.ngp ? '✅' : '❌'}
                </span>
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
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Campaign-aligned ownership</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Made in America, by Americans, and owned 100% by Americans.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            RunVoteWin is built by people who understand that campaign software is operational infrastructure. When the field plan changes at 10 p.m., the system has to work. When volunteers arrive, the turfs have to be ready. When the candidate asks what happened today, the answer has to be obvious.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            'Built for Democratic campaigns that need to move now',
            'Designed by people with 30 combined political cycles',
            'Fast onboarding without legacy access bottlenecks',
            'Reliable data continuity beyond one chaotic cycle',
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
    <section id="states" className="bg-primary-container py-16 text-white md:py-20">
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
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

function Careers() {
  return (
    <section id="careers" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-accent">Careers</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Help build the campaign platform Democrats deserve.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-on-surface-variant">
              <p>
                RunVoteWin was founded because Democratic campaigns should not have to choose between clunky incumbent software and duct-taped spreadsheets. We are building a modern field platform for teams that need to move fast, know their voters, and spend every dollar more effectively.
              </p>
              <p>
                Our goal is simple: help Democrats win overwhelmingly with no compromises. We are a scrappy startup, not an incumbent, and we are looking for people who want to ship, learn, and fight for better campaign infrastructure.
              </p>
              <p className="font-extrabold text-primary">All roles are remote. Applicants must be American.</p>
            </div>
            <a
              href="mailto:recruiter@runvotewin.com"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-lg font-extrabold text-white shadow-lg transition hover:bg-primary-container"
            >
              Email recruiter@runvotewin.com
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {careers.map((role) => (
              <article key={role.title} className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
                <h3 className="font-display text-2xl font-extrabold text-primary">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{role.description}</p>
                <a
                  href={`mailto:recruiter@runvotewin.com?subject=${encodeURIComponent(`RunVoteWin ${role.title} application`)}`}
                  className="mt-5 inline-flex text-sm font-extrabold text-accent transition hover:text-primary"
                >
                  Apply by email →
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-hero py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Ready when your campaign is</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Build the field operation your opponent wishes you did not have.
          </h2>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Get a serious look at the voter-contact platform built for speed, reliability, and wins.
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

function WinForLifePage() {
  const checkoutHref =
    lifetimeCheckoutUrl ||
    'mailto:sales@runvotewin.com?subject=RunVoteWin%20Founding%20Victory%20Pass&body=I%20want%20to%20buy%20a%20Founding%20Victory%20Pass.';

  return (
    <main>
      <section className="relative overflow-hidden bg-primary pt-36 text-white md:pt-40">
        <div className="absolute inset-0 opacity-35">
          <img src={organizingPhotoUrl} alt="Campaign organizers working together" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 md:px-8 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:pb-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary-container/40 bg-white/10 px-4 py-2 text-sm font-extrabold text-secondary-container backdrop-blur">
              <Award size={17} />
              Founding Victory Pass · Available before July 2026
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              Buy RunVoteWin once. Keep your campaign data forever.
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-semibold leading-8 text-on-primary-container">
              Early launch partners can lock in lifetime access for one candidate: premium support, direct feature requests, every feature we build, and data continuity from campaign to campaign.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={checkoutHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary-container px-7 py-4 font-display text-lg font-extrabold text-primary shadow-xl transition hover:bg-white"
              >
                Buy Now — $10,000
                <ArrowRight size={20} />
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-7 py-4 font-display text-lg font-extrabold text-white backdrop-blur transition hover:bg-white/18"
              >
                Back to platform
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/18 bg-white/12 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-extrabold uppercase text-secondary-container">Lifetime launch price</p>
            <p className="mt-3 font-display text-6xl font-extrabold">$10,000</p>
            <p className="mt-3 text-lg font-semibold leading-7 text-on-primary-container">
              No subscription for the covered candidate. No losing your workspace after the cycle. No paying legacy rent forever.
            </p>
            <div className="mt-7 grid gap-3">
              {lifetimeBenefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 rounded-md bg-white/10 p-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-secondary-container" size={20} />
                  <p className="font-semibold leading-6">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-accent">Why join early</p>
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                Become a Founding Victory Partner.
              </h2>
              <p className="mt-6 text-lg leading-8 text-on-surface-variant">
                “Premiere Launch Partner User” is the idea. The sharper name is <strong>Founding Victory Partner</strong>: campaigns that help bootstrap RunVoteWin now and get permanent access before everyone else is paying monthly.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Infinity, title: 'Lifetime access', text: 'One candidate can use RunVoteWin for future campaigns without a subscription.' },
                { icon: LifeBuoy, title: 'Premium support', text: 'Launch-partner support for setup, onboarding, imports, and serious campaign questions.' },
                { icon: Rocket, title: 'Feature influence', text: 'Request features and help shape the platform while we are still moving fast.' },
                { icon: Database, title: 'Data continuity', text: 'Keep your campaign data after the current cycle and carry institutional memory forward.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-2xl font-extrabold text-primary">{item.title}</h3>
                    <p className="mt-3 leading-7 text-on-surface-variant">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-2">
          <FeatureList title="What features are there now?" items={currentFeatures} />
          <FeatureList title="What features are planned?" items={plannedFeatures} />
        </div>
      </section>

      <section className="bg-primary py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-secondary-container">FAQ</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Straight answers before you buy.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <FAQItem
              question="How can we afford to do this?"
              answer="The Founding Victory Pass helps bootstrap the growth we have planned. Data storage costs have fallen by more than 90% over the last decade. Campaigns are just used to being overcharged by legacy vendors."
            />
            <FAQItem
              question="What does the license cover?"
              answer="The license covers all current RunVoteWin features, all future RunVoteWin features, premium launch-partner support, and data continuity for one candidate across future campaigns."
            />
            <FAQItem
              question="Is this for a campaign, a committee, or a candidate?"
              answer="This offer is scoped to one candidate. The candidate can keep access to their RunVoteWin campaign data across future races instead of starting over every cycle."
            />
            <FAQItem
              question="What happens after July 2026?"
              answer="This lifetime launch offer goes away. Future campaigns should expect normal subscription pricing and enterprise-style packages."
            />
          </div>
        </div>
      </section>

      <section className="bg-hero py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="mb-4 text-sm font-extrabold uppercase text-accent">Limited launch window</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Lock in the best deal RunVoteWin will ever offer.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
            Pay once, skip the subscription, and carry your data from race to race. Built for candidates who plan to keep winning.
          </p>
          <a
            href={checkoutHref}
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 font-display text-lg font-extrabold text-white shadow-xl transition hover:bg-primary-container"
          >
            Buy Now — $10,000
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </main>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-outline-variant bg-white p-7 shadow-xl">
      <h2 className="font-display text-3xl font-extrabold text-primary">{title}</h2>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-md bg-surface p-4">
            <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={20} />
            <p className="font-semibold leading-6 text-primary">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-white/15 bg-white/8 p-6 shadow-sm">
      <h3 className="font-display text-2xl font-extrabold text-white">{question}</h3>
      <p className="mt-3 leading-7 text-on-primary-container">{answer}</p>
    </article>
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
            <p className="text-sm text-on-primary-container">Fast, reliable voter-contact software for winning Democratic campaigns.</p>
            <p className="mt-2 text-xs font-medium text-white/55">Made with 💪 in Virginia and Texas. | © 2026 Solarpunk LLC.</p>
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
  const isWinForLifePage = window.location.pathname === '/win-for-life';

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {isWinForLifePage ? (
        <WinForLifePage />
      ) : (
        <main>
          <Hero />
          <Platform />
          <HumanProof />
          <Pricing />
          <Testimonials />
          <Integrations />
          <Comparison />
          <Ownership />
          <States />
          <Careers />
          <FinalCTA />
        </main>
      )}
      <Footer />
    </div>
  );
}
