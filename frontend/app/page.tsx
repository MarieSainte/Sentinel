"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import {
  Archive,
  Bot,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  Database,
  FilePenLine,
  FileText,
  Fingerprint,
  Globe2,
  Link2,
  MessageSquareText,
  Network,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Split,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TrustLevel = "evidence" | "plausible" | "weak";
type ThemeName = "editorial" | "night" | "contrast";

type Message = {
  id: number;
  role: "bot" | "user";
  author: string;
  time: string;
  text: string;
};

type TrustOption = {
  id: TrustLevel;
  label: string;
  copy: string;
  icon: LucideIcon;
  color: string;
  soft: string;
};

const trustOptions: TrustOption[] = [
  {
    id: "evidence",
    label: "Étayé par preuves",
    copy: "Source jointe ou trace exploitable",
    icon: ShieldCheck,
    color: "var(--evidence)",
    soft: "var(--evidence-soft)",
  },
  {
    id: "plausible",
    label: "Plausible à vérifier",
    copy: "Cohérent, sans confirmation",
    icon: CircleHelp,
    color: "var(--plausible)",
    soft: "var(--plausible-soft)",
  },
  {
    id: "weak",
    label: "Signal faible",
    copy: "Indice fragile ou isolé",
    icon: Fingerprint,
    color: "var(--weak)",
    soft: "var(--weak-soft)",
  },
];

const themes = [
  {
    id: "editorial" as const,
    label: "Editorial",
    swatch: ["#fffdf8", "#b8203a", "#117348"],
  },
  {
    id: "night" as const,
    label: "Nocturne",
    swatch: ["#1d2022", "#e3a23b", "#68b8ca"],
  },
  {
    id: "contrast" as const,
    label: "Contraste",
    swatch: ["#ffffff", "#005f8f", "#006b3c"],
  },
];

const seedMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    author: "Sentinel",
    time: "09:41",
    text: "Je suis prêt à structurer une nouvelle information. Ajoute le niveau de fiabilité, les preuves disponibles et les noms ou lieux à préserver.",
  },
  {
    id: 2,
    role: "user",
    author: "Marie",
    time: "09:43",
    text: "Un ancien employé mentionne des achats récurrents via deux sociétés écrans entre Lyon et Genève. Le nom Atlas revient dans les factures.",
  },
  {
    id: 3,
    role: "bot",
    author: "Sentinel",
    time: "09:43",
    text: "Entrée préparée pour indexation. Je propose une relation Organisation -> Transaction -> Lieu, avec Atlas comme entité à confirmer.",
  },
];

const routes = [
  {
    label: "Structurelle",
    meta: "faits, dates, montants, statuts",
    badge: "SQL",
  },
  {
    label: "Graphe",
    meta: "personnes, sociétés, lieux, liens",
    badge: "Graph",
  },
  {
    label: "Vectorielle",
    meta: "notes, citations, documents longs",
    badge: "Vector",
  },
];

const navItems = [
  { label: "Saisie", icon: MessageSquareText, active: true },
  { label: "Sources", icon: Archive, active: false },
  { label: "Graphe", icon: Network, active: false },
  { label: "Rapports", icon: FilePenLine, active: false },
];

