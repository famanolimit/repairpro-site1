import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Smartphone, Battery, Shield, Zap, Cpu, ChevronRight, ChevronLeft, Check,
  Calendar, Clock, MapPin, Phone, Mail, User, MessageSquare, AlertTriangle,
  Award, Wrench, ArrowRight, X, Search, Star, Inbox, Hourglass, RefreshCw, Sparkles, Ghost
} from 'lucide-react';

/* ====================================================================
   DONNÉES TARIFAIRES iPHONE — extraites du fichier Excel
   ==================================================================== */

const IPHONE_DATA = [
  // {model, year, screen:{incell, oled, soft}, battery, backGlass:{price, availability}, charging:{price, type}, board:{micro, recovery, repair}}
  { model: "iPhone 5",            year: 2012, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 80,  recovery: 90,  repair: 120 } },
  { model: "iPhone 5C",           year: 2013, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 80,  recovery: 90,  repair: 120 } },
  { model: "iPhone 5S",           year: 2013, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 80,  recovery: 90,  repair: 120 } },
  { model: "iPhone SE (2016)",    year: 2016, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 80,  recovery: 90,  repair: 120 } },
  { model: "iPhone 6",            year: 2014, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 80,  recovery: 100, repair: 130 } },
  { model: "iPhone 6 Plus",       year: 2014, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 45, type: "Lightning" }, board: { micro: 90,  recovery: 100, repair: 140 } },
  { model: "iPhone 6S",           year: 2015, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 40, type: "Lightning" }, board: { micro: 90,  recovery: 100, repair: 140 } },
  { model: "iPhone 6S Plus",      year: 2015, screen: { incell: 45 },                                battery: 35,  backGlass: null,                                  charging: { price: 45, type: "Lightning" }, board: { micro: 90,  recovery: 100, repair: 140 } },
  { model: "iPhone 7",            year: 2016, screen: { incell: 55 },                                battery: 35,  backGlass: null,                                  charging: { price: 45, type: "Lightning" }, board: { micro: 90,  recovery: 110, repair: 150 } },
  { model: "iPhone 7 Plus",       year: 2016, screen: { incell: 55 },                                battery: 35,  backGlass: null,                                  charging: { price: 50, type: "Lightning" }, board: { micro: 100, recovery: 110, repair: 160 } },
  { model: "iPhone 8",            year: 2017, screen: { incell: 55 },                                battery: 35,  backGlass: { price: 60,  availability: "En stock" },     charging: { price: 45, type: "Lightning" }, board: { micro: 100, recovery: 120, repair: 160 } },
  { model: "iPhone 8 Plus",       year: 2017, screen: { incell: 55 },                                battery: 35,  backGlass: { price: 65,  availability: "En stock" },     charging: { price: 50, type: "Lightning" }, board: { micro: 100, recovery: 120, repair: 170 } },
  { model: "iPhone X",            year: 2017, screen: { incell: 60, oled: 68,  soft: 80 },           battery: 40,  backGlass: { price: 70,  availability: "En stock" },     charging: { price: 55, type: "Lightning" }, board: { micro: 120, recovery: 140, repair: 200 } },
  { model: "iPhone XR",           year: 2018, screen: { incell: 60 },                                battery: 40,  backGlass: { price: 70,  availability: "En stock" },     charging: { price: 55, type: "Lightning" }, board: { micro: 110, recovery: 130, repair: 180 } },
  { model: "iPhone XS",           year: 2018, screen: { incell: 60, oled: 140, soft: 180 },          battery: 40,  backGlass: { price: 75,  availability: "En stock" },     charging: { price: 60, type: "Lightning" }, board: { micro: 130, recovery: 150, repair: 220 } },
  { model: "iPhone XS Max",       year: 2018, screen: { incell: 60, oled: 72,  soft: 75 },           battery: 40,  backGlass: { price: 80,  availability: "En stock" },     charging: { price: 65, type: "Lightning" }, board: { micro: 140, recovery: 160, repair: 240 } },
  { model: "iPhone 11",           year: 2019, screen: { incell: 60 },                                battery: 40,  backGlass: { price: 70,  availability: "En stock" },     charging: { price: 55, type: "Lightning" }, board: { micro: 120, recovery: 140, repair: 200 } },
  { model: "iPhone 11 Pro",       year: 2019, screen: { incell: 65, oled: 70,  soft: 95 },           battery: 40,  backGlass: { price: 85,  availability: "En stock" },     charging: { price: 65, type: "Lightning" }, board: { micro: 140, recovery: 160, repair: 240 } },
  { model: "iPhone 11 Pro Max",   year: 2019, screen: { incell: 65, oled: 75,  soft: 99 },           battery: 55,  backGlass: { price: 95,  availability: "Sur commande" }, charging: { price: 70, type: "Lightning" }, board: { micro: 150, recovery: 170, repair: 260 } },
  { model: "iPhone SE (2020)",    year: 2020, screen: { incell: 50 },                                battery: 50,  backGlass: { price: 65,  availability: "En stock" },     charging: { price: 50, type: "Lightning" }, board: { micro: 100, recovery: 120, repair: 170 } },
  { model: "iPhone 12 mini",      year: 2020, screen: { incell: 72, oled: 85,  soft: 99,  warn: true }, battery: 55, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 65, type: "Lightning" }, board: { micro: 150, recovery: 170, repair: 270 } },
  { model: "iPhone 12",           year: 2020, screen: { incell: 65, oled: 75,  soft: 95,  warn: true }, battery: 50, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 60, type: "Lightning" }, board: { micro: 150, recovery: 170, repair: 270 } },
  { model: "iPhone 12 Pro",       year: 2020, screen: { incell: 65, oled: 75,  soft: 95,  warn: true }, battery: 50, backGlass: { price: 95,  availability: "En stock" },     charging: { price: 65, type: "Lightning" }, board: { micro: 160, recovery: 180, repair: 290 } },
  { model: "iPhone 12 Pro Max",   year: 2020, screen: { incell: 72, oled: 84,  soft: 105, warn: true }, battery: 50, backGlass: { price: 110, availability: "Sur commande" }, charging: { price: 75, type: "Lightning" }, board: { micro: 170, recovery: 190, repair: 310 } },
  { model: "iPhone 13 mini",      year: 2021, screen: { incell: 72, oled: 84,  soft: 105, warn: true }, battery: 50, backGlass: { price: 100, availability: "En stock" },     charging: { price: 70, type: "Lightning" }, board: { micro: 170, recovery: 190, repair: 290 } },
  { model: "iPhone 13",           year: 2021, screen: { incell: 70, oled: 77,  soft: 99,  warn: true }, battery: 50, backGlass: { price: 100, availability: "En stock" },     charging: { price: 65, type: "Lightning" }, board: { micro: 170, recovery: 190, repair: 290 } },
  { model: "iPhone 13 Pro",       year: 2021, screen: { incell: 75, oled: 85,  soft: 112, warn: true }, battery: 50, backGlass: { price: 110, availability: "En stock" },     charging: { price: 75, type: "Lightning" }, board: { micro: 180, recovery: 200, repair: 320 } },
  { model: "iPhone 13 Pro Max",   year: 2021, screen: { incell: 75, oled: 85,  soft: 132, warn: true }, battery: 50, backGlass: { price: 90,  availability: "Sur commande" }, charging: { price: 80, type: "Lightning" }, board: { micro: 190, recovery: 210, repair: 340 } },
  { model: "iPhone SE (2022)",    year: 2022, screen: { incell: 45 },                                battery: 50,  backGlass: { price: 70,  availability: "En stock" },     charging: { price: 55, type: "Lightning" }, board: { micro: 110, recovery: 130, repair: 180 } },
  { model: "iPhone 14",           year: 2022, screen: { incell: 70, oled: 75,  soft: 100, warn: true }, battery: 50, backGlass: { price: 70,  availability: "En stock" },     charging: { price: 70, type: "Lightning" }, board: { micro: 200, recovery: 220, repair: 350 } },
  { model: "iPhone 14 Plus",      year: 2022, screen: { incell: 75, oled: 80,  soft: 92,  warn: true }, battery: 50, backGlass: { price: 70,  availability: "En stock" },     charging: { price: 75, type: "Lightning" }, board: { micro: 210, recovery: 230, repair: 370 } },
  { model: "iPhone 14 Pro",       year: 2022, screen: { oled: 80,  soft: 100, warn: true },           battery: 50,  backGlass: { price: 90,  availability: "En stock" },     charging: { price: 80, type: "Lightning" }, board: { micro: 230, recovery: 250, repair: 400 } },
  { model: "iPhone 14 Pro Max",   year: 2022, screen: { oled: 100, soft: 184, warn: true },           battery: 80,  backGlass: { price: 90,  availability: "Sur commande" }, charging: { price: 90, type: "Lightning" }, board: { micro: 250, recovery: 270, repair: 430 } },
  { model: "iPhone 15",           year: 2023, screen: { incell: 70, oled: 105, soft: 165, warn: true }, battery: 60, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 80, type: "USB-C" },     board: { micro: 240, recovery: 260, repair: 410 } },
  { model: "iPhone 15 Plus",      year: 2023, screen: { incell: 70, oled: 100, soft: 165, warn: true }, battery: 65, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 85, type: "USB-C" },     board: { micro: 250, recovery: 270, repair: 430 } },
  { model: "iPhone 15 Pro",       year: 2023, screen: { oled: 85,  soft: 202, warn: true },           battery: 100, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 95, type: "USB-C" },     board: { micro: 280, recovery: 300, repair: 470 } },
  { model: "iPhone 15 Pro Max",   year: 2023, screen: { oled: 90,  soft: 115, warn: true },           battery: 110, backGlass: { price: 90,  availability: "Sur commande" }, charging: { price: 100, type: "USB-C" },    board: { micro: 300, recovery: 320, repair: 510 } },
  { model: "iPhone 16",           year: 2024, screen: { incell: 75, oled: 90,  soft: 180, warn: true }, battery: 100, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 85, type: "USB-C" },     board: { micro: 280, recovery: 300, repair: 470 } },
  { model: "iPhone 16 Plus",      year: 2024, screen: { incell: 75, oled: 110, soft: 118, warn: true }, battery: 110, backGlass: { price: 90,  availability: "En stock" },     charging: { price: 90, type: "USB-C" },     board: { micro: 300, recovery: 320, repair: 500 } },
  { model: "iPhone 16 Pro",       year: 2024, screen: { oled: 125, soft: 215, warn: true },           battery: 120, backGlass: { price: 90,  availability: "Sur commande" }, charging: { price: 100, type: "USB-C" },    board: { micro: 330, recovery: 350, repair: 550 } },
  { model: "iPhone 16 Pro Max",   year: 2024, screen: { oled: 150, soft: 280, warn: true },           battery: 130, backGlass: { price: 90,  availability: "Sur commande" }, charging: { price: 110, type: "USB-C" },    board: { micro: 350, recovery: 380, repair: 600 } },
];

