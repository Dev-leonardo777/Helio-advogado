"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { contactAreas, validateContact, type ContactErrors } from "@/lib/contact-validation";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ configured, initialArea = "" }: { configured: boolean; initialArea?: string }) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);

  function focusError(nextErrors: ContactErrors) {
    const first = Object.keys(nextErrors)[0];
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = validateContact({ ...Object.fromEntries(fields), consent: fields.get("consent") === "on" });
    if (!result.ok) { setErrors(result.errors); setStatus("error"); setMessage("Revise os campos indicados antes de continuar."); focusError(result.errors); return; }
    setErrors({});
    if (!configured) { setStatus("success"); setMessage("Demonstração concluída. Seus dados ficaram apenas nesta página."); return; }
    inFlight.current = true;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data), signal: AbortSignal.timeout(18_000) });
      const payload = await response.json() as { message?: string; errors?: ContactErrors };
      if (!response.ok) {
        setErrors(payload.errors || {});
        setStatus("error");
        setMessage(payload.message || "Não foi possível enviar. Tente novamente mais tarde.");
        if (payload.errors) focusError(payload.errors);
        return;
      }
      setStatus("success");
      setMessage(payload.message || "Mensagem enviada.");
      form.reset();
    } catch { setStatus("error"); setMessage("Não foi possível confirmar o envio. Verifique sua conexão e tente novamente mais tarde."); }
    finally { inFlight.current = false; }
  }

  const field = (name: keyof ContactErrors) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const error = (name: keyof ContactErrors) => errors[name] ? <span id={`${name}-error`} className="field-error">{errors[name]}</span> : null;

  return <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate aria-label="Formulário de contato" aria-busy={status === "sending"}>
    <div className="form-heading"><h3>Como podemos ajudar?</h3><span>* Campos obrigatórios</span></div>
    {!configured && <p className="form-notice">Demonstração de portfólio. Experimente com dados fictícios.</p>}
    <div className="form-grid">
      <div className="form-field"><label htmlFor="contact-name">Nome completo *</label><input id="contact-name" name="name" placeholder="Como podemos chamar você?" autoComplete="name" required maxLength={100} {...field("name")} />{error("name")}</div>
      <div className="form-field"><label htmlFor="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" placeholder="seu@email.com" autoComplete="email" required maxLength={254} {...field("email")} />{error("email")}</div>
      <div className="form-field"><label htmlFor="contact-phone">Telefone <span>(opcional)</span></label><input id="contact-phone" name="phone" type="tel" placeholder="(DDD) número" autoComplete="tel" maxLength={30} {...field("phone")} />{error("phone")}</div>
      <div className="form-field"><label htmlFor="contact-area">Assunto *</label><select id="contact-area" name="area" defaultValue={initialArea} required {...field("area")}><option value="" disabled>Selecione uma área</option>{Object.entries(contactAreas).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>{error("area")}</div>
      <div className="form-field form-field--wide"><label htmlFor="contact-message">Sua mensagem *</label><textarea id="contact-message" name="message" rows={4} minLength={20} maxLength={4000} required placeholder="Conte brevemente sobre o que você precisa conversar." {...field("message")} />{error("message")}<span className="field-help">De 20 a 4.000 caracteres. Evite enviar documentos ou informações sensíveis neste primeiro contato.</span></div>
    </div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="consent-field"><label htmlFor="contact-consent"><input id="contact-consent" type="checkbox" name="consent" required {...field("consent")} /><span>Autorizo o uso dos meus dados para responder a esta solicitação, conforme o <Link href="/privacidade">aviso de privacidade</Link>. *</span></label>{error("consent")}</div>
    <div className="form-status" role="status" aria-live="polite" aria-atomic="true">{message && <p className={status === "success" ? "status-success" : "status-error"}>{status === "success" && <CheckCircle2 size={18} aria-hidden="true" />}{message}</p>}</div>
    <button type="submit" className="button button-gold form-submit" disabled={status === "sending"}>{status === "sending" ? <>Enviando mensagem <LoaderCircle className="spin" size={18} aria-hidden="true" /></> : <>{configured ? "Enviar mensagem" : "Testar formulário"} <ArrowRight size={18} aria-hidden="true" /></>}</button>
    <p className="form-disclaimer">O envio de uma mensagem não constitui contratação de serviços jurídicos.</p>
  </form>;
}
