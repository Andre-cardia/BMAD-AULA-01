---
title: 'Simulador de Neurônio Artificial — "Vai ter Churrasco?"'
type: 'feature'
created: '2026-10-13'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/planning-artifacts/prds/prd-BMAD-AULA-01-2026-10-13/prd.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Lideranças empresariais em um programa de letramento em IA não têm uma forma concreta e sem jargão de entender os quatro blocos que sustentam qualquer rede neural — Entrada, Peso, Bias e Função de Ativação. O prazo da aula já está estourado e não existe nenhum artefato construído.

**Approach:** Entregar um único arquivo HTML autônomo, que roda offline por duplo clique em notebook, simulando um neurônio artificial único (perceptron) com ativação binária por limiar. Dois Cenários lúdicos pré-definidos ("Vai ter Churrasco?" e "Vai Chover?"); o aluno ajusta Entradas por toggle e Pesos/Bias por slider, e vê em tempo real tanto a fórmula da Soma Ponderada preenchida com números reais quanto o Resultado em linguagem cotidiana com emoji. Requisitos completos em FR-1 a FR-8 do PRD referenciado em `context`.

</frozen-after-approval>

## Implementation Notes

**Arquivo criado:** `simulador-neuronio.html` (~20 kB, único arquivo, HTML + CSS + JS inline, zero dependências externas, zero chamadas de rede).

**Decisões de implementação:**
- **Limiar = 1**, fixo e exposto na tela, conforme a suposição aceita no PRD §3.
- **Pesos/bias padrão** calibrados para que o estado inicial (todas as Entradas em "Não") fique *não ativado*: churrasco soma −1, chuva soma −1,5. Isso garante que o aluno veja a transição ao ativar Entradas, como exige a suposição do PRD §4.3.
- **Ordem visual da coluna direita**: a decisão (ativação + Resultado) vem *antes* do detalhamento da Soma Ponderada. Motivo: em 1280×720 — a resolução mínima assumida no PRD §2.2 — a sequência original empurrava o Resultado para fora da dobra, de modo que o facilitador mexeria no slider de Bias sem ver o clímax descrito em UJ-1/UJ-2. Verificado por screenshot: a decisão agora fica visível junto dos controles.
- **Gráfico de barras de contribuição** (não pedido explicitamente pelo PRD, mas serve FR-5 e a contra-métrica SM-C1): mostra entrada × peso por fator, com linha de zero ao centro e escala comum, para tornar visível que uma Entrada em "Não" contribui zero mesmo com peso alto.
- **Números em formato pt-BR** (vírgula decimal) via uma única função `fmt()`, por onde todo valor passa — público-alvo brasileiro não-técnico.
- **Vocabulário da interface alinhado ao Glossário do PRD §3**: "Soma Ponderada", "função de ativação", "ativado / não ativado". Evitados os sinônimos "liga/desliga" e "soma" soltos, que violariam a disciplina de termos declarada no §3.

**Verificação executada** (`node`, lógica extraída do próprio arquivo):
- Sintaxe do script válida; `fmt()` correto em 11 casos, incluindo supressão de `-0`.
- Estado padrão de ambos os cenários abaixo do limiar.
- Edge case de UJ-1: pesos e bias zerados com Entradas em "Sim" → soma 0, não ativado, determinístico.
- UJ-1: o Bias sozinho vira a decisão sem tocar nas Entradas (2 → −7).
- Fronteira exata: soma = 1 ativa (regra `≥`, não `>`).
- Peso negativo derruba soma positiva; extremos das faixas (±25) sem NaN.
- Inspeção visual em 1280×720 e 1280×1100, nos dois cenários e nos dois estados de ativação.

**Surpresa:** um ERRO inicial na verificação da faixa de peso era falso positivo do próprio teste — o slider de peso é criado via JS (`sl.min = "-5"`), não como atributo HTML, então a regex não casava. Reconfirmado com regex adequada.

## Review Triage Log

