
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { siteConfig } from "@/config/site";

const appearances = [
  {
    program: "Podcast THINGS",
    topic: "O papel do advogado diante dos jurados",
    href: "https://www.instagram.com/programathings/reel/DeIPhxXxyBJ/",
  },
  {
    program: "ExpoDireito 2026",
    topic: "A palavra e a humanidade no plenário",
    href: "https://www.instagram.com/helioaquinoadvogado/reel/DZyAv86pra6/",
  },
];

export function Team() {
  return (
    <section className="team-section section-pad" id="equipe" aria-labelledby="team-title">
      <div className="container team-directory">
        <Reveal className="directory-intro">
          <SectionLabel>Livro, entrevistas e palestras</SectionLabel>
          <h2 id="team-title">Para além<br /><em>da tribuna</em></h2>
          <ul className="directory-areas">
            {appearances.map(({ program, topic, href }) => (
              <li key={program}>
                <a className="appearance-link" href={href} target="_blank" rel="noopener noreferrer">
                  <span>
                    {program}
                    <small className="appearance-topic">{topic}</small>
                  </span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a className="text-link" href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
            Acompanhar no Instagram <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
        <article className="publication-feature"><span className="publication-credit">Hélio Aquino · Editora Dialética</span><h3>A voz<br /><em>que defende</em></h3><p>Minha história no Tribunal do Júri</p><a href="https://www.instagram.com/editoradialetica/p/DaTgejImZzK/" target="_blank" rel="noopener noreferrer">Conhecer o livro <ArrowUpRight size={18} aria-hidden="true" /></a></article>
      </div>
    </section>
  );
}

