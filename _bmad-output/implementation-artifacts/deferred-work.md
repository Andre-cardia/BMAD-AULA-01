- source_spec: `_bmad-output/implementation-artifacts/spec-nivel-2-treinamento-cao-gato.md`
  summary: Versionar em `ferramentas/` um teste de navegador (Chrome headless via CDP, guiado por `window.N2UI.estado()`) para as regras de estado do Nível 2, e rodá-lo também em Edge, Firefox e Safari.
  evidence: A calibração só executa o `n2-core`; a pausa na troca de aba, a tabela de Hiperparâmetros e o ritmo real só foram verificados numa sessão manual no Chrome, e apagar `N2UI.pausar()` de `ativar` não quebraria nenhuma verificação versionada.
