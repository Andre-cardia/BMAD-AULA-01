---
title: 'Nível 2 — Treinamento de Rede Neural (cão vs gato)'
type: 'feature'
created: '2026-10-14'
status: 'done'
baseline_commit: 'cde7ea82117e38bca86ab2d308027e5de442c192'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-BMAD-AULA-01-2026-10-13/prd.md'
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-BMAD-AULA-01-2026-10-13/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O simulador entregue só tem o Nível 1 (Pesos ajustados à mão). A liderança não vê uma IA *aprendendo* sozinha, e por isso não consegue desconfiar de promessas como "é só treinar mais" ou "acurácia de treino é desempenho real".

**Approach:** Acrescentar ao mesmo `simulador-neuronio.html` uma aba "Nível 2: o treinamento" em que uma Rede Neural 400 → H → 1 (sigmoide) aprende, com treino visível e reproduzível por Semente, a classificar Desenhos 20×20 de cães e gatos gerados pelo próprio arquivo. Requisitos completos em FR-9 a FR-18 do PRD; valores técnicos e plano de calibração no addendum §2–§5.

## Boundaries & Constraints

**Always:**
- Um único arquivo HTML, offline, sem bibliotecas nem assets externos; JS puro, compatível com as duas últimas versões de Chrome, Edge, Firefox e Safari.
- Nível 1 se comporta exatamente como hoje (FR-1 a FR-8); só pode ser compactado no layout para que diagrama + faixa da conta caibam em 1280×630.
- Todo sorteio vem de PRNG com semente (mulberry32), em quatro fluxos independentes: dados, inicialização, embaralhamento, Desenhos Novos. Nenhum `Math.random()` que afete resultado.
- Quantidades fixas: 240 Exemplos (120/120, 10% Ambíguos por classe), divisão 180 treino / 60 teste balanceada e fixa.
- Vocabulário do Glossário do PRD §3; números em pt-BR via `fmt`; nenhum texto do Nível 2 abaixo de 14 px; textos de apoio sem hover.
- Ids de SVG/filtros prefixados por Nível (`n1-`, `n2-`); o loop de animação e os atalhos de teclado de cada Nível só rodam com a aba ativa.
- Calibração antes da interface: as metas C1–C7 do addendum §4 passam com a Semente padrão, na ordem de prioridade C1 > C4 > C3 > C5/C6.

**Never:**
- Fotos, upload, webcam, desenho livre pelo Aluno, várias Camadas Ocultas, ReLU/tanh, persistência.
- Os termos "backpropagation", "gradiente" ou "função de custo" na interface.
- Mudar a quantidade de Exemplos ou a divisão treino/teste. Se C1 e C4 não se sustentarem juntos após esgotar as alavancas do addendum §4, HALT e voltar ao solicitante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Treino padrão | Épocas 30, LR 0,5, Batch 20, H 4, Semente padrão | Erro treino < 0,693 até Época 5; teste 52–59/60; ≥ 48/60 corretos com Confiança > 80%; sem aviso de Overfitting; dura 8–15 s | N/A |
| Antes de treinar | Rede recém-inicializada | Probabilidade de todo Desenho entre 40% e 60% | N/A |
| LR máximo | LR 10 | Erro treino final ≥ 2× o padrão; sem aviso de Overfitting | Probabilidade presa em [1e-7, 1−1e-7]; nunca NaN/Infinito na tela |
| Épocas máximas | Épocas 200 | Erro teste final ≥ 1,2× seu mínimo; Erro treino final < o da Época do mínimo de teste; aviso aparece; total ≤ 25 s | N/A |
| Batch máximo | Batch 180 | Erro treino final ≥ 2× o padrão | N/A |
| Camada Oculta | H 1 / H 8 | Teste > 70% com 1; com 8, no máximo +3 acertos sobre o padrão | N/A |
| Reiniciar | Mesmos Hiperparâmetros | Curvas e Classificações idênticas à execução anterior | N/A |
| Troca de Nível rodando | Treino ativo → aba Nível 1 | Treino pausa; ao voltar, segue pausado; estados dos dois Níveis preservados | N/A |
| Hiperparâmetro no Concluído | Muda LR, Batch ou H após concluir | Aceita, mostra aviso de uma frase e volta ao estado sem Treinamento | Bloqueado enquanto Rodando/Pausado (tabela PRD §4.10) |

</frozen-after-approval>

## Code Map

