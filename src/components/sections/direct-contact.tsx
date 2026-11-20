"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { contactAreas } from "@/lib/contact-validation";

export function DirectContact({ initialArea = "" }: { initialArea?: string }) {
  const [area, setArea] = useState(initialArea);
  const selectedArea = Object.hasOwn(contactAreas, area) && area !== "outro"
    ? contactAreas[area as keyof typeof contactAreas]
    : undefined;
  const whatsappUrl = getWhatsAppUrl(selectedArea
    ? `Olá, Dr. Hélio Aquino. Gostaria de solicitar atendimento sobre ${selectedArea}.`
    : undefined);

  return (
    <div className="contact-form direct-contact">
      <div className="form-heading">
        <h3>{whatsappUrl ? "Atendimento pelo WhatsApp" : "Atendimento por telefone"}</h3>
      </div>
      {whatsappUrl && (
        <>
          <p className="direct-intro">Escolha o assunto para iniciar a conversa. Você pode revisar a mensagem no WhatsApp antes de enviá-la.</p>
          <div className="form-field">
            <label htmlFor="direct-contact-area">Assunto <span>(opcional)</span></label>
            <select id="direct-contact-area" value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="">Selecione um assunto</option>
              {Object.entries(contactAreas).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </>
      )}
      <a href={whatsappUrl ?? siteConfig.phoneHref} className="button button-gold form-submit" target={whatsappUrl ? "_blank" : undefined} rel="noopener noreferrer">
        {whatsappUrl ? "Abrir WhatsApp" : `Ligar para ${siteConfig.phone}`} <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      <p className="form-disclaimer"><Link href="/privacidade">Aviso de privacidade</Link></p>
    </div>
  );
}
