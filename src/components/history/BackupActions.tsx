import { useRef, useState, type ChangeEvent } from 'react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { useToastStore } from '../../store/useToastStore';
import { createBackup, serializeBackup, buildBackupFileName, parseAndValidateBackup, type BackupData } from '../../utils/backup';
import { formatDateTimeBr } from '../../utils/date';
import { downloadBlob } from '../pdf/downloadBlob';
import { IconDownload, IconUpload } from '../ui/actionIcons';

/**
 * Exporta/importa um backup (JSON) com rascunho, histórico e contador
 * sequencial — os dados ficam apenas neste aparelho (localStorage), então
 * o backup é a forma de não perder o histórico ao trocar de aparelho ou
 * limpar o navegador.
 */
export function BackupActions() {
  const exportBackupData = useBudgetStore((state) => state.exportBackupData);
  const restoreFromBackup = useBudgetStore((state) => state.restoreFromBackup);
  const showToast = useToastStore((state) => state.show);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingImport, setPendingImport] = useState<BackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const backup = createBackup(exportBackupData());
    const blob = new Blob([serializeBackup(backup)], { type: 'application/json' });
    downloadBlob(blob, buildBackupFileName());
    showToast('Backup exportado.', 'success');
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const text = await file.text();
    const result = parseAndValidateBackup(text);
    if (!result.valid) {
      setImportError(result.error);
      setPendingImport(null);
      showToast('Backup inválido.', 'error');
      return;
    }
    setImportError(null);
    setPendingImport(result.data);
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    restoreFromBackup(pendingImport);
    setPendingImport(null);
    showToast('Backup importado com sucesso.', 'success');
  };

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3">
      <p className="text-xs text-neutral-500">
        Seus orçamentos ficam salvos apenas neste aparelho. Exporte um backup regularmente para não perder os dados.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-300 text-xs font-semibold text-ta-black"
        >
          <IconDownload className="h-4 w-4" />
          Exportar backup
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-300 text-xs font-semibold text-ta-black"
        >
          <IconUpload className="h-4 w-4" />
          Importar backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {importError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {importError}
        </p>
      )}

      {pendingImport && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs text-amber-900">
            Isso vai substituir todos os orçamentos salvos neste aparelho por {pendingImport.history.length}{' '}
            orçamento(s) do backup de {formatDateTimeBr(pendingImport.exportedAt)}. Deseja continuar?
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setPendingImport(null)}
              className="min-h-9 flex-1 rounded-md border border-neutral-300 bg-white text-xs font-semibold text-ta-black"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmImport}
              className="min-h-9 flex-1 rounded-md bg-ta-black text-xs font-semibold text-ta-gold-light"
            >
              Substituir dados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
