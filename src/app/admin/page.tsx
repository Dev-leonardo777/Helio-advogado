"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Layout,
  Award,
  UserCheck,
  Phone,
  Shield,
  Eye,
  RefreshCw,
  Upload,
  ImageIcon,
  Images,
  Plus,
  Trash2,
} from "lucide-react";

interface SiteContent {
  siteConfig?: {
    name?: string;
    role?: string;
    description?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    registration?: string;
    instagram?: string;
    maps?: string;
  };
  hero?: {
    role?: string;
    titleLine1?: string;
    titleLine2?: string;
    scope?: string;
    ctaText?: string;
    quote?: string;
    image?: string;
  };
  award?: {
    badge?: string;
    titleLine1?: string;
    titleLine2?: string;
    category?: string;
    description?: string;
    image?: string;
  };
  about?: {
    titleLine1?: string;
    titleLine2?: string;
    lead?: string;
    question1?: string;
    question2?: string;
    image?: string;
  };
  gallery?: Array<{
    id: number | string;
    src: string;
    title: string;
    tag: string;
    context: string;
  }>;
}

export default function AdminPage() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"site" | "hero" | "award" | "about" | "gallery">("site");

  const heroFileRef = useRef<HTMLInputElement>(null);
  const awardFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const galleryNewFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((json: SiteContent) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (section: keyof Omit<SiteContent, "gallery">, field: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, string>),
          [field]: value,
        },
      };
    });
  };

  const handleGalleryItemChange = (index: number, field: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const list = [...(prev.gallery || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, gallery: list };
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    if (confirm("Tem certeza que deseja remover esta foto da galeria?")) {
      setData((prev) => {
        if (!prev) return prev;
        const list = [...(prev.gallery || [])];
        list.splice(index, 1);
        return { ...prev, gallery: list };
      });
    }
  };

  // Upload de Imagem de Seção Única
  const handleImageUpload = async (section: "hero" | "award" | "about", file: File) => {
    setUploadingSection(section);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        handleChange(section, "image", result.url);
        setStatusMsg({ type: "success", text: `Imagem da seção atualizada com sucesso!` });
      } else {
        setStatusMsg({ type: "error", text: result.message || "Falha no envio da imagem." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Erro ao comunicar com o servidor de upload." });
    } finally {
      setUploadingSection(null);
    }
  };

  // Upload ou Troca de Foto na Galeria
  const handleGalleryImageUpload = async (index: number, file: File) => {
    setUploadingGalleryIdx(index);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        handleGalleryItemChange(index, "src", result.url);
        setStatusMsg({ type: "success", text: `Foto ${index + 1} da galeria atualizada!` });
      } else {
        setStatusMsg({ type: "error", text: result.message || "Erro no upload." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Falha ao enviar arquivo para a galeria." });
    } finally {
      setUploadingGalleryIdx(null);
    }
  };

  // Adicionar Nova Foto à Galeria
  const handleAddNewGalleryImage = async (file: File) => {
    setUploadingSection("new-gallery");
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        const newItem = {
          id: Date.now(),
          src: result.url,
          title: "Novo Registro Forense",
          tag: "Plenário",
          context: "Atuação jurídica em defesa das garantias constitucionais",
        };
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            gallery: [...(prev.gallery || []), newItem],
          };
        });
        setStatusMsg({ type: "success", text: "Nova foto adicionada à galeria!" });
      } else {
        setStatusMsg({ type: "error", text: result.message || "Erro no upload." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Falha ao enviar arquivo." });
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatusMsg({ type: "success", text: "Todas as alterações foram salvas com sucesso no site!" });
      } else {
        setStatusMsg({ type: "error", text: result.message || "Erro ao salvar." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Falha de conexão com a API." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <RefreshCw className="spin" size={32} />
        <p>Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-wrap">
      {/* Barra de Topo do Admin */}
      <header className="admin-topbar">
        <div className="admin-container admin-topbar-inner">
          <div className="admin-brand">
            <Shield size={24} className="gold-icon" />
            <div>
              <strong>Painel Administrativo</strong>
              <span>Hélio Aquino · Advocacia Criminal</span>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/" target="_blank" className="admin-btn-view">
              <Eye size={16} /> Ver Site ao Vivo
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="admin-btn-save"
            >
              <Save size={16} /> {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="admin-container admin-main">
        {statusMsg && (
          <div className={`admin-alert admin-alert-${statusMsg.type}`}>
            {statusMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="admin-layout-grid">
          {/* Menu Lateral de Abas */}
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              <button
                type="button"
                className={`admin-nav-item ${activeTab === "site" ? "is-active" : ""}`}
                onClick={() => setActiveTab("site")}
              >
                <Phone size={18} /> Dados Gerais & Contato
              </button>
              <button
                type="button"
                className={`admin-nav-item ${activeTab === "hero" ? "is-active" : ""}`}
                onClick={() => setActiveTab("hero")}
              >
                <Layout size={18} /> Seção Hero & Imagem
              </button>
              <button
                type="button"
                className={`admin-nav-item ${activeTab === "award" ? "is-active" : ""}`}
                onClick={() => setActiveTab("award")}
              >
                <Award size={18} /> Prêmio Melhores & Imagem
              </button>
              <button
                type="button"
                className={`admin-nav-item ${activeTab === "about" ? "is-active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                <UserCheck size={18} /> O Advogado & Imagem
              </button>
              <button
                type="button"
                className={`admin-nav-item ${activeTab === "gallery" ? "is-active" : ""}`}
                onClick={() => setActiveTab("gallery")}
              >
                <Images size={18} /> Galeria de Fotos ({data?.gallery?.length || 26})
              </button>
            </nav>
          </aside>

          {/* Área de Edição */}
          <section className="admin-editor-card">
            <form onSubmit={handleSubmit}>
              {/* Aba 1: Dados Gerais e Contato */}
              {activeTab === "site" && (
                <div className="admin-form-group">
                  <h3 className="admin-section-title">Dados Gerais e Informações de Contato</h3>
                  <p className="admin-section-subtitle">
                    Modifique o telefone, WhatsApp, redes sociais e textos base do site.
                  </p>

                  <div className="admin-fields-grid">
                    <div className="admin-input-wrap">
                      <label>Nome do Profissional</label>
                      <input
                        type="text"
                        value={data?.siteConfig?.name || ""}
                        onChange={(e) => handleChange("siteConfig", "name", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Função / Especialidade</label>
                      <input
                        type="text"
                        value={data?.siteConfig?.role || ""}
                        onChange={(e) => handleChange("siteConfig", "role", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>WhatsApp (somente números)</label>
                      <input
                        type="text"
                        value={data?.siteConfig?.whatsapp || ""}
                        onChange={(e) => handleChange("siteConfig", "whatsapp", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Telefone Formatado</label>
                      <input
                        type="text"
                        value={data?.siteConfig?.phone || ""}
                        onChange={(e) => handleChange("siteConfig", "phone", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>E-mail de Contato</label>
                      <input
                        type="email"
                        value={data?.siteConfig?.email || ""}
                        onChange={(e) => handleChange("siteConfig", "email", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Registro OAB</label>
                      <input
                        type="text"
                        value={data?.siteConfig?.registration || ""}
                        onChange={(e) => handleChange("siteConfig", "registration", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Link do Instagram</label>
                      <input
                        type="url"
                        value={data?.siteConfig?.instagram || ""}
                        onChange={(e) => handleChange("siteConfig", "instagram", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Descrição Institucional (SEO)</label>
                      <textarea
                        rows={3}
                        value={data?.siteConfig?.description || ""}
                        onChange={(e) => handleChange("siteConfig", "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Aba 2: Hero */}
              {activeTab === "hero" && (
                <div className="admin-form-group">
                  <h3 className="admin-section-title">Seção Hero (Abertura do Site)</h3>
                  <p className="admin-section-subtitle">
                    Troque a imagem principal da Hero e personalize os textos de abertura.
                  </p>

                  <div className="admin-image-manager-box">
                    <div className="admin-image-preview-wrap">
                      {data?.hero?.image ? (
                        <Image
                          src={data.hero.image}
                          alt="Prévia da Hero"
                          fill
                          className="admin-preview-img"
                        />
                      ) : (
                        <div className="admin-no-img"><ImageIcon size={32} /></div>
                      )}
                    </div>
                    <div className="admin-image-manager-details">
                      <strong>Fotografia da Hero (Tribuna do Júri)</strong>
                      <span>URL atual: <code>{data?.hero?.image || "/images/helio-juri.jpg"}</code></span>
                      <p>Envie uma nova imagem para substituir a foto da abertura do site imediatamente:</p>
                      
                      <input
                        type="file"
                        ref={heroFileRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("hero", file);
                        }}
                      />
                      <button
                        type="button"
                        className="admin-upload-btn"
                        onClick={() => heroFileRef.current?.click()}
                        disabled={uploadingSection === "hero"}
                      >
                        <Upload size={16} />
                        {uploadingSection === "hero" ? "Enviando arquivo..." : "Carregar Nova Imagem da Hero"}
                      </button>
                    </div>
                  </div>

                  <div className="admin-fields-grid">
                    <div className="admin-input-wrap">
                      <label>Etiqueta Superior (Role)</label>
                      <input
                        type="text"
                        value={data?.hero?.role || ""}
                        onChange={(e) => handleChange("hero", "role", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Citação de Destaque na Base</label>
                      <input
                        type="text"
                        value={data?.hero?.quote || ""}
                        onChange={(e) => handleChange("hero", "quote", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Título (Linha 1)</label>
                      <input
                        type="text"
                        value={data?.hero?.titleLine1 || ""}
                        onChange={(e) => handleChange("hero", "titleLine1", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Título em Destaque Itálico (Linha 2)</label>
                      <input
                        type="text"
                        value={data?.hero?.titleLine2 || ""}
                        onChange={(e) => handleChange("hero", "titleLine2", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Texto de Escopo / Descrição de Atuação</label>
                      <textarea
                        rows={3}
                        value={data?.hero?.scope || ""}
                        onChange={(e) => handleChange("hero", "scope", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Texto do Botão de Atendimento</label>
                      <input
                        type="text"
                        value={data?.hero?.ctaText || ""}
                        onChange={(e) => handleChange("hero", "ctaText", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Aba 3: Prêmio */}
              {activeTab === "award" && (
                <div className="admin-form-group">
                  <h3 className="admin-section-title">Prêmio Melhores de 2026</h3>
                  <p className="admin-section-subtitle">
                    Troque a foto do troféu e atualize os textos do reconhecimento.
                  </p>

                  <div className="admin-image-manager-box">
                    <div className="admin-image-preview-wrap">
                      {data?.award?.image ? (
                        <Image
                          src={data.award.image}
                          alt="Prévia do Prêmio"
                          fill
                          className="admin-preview-img"
                        />
                      ) : (
                        <div className="admin-no-img"><ImageIcon size={32} /></div>
                      )}
                    </div>
                    <div className="admin-image-manager-details">
                      <strong>Fotografia do Prêmio (Troféu)</strong>
                      <span>URL atual: <code>{data?.award?.image || "/images/premio-melhores-2026.jpg"}</code></span>
                      <p>Envie uma nova fotografia com o troféu ou evento de premiação:</p>
                      
                      <input
                        type="file"
                        ref={awardFileRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("award", file);
                        }}
                      />
                      <button
                        type="button"
                        className="admin-upload-btn"
                        onClick={() => awardFileRef.current?.click()}
                        disabled={uploadingSection === "award"}
                      >
                        <Upload size={16} />
                        {uploadingSection === "award" ? "Enviando arquivo..." : "Carregar Nova Imagem do Prêmio"}
                      </button>
                    </div>
                  </div>

                  <div className="admin-fields-grid">
                    <div className="admin-input-wrap">
                      <label>Selo / Badge do Prêmio</label>
                      <input
                        type="text"
                        value={data?.award?.badge || ""}
                        onChange={(e) => handleChange("award", "badge", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Categoria Homenageada</label>
                      <input
                        type="text"
                        value={data?.award?.category || ""}
                        onChange={(e) => handleChange("award", "category", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Título (Linha 1)</label>
                      <input
                        type="text"
                        value={data?.award?.titleLine1 || ""}
                        onChange={(e) => handleChange("award", "titleLine1", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Título (Linha 2 - Destaque)</label>
                      <input
                        type="text"
                        value={data?.award?.titleLine2 || ""}
                        onChange={(e) => handleChange("award", "titleLine2", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Descrição do Reconhecimento</label>
                      <textarea
                        rows={4}
                        value={data?.award?.description || ""}
                        onChange={(e) => handleChange("award", "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Aba 4: O Advogado */}
              {activeTab === "about" && (
                <div className="admin-form-group">
                  <h3 className="admin-section-title">O Advogado — “Defender é humanizar”</h3>
                  <p className="admin-section-subtitle">
                    Troque a foto oficial de autoridade (Congresso) e edite os textos da seção.
                  </p>

                  <div className="admin-image-manager-box">
                    <div className="admin-image-preview-wrap">
                      {data?.about?.image ? (
                        <Image
                          src={data.about.image}
                          alt="Prévia do Advogado"
                          fill
                          className="admin-preview-img"
                        />
                      ) : (
                        <div className="admin-no-img"><ImageIcon size={32} /></div>
                      )}
                    </div>
                    <div className="admin-image-manager-details">
                      <strong>Fotografia de Autoridade (Congresso / Plenário)</strong>
                      <span>URL atual: <code>{data?.about?.image || "/images/helio-congresso.jpg"}</code></span>
                      <p>Envie uma nova fotografia oficial para esta seção:</p>
                      
                      <input
                        type="file"
                        ref={aboutFileRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("about", file);
                        }}
                      />
                      <button
                        type="button"
                        className="admin-upload-btn"
                        onClick={() => aboutFileRef.current?.click()}
                        disabled={uploadingSection === "about"}
                      >
                        <Upload size={16} />
                        {uploadingSection === "about" ? "Enviando arquivo..." : "Carregar Nova Imagem do Advogado"}
                      </button>
                    </div>
                  </div>

                  <div className="admin-fields-grid">
                    <div className="admin-input-wrap">
                      <label>Título (Linha 1)</label>
                      <input
                        type="text"
                        value={data?.about?.titleLine1 || ""}
                        onChange={(e) => handleChange("about", "titleLine1", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap">
                      <label>Título (Linha 2 - Itálico)</label>
                      <input
                        type="text"
                        value={data?.about?.titleLine2 || ""}
                        onChange={(e) => handleChange("about", "titleLine2", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Texto Introdutório</label>
                      <textarea
                        rows={3}
                        value={data?.about?.lead || ""}
                        onChange={(e) => handleChange("about", "lead", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Pergunta Fundamental 01</label>
                      <textarea
                        rows={2}
                        value={data?.about?.question1 || ""}
                        onChange={(e) => handleChange("about", "question1", e.target.value)}
                      />
                    </div>
                    <div className="admin-input-wrap full-width">
                      <label>Pergunta Fundamental 02</label>
                      <textarea
                        rows={2}
                        value={data?.about?.question2 || ""}
                        onChange={(e) => handleChange("about", "question2", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Aba 5: Galeria de Fotos */}
              {activeTab === "gallery" && (
                <div className="admin-form-group">
                  <div className="admin-gallery-header-row">
                    <div>
                      <h3 className="admin-section-title">Gerenciador da Galeria de Fotos Forenses</h3>
                      <p className="admin-section-subtitle">
                        Substitua qualquer fotografia, edite seus títulos e legendas ou adicione novas fotos ao carrossel.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={galleryNewFileRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAddNewGalleryImage(file);
                        }}
                      />
                      <button
                        type="button"
                        className="admin-upload-btn add-new"
                        onClick={() => galleryNewFileRef.current?.click()}
                        disabled={uploadingSection === "new-gallery"}
                      >
                        <Plus size={16} /> {uploadingSection === "new-gallery" ? "Enviando..." : "Adicionar Nova Foto"}
                      </button>
                    </div>
                  </div>

                  <div className="admin-gallery-list">
                    {data?.gallery?.map((item, idx) => (
                      <div key={item.id || idx} className="admin-gallery-item-card">
                        <div className="admin-gallery-thumb-col">
                          <div className="admin-gallery-thumb-box">
                            <Image
                              src={item.src}
                              alt={item.title || `Foto ${idx + 1}`}
                              fill
                              className="admin-gallery-thumb-img"
                            />
                          </div>
                          <label className="admin-gallery-replace-btn">
                            <Upload size={13} />
                            <span>{uploadingGalleryIdx === idx ? "Enviando..." : "Trocar Imagem"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleGalleryImageUpload(idx, file);
                              }}
                            />
                          </label>
                        </div>

                        <div className="admin-gallery-fields-col">
                          <div className="admin-gallery-row-top">
                            <span className="admin-gallery-number-badge">Foto {idx + 1} de {data?.gallery?.length || 0}</span>
                            <button
                              type="button"
                              className="admin-btn-remove-item"
                              onClick={() => handleRemoveGalleryItem(idx)}
                              title="Remover foto da galeria"
                            >
                              <Trash2 size={15} /> Remover
                            </button>
                          </div>

                          <div className="admin-fields-grid compact">
                            <div className="admin-input-wrap">
                              <label>Tag / Categoria</label>
                              <input
                                type="text"
                                value={item.tag || ""}
                                onChange={(e) => handleGalleryItemChange(idx, "tag", e.target.value)}
                              />
                            </div>
                            <div className="admin-input-wrap">
                              <label>Título da Fotografia</label>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => handleGalleryItemChange(idx, "title", e.target.value)}
                              />
                            </div>
                            <div className="admin-input-wrap full-width">
                              <label>Contexto / Legenda Forense</label>
                              <input
                                type="text"
                                value={item.context || ""}
                                onChange={(e) => handleGalleryItemChange(idx, "context", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="admin-form-footer">
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn-save large"
                >
                  <Save size={18} /> {saving ? "Gravando dados..." : "Salvar Modificações"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
