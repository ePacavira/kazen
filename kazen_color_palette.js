// tailwind.config.js - Kazen Color System
// Sistema de cores completo para o Kazen PWA

module.exports = {
  theme: {
    extend: {
      colors: {
        // ============================================
        // BRAND COLORS - Identidade Visual do Kazen
        // ============================================
        brand: {
          primary: {
            lightest: '#CCFBF1', // Teal 100 - Backgrounds sutis, tags
            light: '#5EEAD4',    // Teal 300 - Elementos secundários
            DEFAULT: '#14B8A6',  // Teal 500 - Cor principal (mais vibrante)
            dark: '#0F766E',     // Teal 600 - Hover states
            darker: '#134E4A',   // Teal 800 - Pressed states, alto contraste
            darkest: '#042F2E',  // Teal 950 - Texto em backgrounds claros
          },
          accent: {
            lightest: '#FED7AA', // Orange 200 - Backgrounds promocionais
            light: '#FDBA74',    // Orange 300 - Badges de desconto suaves
            DEFAULT: '#F97316',  // Orange 500 - CTAs, poupança
            dark: '#EA580C',     // Orange 600 - Hover de CTAs
            darker: '#C2410C',   // Orange 700 - Pressed states
          },
          secondary: {
            lightest: '#EDE9FE', // Violet 100
            light: '#C4B5FD',    // Violet 300
            DEFAULT: '#8B5CF6',  // Violet 500 - Features Premium
            dark: '#7C3AED',     // Violet 600
            darker: '#6D28D9',   // Violet 700
          }
        },

        // ============================================
        // SURFACE COLORS - Backgrounds e Camadas
        // ============================================
        surface: {
          ground: '#F8FAFC',   // Slate 50 - Background principal da app
          card: '#FFFFFF',     // White - Cards e containers
          elevated: '#FFFFFF', // White - Cards com shadow (elevados)
          overlay: {
            light: 'rgba(248, 250, 252, 0.95)', // Para modals claros
            dark: 'rgba(15, 23, 42, 0.75)',     // Para modals escuros
          },
          hover: '#F1F5F9',    // Slate 100 - Hover em cards/listas
          pressed: '#E2E8F0',  // Slate 200 - Pressed state
        },

        // ============================================
        // CONTENT COLORS - Textos
        // ============================================
        content: {
          primary: '#0F172A',   // Slate 900 - Texto principal
          secondary: '#475569', // Slate 600 - Texto secundário
          tertiary: '#94A3B8',  // Slate 400 - Texto desabilitado/placeholders
          inverse: '#FFFFFF',   // White - Texto em backgrounds escuros
          link: '#14B8A6',      // Primary - Links
          linkHover: '#0F766E', // Primary dark - Links hover
        },

        // ============================================
        // BORDER COLORS - Divisórias e Contornos
        // ============================================
        border: {
          light: '#F1F5F9',     // Slate 100 - Borders muito sutis
          DEFAULT: '#E2E8F0',   // Slate 200 - Borders padrão
          medium: '#CBD5E1',    // Slate 300 - Borders mais visíveis
          dark: '#94A3B8',      // Slate 400 - Borders de contraste
          focus: '#14B8A6',     // Primary - Focus states
          error: '#EF4444',     // Red 500 - Estados de erro
        },

        // ============================================
        // STATUS COLORS - Feedback do Sistema
        // ============================================
        status: {
          success: {
            lightest: '#D1FAE5', // Emerald 100
            light: '#A7F3D0',    // Emerald 200
            DEFAULT: '#10B981',  // Emerald 500
            dark: '#059669',     // Emerald 600
            darkest: '#047857',  // Emerald 700
          },
          error: {
            lightest: '#FEE2E2', // Red 100
            light: '#FECACA',    // Red 200
            DEFAULT: '#EF4444',  // Red 500
            dark: '#DC2626',     // Red 600
            darkest: '#B91C1C',  // Red 700
          },
          warning: {
            lightest: '#FEF3C7', // Amber 100
            light: '#FDE68A',    // Amber 200
            DEFAULT: '#F59E0B',  // Amber 500
            dark: '#D97706',     // Amber 600
            darkest: '#B45309',  // Amber 700
          },
          info: {
            lightest: '#DBEAFE', // Blue 100
            light: '#BFDBFE',    // Blue 200
            DEFAULT: '#3B82F6',  // Blue 500
            dark: '#2563EB',     // Blue 600
            darkest: '#1D4ED8',  // Blue 700
          },
        },

        // ============================================
        // FUNCTIONAL COLORS - Específicos do Kazen
        // ============================================
        functional: {
          // Comparação de Preços
          cheapest: {
            bg: '#FED7AA',       // Orange 200
            text: '#C2410C',     // Orange 700
            badge: '#F97316',    // Orange 500
          },
          expensive: {
            bg: '#FEE2E2',       // Red 100
            text: '#B91C1C',     // Red 700
          },
          average: {
            bg: '#E2E8F0',       // Slate 200
            text: '#475569',     // Slate 600
          },
          
          // Estados de Produto
          available: '#10B981',     // Emerald 500
          unavailable: '#94A3B8',   // Slate 400
          lowStock: '#F59E0B',      // Amber 500
          
          // Promoções e Destaques
          promotion: {
            bg: '#FED7AA',       // Orange 200
            text: '#C2410C',     // Orange 700
            badge: '#F97316',    // Orange 500
          },
          discount: {
            bg: '#CCFBF1',       // Teal 100
            text: '#134E4A',     // Teal 800
          },
          
          // Features Premium
          premium: {
            bg: '#EDE9FE',       // Violet 100
            text: '#6D28D9',     // Violet 700
            badge: '#8B5CF6',    // Violet 500
          },
          
          // Substituições
          substitution: {
            pending: '#FEF3C7',  // Amber 100
            approved: '#D1FAE5', // Emerald 100
            rejected: '#FEE2E2', // Red 100
          },

          // Categorias (opcional - para visualização)
          category: {
            fruits: '#DCFCE7',   // Green 100
            meat: '#FEE2E2',     // Red 100
            dairy: '#DBEAFE',    // Blue 100
            bakery: '#FEF3C7',   // Amber 100
            frozen: '#E0E7FF',   // Indigo 100
            beverages: '#FCE7F3',// Pink 100
          }
        },

        // ============================================
        // SHADOWS (para usar com Tailwind)
        // ============================================
        shadow: {
          card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }
      },

      // ============================================
      // CONFIGURAÇÕES ADICIONAIS
      // ============================================
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },

      // Gradientes para CTAs especiais
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-premium': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      }
    }
  }
}

// ============================================
// GUIA DE USO RÁPIDO
// ============================================

/*
EXEMPLOS DE APLICAÇÃO:

1. BOTÃO PRIMARY
   bg-brand-primary text-content-inverse hover:bg-brand-primary-dark

2. BOTÃO ACCENT (Poupança/CTA)
   bg-brand-accent text-content-inverse hover:bg-brand-accent-dark

3. CARD DE PRODUTO
   bg-surface-card border border-border shadow-card

4. PREÇO MAIS BARATO
   bg-functional-cheapest-bg text-functional-cheapest-text

5. PRODUTO INDISPONÍVEL
   text-functional-unavailable line-through

6. BADGE DE PROMOÇÃO
   bg-functional-promotion-bg text-functional-promotion-text px-2 py-1 rounded

7. TEXTO PRINCIPAL
   text-content-primary

8. TEXTO SECUNDÁRIO
   text-content-secondary

9. INPUT FOCUS
   focus:ring-2 focus:ring-brand-primary focus:border-brand-primary

10. STATUS DE SUCESSO
    bg-status-success-lightest text-status-success-dark border-status-success
*/