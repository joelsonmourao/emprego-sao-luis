# Identidade visual — Empregos São Luís

Documento de auditoria e regras de uso da marca oficial do portal, derivado da pasta `Logo/` e do perfil complementar [@empregosaoluis](https://www.instagram.com/empregosaoluis/).

## Arquivos encontrados na pasta Logo

| Arquivo | Formato | Dimensão aprox. | Uso |
|---------|---------|-----------------|-----|
| `logo-horizontal.png` | PNG | Horizontal | Logo principal para fundo escuro |
| `logo-horizontal.webp` | WebP | Horizontal | Logo principal (versão otimizada) |
| `icon.webp` | WebP | Quadrado / ícone | Símbolo, favicon e avatar |

Não foram encontrados na pasta: versão exclusiva para fundo claro, PDF, ICO nativo, modelos editoriais ou artes do feed. As versões publicadas no site usam os arquivos acima com fundos compatíveis.

## Arquivos escolhidos por finalidade

| Finalidade | Arquivo | Caminho público |
|------------|---------|-----------------|
| Logo horizontal (cabeçalho claro) | `logo-horizontal.webp` | `/brand/logo-horizontal.webp` |
| Logo horizontal (fallback PNG) | `logo-horizontal.png` | `/brand/logo-horizontal.png` |
| Símbolo / ícone da marca | `icon.webp` | `/brand/icon.webp` |
| Favicon e PWA | derivados de `icon.webp` | `/favicon.ico`, `/favicon-32x32.png`, `/icon-192.png`, etc. |
| Open Graph padrão | `logo-horizontal.png` | configurável no painel |
| E-mail e admin | `logo-horizontal.webp` | via configuração de identidade visual |

## Paleta principal (hexadecimal)

Extraída do mascote, monograma ES e tipografia “EMPREGO SÃO LUÍS”:

| Token | Hex | Origem |
|-------|-----|--------|
| `brand-primary` | `#9B2D30` | Texto “EMPREGO SÃO LUÍS”, camisa do mascote |
| `brand-primary-hover` | `#B33A3D` | Hover de botões primários |
| `brand-secondary` | `#1A1A1A` | Monograma ES, fundos escuros |
| `brand-accent` | `#E41E26` | Quadrados vermelhos, linha no E |
| `brand-accent-warm` | `#F58220` | Capacete laranja do mascote |

## Paleta secundária

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-background` | `#F5F5F5` | Fundo geral do portal |
| `brand-surface` | `#FFFFFF` | Cards, cabeçalho, formulários |
| `brand-border` | `#E0E0E0` | Bordas e divisores |
| `text-primary` | `#1A1A1A` | Títulos e corpo |
| `text-secondary` | `#5C5C5C` | Texto auxiliar |
| `success` | `#15803D` | Confirmações |
| `warning` | `#CA8A04` | Alertas |
| `danger` | `#DC2626` | Erros, denúncias |
| `info` | `#2563EB` | Informações |

## Cores de fundo

- **Páginas públicas:** `#F5F5F5` (neutro claro)
- **Cabeçalho:** `#FFFFFF` com logo horizontal
- **Rodapé e hero escuro:** `#1A1A1A` (preto da marca, não verde)
- **Painel admin — sidebar:** `#1A1A1A` com logo horizontal

## Regras de contraste

- Texto branco sobre `brand-primary` ou `brand-secondary`: uso em botões e rodapé.
- Texto `text-primary` sobre `brand-surface` e `brand-background`: contraste AA mínimo.
- `brand-accent` reservado para destaques pontuais; não usar como fundo de blocos grandes.
- Evitar combinar `brand-accent-warm` com `brand-accent` em grandes áreas adjacentes.

## Uso correto da logo

- Manter proporção original; altura máxima ~40px no cabeçalho, ~48px no rodapé escuro.
- Usar `logo-horizontal.webp` em fundos claros com `<picture>` e fallback PNG.
- Em fundos escuros (rodapé, hero, admin), usar a mesma logo horizontal — ela foi desenhada para fundo escuro.
- Atributo `alt`: “Empregos São Luís — vagas em São Luís e Maranhão”.
- Permitir substituição via painel **Configurações → Identidade visual**.

## Uso incorreto da logo

- Não esticar, cortar ou aplicar sombras pesadas.
- Não recriar a marca apenas com texto “ES” ou tipografia genérica.
- Não usar ícone de template, Astro ou letra isolada no lugar do mascote/ES.
- Não aplicar fundo incompatível (ex.: logo escura sobre fundo escuro sem contraste).
- Não alterar cores do mascote ou monograma.

## Favicon e ícones derivados

| Arquivo | Tamanho | Função |
|---------|---------|--------|
| `/favicon.ico` | 32×32 | Aba do navegador (legado) |
| `/favicon.svg` | vetorial | Navegadores modernos |
| `/favicon-16x16.png` | 16×16 | Favoritos |
| `/favicon-32x32.png` | 32×32 | Alta densidade |
| `/apple-touch-icon.png` | 180×180 | iOS / atalho |
| `/icon-192.png` | 192×192 | PWA / Android |
| `/icon-512.png` | 512×512 | PWA splash |
| `/site.webmanifest` | — | Manifest PWA |

`theme-color`: `#9B2D30` (brand-primary).

## Referência visual do Instagram

Perfil oficial: https://www.instagram.com/empregosaoluis/

O feed e stories reforçam:

- Mascote com capacete laranja e clipboard
- Monograma ES com detalhes vermelhos
- Tipografia bold em tom tijolo/vermelho escuro
- Linguagem direta, foco em vagas de São Luís e Maranhão
- Complementaridade entre Instagram (divulgação rápida) e portal (busca, filtros, alertas)

O portal deve ser reconhecível imediatamente por quem segue o Instagram, sem parecer template genérico de empregos ou SaaS.

## Cores abandonadas do redesign anterior

As cores **vinho** (`#7A1F2B`), **creme** (`#FAF7F2`) e **verde escuro** (`#1A3C34`) **não fazem parte** da identidade auditada na pasta Logo e foram substituídas pelos tokens acima.
