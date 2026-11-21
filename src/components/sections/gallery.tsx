"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ShieldCheck,
  Scale,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { defaultGalleryImages } from "@/data/default-gallery";

interface GalleryProps {
  initialImages?: typeof defaultGalleryImages;
}

export function Gallery({ initialImages }: GalleryProps) {
  const [galleryImages, setGalleryImages] = useState(initialImages || defaultGalleryImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Busca fotos dinâmicas atualizadas do endpoint
  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json?.gallery) && json.gallery.length > 0) {
          setGalleryImages(json.gallery);
        }
      })
      .catch((err) => console.error("Erro ao carregar fotos da galeria:", err));
  }, []);

  // Sincroniza scroll com índice ativo
  const scrollToCard = useCallback((index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cards = slider.querySelectorAll<HTMLElement>(".curated-card");
    const targetCard = cards[index];
    if (targetCard) {
      const containerWidth = slider.clientWidth;
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.clientWidth;
      const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      slider.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
    }
    setActiveIndex(index);
  }, []);

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(galleryImages.length - 1, activeIndex + 1);
    scrollToCard(nextIdx);
  };

  // Suporte a Touch & Drag suave com o mouse / dedo
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeftStart.current = sliderRef.current?.scrollLeft || 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.4;
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Atualiza índice ativo com base no scroll visível
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const cards = slider.querySelectorAll<HTMLElement>(".curated-card");
        const centerLine = slider.scrollLeft + slider.clientWidth / 2;
        let closestIdx = 0;
        let minDiff = Infinity;

        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const diff = Math.abs(cardCenter - centerLine);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        setActiveIndex(closestIdx);
      }, 60);
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      slider.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const activePhoto = galleryImages[activeIndex] || galleryImages[0];

  return (
    <section className="curated-gallery-section" id="galeria" aria-labelledby="curated-gallery-title">
      <div className="curated-gallery-ambient" aria-hidden="true" />
      
      <div className="container">
        {/* Topo Compacto & Premium */}
        <div className="curated-header-layout">
          <Reveal className="curated-header-left">
            <SectionLabel light>Acervo Fotográfico de Plenário</SectionLabel>
            <div className="curated-title-group">
              <h2 id="curated-gallery-title">
                A Voz na Tribuna<br />
                <em>& Momentos Forenses</em>
              </h2>
            </div>
            <p className="curated-motto">
              “Defender é humanizar.” Registros de julgamentos no Tribunal do Júri e atuações na defesa das garantias constitucionais.
            </p>
          </Reveal>

          {/* Selos de Princípios em formato de badges douradas refinadas */}
          <div className="curated-badges-column">
            <div className="curated-pill">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Plenitude de Defesa</span>
            </div>
            <div className="curated-pill">
              <MessagesSquare size={15} aria-hidden="true" />
              <span>Contraditório Real</span>
            </div>
            <div className="curated-pill">
              <Scale size={15} aria-hidden="true" />
              <span>Presunção de Inocência</span>
            </div>
          </div>
        </div>

        {/* Barra de Controle do Carrossel e Contador */}
        <div className="curated-controls-bar">
          <div className="curated-counter-pill">
            <Sparkles size={14} className="sparkle-gold" aria-hidden="true" />
            <span>
              Registro <strong>{String(activeIndex + 1).padStart(2, "0")}</strong> de{" "}
              <strong>{galleryImages.length}</strong>
            </span>
          </div>

          <div className="curated-active-brief">
            <span className="brief-tag">{activePhoto?.tag}</span>
            <span className="brief-title">{activePhoto?.title}</span>
          </div>

          <div className="curated-arrow-actions">
            <button
              type="button"
              className="curated-btn-arrow"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="curated-btn-arrow"
              onClick={handleNext}
              disabled={activeIndex === galleryImages.length - 1}
              aria-label="Próxima foto"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Carrossel Horizontal Deslizável (Touch / Mouse Drag) */}
        <div
          className="curated-slider-track"
          ref={sliderRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
        >
          {galleryImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={img.id}
                className={`curated-card ${isSelected ? "is-active" : ""}`}
                onClick={() => {
                  scrollToCard(idx);
                }}
              >
                <div className="curated-card-inner">
                  <div className="curated-photo-wrapper">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 340px"
                      quality={86}
                      className="curated-photo"
                      draggable={false}
                    />
                    <div className="curated-card-gradient" />
                    
                    {/* Botão de Expansão (Lightbox) */}
                    <button
                      type="button"
                      className="curated-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(idx);
                      }}
                      aria-label={`Ver foto ${idx + 1} em tamanho ampliado`}
                    >
                      <Maximize2 size={16} />
                    </button>

                    <div className="curated-card-meta">
                      <span className="card-tag">{img.tag}</span>
                      <h4 className="card-title">{img.title}</h4>
                      <p className="card-desc">{img.context}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra de Progresso Interativa */}
        <div className="curated-progress-container">
          <div
            className="curated-progress-bar"
            style={{
              width: `${((activeIndex + 1) / Math.max(1, galleryImages.length)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Lightbox Modal em Alta Definição */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="curated-lightbox-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") {
              setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
            }
            if (e.key === "ArrowRight") {
              setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
            }
          }}
          tabIndex={-1}
        >
          <div className="curated-lightbox-backdrop" />
          
          <button
            type="button"
            className="curated-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Fechar visualização"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="curated-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="curated-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="curated-lightbox-media">
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].title}
                fill
                quality={94}
                sizes="92vw"
                className="curated-lightbox-img"
                priority
              />
            </div>
            <div className="curated-lightbox-caption">
              <div>
                <span className="curated-lightbox-pill">
                  {galleryImages[lightboxIndex].tag} · {lightboxIndex + 1} de {galleryImages.length}
                </span>
                <h3>{galleryImages[lightboxIndex].title}</h3>
                <p>{galleryImages[lightboxIndex].context}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="curated-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
}
