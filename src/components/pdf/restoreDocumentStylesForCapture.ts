/**
 * O html2canvas cria um iframe e tenta reler os <link rel="stylesheet">.
 * Em PWAs (especialmente offline no Android), a requisição do CSS pode
 * falhar apesar de a página original continuar renderizada corretamente.
 * Isso leva à captura de HTML sem CSS (logo em tamanho nativo, texto solto).
 *
 * As regras abaixo vêm do CSSOM já carregado na página original. Não fazemos
 * novas requisições e não alteramos o layout visto pelo usuário.
 */
function snapshot(documentToCapture: Document): string {
  const fragments: string[] = [];

  for (const sheet of Array.from(documentToCapture.styleSheets)) {
    try {
      const base = sheet.href;
      const rules = Array.from(sheet.cssRules).map((rule) => {
        if (!base) return rule.cssText;
        // As URLs originalmente relativas ao arquivo CSS precisam continuar
        // apontando para o mesmo recurso quando injetadas em uma <style>.
        return rule.cssText.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (match, _quote: string, value: string) => {
          const url = value.trim();
          if (/^(?:data:|blob:|https?:|\/\/|#)/i.test(url)) return match;
          try {
            return `url("${new URL(url, base).href}")`;
          } catch {
            return match;
          }
        });
      });

      if (rules.length > 0) fragments.push(rules.join('\n'));
    } catch {
      // Estilos cross-origin podem bloquear cssRules. Os arquivos do app
      // são do mesmo domínio e continuam acessíveis pelo CSSOM.
    }
  }

  return fragments.join('\n');
}

function inject(clonedDocument: Document, css: string): void {
  if (!css.trim()) return;
  const style = clonedDocument.createElement('style');
  style.setAttribute('data-pdf-restored-styles', 'true');
  style.textContent = css;
  clonedDocument.head.appendChild(style);
}

export const restoreDocumentStylesForCapture = { snapshot, inject };
