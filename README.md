# TA Orçamentos

Sistema web para geração de orçamentos da TA Construções e Acabamento — substitui Word/Canva, uso principal em celular. Preenche dados, visualiza em folha A4 com layout fixo premium, edita, gera PDF idêntico ao layout e compartilha pelo WhatsApp.

## Status

**Etapa 1 (concluída):** configuração do projeto, tipos, constantes, estado (Zustand + persistência local em três chaves separadas) e formulário de preenchimento (sem lista de itens estruturada — descrição em texto livre).

**Etapa 2 (pendente):** reconstrução em HTML/CSS da folha A4 (layout fixo, cabeçalho, cortes dourados, área de descrição, rodapé), geração de PDF e compartilhamento via WhatsApp.

## Modelo de dados (`BudgetData`)

```ts
interface BudgetData {
  id: string;
  budgetNumber: number;      // sequencial, nunca reaproveitado após exclusão
  clientName: string;
  clientPhone: string;
  workAddress: string;
  showClientData: boolean;   // exibir ou não o bloco do cliente na folha (Etapa 2)
  description: string;       // texto livre, múltiplas linhas/parágrafos
  totalValue: number;
  date: string;               // ISO (yyyy-mm-dd)
  validity: number;           // validade em dias
  observation: string;
  createdAt: string;
  updatedAt: string;
}
```

## Persistência (localStorage)

Três chaves separadas (`src/store/budgetStorage.ts`), em vez de um único blob de estado:

- `ta-budget-draft` — rascunho em edição no momento.
- `ta-budget-history` — orçamentos salvos.
- `ta-budget-next-number` — contador sequencial; só cresce, nunca é decrementado (nem ao excluir um orçamento), garantindo que um número usado não seja reaproveitado.

## Estado (Zustand — `src/store/useBudgetStore.ts`)

`createNewBudget`, `updateDraft`, `clearDraft`, `saveBudget`, `loadBudget`, `duplicateBudget`, `deleteBudget`, `getNextBudgetNumber`.

## Logo oficial

O projeto está preparado para usar o arquivo oficial da logo em `public/logo-ta.png`. Esse arquivo **ainda não foi adicionado** — adicione-o manualmente nesse caminho (ou `public/logo-ta.svg`, se uma versão vetorial oficial for fornecida futuramente; nesse caso, atualize `logoPath` em `src/constants/company.ts`). A logo **não** é recriada em código — apenas exibida como fornecida.

## Rodando o projeto

```bash
npm install
npm run dev
```

## Testes

```bash
npm run test
```

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Hook Form + Zod, Zustand, Vitest + jsdom.
