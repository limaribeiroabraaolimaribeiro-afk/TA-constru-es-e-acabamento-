# TA Orçamentos

Sistema web para geração de orçamentos da TA Construções e Acabamento — substitui Word/Canva, uso principal em celular. Preenche dados, visualiza em folha A4 com layout fixo premium, edita, gera PDF idêntico ao layout e compartilha pelo WhatsApp.

## Status

**Etapa 1 (concluída):** configuração do projeto, tipos, constantes, estado (Zustand + persistência local em três chaves separadas) e formulário de preenchimento (sem lista de itens estruturada — descrição em texto livre).

**Etapa 2 (concluída):** folha A4 (`src/components/budget-sheet/`) recriada em HTML/CSS fiel ao papel timbrado oficial — tamanho físico fixo (210mm × 297mm), layout interno não responsivo. Logo oficial aplicada (`public/logo-ta.png`).

**Etapa 3 (concluída):** pré-visualização responsiva com zoom (pinça, roda do mouse, botões) e navegação por arraste, sem alterar o tamanho físico da folha nem seu layout interno.

**Etapa 4 (concluída):** geração de PDF (`src/components/pdf/`) — página única A4, fundo branco, alta resolução, aguarda fontes/logo antes de capturar e valida overflow antes de gerar.

**Etapa 5 (pendente):** compartilhamento via WhatsApp.

## Geração de PDF (`src/components/pdf/`)

- `generatePdf.ts` — `generateBudgetPdf(sheetElement, fileName)`: aguarda `document.fonts.ready` e o carregamento de todas as `<img>` (logo/marca-d'água) antes de capturar; verifica overflow (`checkSheetOverflow`) e lança `PdfOverflowError` em vez de gerar um PDF cortado; captura via `html2canvas` (`scale: 3`, `backgroundColor: '#ffffff'`) e insere a imagem em um `jsPDF` de formato `a4` preenchendo exatamente 210×297mm — página única, sem distorcer (a imagem capturada já nasce com a proporção exata da folha). `html2canvas`/`jspdf` são importados dinamicamente (`import()`), carregados só quando o usuário gera o PDF, para não pesar o carregamento inicial do app no celular.
- `checkSheetOverflow` compara a posição+altura reais do texto da descrição contra o espaço disponível na caixa (não usa o `scrollHeight` da caixa em si, porque a marca-d'água sangra intencionalmente para fora dela e infla essa medida sem representar overflow de conteúdo real) e também a altura total da folha (cobre o caso de uma observação muito longa empurrar o rodapé para fora da página).
- `PdfExportButton.tsx` — botão "Gerar PDF" que baixa o arquivo (`orcamento-XXXX.pdf`) ou exibe um aviso (`role="alert"`) se o conteúdo ultrapassar a folha.
- Em `App.tsx`, o PDF é sempre capturado a partir de uma instância **oculta e em tamanho real** de `BudgetSheetA4` (sem o `transform` de zoom/pan da pré-visualização), garantindo resultado idêntico ao layout aprovado independente do zoom que o usuário está vendo na tela.

## Folha A4 (`src/components/budget-sheet/`)

- `BudgetSheetA4.tsx` — componente raiz, tamanho fixo 210mm × 297mm (`.sheet` em `BudgetSheetA4.module.css`), monta cabeçalho, bloco de cliente condicional, barra de título, área de descrição, bloco de totais e rodapé.
- `A4ZoomableViewer.tsx` — envolve a folha para a pré-visualização: escala automaticamente à largura disponível (`ResizeObserver`) e adiciona zoom (pinça de dois dedos, roda do mouse/trackpad, botões +/−/Ajustar) e navegação por arraste quando ampliado. Usa listeners nativos (`{ passive: false }`) para `wheel`/`touchmove`, já que o React anexa esses eventos como passivos por padrão e não permite `preventDefault()` neles — sem isso, o gesto de pinça acionaria o zoom nativo da página em vez do zoom do visualizador. O tamanho real da folha (210mm × 297mm) e seu layout interno nunca são alterados, apenas a escala/posição de exibição do wrapper.
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

`public/logo-ta.png` é o arquivo oficial fornecido pela empresa (cópia exata, sem edição/recorte/vetorização). A imagem já traz o ícone, o nome "CONSTRUÇÕES E ACABAMENTO" e o WhatsApp/telefone "assados" na própria arte — por isso `SheetHeader.tsx` não duplica esse texto em HTML, apenas exibe a logo (`object-fit: contain`, sem distorcer nem cortar). Se uma versão vetorial oficial (`public/logo-ta.svg`) for fornecida futuramente, atualize `logoPath` em `src/constants/company.ts` para apontar para ela.

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