- `simulador-neuronio.html` -- único entregável. CSS `:root` (linhas 8–22) traz a paleta a reutilizar (`--on`, `--accent`, `--neg`, `--warn`). Body: `.topbar` com `#scenarios` e `#reset`, `.stage > svg#net`, `.mathbar`, `#controls`, `.legend`. Script único (229–950): `fmt` (280), `el` (297), `aresta` (323), `construirDiagrama` (337, filtros `glowOn`/`glowAccent` — renomear para `n1-glowOn`/`n1-glowAccent` e atualizar os `url(#…)` em `pintarDiagrama`), `montarControles`, `montarAbas`/`marcarAbaAtiva` (botões de Cenário — as abas de Nível precisam de outro estilo), `recalcular`, `animar` (878, `requestAnimationFrame` contínuo — passar a parar quando o Nível 2 está ativo), arranque (924–949). Teclas Enter/Espaço ficam no `keydown` de cada Entrada (432), portanto já são locais ao Nível 1.
- `<title>` (linha 6) -- trocar para "Simulador de Neurônio Artificial" (FR-9).
- `_bmad-output/implementation-artifacts/spec-simulador-neuronio-artificial.md` -- spec do Nível 1 (done); Review Triage Log lista as decisões de acessibilidade e pt-BR que não podem regredir.

## Tasks & Acceptance

**Execution:**
- [x] `simulador-neuronio.html` -- adicionar `<script id="n2-core">` com o núcleo puro, sem DOM: mulberry32 e derivação dos quatro fluxos; gerador de Desenhos (addendum §2); montagem dos Exemplos e da divisão; rede 400→H→1 com inicialização do addendum §3, mini-lotes com média, entropia cruzada com clamp; métricas por Época (inclusive Época 0); detector de Overfitting (FR-18); mapas `(W − W0)·sinal(w_saída)`. Expor como `window.N2Core` -- uma só fonte de lógica para a página e para a calibração.
- [x] `ferramentas/calibracao-nivel2.mjs` -- script Node que extrai o bloco `n2-core` do HTML, executa C1–C7 e o diagnóstico com 10 sementes, e imprime PASSOU/FALHOU por meta; código de saída ≠ 0 se alguma meta falhar -- garante que o que foi calibrado é o que roda na página.
- [x] calibrar -- ajustar geração, ruído e Hiperparâmetros padrão pelas alavancas do addendum §4 até C1–C7 passarem; registrar os valores finais em Implementation Notes.
- [x] `simulador-neuronio.html` -- abas de Nível no topo (estilo distinto dos Cenários), contêineres `#nivel1`/`#nivel2`, prefixo `n1-` nos ids SVG, pausa do loop do Nível 1 fora da aba, compactação do Nível 1 para caber em 1280×630, novo título.
- [x] `simulador-neuronio.html` -- interface do Nível 2 nas três faixas do PRD §4: barra de player (Treinar, Pausar, +1 Época, Reiniciar, Sortear outra rede, Voltar à Semente padrão, contador); grade de Exemplos com treino/teste separados e marcas de Correta/Errada; diagrama da rede em SVG com mapas 20×20 em escala fixa e conexões de saída coloridas e espessas; curvas SVG de Erro (teto 1,5, linha "chute") e Acurácia, treino cheio / teste tracejado, com números pt-BR; Hiperparâmetros com a tabela de estados e o aviso "muda e reinicia"; Classificação com Desenho grande, "Gato — 87%", barra de Confiança, classe verdadeira e "Gerar Desenho Novo"; textos de apoio de FR-18, aviso de Overfitting e frase de ligação com o Nível 1.
- [x] `simulador-neuronio.html` -- ritmo do player: ~3 atualizações/s, várias Épocas por atualização quando `Épocas/3 > 25 s`; Pausar termina a Época atual.

**Acceptance Criteria:**
- Given o arquivo recém-aberto, when a página carrega, then o Nível 1 está ativo e se comporta como antes (FR-1 a FR-8), com diagrama e faixa da conta inteiros em 1280×630.
- Given o Nível 2 em 1280×630, when o Treinamento roda, then a faixa do meio (Exemplos, A Rede, O aprendizado) e a barra de player ficam inteiras na área visível.
- Given qualquer configuração permitida, when o Treinamento termina, then nenhum valor exibido é NaN ou Infinito e o console não tem erros.
- Given a interface do Nível 2, when inspecionada, then cada conceito listado em FR-18 tem texto visível e os termos proibidos não aparecem.

## Implementation Notes

**Calibração (`node ferramentas/calibracao-nivel2.mjs`, Semente padrão 2026) — todas as metas PASSOU, código de saída 0, ~5 s.** Os valores de partida do addendum bastaram; nenhuma alavanca do §4 precisou ser puxada.

