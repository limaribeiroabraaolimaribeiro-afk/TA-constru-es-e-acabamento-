# TA Orçamentos

Sistema web para geração de orçamentos da TA Construções e Acabamento — substitui Word/Canva, uso principal em celular. Preenche dados, visualiza em folha A4 com layout fixo premium, edita, gera PDF idêntico ao layout e compartilha pelo WhatsApp.

## Status

**Etapa 1 (concluída):** configuração do projeto, tipos, constantes, estado (Zustand + persistência local em três chaves separadas) e formulário de preenchimento (sem lista de itens estruturada — descrição em texto livre).

**Etapa 2 (concluída):** folha A4 (`src/components/budget-sheet/`) recriada em HTML/CSS fiel ao papel timbrado oficial — tamanho físico fixo (210mm × 297mm), layout interno não responsivo, escalada como um todo no celular. Tela temporária de "Editar/Visualizar" para conferência do layout.

**Etapa 3 (pendente):** geração do PDF e compartilhamento via WhatsApp.

## Folha A4 (`src/components/budget-sheet/`)

- `BudgetSheetA4.tsx` — componente raiz, tamanho fixo 210mm × 297mm (`.sheet` em `BudgetSheetA4.module.css`), monta cabeçalho, bloco de cliente condicional, barra de título, área de descrição, bloco de totais e rodapé.
- `A4ScaledPreview.tsx` — envolve a folha e aplica `transform: scale()` proporcional à largura disponível (via `ResizeObserver`), sem alterar o layout interno — é assim que a visualização no celular funciona (item 8 da Etapa 2).
- `SheetHeader.tsx`, `SheetClientBlock.tsx`, `SheetTitleBar.tsx`, `SheetDescriptionArea.tsx`, `SheetTotalsBlock.tsx`, `SheetFooter.tsx` — seções da folha.
- `icons.tsx` — pictogramas genéricos em SVG (pessoa, telefone, pin, envelope, calendário, documento, cifrão, WhatsApp) — não são a logo da empresa.
- Cortes diagonais dourados, cunhas de canto e padrão de pontos são gerados via `clip-path`/`radial-gradient` em CSS puro (sem imagens).
- As linhas pontilhadas da área de descrição usam `repeating-linear-gradient` (linhas horizontais) combinado com `mask-image` (padrão tracejado), preenchendo qualquer altura sem precisar calcular a quantidade de linhas.
- A marca-d'água reaproveita o mesmo `<Logo variant="watermark">` usado no cabeçalho (arquivo oficial, opacidade baixa, escala maior, posicionamento absoluto) — não é um desenho separado.
- "ORÇAMENTO Nº 0001" (`formatBudgetNumber`) aparece discretamente no canto superior direito da folha.

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
