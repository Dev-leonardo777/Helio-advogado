"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Pause, Play, X } from "lucide-react";
import { useSiteMotion } from "@/components/providers/motion-provider";
import { Monogram } from "@/components/ui/brand";
import { siteConfig } from "@/config/site";
import { practiceAreas } from "@/content/practice-areas";

export function InteractiveFolio() {
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = useSiteMotion();
  const MotionIcon = enabled ? Pause : Play;
  const ToggleIcon = open ? X : BookOpen;

  return (
    <div className="folio-scene" data-open={open}>
      <div className="folio-halo" aria-hidden="true" />
      <button className="folio-toggle" type="button" aria-expanded={open}
        aria-controls="folio-index" onClick={() => setOpen(!open)}>
        <span><ToggleIcon size={15} aria-hidden="true" />{open ? "Fechar índice" : "Abrir índice"}</span>
      </button>
      <button className="folio-motion" type="button"
        aria-label={enabled ? "Pausar animações" : "Ativar animações"} title={enabled ? "Pausar animações" : "Ativar animações"}
        onClick={toggle}>
        <MotionIcon size={14} aria-hidden="true" />{!enabled && <span>Animar</span>}
      </button>
      <div className="folio-volume">
        <div className="folio-pages" aria-hidden="true" />
        <nav id="folio-index" className="folio-leaf" aria-label="Índice das áreas de atuação" inert={!open}>
          <span className="folio-leaf-title">Atuação</span>
          {practiceAreas.map(({ id, title }) => (
            <a key={id} href={`#area-${id}`} onClick={() => {
              const area = document.getElementById(`area-${id}`);
              if (area instanceof HTMLDetailsElement) {
                area.open = true;
                area.querySelector("summary")?.focus({ preventScroll: true });
              }
            }}>{title}<ArrowUpRight size={12} aria-hidden="true" /></a>
          ))}
        </nav>
        <div className="folio-cover" aria-hidden="true">
          <div className="folio-endpaper"><Monogram /></div>
          <div className="folio-frame">
            <Monogram />
            <div className="folio-imprint">{siteConfig.name}<span>Advocacia criminal</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