- Valores finais (em `N2Core.CFG`): Semente 2026; Épocas 30, LR 0,5, Batch 20, H 4; deslocamento ±2 px, escala 0,85–1,15 (raio 5), traço 0,9–1,4 px, ruído gaussiano σ 0,10; Exemplos normais com orelha/focinho a até 0,15/0,25 do extremo da classe, Ambíguos a 0,5 ± 0,06 (orelha) / ± 0,12 (focinho), inclinados para a classe que os gerou; init ±0,01 (pixels→oculta), ±0,3–0,5 com sinal sorteado (oculta→saída), Bias de saída compensando a média; escala do mapa ±0,5.
- C1: Erro de treino 0,385 na Época 5 (abaixo de 0,693 dali em diante); teste 58/60; 55/60 corretos com Confiança > 80%; sem aviso. Duração 30 Épocas ≈ 10 s.
- C2: Probabilidade inicial entre 49,3% e 50,6% (H 1–8, 240 Exemplos + 50 Desenhos Novos).
- C3: LR 10 → Erro de treino final 1,419 (padrão 0,026); 30/60; sem aviso; tudo finito.
- C4: 200 Épocas → mínimo do Erro de teste 0,143 na Época 34, final 0,180 (×1,26); treino 0,002 < 0,021; aviso a partir da Época 87; ≈ 22,3 s (3 Épocas por atualização).
- C5: Batch 180 → Erro de treino final 0,500. Diagnóstico: Batch 1 **dispara** o aviso de Overfitting em 30 Épocas (não reprova; o PRD não promete nada para Batch 1).
- C6: H 1 → 58/60; H 8 → 58/60 (padrão 58/60).
- C7: 4/4 mapas com orelha ≥ 4,8× e focinho ≥ 8,5× a mudança média do fundo.
- Diagnóstico com 10 outras sementes de rede: C1 em 10/10; C4 em 9/10 (a semente 9945 chega a ×1,14 em vez de ×1,2).

**Decisões de implementação.**
- Arquivo tem três scripts: o original (Nível 1), `n2-core` (núcleo puro, `window.N2Core`) e `n2-ui`. A calibração avalia o `n2-core` extraído do próprio HTML num `vm` com `window = {}`.
- Fluxos derivados da Semente por `derivarSemente(semente, k)`: dados k=1, inicialização k=2, embaralhamento k=3, Desenhos Novos k=4. "Sortear outra rede" usa um quinto fluxo (k=5) só para escolher a nova semente da rede — inicialização e embaralhamento passam a derivar dela; os Exemplos nunca mudam.
- Regiões de C7: orelha e focinho = máscaras das primitivas na posição nominal, unindo as formas de gato, Ambíguo e cão; fundo = pixels que nenhum Desenho limpo toca (média < 1%).
- `fmt(n, casas)` ganhou um segundo argumento opcional; sem ele o comportamento do Nível 1 é idêntico (1 casa).
- Nível 1: ids `n1-net`, `n1-net-desc`, filtros `n1-glowOn`/`n1-glowAccent`; SVG com altura fixa de 390 px (viewBox recortado de 8 px no topo) e margens menores — faixa da conta termina em ~605 px em 1280×630. O loop `requestAnimationFrame` encerra quando o Nível 2 está ativo e é retomado ao voltar.
- Atalhos do Nível 2 (Espaço = Treinar/Pausar, → = +1 Época) só agem com a aba Nível 2 ativa e com o foco fora de botões e sliders.
- Pausar: cada atualização calcula as Épocas de forma síncrona, então a Época em curso sempre termina antes de o player parar.

**Verificação no Chrome headless (1280×630, via CDP):** sem erros nem exceções no console; Nível 1 FR-1/FR-2/FR-5 checados (fórmula, "4 ≥ 1 → ATIVADO"); Espaço no Nível 1 não mexe no Nível 2; trocar de aba durante o Treinamento pausa, e ao voltar segue pausado, com os estados dos dois Níveis preservados; LR bloqueado no Pausado; Reiniciar reproduz histórico e marcas idênticos; aumentar Épocas no Concluído permite continuar; mudar LR no Concluído mostra o aviso e volta ao estado sem Treinamento; LR 10 sem NaN/Infinito e sem aviso; 200 Épocas ≈ 23 s de relógio, com aviso de Overfitting; H 8 redesenha 8 mapas; nenhum texto do Nível 2 abaixo de 14 px; termos proibidos e `Math.random` ausentes; player + faixa do meio terminam em 626 px.

**Riscos e pendências.** Testado só no Chrome (não houve Edge, Firefox ou Safari nesta máquina/sessão). Em 1280×630 a coluna Exemplos rola internamente (o PRD permite) e a faixa de baixo (Hiperparâmetros/Classificação) fica abaixo da dobra (o PRD também permite). Com Batch 1, o aviso de Overfitting aparece em 30 Épocas.

## Spec Change Log

## Review Triage Log

