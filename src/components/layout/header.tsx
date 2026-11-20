"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, siteConfig } from "@/config/site";
import { Brand } from "@/components/ui/brand";

export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("inicio");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    navigation.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    const media = window.matchMedia("(min-width: 1100px)");
    const onResize = () => { if (media.matches) dialogRef.current?.close(); };
    media.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      media.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, []);

  function openMenu() {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function restoreScroll() {
    document.body.style.overflow = "";
    menuButtonRef.current?.setAttribute("aria-expanded", "false");
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className={`site-header${scrolled || solid ? " is-solid" : ""}`}>
        <div className="header-inner container">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => <Link key={item.id} href={item.href} className={active === item.id && !solid ? "is-active" : ""} aria-current={active === item.id && !solid ? "location" : undefined}>{item.label}</Link>)}
          </nav>
          <Link className="button button-outline header-contact" href="/#contato">Solicitar atendimento <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button className="menu-toggle" ref={menuButtonRef} type="button" aria-label="Abrir menu" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded={false} onClick={() => { openMenu(); menuButtonRef.current?.setAttribute("aria-expanded", "true"); }}><Menu size={26} /></button>
        </div>
      </header>
      <dialog className="mobile-menu" id="mobile-menu" ref={dialogRef} aria-labelledby="mobile-menu-title" onClose={restoreScroll} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-top"><span id="mobile-menu-title" className="eyebrow">{siteConfig.name}</span><button className="menu-toggle" type="button" aria-label="Fechar menu" onClick={() => dialogRef.current?.close()}><X size={28} /></button></div>
          <nav aria-label="Navegação mobile">
            {navigation.map((item) => <Link key={item.id} href={item.href} onClick={() => dialogRef.current?.close()}>{item.label}<ArrowUpRight size={20} aria-hidden="true" /></Link>)}
          </nav>
        </div>
      </dialog>
    </>
  );
}
