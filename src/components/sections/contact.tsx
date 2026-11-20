import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { DirectContact } from "@/components/sections/direct-contact";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { getContactEnvironment } from "@/config/contact-server";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { contactIsConfigured } from "@/lib/contact-handler";

export function Contact({ initialArea }: { initialArea?: string }) {
  const emailFormEnabled = contactIsConfigured(getContactEnvironment());
  const whatsappUrl = getWhatsAppUrl();
  const channels = [
    { label: "Telefone", text: siteConfig.phone, href: siteConfig.phoneHref, icon: Phone },
    { label: "Instagram", text: "@helioaquinoadvogado", href: siteConfig.instagram, icon: Camera },
    { label: "Localização", text: siteConfig.address || "Ver no Google Maps", href: siteConfig.maps, icon: MapPin },
    ...(siteConfig.email ? [{ label: "E-mail", text: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail }] : []),
  ];

  return (
    <section className="contact-section section-pad" id="contato" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <Reveal className="contact-intro">
          <SectionLabel>Contato</SectionLabel>
          <h2 id="contact-title">Fale com<br /><em>Hélio Aquino</em></h2>
          <div className="contact-channels">
            {channels.map(({ label, text, href, icon: Icon }) => (
              <div key={label}>
                <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <span>{label}</span>
                  <a href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer">
                    {text}
                  </a>
                </div>
              </div>
            ))}
          </div>
          {emailFormEnabled && whatsappUrl && (
            <a className="button button-outline whatsapp-contact" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Abrir WhatsApp
            </a>
          )}
        </Reveal>
        {emailFormEnabled
          ? <ContactForm configured initialArea={initialArea} />
          : <DirectContact initialArea={initialArea} />}
      </div>
    </section>
  );
}
