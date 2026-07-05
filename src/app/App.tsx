import { useState, useEffect, lazy, Suspense } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import profilePhoto from "@/imports/Yewon.jpg";
import overviewPDF from "@/imports/DiSPA_Overview.png";
import dreamOverview from "@/imports/DREAM_Overview.png";
import { logVisit } from "@/lib/analytics";

// Lazy-loaded so the admin bundle (incl. firebase/auth) isn't shipped to normal visitors.
const AdminDashboard = lazy(() => import("@/app/components/AdminDashboard"));

// The private analytics page lives at #<ADMIN_SLUG>. Keep this secret and hard to guess.
// Override it via VITE_ADMIN_SLUG in .env.local.
const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "admin-8f3k9x2p";

type Section = "about" | "publications" | "news" | "vitae" | "publication-detail" | "contact";

const NAV_LINKS: { id: Section; label: string }[] = [
  { id: "about", label: "about" },
  { id: "publications", label: "publications" },
  { id: "news", label: "news" },
  { id: "vitae", label: "vitae" },
  { id: "contact", label: "contact" },
];

const PUBLICATIONS = [
  {
    type: "paper",
    year: "2026",
    authors: "Han Y., Kim S., Jeong E., Lee S., Yun S., Lim S.",
    title: "DiSPA: Differential Substructure-Pathway Attention for Drug Response Prediction",
    venue: "Bioinformatics (Transferred from ISMB 2026)",
    doi: "#",
    award: "BEST PAPER AWARD",
    awardDetail: "Accepted in ISMB 2026 Proceedings Track (Acceptance rate: 16%)",
    presentations: [
      { date: "Jun 24, 2026", text: "Invited Talk, Top Conference Session, KCC 2026, Korea.", award: null },
      { date: "Feb 06, 2026", text: "Poster Presentation, KOGO 2026, Korea.", award: "🎉 Excellence Award" },
      { date: "Jul 04, 2025", text: "Poster Presentation, KCC 2025, Korea.", award: "🎉 Excellence Award" },
      { date: "Apr 26, 2025", text: "Poster Presentation, RECOMB 2025, Korea.", award: null },
    ]
  },
  {
    type: "patent",
    year: "2025",
    authors: "Han Y., Lim S., Lee M., Lee Y.",
    title: "System and Method for Predicting Olfactory Characteristics of Odor Mixture Data",
    venue: "Korean Patent Application (pending) No. 10-2025-0003146",
  },
  {
    type: "patent",
    year: "2025",
    authors: "Han Y., Ahn S., Kim J., Joo H., Kim J., Kim M., Lee G.",
    title: "Screen Reader-based Kiosk to Improve Accessibility for the Visually Impaired",
    venue: "Korean Patent Application (pending) No. 10-2025-0028145",
  },
];

// `link` turns the given `label` substring inside `text` into a link to the conference site.
type NewsItem = { date: string; text: string; link?: { label: string; href: string } };

const NEWS: NewsItem[] = [
  {
    date: "Jul 15, 2026",
    text: "💬 Presented DiSPA at ISMB 2026 as an oral presentation in Washington, D.C., USA.",
    link: { label: "ISMB 2026", href: "https://www.iscb.org/ismb2026/home" },
  },
  {
    date: "Jun 24, 2026",
    text: "💬 Presented our research at KCC 2026 as an invited paper in Jeju, Korea.",
    link: { label: "KCC 2026", href: "https://www.kiise.or.kr/conference/kcc/2026/" },
  },
  {
    date: "Apr 02, 2026",
    text: "🎉 DiSPA was accepted to the ISMB 2026 Proceedings Track!",
    link: { label: "ISMB 2026", href: "https://www.iscb.org/ismb2026/home" },
  },
  {
    date: "Feb 05, 2026",
    text: "💬 Presented our research at KOGO 2026 as a poster presentation in Hongcheon, Korea.",
    link: { label: "KOGO 2026", href: "https://www.kogo.or.kr/html/" },
  },
  {
    date: "Jul 04, 2025",
    text: "💬 Presented our research at KCC 2025 as a poster presentation in Jeju, Korea.",
    link: { label: "KCC 2025", href: "https://www.kiise.or.kr/conference/kcc/2025/" },
  },
  {
    date: "Apr 27, 2025",
    text: "💬 Presented our research at RECOMB 2025 as a poster presentation in Seoul, Korea.",
    link: { label: "RECOMB 2025", href: "https://recomb.org/recomb2025/" },
  },
  {
    date: "Feb 01, 2024",
    text: "🚀 Began my research journey at PRISM Lab, Dongguk University.",
  },
];

