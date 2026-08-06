# TA Orçamentos

Sistema web para geração de orçamentos da TA Construções e Acabamento — substitui Word/Canva, uso principal em celular. Preenche dados, visualiza em folha A4 com layout fixo premium, edita, gera PDF idêntico ao layout e compartilha pelo WhatsApp.

## Status

**Etapa 1 (concluída):** configuração do projeto, tipos, constantes, estado (Zustand + persistência local) e formulário de preenchimento.

**Etapa 2 (pendente):** reconstrução em HTML/CSS da folha A4 (layout fixo, cabeçalho, cortes dourados, área de descrição, rodapé), geração de PDF e compartilhamento via WhatsApp.

## Logo oficial

O projeto está preparado para usar o arquivo oficial da logo em `public/logo-ta.png`. Esse arquivo **ainda não foi adicionado** — adicione-o manualmente nesse caminho (ou `public/logo-ta.svg`, se uma versão vetorial oficial for fornecida futuramente; nesse caso, atualize `logoPath` em `src/constants/company.ts`). A logo **não** é recriada em código — apenas exibida como fornecida.

## Rodando o projeto

```bash
npm install
npm run dev
```

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Hook Form + Zod, Zustand (com persistência em `localStorage`).