const REPAIR_TYPES = [
  { id: "screen",   label: "Écran cassé",         icon: Smartphone, desc: "Vitre fissurée, tactile HS, affichage cassé" },
  { id: "battery",  label: "Batterie",            icon: Battery,    desc: "Autonomie faible, extinctions, gonflement" },
  { id: "back",     label: "Vitre arrière",       icon: Shield,     desc: "Dos cassé, démontage laser inclus" },
  { id: "charge",   label: "Connecteur de charge", icon: Zap,        desc: "Charge instable, problème micro / antenne" },
  { id: "board",    label: "Carte mère",          icon: Cpu,        desc: "Diagnostic gratuit, micro-soudure, récupération" },
];

const SCREEN_TYPES = {
  incell: { label: "Incell / TFT",     desc: "Économique. Réservé à la récupération de données sur iPhone 12+." },
  oled:   { label: "OLED rigide",      desc: "Bon rapport qualité/prix. Couleurs fidèles, Face ID compatible." },
  soft:   { label: "Soft OLED (premium)", desc: "Équivalent écran d'origine. True Tone, bordures fines." },
};

const BOARD_SERVICES = [
  { id: "diag",     label: "Diagnostic",        priceKey: null,       free: true,  desc: "Gratuit en cas de réparation" },
  { id: "micro",    label: "Micro-soudure simple", priceKey: "micro",                desc: "Réparation d'un composant ciblé" },
  { id: "recovery", label: "Récupération de données", priceKey: "recovery",          desc: "Sauvetage de vos photos / contacts" },
  { id: "repair",   label: "Réparation moyenne",   priceKey: "repair",                desc: "Forfait pannes complexes (eau, chocs)" },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const OTHER_BRANDS = ["Samsung", "Xiaomi", "Huawei", "OnePlus", "Google Pixel", "Oppo", "Sony", "Honor", "Autre"];

/* ====================================================================
   STYLES & TOKENS
   ==================================================================== */

const COLORS = {
  cream:    "#FFFFFF",  // page background — pure white
  paper:    "#F4F7FB",  // surface — very subtle blue-gray
  ink:      "#0A0A0A",  // near-black for text/contrast
  ink2:     "#1F2937",  // dark slate
  muted:    "#6B7280",  // medium gray
  line:     "#E5E7EB",  // light border
  line2:    "#CBD5E1",  // medium border
  brand:    "#1D4ED8",  // royal blue (primary accent)
  brandDark:"#1E3A8A",  // deep blue
  green:    "#15803D",  // success
  amber:    "#B45309",  // warnings
};

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  body { background: ${COLORS.cream}; }
  .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
  .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }
  .grid-bg {
    background-image:
      linear-gradient(${COLORS.line2}33 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.line2}33 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .noise::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.04; mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none; } }
  .anim-fade-up { animation: fadeUp .4s ease-out both; }
  @keyframes pulse-dot { 0%, 100% { opacity: 1;} 50% { opacity: .35;} }
  .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
  .btn-shadow { box-shadow: 0 1px 0 0 rgba(0,0,0,0.05), 0 8px 24px -12px rgba(29,78,216,0.5); }
  .card-shadow { box-shadow: 0 1px 0 0 rgba(0,0,0,0.04), 0 24px 48px -32px rgba(22,20,18,0.18); }
  /* Custom utilities (replace Tailwind arbitrary values) */
  .tracking-wider2 { letter-spacing: 0.2em; }
  .tracking-wider1 { letter-spacing: 0.15em; }
  .text-2xs        { font-size: 10px; line-height: 14px; }
  .max-h-92vh      { max-height: 92vh; }
  .max-h-50vh      { max-height: 50vh; }
  .hover-lift     { transition: transform .2s ease; }
  .hover-lift:hover { transform: translateY(-1px); }
  .hover-lift2    { transition: transform .3s ease; }
  .hover-lift2:hover { transform: translateY(-2px); }
  .tabular-nums    { font-variant-numeric: tabular-nums; }
  /* Hide spinner on number inputs */
  input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
  /* Smooth scroll */
  html { scroll-behavior: smooth; }
