import { BookOpen, MessagesSquare, Mic, Scale } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

const principles = [
  {
    icon: MessagesSquare,
    title: "Escuta da pessoa",
    text: "A conversa com a defesa dá espaço à versão de quem responde à acusação e às circunstâncias da sua história.",
  },
  {
    icon: BookOpen,
    title: "Leitura das provas",
    text: "Documentos, laudos e depoimentos são examinados em conjunto para distinguir o que está demonstrado do que permanece em aberto.",
  },
  {
    icon: Scale,
    title: "Contraditório",
    text: "As perguntas às testemunhas permitem esclarecer divergências e discutir as diferentes versões dos fatos.",
  },
  {
    icon: Mic,
    title: "Palavra em plenário",
    text: "Diante dos jurados, a sustentação oral apresenta as provas e os argumentos da defesa em linguagem acessível.",
  },
];

export function Differentials() {
  return (
    <section className="differentials-section section-pad" id="diferenciais" aria-labelledby="differentials-title">
      <div className="container differentials-grid">
        <Reveal className="differentials-intro">
          <SectionLabel light>Princípios de atuação</SectionLabel>
          <h2 id="differentials-title">Como se constrói<br /><em>uma defesa</em></h2>
          <p>O que acontece na tribuna começa antes da sessão, na conversa com a pessoa acusada e no estudo dos autos.</p>
          <span className="decorative-v" aria-hidden="true">HA</span>
        </Reveal>
        <div className="principles-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="principle">
                <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
