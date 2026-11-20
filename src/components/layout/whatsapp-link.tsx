import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/config/site";

export function WhatsAppLink() {
  const url = getWhatsAppUrl();
  if (!url) return null;
  return (
    <a className="whatsapp-float" href={url} target="_blank" rel="noopener noreferrer" aria-label="Contato com Hélio Aquino pelo WhatsApp (abre em nova aba)">
      <MessageCircle size={22} aria-hidden="true" /><span>WhatsApp</span>
    </a>
  );
}
