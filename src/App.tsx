import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Map, 
  Database, 
  PhoneCall, 
  Terminal, 
  ChevronDown, 
  Github, 
  Lock, 
  Zap, 
  UserPlus, 
  TrendingDown, 
  EyeOff,
  Code,
  Globe,
  Smartphone,
  Download,
  Users
} from 'lucide-react';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
          <Map className="text-secondary-container w-5 h-5" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-primary">Blue North</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="font-mono text-xs font-medium text-primary border-b-2 border-primary pb-1">Voter File</a>
        <a href="#" className="font-mono text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">Turf Cutting</a>
        <a href="#" className="font-mono text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">Phone Banking</a>
        <a href="#" className="font-mono text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">Open Source</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:block font-mono text-xs font-bold text-primary hover:underline">Login</button>
        <button className="bg-primary text-white px-4 py-2 rounded-sm font-mono text-xs font-medium hover:bg-primary-container transition-all active:scale-95 shadow-sm">
          Request Access
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-32 pb-24 grid-bg">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10"
      >
        <span className="inline-block bg-secondary-container text-on-secondary-container px-2 py-1 font-mono text-[10px] font-bold rounded mb-4">
          V.2.0 OPEN STACK
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-primary leading-[1.1] mb-6 tracking-tight">
          Campaign field software that doesn't feel stuck in 2008.
        </h1>
        <p className="text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
          Blue North is the modern, open-source organizing platform for voter contact, turf cutting, and campaign operations. Built by organizers, for organizers.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white px-8 py-4 rounded-lg font-display text-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
            Request Access
            <ArrowRight size={20} />
          </button>
          <button className="border border-outline text-primary px-8 py-4 rounded-lg font-display text-lg font-semibold flex items-center gap-2 hover:bg-surface-container transition-all">
            <Github size={20} />
            View on GitHub
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="glass-card border border-outline-variant rounded-xl shadow-2xl p-2 overflow-hidden">
          <div className="bg-surface-container px-4 py-2 border-b border-outline-variant flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Map className="text-primary w-4 h-4" />
              <span className="font-mono text-[10px] text-primary font-medium tracking-wider">FIELD_COMMAND_CENTER / TURF_04</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
          
          <div className="relative h-[400px] bg-slate-100 rounded overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-110"
              alt="Map Background"
            />
            <div className="absolute inset-0 p-4 flex flex-col gap-4">
              <div className="w-48 bg-white/95 border border-outline-variant p-3 rounded shadow-md">
                <p className="font-mono text-[10px] text-on-surface-variant mb-2">TURF COMPLETION</p>
                <div className="w-full bg-surface-container h-1.5 rounded-full mb-1">
                  <div className="bg-secondary h-full w-[68%] rounded-full"></div>
                </div>
                <p className="font-mono text-[10px] font-bold text-secondary">68.4% SYNCED</p>
              </div>
              <div className="ml-auto w-52 bg-white/95 border border-outline-variant p-3 rounded shadow-md">
                <p className="font-mono text-[10px] text-on-surface-variant mb-2">LIVE CANVASSERS</p>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-highest"></div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">+12</div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/3">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg"></div>
              </motion.div>
            </div>
            <div className="absolute bottom-1/4 right-1/2">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProblemSection = () => {
  const problems = [
    { icon: <TrendingDown />, title: "Expensive Licenses", text: "Don't let software fees swallow your field budget. We believe technology should scale without crushing costs." },
    { icon: <Zap />, title: "Clunky Workflows", text: "Stop wasting staff hours on manual data imports and outdated UIs. Blue North is built for speed." },
    { icon: <Lock />, title: "Locked-down Data", text: "It's your data. You should be able to export and own it without paying a premium." },
    { icon: <Users />, title: "Volunteer Friction", text: "Old apps frustrate canvassers. Our mobile experience is intuitive, lowering the barrier to entry." },
    { icon: <Smartphone />, title: "Slow Onboarding", text: "Get field offices up and running in minutes, not weeks of technical training." },
    { icon: <EyeOff />, title: "Poor Transparency", text: "Real-time reporting shouldn't be a luxury. Track progress live as it happens on the doors." }
  ];

  return (
    <section className="py-24 bg-primary-container text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-6">The high cost of legacy campaign tools.</h2>
          <p className="text-on-primary-container max-w-2xl mx-auto text-lg">
            Modern organizing requires tools that move as fast as your volunteers. Legacy software holds your data hostage and drains your budget.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <div key={i} className="border border-on-primary-container/20 p-8 rounded-lg hover:bg-white/5 transition-all group">
              <div className="text-secondary-container mb-6 group-hover:scale-110 transition-transform duration-300">
                {p.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-on-primary-container leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonTable = () => {
  const rows = [
    { metric: "Source Model", blue: "Open Source (AGPLv3)", legacy: "Proprietary / Black Box", icon: <Code size={16} /> },
    { metric: "Custom Workflows", blue: "Infinite via API & Extensibility", legacy: "Limited to pre-set modules", icon: <Zap size={16} /> },
    { metric: "Access Policy", blue: "Available to all Blue campaigns", legacy: "Often restricted by scale", icon: <Globe size={16} /> },
    { metric: "Volunteer UX", blue: "Mobile-first, Latency-free", legacy: "Laggy web-views, drop-off", icon: <Smartphone size={16} /> },
    { metric: "Data Portability", blue: "Full Postgres SQL access", legacy: "Restricted exports / Locked", icon: <Download size={16} /> },
    { metric: "Roadmap Control", blue: "Community-driven features", legacy: "Corporate-driven priorities", icon: <Users size={16} /> }
  ];

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl font-bold text-primary tracking-tight">The Open-Source Alternative to NGP VAN</h2>
          <p className="text-on-surface-variant mt-4 text-lg">A direct comparison of infrastructure philosophy and performance.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant shadow-xl bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-6 text-left font-mono text-[10px] font-bold text-primary uppercase tracking-widest w-1/4">Metric</th>
                <th className="p-6 text-left font-mono text-[10px] font-bold text-primary bg-secondary-container/10 uppercase tracking-widest w-3/8">Blue North (Modern)</th>
                <th className="p-6 text-left font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-3/8">Legacy Tools (Standard)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-6 font-bold text-primary">{row.metric}</td>
                  <td className="p-6 bg-secondary-container/5">
                    <div className="flex items-center gap-2 text-secondary font-medium">
                      {row.icon}
                      {row.blue}
                    </div>
                  </td>
                  <td className="p-6 text-on-surface-variant">{row.legacy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Features = () => (
  <section className="py-24 bg-surface-container-low">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="font-mono text-xs font-bold text-secondary mb-2 block uppercase tracking-widest">CORE CAPABILITIES</span>
          <h2 className="font-display text-4xl font-bold text-primary tracking-tight">Precision tools for high-intensity field ops.</h2>
        </div>
        <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300">
          Explore all technical specs
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white border border-outline-variant p-10 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <Map className="text-primary w-10 h-10 mb-6" />
            <h3 className="font-display text-2xl font-bold mb-4">Advanced Turf Cutting</h3>
            <p className="text-on-surface-variant max-w-sm leading-relaxed">
              Our geospatial engine allows for sub-meter precision in turf assignment. Use heatmaps to visualize density and cut walking lists with automated route optimization.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Map size={256} className="text-primary" />
          </div>
        </div>

        <div className="md:col-span-4 bg-primary text-white p-10 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <Database className="text-secondary-container w-10 h-10 mb-6" />
            <h3 className="font-display text-2xl font-bold mb-4">Voter File Management</h3>
            <p className="text-on-primary-container leading-relaxed">
              Import and normalize raw voter data from multiple sources. Maintain a single source of truth for the entire campaign.
            </p>
          </div>
        </div>

        <div className="md:col-span-4 bg-white border border-outline-variant p-10 rounded-xl shadow-sm">
          <PhoneCall className="text-primary w-10 h-10 mb-6" />
          <h3 className="font-display text-2xl font-bold mb-4">Phone Bank Sync</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Integrated VOIP and predictive dialing systems that sync results directly to your field reports in real-time.
          </p>
        </div>

        <div className="md:col-span-8 bg-surface-container text-primary p-10 rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Terminal className="text-primary w-10 h-10 mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4">Open Data Architecture</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Built on a robust PostgreSQL backend with a GraphQL API. Connect your own BI tools and custom scripts without friction.
              </p>
            </div>
            <div className="bg-primary-container p-6 rounded-lg font-mono text-[11px] text-secondary-container shadow-inner overflow-x-auto">
              <div className="opacity-50 mb-2"># Fetch live field data</div>
              <div className="flex gap-2">
                <span className="text-white">query</span>
                <span>{'{'}</span>
              </div>
              <div className="pl-4 flex gap-2">
                <span className="text-white">turf</span>
                <span>(id: "T-102") {'{'}</span>
              </div>
              <div className="pl-8 text-white">voters_contacted</div>
              <div className="pl-8 text-white">sync_status</div>
              <div className="pl-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FieldReality = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=1200" 
          alt="Field work" 
          className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8">
          <p className="font-mono text-[10px] text-white/70 mb-1 uppercase tracking-widest">LOCATION: PRECINCT_342_A</p>
          <p className="font-display text-2xl font-bold text-secondary-container uppercase tracking-tight">LIVESYNC ACTIVE</p>
        </div>
      </div>

      <div>
        <span className="font-mono text-xs font-bold text-secondary mb-4 block uppercase tracking-widest">THE REALITY OF THE FIELD</span>
        <h2 className="font-display text-5xl font-bold text-primary mb-8 tracking-tight">Built for the midnight turf cut.</h2>
        <p className="text-xl text-on-surface-variant mb-6 leading-relaxed">
          We know what it’s like. It’s 11 PM, the volunteers arrive at 8 AM, and you still have 40 turfs to cut. Legacy software slows you down with spinning wheels.
        </p>
        <p className="text-on-surface-variant mb-10 leading-relaxed">
          Blue North was built by organizers who have spent years in the trenches. Every feature, from the bulk-assign tools to the offline mobile sync, is designed to save you precious minutes when they matter most.
        </p>
        <div className="flex gap-12 border-t border-outline-variant pt-10">
          <div>
            <p className="font-display text-5xl font-bold text-secondary tracking-tighter">0ms</p>
            <p className="font-mono text-[10px] text-on-surface-variant font-bold uppercase mt-2 tracking-widest">LATENCY TARGET</p>
          </div>
          <div>
            <p className="font-display text-5xl font-bold text-secondary tracking-tighter">100%</p>
            <p className="font-mono text-[10px] text-on-surface-variant font-bold uppercase mt-2 tracking-widest">OFFLINE SYNC</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  const questions = [
    { q: "Who owns the data I import?", a: "You do. Period. Blue North is a tool, not a data broker. Your database is yours to export or delete at any time." },
    { q: "Can I import my existing VAN data?", a: "Yes. We have built-in mapping tools to ingest standard field exports from NGP VAN and other legacy providers." },
    { q: "Is it really 'Open Source'?", a: "Yes. The core engine is licensed under AGPLv3. You can audit the code on GitHub today." }
  ];

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl font-bold text-primary text-center mb-16 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="border-b border-outline-variant">
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-primary transition-colors group"
              >
                <span className="font-display text-xl font-semibold">{item.q}</span>
                <ChevronDown className={`transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-on-surface-variant leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 grid-bg rotate-12 scale-150"></div>
      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <h2 className="font-display text-5xl font-bold text-white mb-6 tracking-tight">Build field power without legacy software drag.</h2>
        <p className="text-xl text-on-primary-container mb-12 max-w-xl mx-auto">
          Join the movement of organizers building the future of civic tech. Modern, open, and fast.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-lg font-display text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Request Access
          </button>
          <button className="bg-primary-container text-white border border-white/20 px-10 py-5 rounded-lg font-display text-xl font-bold hover:bg-primary-container/80 transition-all">
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-24 bg-primary border-t border-white/10 text-white/60">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6 text-white">
            <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center">
              <Map size={18} className="text-secondary-container" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Blue North</span>
          </div>
          <p className="text-sm max-w-xs leading-relaxed text-on-primary-container">
            © 2024 Blue North. An insurgent tool for modern organizers. Open data, open code. Built for the movement.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-mono text-[10px] font-bold text-secondary-container uppercase mb-6 tracking-widest">PLATFORM</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub Repo</a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] font-bold text-secondary-container uppercase mb-6 tracking-widest">LEGAL</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] font-bold text-secondary-container uppercase mb-6 tracking-widest">SYSTEM</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ComparisonTable />
        <Features />
        <FieldReality />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