`;

/* ====================================================================
   COMPOSANTS UI RÉUTILISABLES
   ==================================================================== */

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, disabled, type = "button" }) => {
  const base = "inline-flex items-center justify-center gap-2 font-body font-medium tracking-tight transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: `text-white px-6 py-3.5 btn-shadow hover-lift active:translate-y-0`,
    ghost:   `bg-transparent px-5 py-3 hover:bg-black/5`,
    outline: `bg-transparent border px-5 py-3 hover:bg-black/5`,
    dark:    `text-white px-6 py-3.5 hover:opacity-90`,
  };
  const styles = {
    primary: { background: COLORS.brand, color: "#fff" },
    outline: { borderColor: COLORS.line2, color: COLORS.ink },
    ghost:   { color: COLORS.ink },
    dark:    { background: COLORS.ink, color: "#fff" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`} style={styles[variant]}>
      {children}
      {Icon && <Icon size={18} strokeWidth={2.2} />}
    </button>
  );
};

const Pill = ({ children, color = "ink" }) => {
  const styles = {
    ink:    { background: COLORS.ink, color: "#fff" },
    brand:  { background: "#DBEAFE", color: COLORS.brandDark },
    green:  { background: "#E2EBE6", color: COLORS.green },
    paper:  { background: COLORS.paper, color: COLORS.ink, border: `1px solid ${COLORS.line2}` },
    amber:  { background: "#FEF3C7", color: "#92400E" },
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium tracking-wide uppercase px-2.5 py-1 rounded-full" style={styles[color]}>
      {children}
    </span>
  );
};

const SectionLabel = ({ children, num }) => (
  <div className="flex items-center gap-3 mb-6">
    {num && (
      <span className="font-display italic text-xl" style={{ color: COLORS.brand }}>
        {num}.
      </span>
    )}
    <span className="font-body text-xs uppercase tracking-wider2" style={{ color: COLORS.muted }}>
      {children}
    </span>
    <div className="flex-1 h-px" style={{ background: COLORS.line }} />
  </div>
);

/* ====================================================================
   HEADER
   ==================================================================== */

const Header = ({ onStartQuote }) => (
  <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: `${COLORS.cream}E6`, borderBottom: `1px solid ${COLORS.line}` }}>
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.ink }}>
          <Wrench size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div className="font-display font-bold text-xl leading-none" style={{ color: COLORS.ink }}>RepairPro</div>
          <div className="font-body text-2xs uppercase tracking-wider2" style={{ color: COLORS.muted }}>Atelier de réparation</div>
        </div>
      </a>
      <nav className="hidden md:flex items-center gap-7 font-body text-sm" style={{ color: COLORS.ink2 }}>
        <a href="#services" className="hover:opacity-70">Services</a>
        <a href="#tarifs" className="hover:opacity-70">Tarifs</a>
        <a href="#about" className="hover:opacity-70">À propos</a>
        <a href="#contact" className="hover:opacity-70">Contact</a>
      </nav>
      <div className="flex items-center gap-2">
        <Button onClick={onStartQuote} icon={ArrowRight}>Devis instantané</Button>
      </div>
    </div>
  </header>
);

/* ====================================================================
   HERO
   ==================================================================== */