Revisor Blind Hunter: 13 achados, piso de 5. Todos verificados no código; nenhum falso positivo. Agrupados por causa raiz e corrigidos — nada deferido.

- **patch** (verdict: high) — Números em formato en-US (`1.5`) para público brasileiro. Evidência: `fmt()` devolvia `toString()` cru e propagava ponto decimal para pesos, bias, fórmula, barras e texto "Faltam". Corrigido na própria `fmt()`, mais supressão de `-0`.
- **patch** (verdict: high) — "Função de Ativação", um dos quatro conceitos que o produto existe para ensinar (SM-1), nunca era nomeada na tela; a única menção ao Limiar estava no rodapé, longe do controle, violando FR-8. Corrigido: a seção 3 passou a se chamar "A decisão: a função de ativação" com nota explicativa junto do painel de comparação.
- **patch** (verdict: high) — Vocabulário da interface divergia do Glossário §3, que declara sinônimos não-declarados como violação de disciplina: "Soma Ponderada" não aparecia em lugar nenhum, e "ativado/não ativado" virara "LIGADO/DESLIGADO". Corrigido em todo o texto e nos nomes de campo (`ativado`/`naoAtivado`).
- **patch** (verdict: medium) — Rótulo do slider de peso era "Peso" em vez de "Importância de {Entrada}" (PRD §4.3), gerando três `<label>` idênticos sem vínculo com sua Entrada. Corrigido: rótulo "Importância" mais `aria-label` nominal por slider.
- **patch** (verdict: medium) — Faixa dos sliders não era visível, embora FR-3 e FR-4 exijam "faixa visível"; os extremos existiam só como atributos. Corrigido com marcas `-5 / 0 / +5` e `-10 / 0 / +10` sob cada slider — justamente o que revela que peso pode ser negativo.
- **patch** (verdict: medium) — Resultado e botão Reiniciar abaixo da dobra em 1280×720, quebrando o clímax de UJ-1/UJ-2. Corrigido reordenando a coluna direita e compactando o topo; confirmado por screenshot.
- **patch** (verdict: medium) — Gráfico de barras sem título ou legenda, e marcado `aria-hidden="true"` sendo o único lugar com o valor de cada contribuição. Corrigido: nota explicando contribuição vs. peso, linha de zero e escala; `aria-hidden` removido e cada barra exposta com `role="img"` e `aria-label`.
- **patch** (verdict: medium) — `#result` com `aria-live="polite"` disparava ~40 anúncios ao arrastar o Bias de -10 a +10. Corrigido com região `.sr-only` dedicada que anuncia somente quando a decisão vira.
- **patch** (verdict: medium) — `.formula` com `white-space: nowrap` fazia o total (`= soma`), número mais importante da tela, ser o primeiro a sair do campo de visão em projeção ou zoom. Corrigido: quebra de linha em vez de rolagem horizontal.
- **patch** (verdict: low) — Dica dos cenários afirmava "só mudam os nomes das entradas", mas a troca também substitui pesos e bias padrão, desinformando sobre o ponto pedagógico de UJ-2. Texto corrigido.
- **patch** (verdict: low) — Sem `<noscript>`: num notebook corporativo restritivo o aluno veria caixas vazias e nenhuma mensagem, num artefato distribuído por pendrive. Corrigido com aviso de uma linha.
- **patch** (verdict: low) — Troca de cenário recriava os botões das abas, destruindo o elemento recém-clicado e perdendo o foco do teclado; nenhum estilo `:focus` explícito. Corrigido: `aria-pressed` atualizado nos botões existentes, mais regra `:focus-visible`.

## Spec Change Log

