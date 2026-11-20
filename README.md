# Valença Advogados

Site institucional implementado com Next.js App Router, React, TypeScript estrito, Tailwind CSS v4, Motion e Lucide. Direção visual baseada na referência preservada em `public/referencia-valenca.png`.

## Estado atual

- Implementadas as oito seções solicitadas, menu mobile, navegação por âncoras, áreas de atuação expansíveis, animações sutis, aviso de privacidade e página 404.
- Fontes Cormorant Garamond e DM Sans; cores #101D32, #B99A62, #F5F2EB e #25282D.
- Fotografias ilustrativas locais; nomes, registros, retratos e dados institucionais ainda não fornecidos estão claramente identificados como placeholders.
- Endpoint real `POST /api/contato`, com validação no cliente e servidor e entrega via Resend quando configurado.
- Dez testes automatizados de validação e do handler de contato executados com sucesso. O provedor de e-mail é simulado nos testes; nenhuma mensagem real foi enviada.
- Dependências instaladas e versões registradas em `package-lock.json`, incluindo os pacotes locais das fontes.
- Build de produção, lint, TypeScript e os dez testes de contato aprovados. Página inicial, privacidade e imagens verificadas por HTTP.
- Fontes carregadas com `next/font/local`, sem acesso ao Google Fonts durante o build. O servidor de desenvolvimento está disponível em `http://127.0.0.1:3000` enquanto seu processo estiver ativo.
- A inspeção visual completa da responsividade no navegador continua pendente; as verificações HTTP não substituem essa inspeção.

## Como executar

Em um PowerShell normal, com acesso ao registro npm:

```powershell
cd C:\Users\Win11\Downloads\ADVOCACIA
npm.cmd install
npm.cmd run check
npm.cmd run build
npm.cmd run dev
```

Quando aparecer `Ready`, abra **http://127.0.0.1:3000**. Mantenha o terminal aberto; `Ctrl+C` encerra o servidor.

O projeto usa Node.js 22.18 ou superior. O ambiente inspecionado possui Node.js 26.7.0 e npm 11.19.0. `npm.cmd` evita o bloqueio de `npm.ps1` pelo PowerShell sem modificar políticas do sistema.

Se a porta 3000 estiver ocupada:

```powershell
npm.cmd run dev -- --port 3001
```

Nesse caso, abra http://127.0.0.1:3001. Para servir a compilação de produção, execute `npm.cmd run build` e depois `npm.cmd start`.

O cache do npm foi direcionado para `.npm-cache/` dentro do projeto. Após a primeira instalação bem-sucedida, versione o `package-lock.json`; em outras máquinas, use `npm.cmd ci`.

## Configuração de contato

Crie `.env.local` a partir de `.env.example` e preencha somente dados reais. Nunca envie chaves secretas pelo chat nem as versione.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail exibido no site |
| `NEXT_PUBLIC_CONTACT_PHONE` | Telefone exibido, com DDD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | País + DDD + número, somente dígitos |
| `NEXT_PUBLIC_OFFICE_ADDRESS` | Endereço público real |
| `NEXT_PUBLIC_OAB_REGISTRATION` | Registro real da sociedade |
| `RESEND_API_KEY` | Chave de envio, somente no servidor |
| `CONTACT_FROM_EMAIL` | Remetente com domínio verificado no Resend |
| `CONTACT_TO_EMAIL` | Destinatário institucional |
| `SITE_URL` | Origem HTTPS de produção; localmente pode ficar vazia |

Reinicie o servidor após alterar `.env.local`. Variáveis `NEXT_PUBLIC_` exigem novo build em produção. A integração WhatsApp só aparece com número configurado; não existe um telefone de demonstração que possa ser acionado por engano.

Sem as três variáveis de entrega, o formulário mostra que o canal está em configuração e não permite enviar; o endpoint retorna 503. Com configuração, a mensagem é enviada pelo servidor, e o sucesso só é exibido quando o provedor retorna um recibo. O servidor usa texto simples, destinatário fixo, timeout, honeypot, limite de tamanho e limite de tentativas. Não há banco de dados nem log dos textos enviados.

O limite de tentativas é em memória, por processo. Para produção com múltiplas instâncias, aplicar também rate limiting no gateway. O aviso de privacidade descreve o fluxo técnico e destaca dados institucionais e prazo de retenção ainda pendentes.

## Estrutura

```text
src/
  app/
    api/contato/route.ts       Endpoint de envio
    privacidade/page.tsx      Aviso de privacidade
    icon.svg                  Ícone do site
    layout.tsx                Idioma, fontes, metadados e provider
    not-found.tsx             Página 404
    page.tsx                  Composição das seções
  components/
    layout/                   Header, footer e WhatsApp
    providers/                Configuração Motion
    sections/                 Hero, áreas, escritório, equipe, diferenciais, contato
    ui/                       Marca, rótulos e animação reutilizável
  config/                     Dados públicos e configuração de contato do servidor
  content/                    Áreas de atuação
  lib/                        Fontes, validação e handler testável de contato
  styles/globals.css          Identidade visual e breakpoints
  hooks/                      Reservado para hooks compartilhados
  types/                      Reservado para tipos compartilhados
public/
  images/                     Fotografias ilustrativas locais
  referencia-valenca.png      Referência original preservada
tests/contact.test.mjs       Testes sem envio real de e-mails
docs/IMAGENS.md              Origem das imagens e prompts utilizados
```

## Verificação

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

`npm.cmd test` usa o runner nativo do Node e consegue executar mesmo sem as dependências do Next. Não equivale a validar compilação ou UI.

Com o servidor disponível, verificar os layouts em 1440, 1024, 768, 390 e 320 px; menu mobile com teclado, Escape e retorno de foco; âncoras com header fixo; expansão das três áreas; seleção do assunto ao clicar em uma área; formulário inválido, envio, sucesso e falha; preferência por movimento reduzido; página de privacidade e 404. A entrega real precisa de credenciais válidas e de um teste autorizado para o destinatário institucional.

As fontes usam `next/font/local` com arquivos WOFF2 dos pacotes `@fontsource-variable/cormorant-garamond` e `@fontsource-variable/dm-sans`. São preservadas as famílias, as variáveis CSS, os pesos utilizados e os estilos normal/itálico da Cormorant Garamond. Após `npm ci`, não é necessário acessar o Google Fonts durante o build. As licenças acompanham os pacotes instalados. As imagens são servidas do próprio projeto pelo `next/image`, com as qualidades 75 e 85 autorizadas na configuração.

## Referências técnicas

- [Next.js — Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js — Fontes](https://nextjs.org/docs/app/getting-started/fonts)
- [Tailwind CSS com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Motion — animações de rolagem](https://motion.dev/docs/react-scroll-animations)
- [Resend — envio de e-mail](https://resend.com/docs/api-reference/emails/send-email)
- [Lucide React](https://lucide.dev/guide/react)