Três camadas (Blind Hunter 14, Edge Case Hunter 8, Verification Gap 2). Correções aplicadas pelo orquestrador; calibração 11/11 e teste CDP no Chrome reexecutados sem erros.

- **patch** (medium) — Ritmo: `tique` agendava o próximo quadro 333 ms *depois* do cálculo e da pintura, e a calibração supunha 3/s fixo (Blind 1, Edge 8, VGap 1). Corrigido com agenda fixa (`proximo += INTERVALO_MS`) e `CFG.intervaloMs` compartilhado pela página e pelo script. 200 Épocas medidas no Chrome: 22,4 s (antes 23,1 s).
- **patch** (medium) — Aviso de Overfitting preso em `disparou`: continuava dizendo "está X% acima" depois que a condição sumia (Blind 3, Edge 1). Agora usa `ativo` no presente e um texto no passado depois.
- **patch** (medium) — Leitor de tela: `#n2-cl-resposta` e `#n2-aviso-of` eram reescritos ~3×/s durante o Treinamento (Blind 4, Edge 7). `aria-live` fica `off` enquanto o Treinamento roda.
- **patch** (medium) — A mensagem de dúvida dizia "traços de cão e de gato" para qualquer Desenho com Confiança < 70% (Blind 6, Edge 4). Agora há três textos separados: Ambíguo, baixa Confiança e erro convicto.
- **patch** (low) — Um aviso velho de Hiperparâmetro continuava aparecendo quando o Hiperparâmetro mudava no estado "sem Treinamento" (Edge 3). Agora é escondido.
- **patch** (low) — Segurar Espaço alternava Treinar/Pausar por auto-repeat (Edge 6). Agora `ev.repeat` é ignorado.
- **patch** (low) — "Sortear outra rede" podia sortear a mesma Semente que já estava ativa (Edge 2). Corrigido.
- **patch** (low) — As miniaturas do treino tinham `aria-label` sem papel (role) (Blind 9). Ganharam `role="img"`.
- **patch** (low) — Constantes literais `60` e `"0,69"` na interface (Blind 13). Agora usam `dados.teste.length` e `fmt(N2.CHUTE, 2)`.
- **false** — Edge 5: esconder Correta/Errada na Época 0. O FR-17 manda mostrar a classe verdadeira e Correta/Errada sempre; a mudança foi testada e revertida.
- **false** — Blind 2: o C7 seria "mais fraco que o declarado". O critério do addendum é exatamente "≥ metade dos mapas, ≥ 3×", e o script aplica isso; 4/4 é o resultado observado, não a meta.
- **low, rejeitado** — Blind 5: Reiniciar/Sortear/Voltar clicáveis durante o Treinamento. Reiniciar é uma ação explícita do player; o PRD só restringe Hiperparâmetros.
- **low, rejeitado** — Blind 7: o `rngNovos` não reinicia junto com a Semente. O addendum define o fluxo de Desenhos Novos como independente; reiniciá-lo acrescentaria regra sem pedido.
- **low, rejeitado** — Blind 8: não há botão "Restaurar padrões". Seria uma funcionalidade nova, fora do PRD.
- **low, rejeitado** — Blind 10: layout responsivo abaixo de 1280 px. O PRD §2.2 fixa 1280×720 como tela mínima.
- **low, rejeitado** — Blind 12: os atalhos não agem com o foco num botão. Isso é intencional: Espaço ativa o botão em foco, e o comportamento está documentado na tela.
- **low, rejeitado** — Blind 14: números de linha do Code Map desatualizados. Corrigir exigiria editar a spec deste build.
- **defer** (medium) — Blind 11 e VGap 2: não há teste de navegador versionado para as regras de estado (troca de aba, tabela de Hiperparâmetros) e não houve teste em Edge, Firefox ou Safari. Ver `deferred-work.md`.

## Design Notes

A calibração usa exatamente o código da página: o script Node lê o HTML, isola o conteúdo de `<script id="n2-core">` e o avalia num contexto com `window = {}`. Assim não há duas implementações divergindo. O núcleo recebe o estado e devolve números; a camada de interface só desenha.

Escala do mapa de Pesos: fixa (±0,5 = saturado, ajustável na calibração), igual para todos os neurônios e todas as Épocas, para que a turma compare mapas entre si e ao longo do tempo.

## Verification

**Commands:**
- `node ferramentas/calibracao-nivel2.mjs` -- expected: C1–C7 com PASSOU, código de saída 0.
- `node -e` extraindo os dois `<script>` e checando sintaxe com `new Function` -- expected: sem erro.

**Manual checks (if no CLI):**
- Screenshot headless (Chrome) em 1280×630 dos dois Níveis, antes e depois do Treinamento padrão: faixas inteiras, sem texto < 14 px no Nível 2, mapas neutros antes de treinar.
