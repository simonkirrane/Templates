import { useEffect, useMemo, useRef, useState } from "react"

type Tool = "Confluence" | "Notion" | "PDF Playbook"
type UseCase = "Strategy" | "Fiction Writing" | "GEO / SEO" | "Operations" | "Leadership" | "Campaigns"
type Complexity = "Starter" | "Advanced" | "Team system"
type GroupBy = "None" | "Tool" | "Use case" | "Complexity"
type SortBy = "Featured" | "A–Z" | "Recently updated"

type Template = {
  id: number
  slug: string
  title: string
  tool: Tool
  useCase: UseCase
  complexity: Complexity
  description: string
  updated: string
  audience: string
  format: string
  accent: number
  featured: number
}

const concepts: Array<{
  title: string
  useCase: UseCase
  description: string
  audience: string
}> = [
  {
    title: "Content Strategy Canvas",
    useCase: "Strategy",
    description:
      "Turn audience insight, commercial goals and editorial choices into one clear operating view.",
    audience: "Content leads and heads of marketing",
  },
  {
    title: "Editorial North Star",
    useCase: "Strategy",
    description:
      "Define the promise, principles and measures that keep every publishing decision aligned.",
    audience: "Editorial and brand leadership",
  },
  {
    title: "Audience Needs Matrix",
    useCase: "Strategy",
    description:
      "Map audience jobs, anxieties and moments of intent before choosing what to publish.",
    audience: "Strategists and research teams",
  },
  {
    title: "Content Portfolio Planner",
    useCase: "Strategy",
    description:
      "Balance evergreen utility, campaign work and experimentation across a complete programme.",
    audience: "Content operations teams",
  },
  {
    title: "Narrative Positioning Map",
    useCase: "Strategy",
    description:
      "Find the credible territory your brand can own and turn it into repeatable story angles.",
    audience: "Brand and communications teams",
  },
  {
    title: "Quarterly Content Review",
    useCase: "Strategy",
    description:
      "A decision-led review that moves teams from reporting activity to improving outcomes.",
    audience: "Content directors and stakeholders",
  },
  {
    title: "Character Bible",
    useCase: "Fiction Writing",
    description:
      "Build consistent characters through motivation, contradiction, history and voice.",
    audience: "Novelists and narrative designers",
  },
  {
    title: "Three-Act Story Architect",
    useCase: "Fiction Writing",
    description:
      "Shape turning points, pressure and payoff without reducing a story to a rigid formula.",
    audience: "Fiction writers and screenwriters",
  },
  {
    title: "Worldbuilding System",
    useCase: "Fiction Writing",
    description:
      "Connect place, culture, power and history in a world that generates story naturally.",
    audience: "Fantasy and science-fiction writers",
  },
  {
    title: "Scene Purpose Card",
    useCase: "Fiction Writing",
    description:
      "Test every scene for desire, change, tension and its job within the larger narrative.",
    audience: "Writers and developmental editors",
  },
  {
    title: "Story Research Ledger",
    useCase: "Fiction Writing",
    description:
      "Keep sources, details, open questions and creative decisions connected to the manuscript.",
    audience: "Research-led fiction writers",
  },
  {
    title: "Revision Control Board",
    useCase: "Fiction Writing",
    description:
      "Turn a daunting manuscript edit into visible, sequenced passes with clear intent.",
    audience: "Authors and editors",
  },
  {
    title: "Semantic Entity Map",
    useCase: "GEO / SEO",
    description:
      "Plan entities, relationships and proof points that make expertise legible to search and AI.",
    audience: "SEO and GEO strategists",
  },
  {
    title: "Schema-Led Brief",
    useCase: "GEO / SEO",
    description:
      "Design content from its underlying meaning, relationships and machine-readable structure.",
    audience: "Content designers and SEO teams",
  },
  {
    title: "AI Citation Readiness Audit",
    useCase: "GEO / SEO",
    description:
      "Assess whether content is specific, attributable and structured enough to become a source.",
    audience: "GEO and content teams",
  },
  {
    title: "Search Intent Ladder",
    useCase: "GEO / SEO",
    description:
      "Move from broad informational demand to high-intent assets that AI cannot easily replace.",
    audience: "Growth and acquisition teams",
  },
  {
    title: "Topical Authority Planner",
    useCase: "GEO / SEO",
    description:
      "Build connected coverage around genuine expertise rather than a loose list of keywords.",
    audience: "SEO leads and subject experts",
  },
  {
    title: "Content Decay Monitor",
    useCase: "GEO / SEO",
    description:
      "Spot declining usefulness early and prioritise updates by strategic value and effort.",
    audience: "Content operations and SEO teams",
  },
  {
    title: "Editorial Production System",
    useCase: "Operations",
    description:
      "A visible path from idea to live asset with ownership, standards and fewer hidden handoffs.",
    audience: "Editorial operations teams",
  },
  {
    title: "Content Request Triage",
    useCase: "Operations",
    description:
      "Score incoming requests against audience value, strategic fit and real delivery cost.",
    audience: "In-house content teams",
  },
  {
    title: "Repurposing Workflow",
    useCase: "Operations",
    description:
      "Turn one strong source asset into a purposeful family of formats without creating noise.",
    audience: "Lean marketing teams",
  },
  {
    title: "Editorial QA Checklist",
    useCase: "Operations",
    description:
      "A final check for usefulness, evidence, accessibility, brand voice and discoverability.",
    audience: "Editors and content producers",
  },
  {
    title: "Content Debt Register",
    useCase: "Operations",
    description:
      "Make outdated, duplicated and ownerless content visible enough to manage deliberately.",
    audience: "Content designers and web teams",
  },
  {
    title: "Publishing Cadence Board",
    useCase: "Operations",
    description:
      "Coordinate people, dependencies and channels while protecting space for meaningful work.",
    audience: "Editorial managers",
  },
  {
    title: "Team Decision Log",
    useCase: "Leadership",
    description:
      "Record what was decided, why it mattered and when the assumptions should be revisited.",
    audience: "Leadership and product teams",
  },
  {
    title: "Strategy on a Page",
    useCase: "Leadership",
    description:
      "Reduce a complex direction to the choices, boundaries and measures a team can actually use.",
    audience: "Heads of function and founders",
  },
  {
    title: "One-to-One Framework",
    useCase: "Leadership",
    description:
      "Create useful conversations around momentum, obstacles, development and mutual clarity.",
    audience: "People managers",
  },
  {
    title: "Change Narrative Builder",
    useCase: "Leadership",
    description:
      "Explain what is changing, what is not and how people can act with confidence.",
    audience: "Transformation leaders",
  },
  {
    title: "Team Health Review",
    useCase: "Leadership",
    description:
      "Surface friction across purpose, pace, trust and decision-making before it becomes failure.",
    audience: "Team leads and facilitators",
  },
  {
    title: "Executive Briefing Page",
    useCase: "Leadership",
    description:
      "Give decision-makers the context, evidence and recommendation they need without the theatre.",
    audience: "Senior leaders and advisers",
  },
  {
    title: "Campaign Narrative Spine",
    useCase: "Campaigns",
    description:
      "Connect the audience tension, central idea and channel expressions into one coherent story.",
    audience: "Campaign and creative teams",
  },
  {
    title: "Launch Readiness Board",
    useCase: "Campaigns",
    description:
      "Track proposition, proof, production and distribution before a launch becomes a scramble.",
    audience: "Go-to-market teams",
  },
  {
    title: "Creative Brief That Works",
    useCase: "Campaigns",
    description:
      "A brief built around the problem, audience response and non-negotiables—not empty adjectives.",
    audience: "Creative and agency teams",
  },
  {
    title: "Webinar Production Kit",
    useCase: "Campaigns",
    description:
      "Plan the promise, guest, promotion and follow-through for an event people choose to attend.",
    audience: "Demand generation teams",
  },
  {
    title: "Campaign Learning Review",
    useCase: "Campaigns",
    description:
      "Separate signal from vanity metrics and turn one campaign into better future decisions.",
    audience: "Marketing and growth teams",
  },
  {
    title: "Partner Content Planner",
    useCase: "Campaigns",
    description:
      "Align expertise, audience value and distribution when two brands create something together.",
    audience: "Partnership and content teams",
  },
]