- **Gatilho:** rejeição do usuário na primeira entrega — "era pra representar graficamente o neurônio, as entradas (inputs) depois o Output (ativando ou nao a função) e nao isso estático e tudo em texto".
- **O que mudou:** a interface foi refeita em torno de um **diagrama SVG animado** do neurônio, que passou de ausente a protagonista da tela. A v1 cumpria FR-1 a FR-8 ao pé da letra, mas os entregava como painéis de texto e sliders — o PRD pede "simulador visual" (§1), e o aluno precisa ver o *fluxo* entrada → conexão → corpo → ativação → saída, não ler números.
- **Estado ruim evitado:** uma ferramenta tecnicamente conforme ao PRD e pedagogicamente morta. Em sala projetada, a v1 exigia que o facilitador narrasse o que os números significavam; a v2 mostra o sinal viajando.
- **KEEP (deve sobreviver a qualquer re-derivação):**
  - Toda a lógica de cálculo e os valores padrão por cenário, verificados e corretos.
  - As 12 correções do primeiro Review Triage Log — em especial `fmt()` em pt-BR, vocabulário alinhado ao Glossário §3 ("Soma Ponderada", "função de ativação", "ativado / não ativado"), `<noscript>`, faixas visíveis dos sliders, foco de teclado e anúncio a leitor de tela só na virada da decisão.
  - A matemática permanece visível (contra-métrica SM-C1): a fórmula com números reais ficou numa faixa própria, e o valor da Soma Ponderada aparece dentro do corpo do neurônio.

### Design do diagrama (v2)

- **Entradas como interruptores:** os círculos à esquerda são os próprios controles (clique ou Enter/Espaço), mostrando `1/SIM` ou `0/NÃO`. Eliminam a separação artificial entre "o desenho" e "os botões".
- **Conexões sinápticas:** espessura proporcional a |peso|, cor vermelha quando o peso é negativo, e **pulsos animados** viajando da entrada ao corpo apenas quando a entrada está ligada — é o que torna o fluxo visível.
- **Bias como quarta entrada:** entra no corpo por uma linha tracejada âmbar, deixando explícito que ele soma como qualquer outro sinal, sem depender de nenhuma entrada.
- **Corpo do neurônio:** anel de progresso que preenche conforme a Soma Ponderada caminha até o limiar, com o valor no centro. Brilha e pulsa quando ativado.
- **Função de ativação como gráfico:** a caixa desenha o degrau real (0 antes do limiar, salto para 1 a partir dele) e uma bolinha marca onde a Soma Ponderada caiu. O aluno vê a bolinha subir o degrau no instante da virada.
- **Saída:** círculo com o emoji do cenário, o bit (`DISPAROU · 1` / `NÃO DISPAROU · 0`) e a mensagem lúdica; recebe pulsos verdes só quando o neurônio dispara.
- **Acessibilidade mantida:** `prefers-reduced-motion` desliga a animação e posiciona sinais estáticos; `#net-desc` descreve o diagrama inteiro em texto para leitores de tela.

### Correções visuais desta iteração (achadas por inspeção de screenshot)

- `DISPAROU · 1` era mais largo que o círculo da saída e vazava sobre a borda → movido para fora, abaixo do círculo.
- `Σ entrada × peso + bias` encostava nas bordas do corpo → reescrito como `Σ (entrada × peso) + bias`, fonte reduzida e raio do neurônio aumentado de 94 para 100.
- Pulsos animados passavam por cima das etiquetas de peso → criado o grupo SVG `gPesos`, pintado depois de `gPulsos`.

### Verificação da v2

27 checagens automatizadas, todas passando: sintaxe; `fmt()` pt-BR; geometria das arestas (recorte pelos raios, diagonal do bias com comprimento positivo); quebra de rótulos longos em duas linhas; estado padrão desligado nos dois cenários; ativação do churrasco (4) e da chuva (1,5); fronteira exata `soma = 1` ativando pela regra `≥`; peso negativo derrubando soma positiva; edge case de UJ-1 com tudo zerado; saturação do arco entre 0 e 1; ponto do degrau nunca saindo da caixa; e doze checagens estruturais. Inspeção visual em 1280×880 nos dois cenários e nos dois estados de ativação.