const Hero = ({ onStartQuote }) => (
  <section className="relative grid-bg" style={{ background: COLORS.cream }}>
    <div className="absolute inset-0 noise pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative">
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8 anim-fade-up">
          <Pill color="brand">
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: COLORS.brand }} />
            Garantie 12 mois sur toutes les pièces
          </Pill>
          <h1 className="mt-6 font-display font-bold tracking-tight" style={{ color: COLORS.ink, fontSize: "clamp(48px, 8vw, 112px)", lineHeight: 0.95 }}>
            Votre iPhone,<br />
            <span className="italic font-light" style={{ color: COLORS.brand }}>comme neuf</span>
            <span className="font-display"> en 30 minutes.</span>
          </h1>
          <p className="mt-7 font-body text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: COLORS.ink2 }}>
            Devis instantané en ligne, prise de rendez-vous immédiate, prix transparents. Plus de surprise — vous savez ce que vous payez avant de venir.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={onStartQuote} icon={ArrowRight} className="text-base">Calculer mon devis</Button>
            <a href="#tarifs">
              <Button variant="outline" className="text-base">Voir les tarifs</Button>
            </a>
          </div>
        </div>
        <div className="md:col-span-4 hidden md:block">
          <div className="relative">
            <div className="rounded-2xl p-7 card-shadow" style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}` }}>
              <div className="flex items-center justify-between mb-5">
                <div className="font-body text-xs uppercase tracking-wider2" style={{ color: COLORS.muted }}>Aujourd'hui</div>
                <Pill color="green"><Check size={11} strokeWidth={3}/> En activité</Pill>
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "iPhone 13 — Écran",        time: "30 min", price: "99 €" },
                  { label: "iPhone 14 Pro — Batterie", time: "45 min", price: "50 €" },
                  { label: "iPhone 12 — Connecteur",   time: "1h",      price: "60 €" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: COLORS.line }}>
                    <div>
                      <div className="font-body font-medium text-sm" style={{ color: COLORS.ink }}>{r.label}</div>
                      <div className="font-body text-xs flex items-center gap-1.5 mt-1" style={{ color: COLORS.muted }}>
                        <Clock size={11}/>{r.time}
                      </div>
                    </div>
                    <div className="font-display font-bold text-lg" style={{ color: COLORS.ink }}>{r.price}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 flex items-center gap-2 font-body text-xs" style={{ color: COLORS.muted, borderTop: `1px solid ${COLORS.line}` }}>
                <Sparkles size={12} style={{ color: COLORS.brand }} />
                Tous prix TTC, pose comprise
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-xs uppercase tracking-wider transform rotate-12" style={{ background: COLORS.brand, color: "#fff" }}>
              Devis<br/>gratuit
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ====================================================================
   SECTION VALEURS
   ==================================================================== */

const ValueSection = () => {
  const items = [
    { icon: Hourglass, title: "30 min à 2h",    desc: "La majorité de nos réparations sont effectuées sur place le jour même." },
    { icon: Award,     title: "Garantie 12 mois", desc: "Toutes nos pièces sont garanties un an, même après un choc accidentel." },
    { icon: Sparkles,  title: "Pièces premium",   desc: "OLED, Soft OLED ou compatibles certifiées — vous choisissez la qualité." },
    { icon: Star,      title: "Prix transparents", desc: "Vous obtenez le tarif définitif avant de prendre rendez-vous." },
  ];
  return (
    <section id="services" className="py-20 md:py-28" style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel num="01">Pourquoi nous</SectionLabel>
        <h2 className="font-display font-bold tracking-tight mb-14 max-w-3xl" style={{ color: COLORS.ink, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.05 }}>
          Une promesse simple : <span className="italic font-light" style={{ color: COLORS.brand }}>vous repartez le sourire aux lèvres.</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: COLORS.line }}>
          {items.map((it, i) => (
            <div key={i} className="p-7 transition-colors duration-300 hover:bg-white" style={{ background: COLORS.paper }}>
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: COLORS.ink, color: "#fff" }}>
                <it.icon size={20} strokeWidth={2}/>
              </div>
              <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: COLORS.ink }}>{it.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: COLORS.ink2 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ====================================================================
   QUOTE BUILDER — Configurateur de devis
   ==================================================================== */

const QuoteBuilder = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState(null); // 'iphone' | 'other'
  const [model, setModel] = useState(null);
  const [repair, setRepair] = useState(null);
  const [option, setOption] = useState(null); // screen quality OR board service
  // Other brand
  const [otherBrand, setOtherBrand] = useState("");
  const [otherModel, setOtherModel] = useState("");
  const [otherIssue, setOtherIssue] = useState("");
  // Contact / appointment
  const [contact, setContact] = useState({ name: "", email: "", phone: "", date: "", time: "", note: "" });
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step, open]);

  useEffect(() => {
    if (!open) { setStep(0); setPath(null); setModel(null); setRepair(null); setOption(null); setSubmitted(null); }
  }, [open]);

  const reset = () => { setStep(0); setPath(null); setModel(null); setRepair(null); setOption(null); setSubmitted(null);
    setContact({ name: "", email: "", phone: "", date: "", time: "", note: "" });
    setOtherBrand(""); setOtherModel(""); setOtherIssue(""); };

  const filteredModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return IPHONE_DATA;
    return IPHONE_DATA.filter(m => m.model.toLowerCase().includes(q));
  }, [search]);

  // ===== Calcul du prix =====
  const quote = useMemo(() => {
    if (path === "other") return null;
    if (!model || !repair) return null;
    const m = IPHONE_DATA.find(x => x.model === model);
    if (!m) return null;
    let label = "", price = null, detail = "";
    if (repair === "screen") {
      if (!option) return null;
      const s = m.screen[option];
      if (s == null) return null;
      label = `Écran ${SCREEN_TYPES[option].label}`;
      price = s;
      detail = SCREEN_TYPES[option].desc;
    } else if (repair === "battery") {
      label = "Batterie + diagnostic santé";
      price = m.battery;
    } else if (repair === "back") {
      if (!m.backGlass) return { unavailable: "Cet iPhone a une coque arrière en aluminium — pas de vitre à remplacer." };
      label = "Vitre arrière (démontage laser)";
      price = m.backGlass.price;
      detail = m.backGlass.availability;
    } else if (repair === "charge") {
      label = `Connecteur de charge ${m.charging.type}`;
      price = m.charging.price;
      detail = "Inclut nappe complète : charge + micro + antenne";
    } else if (repair === "board") {
      if (!option) return null;
      const svc = BOARD_SERVICES.find(s => s.id === option);
      if (svc.free) { label = "Diagnostic carte mère"; price = 0; detail = "Gratuit en cas de réparation"; }
      else { label = svc.label; price = m.board[svc.priceKey]; detail = svc.desc; }
    }
    return { label, price, detail, model };
  }, [path, model, repair, option]);

  // ===== Submit =====
  // Pour recevoir les demandes par email, créez un compte gratuit sur https://formspree.io
  // puis remplacez "VOTRE_ID_FORMSPREE" ci-dessous par l'ID que Formspree vous donnera (ex: xpzgkqer)
  const FORMSPREE_ID = "xqewvpkb";

  const handleSubmit = async () => {
    if (!contact.name || !contact.phone || !contact.date || !contact.time) return;
    setSaving(true);
    const booking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      type: path,
      model: path === "iphone" ? model : `${otherBrand} ${otherModel}`,
      repair: path === "iphone" ? (REPAIR_TYPES.find(r => r.id === repair)?.label) : "Devis personnalisé",
      option: option || null,
      issueDescription: path === "other" ? otherIssue : null,
      price: path === "iphone" ? (quote?.price ?? null) : null,
      label: path === "iphone" ? quote?.label : null,
      contact,
    };
    try {
      // Envoi de la demande à Formspree, qui forwarde par email à ixititoure@gmail.com
      if (FORMSPREE_ID && FORMSPREE_ID !== "xqewvpkb") {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `Nouvelle demande RDV — ${booking.contact.name} (${booking.model})`,
            reference: booking.id,
            date_creation: new Date(booking.createdAt).toLocaleString("fr-FR"),
            type_demande: booking.type === "iphone" ? "Devis instantané iPhone" : "Devis personnalisé (autre marque)",
            appareil: booking.model,
            reparation: booking.label || booking.repair,
            description: booking.issueDescription || "—",
            prix_estime: booking.price != null ? `${booking.price} €` : "À définir",
            nom: booking.contact.name,
            telephone: booking.contact.phone,
            email: booking.contact.email || "—",
            rdv_date: booking.contact.date,
            rdv_heure: booking.contact.time,
            note: booking.contact.note || "—",
          }),
        });
      } else {
        console.warn("⚠️ Formspree non configuré : la demande n'a pas été envoyée par email. Configurez FORMSPREE_ID dans App.jsx");
      }
    } catch (e) {
      console.error("Erreur d'envoi:", e);
    }
    setSaving(false);
    setSubmitted(booking);
  };

  if (!open) return null;

  // ===== Validation des étapes pour activer "Suivant" =====
  const canContinue = (() => {
    if (step === 0) return path != null;
    if (path === "iphone") {
      if (step === 1) return model != null;
      if (step === 2) return repair != null;
      if (step === 3) {
        if (repair === "screen") return option != null;
        if (repair === "board")  return option != null;
        return true;
      }
      if (step === 4) return contact.name && contact.phone && contact.date && contact.time;
    }
    if (path === "other") {
      if (step === 1) return otherBrand && otherModel.trim().length > 0;
      if (step === 2) return otherIssue.trim().length > 5;
      if (step === 3) return contact.name && contact.phone && contact.date && contact.time;
    }
    return false;
  })();

  // skip option step if not needed
  const goNext = () => {
    if (path === "iphone" && step === 2) {
      const needsOption = (repair === "screen") || (repair === "board");
      if (!needsOption) { setStep(4); return; }
    }
    setStep(s => s + 1);
  };
  const goBack = () => {
    if (path === "iphone" && step === 4) {
      const needsOption = (repair === "screen") || (repair === "board");
      if (!needsOption) { setStep(2); return; }
    }
    setStep(s => Math.max(0, s - 1));
  };

  const totalSteps = path === "iphone" ? 5 : (path === "other" ? 4 : 1);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center" style={{ background: "rgba(22,20,18,0.6)" }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div ref={scrollRef} className="relative w-full md:max-w-3xl h-full md:h-auto md:max-h-92vh overflow-y-auto md:rounded-2xl card-shadow" style={{ background: COLORS.paper }}>

        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-7 py-4" style={{ background: `${COLORS.paper}F2`, borderBottom: `1px solid ${COLORS.line}`, backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-3">
            <div className="font-body text-xs uppercase tracking-wider2" style={{ color: COLORS.muted }}>
              {submitted ? "Réservation confirmée" : `Étape ${step + 1} / ${totalSteps}`}
            </div>
            {!submitted && (
              <div className="hidden sm:flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className="w-6 h-1 rounded-full transition-colors" style={{ background: i <= step ? COLORS.brand : COLORS.line2 }} />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!submitted && step > 0 && <button onClick={reset} className="font-body text-xs hover:underline" style={{ color: COLORS.muted }}>Recommencer</button>}
            <button onClick={onClose} className="p-2 rounded-md hover:bg-black/5" style={{ color: COLORS.ink }}><X size={18}/></button>
          </div>
        </div>

        <div className="px-5 md:px-10 py-8 md:py-10 anim-fade-up" key={`${step}-${path}-${repair}`}>

          {/* ============= CONFIRMATION ============= */}
          {submitted && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: COLORS.green }}>
                <Check size={28} color="#fff" strokeWidth={2.5}/>
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl mb-3" style={{ color: COLORS.ink }}>Merci {submitted.contact.name.split(" ")[0]} !</h3>
              <p className="font-body text-base mb-8 max-w-md mx-auto" style={{ color: COLORS.ink2 }}>
                Votre demande de rendez-vous a bien été enregistrée. Nous vous recontactons sous 24h pour confirmer le créneau.
              </p>
              <div className="max-w-md mx-auto rounded-xl p-6 text-left" style={{ background: COLORS.cream, border: `1px solid ${COLORS.line}` }}>
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                  <div className="font-body text-xs uppercase tracking-wider2" style={{ color: COLORS.muted }}>Référence</div>
                  <div className="font-display font-bold" style={{ color: COLORS.ink }}>{submitted.id}</div>
                </div>
                <div className="space-y-2.5 font-body text-sm">
                  <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Appareil</span><span style={{ color: COLORS.ink }} className="font-medium">{submitted.model}</span></div>
                  <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Réparation</span><span style={{ color: COLORS.ink }} className="font-medium">{submitted.label || submitted.repair}</span></div>
                  <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Date</span><span style={{ color: COLORS.ink }} className="font-medium">{submitted.contact.date} à {submitted.contact.time}</span></div>
                  {submitted.price != null && (
                    <div className="flex justify-between pt-3 mt-3" style={{ borderTop: `1px solid ${COLORS.line}` }}>
                      <span className="font-display italic" style={{ color: COLORS.muted }}>Total estimé</span>
                      <span className="font-display font-bold text-2xl" style={{ color: COLORS.brand }}>{submitted.price === 0 ? "Gratuit" : `${submitted.price} €`}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <Button onClick={onClose} variant="outline">Fermer</Button>
                <Button onClick={reset} icon={RefreshCw}>Nouveau devis</Button>
              </div>
            </div>
          )}

          {/* ============= STEP 0 : CHOIX MARQUE ============= */}
          {!submitted && step === 0 && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>
                Quelle est la marque <br/><span className="italic font-light" style={{ color: COLORS.brand }}>de votre appareil ?</span>
              </h3>
              <p className="font-body mb-9" style={{ color: COLORS.muted }}>Sélectionnez une option pour démarrer votre devis.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={() => { setPath("iphone"); setStep(1); }} className="text-left rounded-xl p-7 transition-all duration-300 hover-lift2 card-shadow" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
                  <div className="flex items-start justify-between mb-5">
                    <Smartphone size={32} style={{ color: COLORS.brand }} strokeWidth={1.5}/>
                    <Pill color="brand">Devis instantané</Pill>
                  </div>
                  <h4 className="font-display font-bold text-2xl mb-1" style={{ color: COLORS.ink }}>iPhone</h4>
                  <p className="font-body text-sm" style={{ color: COLORS.ink2 }}>Tarif définitif affiché immédiatement, modèle 5 jusqu'aux 16 Pro Max.</p>
                </button>
                <button onClick={() => { setPath("other"); setStep(1); }} className="text-left rounded-xl p-7 transition-all duration-300 hover-lift2 card-shadow" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
                  <div className="flex items-start justify-between mb-5">
                    <Wrench size={32} style={{ color: COLORS.green }} strokeWidth={1.5}/>
                    <Pill color="green">Devis sous 24h</Pill>
                  </div>
                  <h4 className="font-display font-bold text-2xl mb-1" style={{ color: COLORS.ink }}>Autre marque</h4>
                  <p className="font-body text-sm" style={{ color: COLORS.ink2 }}>Samsung, Xiaomi, Huawei, OnePlus… Devis personnalisé après diagnostic.</p>
                </button>
              </div>
            </div>
          )}

          {/* ============= IPHONE STEP 1 : MODEL ============= */}
          {!submitted && path === "iphone" && step === 1 && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>Quel <span className="italic font-light" style={{ color: COLORS.brand }}>modèle</span> ?</h3>
              <p className="font-body mb-6" style={{ color: COLORS.muted }}>Sélectionnez votre iPhone dans la liste.</p>
              <div className="relative mb-5">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: COLORS.muted }}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher (ex. iPhone 13 Pro)" className="w-full pl-10 pr-4 py-3 rounded-lg font-body text-sm focus:outline-none" style={{ background: "#fff", border: `1px solid ${COLORS.line}`, color: COLORS.ink }}/>
              </div>
              <div className="max-h-50vh overflow-y-auto rounded-xl" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
                {filteredModels.length === 0 && (
                  <div className="p-8 text-center font-body text-sm" style={{ color: COLORS.muted }}>Aucun modèle trouvé.</div>
                )}
                {filteredModels.map(m => (
                  <button key={m.model} onClick={() => setModel(m.model)} className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors`} style={{ background: model === m.model ? "#DBEAFE" : "transparent", borderBottom: `1px solid ${COLORS.line}` }}>
                    <div>
                      <div className="font-body font-medium text-sm" style={{ color: COLORS.ink }}>{m.model}</div>
                      <div className="font-body text-xs" style={{ color: COLORS.muted }}>{m.year}{m.screen.warn ? " · OLED recommandé" : ""}</div>
                    </div>
                    {model === m.model && <Check size={18} style={{ color: COLORS.brand }} strokeWidth={2.5}/>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============= IPHONE STEP 2 : TYPE DE RÉPARATION ============= */}
          {!submitted && path === "iphone" && step === 2 && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>Que faut-il <span className="italic font-light" style={{ color: COLORS.brand }}>réparer</span> ?</h3>
              <p className="font-body mb-7" style={{ color: COLORS.muted }}><span className="font-medium" style={{ color: COLORS.ink2 }}>{model}</span> · choisissez le type d'intervention.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {REPAIR_TYPES.map(t => {
                  const m = IPHONE_DATA.find(x => x.model === model);
                  const disabled = t.id === "back" && m && !m.backGlass;
                  return (
                    <button key={t.id} disabled={disabled} onClick={() => { setRepair(t.id); setOption(null); }} className={`text-left rounded-xl p-5 transition-all duration-200 ${disabled ? "opacity-40 cursor-not-allowed" : "hover-lift"}`} style={{ background: repair === t.id ? "#DBEAFE" : "#fff", border: `1px solid ${repair === t.id ? COLORS.brand : COLORS.line}`, boxShadow: repair === t.id ? `0 0 0 3px ${COLORS.brand}1A` : "none" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: COLORS.ink, color: "#fff" }}>
                          <t.icon size={18} strokeWidth={2}/>
                        </div>
                        <div>
                          <div className="font-display font-semibold text-lg" style={{ color: COLORS.ink }}>{t.label}</div>
                          <div className="font-body text-xs mt-0.5" style={{ color: COLORS.muted }}>{disabled ? "Coque alu — pas de vitre" : t.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============= IPHONE STEP 3 : OPTION (qualité écran ou service carte mère) ============= */}
          {!submitted && path === "iphone" && step === 3 && (repair === "screen" || repair === "board") && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>
                {repair === "screen" ? <>Quelle <span className="italic font-light" style={{ color: COLORS.brand }}>qualité</span> d'écran ?</> : <>Quel <span className="italic font-light" style={{ color: COLORS.brand }}>service</span> ?</>}
              </h3>
              <p className="font-body mb-7" style={{ color: COLORS.muted }}>{model} · choisissez l'option qui vous convient.</p>

              {repair === "screen" && (() => {
                const m = IPHONE_DATA.find(x => x.model === model);
                const variants = ["incell", "oled", "soft"].filter(k => m?.screen?.[k] != null);
                return (
                  <>
                    {m?.screen?.warn && (
                      <div className="mb-5 p-4 rounded-lg flex gap-3 items-start" style={{ background: "#FEF3C7", border: `1px solid ${COLORS.amber}66` }}>
                        <AlertTriangle size={18} style={{ color: "#92400E" }} className="flex-shrink-0 mt-0.5"/>
                        <div className="font-body text-sm" style={{ color: "#78350F" }}>
                          <strong>iPhone 12 et plus :</strong> nous recommandons <strong>OLED ou Soft OLED</strong>. Un écran Incell/TFT peut entraîner surchauffe et dégradation rapide de la batterie.
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      {variants.map(k => (
                        <button key={k} onClick={() => setOption(k)} className="w-full text-left rounded-xl p-5 transition-all duration-200 hover-lift" style={{ background: option === k ? "#DBEAFE" : "#fff", border: `1px solid ${option === k ? COLORS.brand : COLORS.line}` }}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-display font-semibold text-lg" style={{ color: COLORS.ink }}>{SCREEN_TYPES[k].label}</div>
                                {k === "soft" && <Pill color="amber">Premium</Pill>}
                                {k === "oled"  && <Pill color="green">Recommandé</Pill>}
                              </div>
                              <div className="font-body text-xs leading-relaxed" style={{ color: COLORS.muted }}>{SCREEN_TYPES[k].desc}</div>
                            </div>
                            <div className="font-display font-bold text-2xl flex-shrink-0" style={{ color: COLORS.ink }}>{m.screen[k]} €</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                );
              })()}

              {repair === "board" && (() => {
                const m = IPHONE_DATA.find(x => x.model === model);
                return (
                  <div className="space-y-3">
                    {BOARD_SERVICES.map(s => (
                      <button key={s.id} onClick={() => setOption(s.id)} className="w-full text-left rounded-xl p-5 transition-all duration-200 hover-lift" style={{ background: option === s.id ? "#DBEAFE" : "#fff", border: `1px solid ${option === s.id ? COLORS.brand : COLORS.line}` }}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-display font-semibold text-lg mb-0.5" style={{ color: COLORS.ink }}>{s.label}</div>
                            <div className="font-body text-xs" style={{ color: COLORS.muted }}>{s.desc}</div>
                          </div>
                          <div className="font-display font-bold text-2xl flex-shrink-0" style={{ color: COLORS.ink }}>
                            {s.free ? "Gratuit" : `${m.board[s.priceKey]} €`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ============= IPHONE STEP 4 : RECAP + COORDONNÉES ============= */}
          {!submitted && path === "iphone" && step === 4 && (
            <ContactForm
              quoteSummary={
                quote?.unavailable ? null : (
                  <QuoteRecap model={model} repair={REPAIR_TYPES.find(r => r.id === repair)?.label} option={quote?.label} price={quote?.price} detail={quote?.detail}/>
                )
              }
              unavailable={quote?.unavailable}
              contact={contact} setContact={setContact}
            />
          )}

          {/* ============= OTHER STEP 1 : MARQUE & MODÈLE ============= */}
          {!submitted && path === "other" && step === 1 && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>Votre <span className="italic font-light" style={{ color: COLORS.brand }}>appareil</span></h3>
              <p className="font-body mb-7" style={{ color: COLORS.muted }}>Pour les marques autres qu'Apple, le tarif sera établi après diagnostic. Nous vous recontactons sous 24h.</p>
              <div className="space-y-5">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider1 mb-2 block" style={{ color: COLORS.muted }}>Marque</label>
                  <div className="flex flex-wrap gap-2">
                    {OTHER_BRANDS.map(b => (
                      <button key={b} onClick={() => setOtherBrand(b)} className="px-4 py-2 rounded-full font-body text-sm transition-colors" style={{ background: otherBrand === b ? COLORS.ink : "#fff", color: otherBrand === b ? "#fff" : COLORS.ink, border: `1px solid ${otherBrand === b ? COLORS.ink : COLORS.line}` }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider1 mb-2 block" style={{ color: COLORS.muted }}>Modèle exact</label>
                  <input value={otherModel} onChange={e => setOtherModel(e.target.value)} placeholder="ex. Galaxy S23 Ultra, Redmi Note 12…" className="w-full px-4 py-3 rounded-lg font-body text-sm focus:outline-none" style={{ background: "#fff", border: `1px solid ${COLORS.line}`, color: COLORS.ink }}/>
                </div>
              </div>
            </div>
          )}

          {/* ============= OTHER STEP 2 : DESCRIPTION DU PROBLÈME ============= */}
          {!submitted && path === "other" && step === 2 && (
            <div>
              <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>Décrivez la <span className="italic font-light" style={{ color: COLORS.brand }}>panne</span></h3>
              <p className="font-body mb-7" style={{ color: COLORS.muted }}>{otherBrand} {otherModel} · Plus c'est précis, plus le devis sera juste.</p>
              <textarea value={otherIssue} onChange={e => setOtherIssue(e.target.value)} rows={6} placeholder="Ex. : écran fissuré sur tout l'angle inférieur droit, l'affichage fonctionne mais le tactile n'est plus réactif sur la moitié droite. Tombé hier d'environ 1 mètre." className="w-full px-4 py-3.5 rounded-lg font-body text-sm focus:outline-none resize-none" style={{ background: "#fff", border: `1px solid ${COLORS.line}`, color: COLORS.ink }}/>
              <div className="mt-3 font-body text-xs flex items-center gap-1.5" style={{ color: COLORS.muted }}>
                <Inbox size={12}/> Vous pouvez préciser quand est arrivée la panne, si l'appareil est tombé, mouillé, etc.
              </div>
            </div>
          )}

          {/* ============= OTHER STEP 3 : COORDONNÉES ============= */}
          {!submitted && path === "other" && step === 3 && (
            <ContactForm
              quoteSummary={
                <div className="rounded-xl p-5" style={{ background: COLORS.cream, border: `1px solid ${COLORS.line}` }}>
                  <Pill color="green">Devis personnalisé sous 24h</Pill>
                  <div className="mt-3 font-display font-semibold text-lg" style={{ color: COLORS.ink }}>{otherBrand} {otherModel}</div>
                  <div className="font-body text-sm mt-1" style={{ color: COLORS.ink2 }}>{otherIssue}</div>
                  <div className="font-body text-xs mt-3" style={{ color: COLORS.muted }}>Le tarif définitif vous sera communiqué après diagnostic gratuit. Aucun engagement.</div>
                </div>
              }
              contact={contact} setContact={setContact}
            />
          )}

          {/* ============= NAVIGATION ============= */}
          {!submitted && (
            <div className="mt-10 flex items-center justify-between">
              <button onClick={goBack} disabled={step === 0} className="flex items-center gap-1.5 font-body text-sm disabled:opacity-30" style={{ color: COLORS.ink }}>
                <ChevronLeft size={16}/> Retour
              </button>
              {(path === "iphone" && step === 4) || (path === "other" && step === 3) ? (
                <Button onClick={handleSubmit} disabled={!canContinue || saving} icon={saving ? Hourglass : Check}>
                  {saving ? "Envoi en cours…" : "Confirmer la demande"}
                </Button>
              ) : (
                <Button onClick={goNext} disabled={!canContinue} icon={ChevronRight}>
                  Continuer
                </Button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const QuoteRecap = ({ model, repair, option, price, detail }) => (
  <div className="rounded-xl p-5 mb-2" style={{ background: COLORS.cream, border: `1px solid ${COLORS.line}` }}>
    <Pill color="brand">Devis instantané</Pill>
    <div className="mt-3 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="font-display font-semibold text-lg leading-tight" style={{ color: COLORS.ink }}>{model}</div>
        <div className="font-body text-sm mt-0.5" style={{ color: COLORS.ink2 }}>{repair}{option ? ` — ${option}` : ""}</div>
        {detail && <div className="font-body text-xs mt-1.5" style={{ color: COLORS.muted }}>{detail}</div>}
      </div>
      <div className="font-display font-bold text-3xl md:text-4xl flex-shrink-0" style={{ color: COLORS.brand }}>
        {price === 0 ? "Gratuit" : `${price} €`}
      </div>
    </div>
    <div className="mt-4 pt-4 flex items-center gap-4 font-body text-xs flex-wrap" style={{ color: COLORS.muted, borderTop: `1px solid ${COLORS.line}` }}>
      <span className="flex items-center gap-1.5"><Award size={12}/> Garantie 12 mois</span>
      <span className="flex items-center gap-1.5"><Clock size={12}/> 30 min à 2h</span>
      <span className="flex items-center gap-1.5"><Sparkles size={12}/> TTC, pose comprise</span>
    </div>
  </div>
);

const ContactForm = ({ quoteSummary, unavailable, contact, setContact }) => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div>
      <h3 className="font-display font-bold mb-2" style={{ color: COLORS.ink, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>Vos <span className="italic font-light" style={{ color: COLORS.brand }}>coordonnées</span></h3>
      <p className="font-body mb-6" style={{ color: COLORS.muted }}>Pour confirmer votre rendez-vous.</p>

      {unavailable && (
        <div className="mb-5 p-4 rounded-lg flex gap-3 items-start" style={{ background: "#FEF3C7", border: `1px solid ${COLORS.amber}66` }}>
          <AlertTriangle size={18} style={{ color: "#92400E" }} className="flex-shrink-0 mt-0.5"/>
          <div className="font-body text-sm" style={{ color: "#78350F" }}>{unavailable}</div>
        </div>
      )}

      {quoteSummary && <div className="mb-7">{quoteSummary}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom complet *" icon={User}>
          <input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} placeholder="Jean Dupont" className="bare-input"/>
        </Field>
        <Field label="Téléphone *" icon={Phone}>
          <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="06 12 34 56 78" className="bare-input"/>
        </Field>
        <Field label="Email" icon={Mail}>
          <input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="vous@exemple.fr" className="bare-input"/>
        </Field>
        <Field label="Date souhaitée *" icon={Calendar}>
          <input type="date" min={today} value={contact.date} onChange={e => setContact({ ...contact, date: e.target.value })} className="bare-input"/>
        </Field>
      </div>

      <div className="mt-4">
        <label className="font-body text-xs uppercase tracking-wider1 mb-2 block" style={{ color: COLORS.muted }}>Créneau souhaité *</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {TIME_SLOTS.map(t => (
            <button key={t} onClick={() => setContact({ ...contact, time: t })} className="py-2 rounded-md font-body text-xs transition-colors" style={{ background: contact.time === t ? COLORS.ink : "#fff", color: contact.time === t ? "#fff" : COLORS.ink, border: `1px solid ${contact.time === t ? COLORS.ink : COLORS.line}` }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Field label="Note (facultatif)" icon={MessageSquare}>
          <textarea rows={2} value={contact.note} onChange={e => setContact({ ...contact, note: e.target.value })} placeholder="Une précision à nous transmettre ?" className="bare-input resize-none"/>
        </Field>
      </div>

      <style>{`
        .bare-input { width: 100%; background: #fff; border: 1px solid ${COLORS.line}; color: ${COLORS.ink}; padding: 0.7rem 0.9rem; border-radius: 0.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; outline: none; }
        .bare-input:focus { border-color: ${COLORS.brand}; box-shadow: 0 0 0 3px ${COLORS.brand}22; }
      `}</style>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="font-body text-xs uppercase tracking-wider1 mb-2 block flex items-center gap-1.5" style={{ color: COLORS.muted }}>
      {Icon && <Icon size={11}/>} {label}
    </label>
    {children}
  </div>
);

/* ====================================================================
   GRILLE TARIFAIRE PUBLIQUE
   ==================================================================== */

const PricingTable = () => {
  const [tab, setTab] = useState("screen");
  const tabs = [
    { id: "screen",  label: "Écran" },
    { id: "battery", label: "Batterie" },
    { id: "back",    label: "Vitre arrière" },
    { id: "charge",  label: "Connecteur" },
    { id: "board",   label: "Carte mère" },
  ];
  return (
    <section id="tarifs" className="py-20 md:py-28" style={{ background: COLORS.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel num="02">Grille tarifaire iPhone</SectionLabel>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h2 className="font-display font-bold tracking-tight max-w-3xl" style={{ color: COLORS.ink, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.05 }}>
            Aucune surprise, <span className="italic font-light" style={{ color: COLORS.brand }}>jamais.</span>
          </h2>
          <p className="font-body max-w-md" style={{ color: COLORS.ink2 }}>
            Tarifs TTC, pose comprise, garantie 12 mois sur les pièces. Pour un devis sur d'autres marques, utilisez notre formulaire.
          </p>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-colors" style={{ background: tab === t.id ? COLORS.ink : "#fff", color: tab === t.id ? "#fff" : COLORS.ink, border: `1px solid ${tab === t.id ? COLORS.ink : COLORS.line}` }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl overflow-hidden card-shadow" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr style={{ background: COLORS.paper, borderBottom: `1px solid ${COLORS.line}` }}>
                  <th className="text-left px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Modèle</th>
                  {tab === "screen" && <>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Incell/TFT</th>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>OLED</th>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Soft OLED</th>
                  </>}
                  {tab === "battery" && <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Tarif</th>}
                  {tab === "back"    && <><th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Tarif</th><th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Disponibilité</th></>}
                  {tab === "charge"  && <><th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Tarif</th><th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Connecteur</th></>}
                  {tab === "board"   && <>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Diagnostic</th>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Micro-soudure</th>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Récupération</th>
                    <th className="text-right px-5 py-3.5 font-medium uppercase text-xs tracking-wider" style={{ color: COLORS.muted }}>Réparation</th>
                  </>}
                </tr>
              </thead>
              <tbody>
                {IPHONE_DATA.map((m, i) => (
                  <tr key={m.model} style={{ borderBottom: i < IPHONE_DATA.length - 1 ? `1px solid ${COLORS.line}` : "none", background: i % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: COLORS.ink }}>{m.model}</td>
                    {tab === "screen" && <>
                      <td className="px-5 py-3 text-right tabular-nums" style={{ color: m.screen.warn && m.screen.incell ? COLORS.amber : COLORS.ink }}>
                        {m.screen.incell != null ? `${m.screen.incell} €` : "—"}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums" style={{ color: COLORS.ink }}>{m.screen.oled != null ? `${m.screen.oled} €` : "—"}</td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold" style={{ color: COLORS.ink }}>{m.screen.soft != null ? `${m.screen.soft} €` : "—"}</td>
                    </>}
                    {tab === "battery" && <td className="px-5 py-3 text-right tabular-nums font-semibold" style={{ color: COLORS.ink }}>{m.battery} €</td>}
                    {tab === "back"    && <>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold" style={{ color: m.backGlass ? COLORS.ink : COLORS.muted }}>{m.backGlass ? `${m.backGlass.price} €` : "—"}</td>
                      <td className="px-5 py-3 text-right text-xs" style={{ color: COLORS.muted }}>{m.backGlass ? m.backGlass.availability : "Coque alu"}</td>
                    </>}
                    {tab === "charge"  && <>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold" style={{ color: COLORS.ink }}>{m.charging.price} €</td>
                      <td className="px-5 py-3 text-right text-xs" style={{ color: COLORS.muted }}>{m.charging.type}</td>
                    </>}
                    {tab === "board"   && <>
                      <td className="px-5 py-3 text-right tabular-nums" style={{ color: COLORS.green }}>Gratuit</td>
                      <td className="px-5 py-3 text-right tabular-nums" style={{ color: COLORS.ink }}>{m.board.micro} €</td>
                      <td className="px-5 py-3 text-right tabular-nums" style={{ color: COLORS.ink }}>{m.board.recovery} €</td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold" style={{ color: COLORS.ink }}>{m.board.repair} €</td>
                    </>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-5 font-body text-xs" style={{ color: COLORS.muted }}>
          ⚠️ Sur iPhone 12 et plus, l'écran Incell/TFT est réservé à la récupération de données — un OLED est fortement recommandé. Pour iPhone 14/15/16 Pro &amp; Pro Max, l'Incell n'est pas disponible (technologie LTPO).
        </p>
      </div>
    </section>
  );
};

/* ====================================================================
   FAQ
   ==================================================================== */

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const items = [
    { q: "Combien de temps prend une réparation ?", a: "La majorité des réparations (écran, batterie, connecteur) sont effectuées sur place en 30 minutes à 2 heures. Les interventions complexes (carte mère, vitre arrière sur commande) peuvent demander 24 à 48h." },
    { q: "Quelle est la différence entre OLED et Soft OLED ?", a: "L'OLED rigide est une dalle aftermarket de bonne qualité, fidèle en couleurs, compatible Face ID et True Tone. La Soft OLED est une dalle souple équivalente à l'écran d'origine Apple — touch plus fluide, bordures plus fines. Recommandée pour les utilisateurs exigeants." },
    { q: "La garantie 12 mois couvre-t-elle un nouveau choc ?", a: "Notre garantie couvre les défauts liés à la pièce ou à la pose. En cas de chute ou de choc accidentel après réparation, la garantie ne s'applique pas, mais nous offrons un tarif fidélité pour la nouvelle intervention." },
    { q: "Mon téléphone n'est pas un iPhone, comment obtenir un devis ?", a: "Sélectionnez « Autre marque » dans le configurateur. Décrivez le modèle et la panne — nous revenons vers vous sous 24h avec un devis ferme. Diagnostic gratuit dans tous les cas." },
    { q: "Acceptez-vous les téléphones avec un écran complètement HS ?", a: "Oui. Tant qu'on peut accéder à la carte mère, nous pouvons souvent récupérer vos données avant remplacement. Demandez le service « Récupération de données »." },
  ];
  return (
    <section className="py-20 md:py-28" style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}` }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionLabel num="03">Questions fréquentes</SectionLabel>
        <h2 className="font-display font-bold tracking-tight mb-10" style={{ color: COLORS.ink, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.05 }}>
          Vos doutes, <span className="italic font-light" style={{ color: COLORS.brand }}>levés.</span>
        </h2>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left">
                <span className="font-display font-semibold text-lg" style={{ color: COLORS.ink }}>{it.q}</span>
                <span className="font-display font-bold text-2xl flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300" style={{ background: open === i ? COLORS.brand : COLORS.cream, color: open === i ? "#fff" : COLORS.ink, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 -mt-1 font-body text-sm leading-relaxed anim-fade-up" style={{ color: COLORS.ink2 }}>{it.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ====================================================================
   CONTACT / FOOTER
   ==================================================================== */

const Contact = ({ onStartQuote }) => {
  const ACCENT = "#60A5FA"; // light blue accent on dark bg (more readable than brand blue on black)
  const SOFT   = "#CBD5E1"; // cool gray for body text on dark
  return (
    <section id="contact" className="py-20 md:py-28" style={{ background: COLORS.ink, color: "#fff" }}>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <div className="font-body text-xs uppercase tracking-wider2 mb-5" style={{ color: ACCENT }}>04 — On en parle ?</div>
          <h2 className="font-display font-bold tracking-tight mb-7" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1 }}>
            Prêt à donner une <br/><span className="italic font-light" style={{ color: ACCENT }}>seconde vie</span> à votre téléphone ?
          </h2>
          <p className="font-body text-lg max-w-xl mb-9" style={{ color: SOFT }}>
            Le devis prend deux minutes. La réparation, à peine plus. Et la satisfaction, elle, dure douze mois.
          </p>
          <Button onClick={onStartQuote} icon={ArrowRight}>Démarrer mon devis</Button>
        </div>
        <div id="about" className="md:col-span-5">
          <div className="rounded-2xl p-7" style={{ background: "#FFFFFF0A", border: `1px solid #FFFFFF1A` }}>
            <div className="font-body text-xs uppercase tracking-wider2 mb-4" style={{ color: ACCENT }}>L'atelier</div>
            <div className="space-y-4 font-body text-sm">
              <div className="flex items-start gap-3"><MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: ACCENT }}/><div><div className="font-medium">Adresse</div><div style={{ color: SOFT }}>Rue Charles de Gaulle<br/>42000 Saint-Étienne</div></div></div>
              <div className="flex items-start gap-3"><Phone size={18} className="flex-shrink-0 mt-0.5" style={{ color: ACCENT }}/><div><div className="font-medium">Téléphone</div><a href="tel:+33745376436" className="hover:underline" style={{ color: SOFT }}>07 45 37 64 36</a></div></div>
              <div className="flex items-start gap-3"><Ghost size={18} className="flex-shrink-0 mt-0.5" style={{ color: ACCENT }}/><div><div className="font-medium">Snapchat</div><div style={{ color: SOFT }}>ixititoure</div></div></div>
              <div className="flex items-start gap-3"><Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color: ACCENT }}/><div><div className="font-medium">Horaires</div><div style={{ color: SOFT }}>Ouvert tous les jours</div></div></div>
              <div className="flex items-start gap-3"><Mail size={18} className="flex-shrink-0 mt-0.5" style={{ color: ACCENT }}/><div><div className="font-medium">Email</div><a href="mailto:ixititoure@gmail.com" className="hover:underline break-all" style={{ color: SOFT }}>ixititoure@gmail.com</a></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs" style={{ color: "#94A3B8", borderTop: "1px solid #FFFFFF1A" }}>
        <div>© {new Date().getFullYear()} RepairPro · Saint-Étienne. Tarifs TTC. TVA 20% incluse.</div>
        <div>Garantie 12 mois · Pièces certifiées · Diagnostic gratuit</div>
      </div>
    </section>
  );
};


/* ====================================================================
   APP RACINE
   ==================================================================== */

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="font-body" style={{ background: COLORS.cream, color: COLORS.ink, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>
      <div id="top"/>
      <Header onStartQuote={() => setQuoteOpen(true)}/>
      <Hero onStartQuote={() => setQuoteOpen(true)}/>
      <ValueSection/>
      <PricingTable/>
      <FAQ/>
      <Contact onStartQuote={() => setQuoteOpen(true)}/>
      <QuoteBuilder open={quoteOpen} onClose={() => setQuoteOpen(false)}/>
    </div>
  );
}
