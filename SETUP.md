# 🚀 Guia de Setup Rápido - Kazen

## Instalação

```bash
npm install
```

## Executar

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura de Pastas para Imagens

### Produtos
Coloque as imagens dos produtos em:
```
public/images/products/
```

Nomes esperados:
- `picanha.jpg`
- `frango.jpg`
- `costela.jpg`
- `linguica.jpg`
- `carne-moida.jpg`
- `hamburger.jpg`
- `espetinho.jpg`
- `salsicha.jpg`
- `bacon.jpg`
- `alcatra.jpg`

### Lojas
Coloque os logos das lojas em:
```
public/images/stores/
```

Nomes esperados:
- `kero.png`
- `shoprite.png`
- `continente.png`

### Ícones PWA
Gere os ícones PWA usando:
- https://www.pwabuilder.com/imageGenerator
- Ou https://realfavicongenerator.net/

Coloque os ícones em:
```
public/icons/
```

Tamanhos necessários: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## 🎨 Personalização

### Cores
As cores estão definidas em `tailwind.config.ts` seguindo a paleta do `kazen_color_palette.js`

### Dados Mockados
Os dados mockados estão em `lib/supabase.ts`:
- `mockProducts` - Lista de produtos
- `mockStores` - Lista de lojas
- `mockPrices` - Preços por produto e loja

## 🔧 Variáveis de Ambiente (Opcional)

Para usar Supabase real, crie um arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

## ✅ Checklist para Demo

- [ ] Instalar dependências (`npm install`)
- [ ] Adicionar imagens de produtos em `/public/images/products/`
- [ ] Adicionar logos de lojas em `/public/images/stores/`
- [ ] Gerar e adicionar ícones PWA em `/public/icons/`
- [ ] Testar fluxo completo:
  - [ ] Onboarding
  - [ ] Adicionar produtos
  - [ ] Comparar preços
  - [ ] Finalizar checkout
  - [ ] Ver QR Code
- [ ] Testar modo escuro
- [ ] Testar em dispositivo móvel
- [ ] Verificar instalação PWA

## 🐛 Troubleshooting

### Erro de imagens não encontradas
- Verifique se as imagens estão na pasta correta
- Verifique os nomes dos arquivos (case-sensitive)
- Use imagens placeholder se necessário

### PWA não instala
- Verifique se o `manifest.json` está correto
- Verifique se os ícones existem
- Teste em HTTPS (necessário para PWA)

### Modo escuro não funciona
- Verifique se o `ThemeProvider` está no layout
- Verifique se o `darkMode: 'class'` está no `tailwind.config.ts`

## 📱 Testar PWA

1. Execute `npm run build && npm start`
2. Acesse via HTTPS (use ngrok ou similar)
3. No mobile, abra o menu do navegador
4. Selecione "Adicionar à tela inicial"

---

**Boa sorte na demo! 🎉**