const toolConfig: Record<Tool, {
  format: string
  complexity: Complexity
  cta: string
  destination: string
}> = {
  Confluence: {
    format: "Confluence page template",
    complexity: "Team system",
    cta: "Get Confluence template",
    destination: "https://www.kolekti.com/resources/templates",
  },
  Notion: {
    format: "Notion workspace template",
    complexity: "Advanced",
    cta: "Get Notion template",
    destination: "https://www.notion.so/templates",
  },
  "PDF Playbook": {
    format: "Printable PDF worksheet",
    complexity: "Starter",
    cta: "Access playbook",
    destination: "https://www.simonkirrane.com/",
  },
}

const tools = Object.keys(toolConfig) as Tool[]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const templates: Template[] = concepts.flatMap((concept, conceptIndex) =>
  tools.map((tool, toolIndex) => ({
    id: conceptIndex * tools.length + toolIndex + 1,
    slug: `${slugify(concept.title)}-${slugify(tool)}`,
    title: concept.title,
    tool,
    useCase: concept.useCase,
    complexity: toolConfig[tool].complexity,
    description: concept.description,
    updated: ["18 Jun 2026", "06 Jun 2026", "22 May 2026"][
      (conceptIndex + toolIndex) % 3
    ],
    audience: concept.audience,
    format: toolConfig[tool].format,
    accent: (conceptIndex + toolIndex) % 6,
    featured:
      conceptIndex < 6 ? 100 - conceptIndex * 3 - toolIndex : 50 - conceptIndex,
  })),
)

