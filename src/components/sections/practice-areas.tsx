import Link from "next/link";
import { ArrowRight, BookOpen, Landmark, Plus, ShieldCheck } from "lucide-react";
import { practiceAreas } from "@/content/practice-areas";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

const icons = { "tribunal-do-juri": Landmark, flagrantes: ShieldCheck, "lei-de-drogas": BookOpen };

export function PracticeAreas() {
  return (
    <section className="practice-section section-pad" id="atuacao" aria-labelledby="practice-title">
      <div className="container">
        <Reveal className="section-heading section-heading--split">
          <div>
            <SectionLabel>Áreas de atuação</SectionLabel>
            <h2 id="practice-title">Da delegacia<br /><em>ao plenário</em></h2>
          </div>
          <p>Selecione uma área para conhecer as questões que você pode tratar com o advogado.</p>
        </Reveal>
        <div className="practice-grid">
          {practiceAreas.map((area, index) => {
            const Icon = icons[area.id];
            return <Reveal key={area.id} delay={index * 0.07}>
              <details className="practice-card" id={`area-${area.id}`}>
                <summary>
                  <div className="practice-card-top"><Icon size={37} strokeWidth={1.2} aria-hidden="true" /></div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <span className="practice-action">Detalhes <Plus size={19} aria-hidden="true" /></span>
                </summary>
                <div className="practice-details">
                  <ul>{area.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
                  <Link href={`/?area=${area.id}#contato`} scroll prefetch={false}>
                    Conversar sobre {area.title} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}
