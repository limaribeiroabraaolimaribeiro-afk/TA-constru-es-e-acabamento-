import { registerSW } from 'virtual:pwa-register';

/**
 * Registra o service worker (importado explicitamente — sem isso, o plugin
 * injeta um <script> estático que só registra e nunca recarrega a página).
 * Com registerType: 'autoUpdate' (vite.config.ts), assim que uma nova
 * versão termina de ativar (skipWaiting/clientsClaim já cuidam de tomar o
 * controle), a página recarrega sozinha — sem prompt, sem clique do
 * usuário. Sem UI: substitui o antigo aviso "Nova versão disponível".
 */
registerSW({ immediate: true });