function statusTone(level: TrustLevel) {
  if (level === "evidence") {
    return "preuve jointe";
  }

  if (level === "plausible") {
    return "corroboration requise";
  }

  return "priorité basse";
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeName>("editorial");
  const [trustLevel, setTrustLevel] = useState<TrustLevel>("evidence");
  const [draft, setDraft] = useState(
    "Le témoin indique que la société Northline Consulting aurait facturé des prestations de sécurité à Atlas Media entre mars et juin 2025. Deux virements seraient passés par Genève. Une facture PDF et un extrait bancaire sont disponibles.",
  );
  const [messages, setMessages] = useState(seedMessages);
  const [evidenceCount, setEvidenceCount] = useState(2);

  const activeTrust = trustOptions.find((option) => option.id === trustLevel) ?? trustOptions[0];

  const preview = useMemo(() => {
    const hasDraft = draft.trim().length > 0;

    return {
      entities: hasDraft
        ? [
            ["Northline Consulting", "Organisation"],
            ["Atlas Media", "Organisation"],
            ["Genève", "Lieu"],
          ]
        : [
            ["Atlas", "Organisation"],
            ["Lyon", "Lieu"],
            ["Genève", "Lieu"],
          ],
      facts: hasDraft ? 7 : 4,
      links: hasDraft ? 5 : 3,
      questions: trustLevel === "evidence" ? 1 : trustLevel === "plausible" ? 3 : 5,
    };
  }, [draft, trustLevel]);

  function submitInformation() {
    const normalized = draft.trim();

    if (!normalized) {
      return;
    }

    const clipped = normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized;
    const nextId = messages.length + 1;

    setMessages((current) => [
      ...current,
      {
        id: nextId,
        role: "user",
        author: "Marie",
        time: "maintenant",
        text: clipped,
      },
      {
        id: nextId + 1,
        role: "bot",
        author: "Sentinel",
        time: "maintenant",
        text: `Information classée "${activeTrust.label}". Je prépare ${preview.facts} faits, ${preview.links} liens et ${preview.questions} question${preview.questions > 1 ? "s" : ""} de clarification.`,
      },
    ]);
    setDraft("");
  }

  return (
    <main className="sentinel-shell" data-theme={theme}>
      <aside className="left-rail">
        <div className="brand-mark">
          <div className="brand-icon" aria-hidden="true">
            <Search size={21} strokeWidth={2.3} />
          </div>
          <div>
            <div className="eyebrow">Investigation AI</div>
            <div className="brand-title">Sentinel</div>
          </div>
        </div>

        <div className="section-label">Espace</div>
        <nav className="nav-list" aria-label="Navigation principale">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button className="nav-item" data-active={item.active} key={item.label} type="button">
                <Icon size={17} />
                <span>{item.label}</span>
                {item.active ? <ChevronRight className="ml-auto" size={16} /> : null}
              </button>
            );
          })}
        </nav>

        <div className="section-label">Connexions</div>
        <div className="source-stack">
          <div className="source-card">
            <div className="source-row">
              <div>
                <div className="source-title">Base relationnelle</div>
                <div className="source-meta">faits normalisés</div>
              </div>
              <span className="status-dot" style={{ background: "var(--evidence)" }} />
            </div>
          </div>
          <div className="source-card">
            <div className="source-row">
              <div>
                <div className="source-title">Graphe d'entités</div>
                <div className="source-meta">relations actives</div>
              </div>
              <span className="status-dot" style={{ background: "var(--info)" }} />
            </div>
          </div>
          <div className="source-card">
            <div className="source-row">
              <div>
                <div className="source-title">Index vectoriel</div>
                <div className="source-meta">documents et notes</div>
              </div>
              <span className="status-dot" style={{ background: "var(--plausible)" }} />
            </div>
          </div>
        </div>

        <div className="section-label">Looks</div>
        <div className="theme-grid" role="radiogroup" aria-label="Theme de l'interface">
          {themes.map((item) => (
            <button
              className="theme-button"
              data-active={theme === item.id}
              key={item.id}
              onClick={() => setTheme(item.id)}
              type="button"
            >
              <span className="theme-swatch" aria-hidden="true">
                {item.swatch.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="workbench">
        <header className="topbar">
          <div className="topbar-title">
            <div className="avatar" aria-hidden="true">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h1>Nouvelle information</h1>
              <p>Dossier Atlas, cellule investigation économique</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" title="Changer de langue" type="button">
              <Globe2 size={17} />
            </button>
            <button className="secondary-button" type="button">
              <Upload size={16} />
              Preuve
            </button>
            <button className="secondary-button" type="button">
              <FileText size={16} />
              Rapport
            </button>
          </div>
        </header>

        <div className="chat-column">
          <section className="conversation" aria-label="Conversation Sentinel">
            <div className="conversation-inner">
              {messages.map((message) => (
                <article className="message" data-role={message.role} key={message.id}>
                  <div className="avatar" aria-hidden="true">
                    {message.role === "bot" ? <Bot size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="message-bubble">
                    <div className="message-header">
                      <span className="message-author">{message.author}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <p className="message-text">{message.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="composer" aria-label="Saisie d'information">
            <div className="composer-header">
              <div className="composer-title">
                <Sparkles size={18} />
                <span>Entrée enrichie</span>
              </div>
              <div className="composer-tools">
                <button className="chip-button" type="button">
                  <Globe2 size={14} />
                  Multilingue
                </button>
                <button className="chip-button" type="button">
                  <Split size={14} />
                  Routage DB
                </button>
                <button className="chip-button" type="button">
                  <Network size={14} />
                  Entités
                </button>
              </div>
            </div>

            <textarea
              aria-label="Information à structurer"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ajouter une note, un extrait, un témoignage ou un lot d'informations..."
              value={draft}
            />

            <div className="trust-grid" role="radiogroup" aria-label="Niveau de fiabilite">
              {trustOptions.map((option) => {
                const Icon = option.icon;
                const style = {
                  "--status": option.color,
                  "--status-soft": option.soft,
                } as CSSProperties;

                return (
                  <button
                    className="trust-button"
                    data-active={trustLevel === option.id}
                    key={option.id}
                    onClick={() => setTrustLevel(option.id)}
                    style={style}
                    type="button"
                  >
                    <span className="trust-icon" aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    <span>
                      <span className="trust-label">{option.label}</span>
                      <span className="trust-copy">{option.copy}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="composer-footer">
              <div className="evidence-strip">
                <span className="evidence-pill">
                  <ShieldCheck size={14} />
                  {statusTone(trustLevel)}
                </span>
                <span className="evidence-pill">
                  <Archive size={14} />
                  {evidenceCount} preuve{evidenceCount > 1 ? "s" : ""}
                </span>
                <button
                  className="evidence-pill"
                  onClick={() => setEvidenceCount((count) => count + 1)}
                  type="button"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              </div>
              <button className="primary-button" onClick={submitInformation} type="button">
                <Send size={16} />
                Analyser
              </button>
            </div>
          </section>
        </div>
      </section>

      <aside className="insight-rail">
        <section className="insight-section">
          <div className="section-label" style={{ marginTop: 0 }}>
            Aperçu
          </div>
          <div className="metric-grid">
            <div className="metric-tile">
              <div className="metric-meta">Faits</div>
              <div className="metric-value">{preview.facts}</div>
            </div>
            <div className="metric-tile">
              <div className="metric-meta">Liens</div>
              <div className="metric-value">{preview.links}</div>
            </div>
            <div className="metric-tile">
              <div className="metric-meta">Questions</div>
              <div className="metric-value">{preview.questions}</div>
            </div>
          </div>
        </section>

        <section className="insight-section">
          <div className="section-label">Entités</div>
          <div className="entity-list">
            {preview.entities.map(([label, type]) => (
              <div className="entity-row" key={label}>
                <div>
                  <div className="entity-title">{label}</div>
                  <div className="entity-meta">confiance moyenne</div>
                </div>
                <span className="entity-type">{type}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="section-label">Insertion</div>
          <div className="route-list">
            {routes.map((route) => (
              <div className="route-row" key={route.label}>
                <div>
                  <div className="route-title">{route.label}</div>
                  <div className="route-meta">{route.meta}</div>
                </div>
                <span className="route-badge">{route.badge}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="section-label">Actions</div>
          <div className="action-list">
            <button className="quick-action" type="button">
              <Database size={17} />
              <span>
                <strong>Préparer requêtes</strong>
                <span>SQL, graphe et vecteur</span>
              </span>
            </button>
            <button className="quick-action" type="button">
              <Link2 size={17} />
              <span>
                <strong>Relier au dossier</strong>
                <span>Atlas Media, Genève</span>
              </span>
            </button>
            <button className="quick-action" type="button">
              <FilePenLine size={17} />
              <span>
                <strong>Insérer au rapport</strong>
                <span>bloc de faits sourcés</span>
              </span>
            </button>
          </div>
        </section>
      </aside>
    </main>
  );
}