// Render news text, turning `link.label` (if present) into a hyperlink to the conference site.
function renderNewsText(item: NewsItem) {
  if (!item.link) return item.text;
  const idx = item.text.indexOf(item.link.label);
  if (idx === -1) return item.text;
  const before = item.text.slice(0, idx);
  const after = item.text.slice(idx + item.link.label.length);
  return (
    <>
      {before}
      <a
        href={item.link.href}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline underline-offset-2"
      >
        {item.link.label}
      </a>
      {after}
    </>
  );
}

function AboutSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-start">
        <div className="space-y-5">
          <div>
            <h1 className="font-garamond text-4xl md:text-5xl font-normal text-foreground leading-tight">
              <span className="font-semibold">Yewon</span>{" "}
              Han
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-sans tracking-wide">
              B.S in Computer Science &nbsp;·&nbsp; Undergraduate Researcher{" "}
              <a
                href="http://sangsoolim.notion.site"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline underline-offset-2"
              >
                @PRISM lab
              </a>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "Email", href: "mailto:yewoonn02@gmail.com" },
                { label: "GitHub", href: "http://github.com/yewoonn" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/han-yewon" },
                { label: "CV (PDF)", href: "https://drive.google.com/file/d/1p-b297cereuH8uUuoOVJTTyhv3ytUvd9/view?usp=sharing" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-mono text-foreground border border-border px-3 py-1 rounded hover:bg-accent hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p className="text-base leading-relaxed font-sans text-foreground">
            I am an undergraduate researcher in Medical AI, passionate about building interpretable 
            machine learning models for precision medicine.
          </p>

          <p className="text-base leading-relaxed font-sans text-foreground">
            My current research centers on DiSPA, a first-author project accepted to the ISMB 2026 Proceedings Track. 
            DiSPA focuses on drug response prediction by modeling interactions between drug substructures 
            and pathway-level cellular contexts, aiming to better understand treatment sensitivity in a biologically 
            interpretable way. Through this project, I developed skills in model design, data analysis, and biological 
            interpretation, while also strengthening my project management, leadership, and public speaking skills.
          </p>
        </div>

        <div className="flex-shrink-0">
          <div className="w-42 md:w-54 overflow-hidden border border-border/40 shadow-sm mt-36">
            <ImageWithFallback
              src={profilePhoto}
              alt="Yewon Han"
              className="w-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <p className="text-base leading-relaxed font-sans text-foreground">
        I am currently seeking master's or PhD opportunities in Medical AI, BioAI, and computational biology, 
        where I can further develop interpretable and biologically meaningful AI approaches for healthcare. 
        Through future research, I hope to help bridge the gap between powerful deep learning models and 
        clinically meaningful precision medicine. I would be glad to connect with researchers, students, 
        and mentors who share interests in Medical AI, precision medicine, interpretable machine learning, 
        drug response prediction, or computational biology.{" "}
        <a href="mailto:yewoonn02@gmail.com" className="text-primary hover:underline underline-offset-2">
          Get in touch.
        </a>
      </p>

    </div>
  );
}