const useCases: UseCase[] = [
  "Strategy",
  "Fiction Writing",
  "GEO / SEO",
  "Operations",
  "Leadership",
  "Campaigns",
]

function Header({
  onHome,
  onCategory,
  onSearch,
}: {
  onHome: () => void
  onCategory: (value: UseCase) => void
  onSearch: () => void
}) {
  return (
    <header className="hub-header">
      <div className="hub-header-main">
        <button className="hub-wordmark" onClick={onHome}>
          <img src="/favicon.webp" alt="" />
          <span>
            Simon Kirrane
            <small>Template Library</small>
          </span>
        </button>
        <nav className="category-nav" aria-label="Template categories">
          {useCases.slice(0, 4).map((item) => (
            <button key={item} onClick={() => onCategory(item)}>
              {item}
            </button>
          ))}
        </nav>
        <button className="search-cta" onClick={onSearch}>
          <SearchIcon />
          <span>Search library</span>
          <kbd>/</kbd>
        </button>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

function TemplatePreview({
  template,
  large = false,
}: {
  template: Template
  large?: boolean
}) {
  return (
    <div
      className={`template-preview accent-${template.accent}${
        large ? " large" : ""
      }`}
    >
      <div className="preview-bar">
        <span />
        <span>{template.tool}</span>
      </div>
      <div className="preview-canvas">
        <div className="preview-index">
          {String(template.id).padStart(3, "0")}
        </div>
        <div className="preview-title">{template.title}</div>
        <div className="preview-lines">
          <i />
          <i />
          <i />
        </div>
        <div className="preview-grid">
          <b />
          <b />
          <b />
        </div>
      </div>
    </div>
  )
}

function TemplateCard({
  template,
  onNavigate,
}: {
  template: Template
  onNavigate: (slug: string) => void
}) {
  return (
    <a
      className="template-card"
      href={`/${template.slug}`}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(template.slug)
      }}
    >
      <TemplatePreview template={template} />
      <div className="card-content">
        <div className="card-meta">
          <span>{template.tool}</span>
          <span>{template.complexity}</span>
        </div>
        <h3>{template.title}</h3>
        <p>{template.description}</p>
        <div className="card-action">
          View template <ArrowIcon />
        </div>
      </div>
    </a>
  )
}

function FilterSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string
  value: string
  values: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="All">All</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

function HomePage({
  onNavigate,
  initialUseCase,
  searchRef,
}: {
  onNavigate: (slug: string) => void
  initialUseCase: UseCase | "All"
  searchRef: React.RefObject<HTMLInputElement | null>
}) {
  const [query, setQuery] = useState("")
  const [tool, setTool] = useState("All")
  const [useCase, setUseCase] = useState<string>(initialUseCase)
  const [complexity, setComplexity] = useState("All")
  const [groupBy, setGroupBy] = useState<GroupBy>("None")
  const [sortBy, setSortBy] = useState<SortBy>("Featured")

  useEffect(() => {
    setUseCase(initialUseCase)
  }, [initialUseCase])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [searchRef])

  const filtered = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()
    const result = templates.filter((template) => {
      const matchesQuery =
        !normalisedQuery ||
        [
          template.title,
          template.description,
          template.tool,
          template.useCase,
          template.audience,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalisedQuery)
      return (
        matchesQuery &&
        (tool === "All" || template.tool === tool) &&
        (useCase === "All" || template.useCase === useCase) &&
        (complexity === "All" || template.complexity === complexity)
      )
    })

    return result.sort((a, b) => {
      if (sortBy === "A–Z") return a.title.localeCompare(b.title)
      if (sortBy === "Recently updated") return b.id - a.id
      return b.featured - a.featured
    })
  }, [complexity, query, sortBy, tool, useCase])

  const grouped = useMemo(() => {
    if (groupBy === "None")
      return [["All templates", filtered]] as Array<[string, Template[]]>
    const key =
      groupBy === "Tool"
        ? "tool"
        : groupBy === "Use case"
          ? "useCase"
          : "complexity"
    return Array.from(
      filtered.reduce((map, template) => {
        const group = template[key]
        map.set(group, [...(map.get(group) || []), template])
        return map
      }, new Map<string, Template[]>()),
    )
  }, [filtered, groupBy])

  const reset = () => {
    setQuery("")
    setTool("All")
    setUseCase("All")
    setComplexity("All")
    setGroupBy("None")
    setSortBy("Featured")
  }

  return (
    <>
      <section className="hub-hero">
        <div className="hub-hero-copy">
          <p className="eyebrow">Templates by Simon Kirrane</p>
          <h1>
            Systems for
            <br />
            <em>better work.</em>
          </h1>
        </div>
        <div className="hub-hero-intro">
          <p>
            Battle-tested operational frameworks, Notion systems and Confluence
            assets built for high-growth teams, content leaders and people who
            make things happen.
          </p>
          <div className="hero-note">
            <span>{templates.length}</span>
            <p>Practical templates. No blank pages. No performative process.</p>
          </div>
        </div>
      </section>

      <section className="library-shell" id="library">
        <div className="library-heading">
          <div>
            <p className="eyebrow">Explore the library</p>
            <h2>Find your starting point.</h2>
          </div>
          <p>
            Filter by tool, task or depth. Every asset is designed to survive
            contact with a real team.
          </p>
        </div>

        <div className="search-panel">
          <label className="instant-search">
            <SearchIcon />
            <span className="sr-only">Search templates</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword, tool or audience…"
            />
            <kbd>/</kbd>
          </label>
          <div className="filter-row">
            <FilterSelect
              label="Tool"
              value={tool}
              values={tools}
              onChange={setTool}
            />
            <FilterSelect
              label="Use case"
              value={useCase}
              values={useCases}
              onChange={setUseCase}
            />
            <FilterSelect
              label="Complexity"
              value={complexity}
              values={["Starter", "Advanced", "Team system"]}
              onChange={setComplexity}
            />
            <label className="filter-select">
              <span>Group by</span>
              <select
                value={groupBy}
                onChange={(event) => setGroupBy(event.target.value as GroupBy)}
              >
                {(["None", "Tool", "Use case", "Complexity"] as GroupBy[]).map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label className="filter-select">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortBy)}
              >
                {(["Featured", "A–Z", "Recently updated"] as SortBy[]).map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
          </div>
        </div>

        <div className="results-summary">
          <p>
            Showing <strong>{filtered.length}</strong> of {templates.length}{" "}
            templates
          </p>
          {(query ||
            tool !== "All" ||
            useCase !== "All" ||
            complexity !== "All") && (
            <button onClick={reset}>Clear filters</button>
          )}
        </div>

        {filtered.length ? (
          grouped.map(([group, items]) => (
            <section className="template-group" key={group}>
              {groupBy !== "None" && (
                <div className="group-heading">
                  <h3>{group}</h3>
                  <span>{items.length} templates</span>
                </div>
              )}
              <div className="template-grid">
                {items.map((template) => (
                  <TemplateCard
                    key={template.slug}
                    template={template}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-state">
            <p className="eyebrow">No exact match</p>
            <h3>Try a broader idea.</h3>
            <p>
              Clear one filter or search for a task rather than a template name.
            </p>
            <button onClick={reset}>Reset the library</button>
          </div>
        )}
      </section>
    </>
  )
}

function DetailPage({
  template,
  onHome,
  onNavigate,
}: {
  template: Template
  onHome: () => void
  onNavigate: (slug: string) => void
}) {
  const related = templates
    .filter(
      (item) =>
        item.slug !== template.slug &&
        (item.useCase === template.useCase || item.title === template.title),
    )
    .slice(0, 3)
  const config = toolConfig[template.tool]

  useEffect(() => {
    document.title = `${template.title} — Simon Kirrane Templates`
    window.scrollTo(0, 0)
    return () => {
      document.title = "Templates by Simon Kirrane"
    }
  }, [template])

  return (
    <main className="detail-page">
      <div className="detail-inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button onClick={onHome}>Template library</button>
          <span>/</span>
          <button onClick={onHome}>{template.useCase}</button>
          <span>/</span>
          <strong>{template.title}</strong>
        </nav>

        <header className="detail-hero">
          <div>
            <div className="detail-meta">
              <span>{template.tool}</span>
              <span>{template.useCase}</span>
              <span>{template.complexity}</span>
            </div>
            <h1>{template.title}</h1>
            <p>{template.description}</p>
          </div>
          <span className="detail-number">
            {String(template.id).padStart(3, "0")}
          </span>
        </header>

        <div className="detail-layout">
          <article className="detail-content">
            <TemplatePreview template={template} large />

            <section>
              <p className="eyebrow">Overview</p>
              <h2>A useful system, not another empty document.</h2>
              <p className="lead">
                This {template.format.toLowerCase()} turns a complex, often
                fuzzy piece of work into a sequence of clear decisions. It gives
                {` ${template.audience.toLowerCase()} `} enough structure to
                move quickly without replacing judgement with process.
              </p>
              <p>
                Use it at the start of a project to frame the work, during
                delivery to keep collaborators aligned, or afterwards to make
                learning visible. Each section contains prompts, examples and
                decision points rather than decorative fields.
              </p>
            </section>

            <aside className="editorial-callout">
              <span>The principle</span>
              <p>
                A good template should remove uncertainty—not remove the need to
                think.
              </p>
            </aside>

            <section>
              <p className="eyebrow">Why I built this</p>
              <h2>Because the blank page is rarely the real problem.</h2>
              <p>
                Most teams already have enough ideas. What they lack is a shared
                way to make choices, expose assumptions and carry context from
                one person to the next. I built this framework from patterns
                used across publishing, SaaS, content strategy and
                transformation work.
              </p>
              <p>
                It is deliberately opinionated where that helps momentum and
                deliberately open where the answer depends on your audience,
                product or organisation.
              </p>
            </section>

            <section>
              <p className="eyebrow">Inside the template</p>
              <h2>Four layers of useful structure.</h2>
              <ol className="structure-list">
                <li>
                  <span>01</span>
                  <div>
                    <h3>Frame the decision</h3>
                    <p>
                      Define the audience, problem and outcome before filling in
                      activity.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Make the thinking visible</h3>
                    <p>
                      Prompts surface assumptions, evidence, constraints and
                      open questions.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Turn insight into action</h3>
                    <p>
                      Clear ownership and next steps keep the document connected
                      to delivery.
                    </p>
                  </div>
                </li>
                <li>
                  <span>04</span>
                  <div>
                    <h3>Build in the review</h3>
                    <p>
                      Revisit the decisions, capture learning and improve the
                      system over time.
                    </p>
                  </div>
                </li>
              </ol>
            </section>
          </article>

          <aside className="action-sidebar">
            <div className="action-card">
              <p className="eyebrow">Ready to use</p>
              <h2>Start with the system. Make it yours.</h2>
              <p>
                Duplicate the asset, follow the embedded guidance and adapt it
                to your team.
              </p>
              <a href={config.destination} target="_blank" rel="noreferrer">
                {config.cta} <ArrowIcon />
              </a>
              <dl>
                <div>
                  <dt>Format</dt>
                  <dd>{template.format}</dd>
                </div>
                <div>
                  <dt>Complexity</dt>
                  <dd>{template.complexity}</dd>
                </div>
                <div>
                  <dt>Best for</dt>
                  <dd>{template.audience}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{template.updated}</dd>
                </div>
              </dl>
            </div>
            <p className="sidebar-note">
              Built from 20+ years across publishing, B2B SaaS and content
              transformation.
            </p>
          </aside>
        </div>
      </div>

      <section className="related-section">
        <div className="related-inner">
          <div className="related-heading">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2>Related templates.</h2>
            </div>
            <button onClick={onHome}>View all {templates.length}</button>
          </div>
          <div className="template-grid">
            {related.map((item) => (
              <TemplateCard
                key={item.slug}
                template={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function Footer() {
  return (
    <footer className="hub-footer">
      <div>
        <p className="eyebrow">Templates by Simon Kirrane</p>
        <h2>Make the work clearer.</h2>
      </div>
      <div className="footer-nav">
        <a href="https://www.simonkirrane.com/">Main portfolio ↗</a>
        <a href="https://www.linkedin.com/in/simon-kirrane/">LinkedIn ↗</a>
      </div>
      <p className="copyright">© 2026 Simon Kirrane</p>
    </footer>
  )
}

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [path, setPath] = useState(window.location.pathname)
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | "All">("All")

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const currentSlug = path.replace(/^\/|\/$/g, "")
  const currentTemplate = templates.find(
    (template) => template.slug === currentSlug,
  )

  const navigate = (slug = "") => {
    const nextPath = slug ? `/${slug}` : "/"
    window.history.pushState({}, "", nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToCategory = (value: UseCase) => {
    setSelectedUseCase(value)
    navigate()
    window.setTimeout(() => {
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth" })
    }, 0)
  }

  const openSearch = () => {
    navigate()
    window.setTimeout(() => {
      searchRef.current?.focus()
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth" })
    }, 0)
  }

  return (
    <>
      <Header
        onHome={() => {
          setSelectedUseCase("All")
          navigate()
        }}
        onCategory={goToCategory}
        onSearch={openSearch}
      />
      {currentTemplate ? (
        <DetailPage
          template={currentTemplate}
          onHome={() => navigate()}
          onNavigate={navigate}
        />
      ) : (
        <HomePage
          onNavigate={navigate}
          initialUseCase={selectedUseCase}
          searchRef={searchRef}
        />
      )}
      <Footer />
    </>
  )
}
