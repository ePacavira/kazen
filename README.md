# 🚀 Kazen - MVP para Startup Challenge

Plataforma PWA para comparação de preços entre supermercados em Angola.

## 🎯 Características

- ✅ **PWA Completo** - Instalável no telemóvel
- ✅ **Comparação de Preços** - Compare preços entre múltiplas lojas
- ✅ **Modo Escuro** - Suporte completo a tema claro/escuro
- ✅ **Onboarding Animado** - Experiência de primeira utilização
- ✅ **Interface Moderna** - Design com Tailwind CSS e Shadcn/UI
- ✅ **Animações Suaves** - Framer Motion para transições
- ✅ **Loading Skeletons** - Feedback visual durante carregamento

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Componentes**: Shadcn/UI (estilo)
- **Animações**: Framer Motion
- **Backend**: Supabase (configurado, usando dados mockados para demo)
- **PWA**: Manifest.json configurado

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🎨 Paleta de Cores

A paleta de cores está definida em `tailwind.config.ts` seguindo o sistema do `kazen_color_palette.js`.

## 📱 Funcionalidades

### Páginas Principais

1. **Home** (`/`) - Lista de produtos para adicionar à lista de compras
2. **Comparação** (`/compare`) - Comparação de preços entre lojas
3. **Checkout** (`/checkout`) - Finalização de reserva com pagamento mockado
4. **Lista** (`/list`) - Visualizar e editar lista de compras
5. **Perfil** (`/profile`) - Perfil do utilizador

### Funcionalidades Mockadas

- **Login**: Login fake com nome pré-configurado
- **Pagamento**: Simulação de pagamento (2s de loading → sucesso)
- **Dados**: Todos os dados são mockados para garantir demo perfeita

## 🎭 Demo Strategy

Os dados são cuidadosamente mockados para garantir que:
- A Loja A (Kero Talatona) sempre tem os melhores preços
- A poupança é sempre visível e significativa
- Todos os produtos estão em stock
- A experiência é fluida e sem erros

## 📂 Estrutura do Projeto

```
kazen/
├── app/              # Next.js App Router
│   ├── compare/      # Página de comparação
│   ├── checkout/     # Página de checkout
│   ├── list/         # Página de lista
│   ├── profile/      # Página de perfil
│   └── page.tsx      # Home page
├── components/       # Componentes React
│   ├── onboarding.tsx
│   ├── header.tsx
│   ├── product-card.tsx
│   └── ...
├── lib/              # Utilitários e tipos
│   ├── types.ts
│   ├── utils.ts
│   └── supabase.ts   # Configuração Supabase + dados mockados
├── public/           # Assets estáticos
│   ├── images/       # Imagens de produtos e lojas
│   └── manifest.json # PWA manifest
└── tailwind.config.ts
```

## 🚀 Próximos Passos (Para Produção)

1. Configurar Supabase real com variáveis de ambiente
2. Implementar autenticação real
3. Integrar API de pagamento real
4. Adicionar scraping real de preços
5. Implementar sistema de notificações push
6. Adicionar mapa real com Leaflet

## 📝 Notas

- As imagens de produtos devem ser colocadas em `/public/images/products/`
- Os logos das lojas devem ser colocados em `/public/images/stores/`
- Os ícones PWA devem ser gerados e colocados em `/public/icons/`

## 🎯 Para a Demo

1. Execute `npm run dev`
2. Abra no navegador
3. Complete o onboarding
4. Adicione produtos à lista
5. Compare preços
6. Finalize uma reserva
7. Mostre o QR Code

---

**Desenvolvido para Startup Challenge** 🏆