function PublicationsSection({ onPublicationClick }: { onPublicationClick?: (pub: typeof PUBLICATIONS[0]) => void }) {
  const [showAwardDetail, setShowAwardDetail] = useState<{ [key: number]: boolean }>({});

  const toggleAwardDetail = (index: number) => {
    setShowAwardDetail(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {PUBLICATIONS.map((pub, i) => (
          <div key={i} className={`grid grid-cols-[3rem_1fr] gap-4 ${i > 0 ? 'border-t border-border pt-5' : 'pb-5'}`}>
            <span className="font-mono text-xs text-muted-foreground pt-0.5">{pub.year}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-sans text-muted-foreground">
                  {pub.authors.split(', ').map((author, idx, arr) => (
                    <span key={idx}>
                      {author === "Han Y." ? (
                        <span className="font-bold underline underline-offset-2">{author}</span>
                      ) : author}
                      {idx < arr.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                {pub.type === "patent" && (
                  <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 text-xs font-sans rounded">
                    PATENT
                  </span>
                )}
              </div>
              {(i === 0 || i === 1 || i === 2) && onPublicationClick ? (
                <button
                  onClick={() => onPublicationClick(pub)}
                  className="font-garamond text-lg text-foreground hover:text-primary transition-colors leading-snug text-left"
                >
                  {pub.title}
                </button>
              ) : (
                <span className="font-garamond text-lg text-foreground leading-snug">
                  {pub.title}
                </span>
              )}
              <p className="mt-1 text-xs font-mono text-muted-foreground italic">{pub.venue}</p>
              <div className="flex items-center gap-2 mt-3">
                {pub.award && (
                  <button
                    onClick={() => toggleAwardDetail(i)}
                    className="px-2 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs font-sans rounded border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    {pub.award} {showAwardDetail[i] ? '▼' : '▶'}
                  </button>
                )}
                {pub.type === "paper" && pub.doi && (
                  <>
                    <a 
                      href={pub.doi}
                      className="px-2 py-1 text-xs font-mono border border-border hover:bg-accent hover:text-white transition-colors rounded"
                    >
                      DOI
                    </a>
                    <button
                      className="px-2 py-1 text-xs font-mono border border-border hover:bg-accent hover:text-white transition-colors rounded"
                    >
                      BIB
                    </button>
                  </>
                )}
              </div>
              {pub.awardDetail && showAwardDetail[i] && (
                <div className="mt-3 p-3 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded bg-gray-50/50 dark:bg-gray-900/30">
                  <p className="text-sm font-sans text-foreground">
                    {pub.awardDetail.split(' ').map((word, idx) => 
                      word === 'Best' || word === 'Paper' || word === 'Award' ? 
                      <span key={idx} className="font-semibold">{word} </span> : 
                      <span key={idx}>{word} </span>
                    )}
                  </p>
                  {pub.presentations && (
                    <ul className="mt-2 space-y-1 text-sm font-sans text-foreground">
                      {(pub.presentations as { date: string; text: string; award: string | null }[]).filter(p => p.award).map((pres, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="mr-2">•</span>
                          <span>{pres.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSection() {
  return (
    <div className="space-y-0">
      {NEWS.map((item, i) => (
        <div key={i} className={`grid grid-cols-[7rem_1fr] gap-4 ${i > 0 ? 'border-t' : ''} border-border ${i === 0 ? 'pb-4' : 'py-4'}`}>
          <span className="font-mono text-xs text-muted-foreground pt-0.5">{item.date}</span>
          <p className="text-base font-sans text-foreground leading-relaxed">{renderNewsText(item)}</p>
        </div>
      ))}
    </div>
  );
}

function VitaeSection() {
  const sections = [
    {
      heading: "Education",
      items: [
        { period: "2022–2026", title: "B.S. in Computer Science Engineering", detail: "Dongguk University, Korea · GPA 4.3/4.5 (Major 4.34/4.5)" },
      ],
    },
    {
      heading: "Research Experience",
      items: [
        { period: "Feb 2023–Present", title: "Undergraduate Research Intern", detail: "PRISM Lab, Dongguk University (Advisor: Prof. Sangsoo Lim)" },
      ],
    },
    {
      heading: "Honors & Awards",
      subsections: [
        {
          subheading: "Conference Awards",
          items: [
            { period: "2026", title: "Excellence Award for Poster Presentation", detail: "The 22nd KOGO Winter Symposium, Korean Genome Organization (KOGO), Korea" },
            { period: "2025", title: "Excellence Award for Poster Presentation, Undergraduate Division", detail: "Korea Computer Congress (KCC), KIISE, Korea" },
          ],
        },
        {
          subheading: "Research Grant",
          items: [
            { period: "2025", title: "Research Grant, Creative Independent Research Support Program", detail: "Dongguk University, Korea · Project Title: PathDCA: Pathway-Level Differential Cross Attention for Enhanced Drug Response Prediction" },
          ],
        },
        {
          subheading: "Academic Scholarship",
          items: [
            { period: "2022–2026", title: "Dean's List", detail: "Dongguk University, Korea" },
            { period: "2024–2026", title: "Merit-Based Scholarship", detail: "Dongguk University, Korea" },
            { period: "2025", title: "IoT-COSS Micro Degree Academic Excellence Scholarship", detail: "Dongguk University, Korea" },
          ],
        },
        {
          subheading: "Others",
          items: [
            { period: "2024–2025", title: "Best Mentor Award", detail: "Special Education Mentoring Program, Rehabilitation International Korea" },
            { period: "2025", title: "Excellence Award", detail: "Intercollegiate Presentation Competition, Korea" },
            { period: "2025", title: "Excellence Award", detail: "Creative Problem-Solving Project, Dongguk University" },
          ],
        },
      ],
    },
    {
      heading: "Certifications",
      items: [
        { period: "2025", title: "TOPCIT Level 4", detail: "Institute for Information & Communications Technology Planning & Evaluation" },
        { period: "2025", title: "Engineer Information Processing", detail: "Human Resources Development Service of Korea" },
        { period: "2024", title: "SQLD (SQL Developer)", detail: "Korea Data Agency" },
      ],
    },
    {
      heading: "Technical Skills",
      items: [
        { period: "", title: "Machine Learning", detail: "PyTorch, PyTorch Geometric, scikit-learn" },
        { period: "", title: "Bioinformatics", detail: "RDKit, scanpy" },
        { period: "", title: "Data Analysis", detail: "Pandas, Matplotlib, seaborn, NumPy" },
      ],
    },
    {
      heading: "Languages",
      items: [
        { period: "", title: "Korean", detail: "Native" },
        { period: "", title: "English", detail: "TOEFL iBT (4.5)" },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground font-sans">
        Abbreviated curriculum vitae.{" "}
        <a href="https://drive.google.com/file/d/1p-b297cereuH8uUuoOVJTTyhv3ytUvd9/view?usp=sharing" target="_blank" rel="noreferrer" className="text-primary hover:underline underline-offset-2">
          Download full CV (PDF)
        </a>
      </p>
      {sections.map((sec) => (
        <div key={sec.heading}>
          <h2 className="font-garamond text-2xl text-foreground mb-4 font-normal">{sec.heading}</h2>
          {'subsections' in sec ? (
            <div className="space-y-6">
              {(sec as { heading: string; subsections: { subheading: string; items: { period: string; title: string; detail: string }[] }[] }).subsections.map((sub) => (
                <div key={sub.subheading}>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">{sub.subheading}</p>
                  <div className="space-y-0">
                    {sub.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3">
                        <span className="font-mono text-xs text-muted-foreground pt-0.5">{item.period}</span>
                        <div>
                          <p className="text-base font-sans font-medium text-foreground leading-snug">{item.title}</p>
                          <p className="text-sm font-sans text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {(sec as { heading: string; items: { period: string; title: string; detail: string }[] }).items.map((item, i) => (
                <div key={i} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3">
                  <span className="font-mono text-xs text-muted-foreground pt-0.5">{item.period}</span>
                  <div>
                    <p className="text-base font-sans font-medium text-foreground leading-snug">{item.title}</p>
                    <p className="text-sm font-sans text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


function PublicationDetailSection({ publication }: { publication: typeof PUBLICATIONS[0] | null }) {
  if (!publication) return null;
  
  const isDREAM = publication.title.includes("Olfactory");
  const isVOISK = publication.title.includes("Screen Reader");
  const overviewImage = isDREAM ? dreamOverview : overviewPDF;
  
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-garamond text-3xl md:text-4xl text-foreground mb-4 leading-tight">
          {publication.title}
        </h1>
        <p className="text-base font-sans text-muted-foreground mb-2">{publication.authors}</p>
        <p className="text-sm font-mono text-muted-foreground italic">{publication.venue}</p>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {!isVOISK && (
          <div className="mb-8">
            <h2 className="font-garamond text-2xl text-foreground mb-4">Overview</h2>
            <div className="w-full border border-border rounded-lg overflow-hidden">
              <img 
                src={overviewImage} 
                alt={isDREAM ? "DREAM Overview" : "DiSPA Overview"}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
        
        {isVOISK ? (
          <>
            <h2 className="font-garamond text-2xl text-foreground mb-4">Model Summary</h2>
            <p className="text-base font-sans text-foreground leading-relaxed mb-6">
              This patent application is an NFC-based mobile ordering and kiosk-linked system designed to make ordering more accessible for visually impaired users. By scanning an NFC tag placed on a table or near a kiosk, users can access a simplified mobile menu interface that is compatible with built-in accessibility tools such as VoiceOver and TalkBack. The system provides text-based menu structures and voice-guided navigation, allowing users to browse menus, select items, and complete orders without relying on visually complex graphical interfaces.
            </p>
          </>
        ) : !isDREAM ? (
          <>
            <h2 className="font-garamond text-2xl text-foreground mb-4">Abstract</h2>
            <p className="text-base font-sans text-foreground leading-relaxed mb-6">
              Motivation: Accurate prediction of drug response in precision medicine requires models that capture how specific chemical substructures interact with cellular pathway states. However, most existing deep learning approaches treat chemical and transcriptomic modalities independently or combine them only at late stages, limiting their ability to model fine-grained, context-dependent mechanisms of drug action. In addition, standard attention mechanisms are often sensitive to noise and sparsity in high-dimensional biological networks, hindering both generalization and interpretability.
    Results: We present DiSPA (Differential Substructure-Pathway Attention), a representation learning framework that explicitly disentangles structure-driven and context-driven mechanisms of drug response through bidirectional conditioning between chemical substructures and pathway-level gene expression. DiSPA introduces a differential cross-attention module that suppresses spurious pathwayâ€"substructure associations while amplifying contextually relevant interactions. Across multiple evaluation settings on the GDSC benchmark, DiSPA achieves state-of-the-art performance, with particularly strong improvements in the disjoint-set setting (RMSE = 2.453), which assesses generalization to unseen drug-cell combinations. Beyond predictive accuracy, DiSPA yields mechanistically informative representations: learned attention patterns recover known pharmacophores, distinguish structure-driven from context-dependent compounds, and exhibit coherent organization across biological pathways. Furthermore, we demonstrate that DiSPA trained solely on bulk RNA-seq data enables zero-shot transfer to spatial transcriptomics, revealing region-specific drug sensitivity patterns without retraining. Together, these results establish DiSPA as a robust and interpretable framework for integrative pharmacogenomic modeling, enabling principled analysis of drug response mechanisms beyond post hoc interpretation.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-garamond text-2xl text-foreground mb-4">Model Summary</h2>
            <p className="text-base font-sans text-foreground leading-relaxed mb-6">
              This patent application introduces a GNN-based pipeline for predicting olfactory characteristics of odor mixture data. The system extracts chemical fingerprints such as MACCS, ECFP4, and PubChem from SMILES strings, constructs mixture graphs based on compound similarity, and learns mixture-level embeddings using a GIN-based graph neural network. Attention layers are applied to integrate graph and fingerprint representations, enabling more effective prediction of similarity between complex odor mixtures.
            </p>
          </>
        )}
        
        {'presentations' in publication && publication.presentations && (
          <div className="mt-8">
            <h2 className="font-garamond text-2xl text-foreground mb-4">Presentation History</h2>
            <div className="space-y-0">
              {(publication.presentations as { date: string; text: string; award: string | null }[]).map((pres, idx) => (
                <div key={idx} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
                  <span className="font-mono text-xs text-muted-foreground pt-0.5">{pres.date}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-sans text-foreground">{pres.text}</span>
                    {pres.award && (
                      <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-sans rounded">
                        {pres.award}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isVOISK && (
          <div className="flex gap-4 mt-8">
            {!isDREAM && (
              <a href="https://arxiv.org/abs/2601.14346" target="_blank" rel="noreferrer" className="px-4 py-2 border border-border hover:bg-accent hover:text-white transition-colors text-sm font-sans rounded">
                Preprint
              </a>
            )}
            <a href="https://github.com/yewoonn/2024-DREAM-challenge" className="px-4 py-2 border border-border hover:bg-accent hover:text-white transition-colors text-sm font-sans rounded">
              GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactSection() {
  const links = [
    { label: "Email", value: "yewoonn02@gmail.com", href: "mailto:yewoonn02@gmail.com", desc: "Reach out anytime" },
    { label: "GitHub", value: "github.com/yewoonn", href: "http://github.com/yewoonn", desc: "Code & projects" },
    { label: "LinkedIn", value: "linkedin.com/in/han-yewon", href: "https://www.linkedin.com/in/han-yewon", desc: "Professional profile" },
    { label: "CV (PDF)", value: "Download CV", href: "https://drive.google.com/file/d/1p-b297cereuH8uUuoOVJTTyhv3ytUvd9/view?usp=sharing", desc: "Full curriculum vitae" },
  ];

  return (
    <div className="space-y-10 max-w-2xl">
      <p className="text-base font-sans text-muted-foreground leading-relaxed">
        I'm always happy to connect with researchers, students, and mentors. Feel free to reach out via any of the channels below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
            className="group block p-5 border border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-all duration-200"
          >
            <p className="font-mono text-xs text-muted-foreground mb-1 uppercase tracking-widest">{item.label}</p>
            <p className="font-sans text-base font-medium text-foreground group-hover:text-primary transition-colors">{item.value}</p>
            <p className="font-sans text-xs text-muted-foreground mt-1">{item.desc}</p>
          </a>
        ))}
      </div>

    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>(() => {
    const hash = window.location.hash.slice(1);
    return (hash as Section) || "about";
  });
  const [selectedPublication, setSelectedPublication] = useState<typeof PUBLICATIONS[0] | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.slice(1) === ADMIN_SLUG);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setIsAdmin(hash === ADMIN_SLUG);
      if (hash && hash !== ADMIN_SLUG) {
        setActiveSection(hash as Section);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Record one visit per page load (skip the private admin page).
  useEffect(() => {
    if (window.location.hash.slice(1) === ADMIN_SLUG) return;
    const entry = window.location.hash.slice(1) || "about";
    logVisit(entry);
  }, []);

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        .font-garamond { font-family: 'EB Garamond', Georgia, serif; }
        .font-mono { font-family: 'DM Mono', 'Courier New', monospace; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>

      {/* Top navigation */}
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-4">
          <nav className="flex flex-wrap justify-end gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleSectionChange(link.id)}
                className={`text-sm font-sans tracking-wide transition-colors duration-150 ${
                  activeSection === link.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <span className="text-muted-foreground/30">|</span>
            <a
              href="#"
              className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
              aria-label="CV"
              title="Download CV"
            >
              ★
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {activeSection === "about" && (
          <div className="space-y-16">
            <AboutSection />
            <section>
              <div className="flex items-baseline justify-between border-b border-border pb-3 mb-6">
                <h2 className="font-garamond text-2xl font-normal text-foreground">
                  News
                </h2>
                <button
                  onClick={() => handleSectionChange("news")}
                  className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                >
                  more →
                </button>
              </div>
              <div className="space-y-0">
                {NEWS.slice(0, 3).map((item, i) => (
                  <div key={i} className={`grid grid-cols-[7rem_1fr] gap-4 ${i > 0 ? 'border-t' : ''} border-border ${i === 0 ? 'pb-4' : 'py-4'}`}>
                    <span className="font-mono text-xs text-muted-foreground pt-0.5">{item.date}</span>
                    <p className="text-base font-sans text-foreground leading-relaxed">{renderNewsText(item)}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-garamond text-2xl font-normal text-foreground mb-6 border-b border-border pb-3">
                Publications
              </h2>
              <PublicationsSection onPublicationClick={(pub) => {
                setSelectedPublication(pub);
                handleSectionChange("publication-detail");
              }} />
            </section>
          </div>
        )}
        {activeSection === "publications" && (
          <div className="space-y-8">
            <h1 className="font-garamond text-3xl md:text-4xl font-normal text-foreground border-b border-border pb-4">Publications</h1>
            <PublicationsSection onPublicationClick={(pub) => {
              setSelectedPublication(pub);
              handleSectionChange("publication-detail");
            }} />
          </div>
        )}
        {activeSection === "news" && (
          <div className="space-y-8">
            <h1 className="font-garamond text-3xl md:text-4xl font-normal text-foreground border-b border-border pb-4">News</h1>
            <NewsSection />
          </div>
        )}
        {activeSection === "vitae" && (
          <div className="space-y-8">
            <h1 className="font-garamond text-3xl md:text-4xl font-normal text-foreground border-b border-border pb-4">Curriculum Vitae</h1>
            <VitaeSection />
          </div>
        )}
        {activeSection === "contact" && (
          <div className="space-y-8">
            <h1 className="font-garamond text-3xl md:text-4xl font-normal text-foreground border-b border-border pb-4">Contact</h1>
            <ContactSection />
          </div>
        )}
        {activeSection === "publication-detail" && <PublicationDetailSection publication={selectedPublication} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-6">
          <p className="font-mono text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Yewon Han &nbsp;·&nbsp; Dongguk University
          </p>
        </div>
      </footer>
    </div>
  );
}
