---
title: Revisão de verificação — PRD Simulador de Neurônio Artificial (Nível 1 e Nível 2)
reviewed: prd.md (rev. 14/10/2026) + addendum.md, contra review-rubric.md e review-adversarial.md
date: 2026-10-14
---

# Revisão de verificação

## Veredito: **NEEDS FIXES**

A revisão resolveu de verdade quase todos os bloqueios estruturais. Os pontos resolvidos são estes: Semente fixa com quatro fluxos, teste com 60 imagens e faixa de 52 a 59 acertos, Overfitting definido pelo Erro, mapa `W − W_inicial` com escala global, gradiente médio, limite no `log`, tabela de estados dos controles, forma visual do Nível 2, teto de 25 s e ordem de prioridade da calibração. Não há bloqueio que tenha ficado sem nenhuma correção.

Ainda assim, a correção criou quatro problemas novos que devem ser resolvidos antes do build:

1. O critério de não-regressão de FR-9 já falha no arquivo entregue.
2. O aviso de Overfitting não é específico e dispara no experimento de Learning Rate máximo.
3. Uma alavanca de calibração contradiz FR-10 e é aritmeticamente impossível.
4. A inicialização ±0,01 nas duas camadas produz mapas praticamente iguais e um platô no início do Treinamento.

**Contagem:** 20 findings verificados (adversarial F1–F9; rubric: 4 altos e 7 médios). **12 RESOLVED · 8 PARTIAL · 0 NOT RESOLVED.**

*Método.* Leitura integral dos quatro documentos e grep do `simulador-neuronio.html` entregue. Medi a faixa da conta no Chrome headless. Também rodei um modelo de brinquedo em numpy, com a arquitetura, a inicialização, o Learning Rate, o Batch Size e o Erro do addendum, sobre desenhos sintéticos simplificados (não o gerador real). Os números desse modelo servem só como indício de dinâmica, não como calibração.

---

## 1. Status de cada finding anterior

### Revisão adversarial

| # | Status | Onde foi resolvido | Observação |
|---|---|---|---|
| F1 — teste de 24 imagens, resultado muda a cada Reiniciar | **RESOLVED** | Glossário "Semente"; FR-11 "180 … e 60"; FR-12 "entre 52 e 59 Classificações Corretas em 60"; FR-14 "Reiniciar … usando a **mesma Semente**"; addendum §2 "quatro fluxos independentes"; addendum §4 "10 outras sementes … só como diagnóstico" | Granularidade de 1,67 ponto, faixa de 8 valores e execução determinística. |
| F2 — Overfitting vazio, aviso dispara no sucesso | **PARTIAL** | Glossário "Overfitting … o Erro de treino continua caindo enquanto o Erro de teste … volta a subir"; FR-12 "pelo menos 20% acima do seu próprio mínimo"; FR-18 "10% acima … por 5 Épocas seguidas … Com o Treinamento padrão, o aviso não aparece"; UJ-4 passos 2 e 3 separados | O falso positivo saiu do caso de sucesso e foi para o caso de Learning Rate máximo (ver N2). O problema mudou de lugar. |
| F3 — mapa de Pesos vira estática | **RESOLVED** | FR-15 "o quanto cada Peso mudou desde o início", "escala de cor única e fixa", "Antes de treinar, todos os mapas aparecem neutros"; addendum §3 "±0,01" e "`W_atual − W_inicial`" | O ruído da inicialização sumiu do mapa. Problemas novos da mesma escolha estão em N4. |
| F4 — Learning Rate e Batch Size dependem de escolhas não feitas | **PARTIAL** | addendum §3 "**gradiente médio do lote** (não a soma)", "[1e-7, 1 − 1e-7]"; FR-12 "(demais no padrão)", consequências de Batch Size 1 e máximo; addendum §4 degraus 1·10·20·45·180 | A convenção está fixada. Dois subcritérios continuam adjetivos e não são testáveis: "para num patamar alto" e "visivelmente mais serrilhada" (ver N5). |
| F5 — "erra quase tudo" × 50%; saída deslocada | **RESOLVED** | §1 "só chuta: responde perto de 50%"; FR-17 "entre 40% e 60%"; addendum §3, saída "±0,01" | O efeito colateral (platô) está em N4. |
| F6 — layout a 1280×720 | **RESOLVED** | Forma visual do Nível 2: "a faixa do meio … fica inteira na primeira dobra a 1280×720"; "não precisam estar todos acima da dobra"; "menor que 14 px" | A ambiguidade entre tela e viewport está em N1. |
| F7 — regressão do Nível 1 | **PARTIAL** | FR-9 "**Não-regressão** … re-verificadas no build", atalhos, título, abas distintas, botões Reiniciar separados; addendum §5 prefixos `n1-`/`n2-` | A nova Consequência de dobra já é violada pelo arquivo entregue (ver N1). |
| F8 — rótulo e parcela dos ambíguos | **RESOLVED** | FR-10 "10% dos Exemplos de cada classe", "Rótulo … sempre a classe que o gerou"; FR-11 "distribuídos proporcionalmente"; FR-17 "ao menos um Desenho Ambíguo no Conjunto de Teste" | 12 por classe, 3 por classe no teste. A conta fecha. A alavanca de 15% quebra isso (ver N3). |
| F9 — ritmo × duração da aula | **RESOLVED** | FR-14 "no máximo 25 segundos … várias são calculadas por quadro … entre 8 e 15 segundos"; addendum §4 "Com 30 Épocas, ~10 s" | |
| F10, F11 (baixos, para registro) | F10 RESOLVED; F11 PARTIAL | Tabela de estados, Época 0, fluxos separados, complemento cão, divisão fixa; "Correção dos Pesos" no Glossário | "barra de chance" continua sem declaração (N8). |

### Revisão de rubric

| Finding | Status | Onde foi resolvido | Observação |
|---|---|---|---|
| [alto] Tensão de calibração sem prioridade | **PARTIAL** | addendum §4 "Ordem de prioridade … 1º C1 … 2º C4"; "Critério de parada"; PRD §8 "Risco aberto"; PRD §9, item do addendum §4 | A lista de alavancas inclui uma alavanca proibida pelo próprio PRD (N3). C2 e C7 ficam fora da ordem de prioridade (N7). |
| [alto] Gatilho do aviso de Overfitting | **PARTIAL** | FR-18 "10% acima do seu próprio mínimo por 5 Épocas seguidas" | É objetivo e não dispara no padrão, mas não é específico de Overfitting (N2). "Mínimo" acumulado ou global, e se o aviso some depois de aparecer, não estão definidos. |
| [alto] Consequências estocásticas | **RESOLVED** | Semente, FR-14, addendum §2 | |
| [alto] Nível 2 sem forma visual | **RESOLVED** | "Forma visual" do Nível 2 (três faixas) | |
| [médio] Observável do Overfitting diverge | **RESOLVED** | Glossário, UJ-4 passo 2, FR-12 e FR-18 usam todos o Erro de teste | |
| [médio] Observável do Learning Rate alto | **PARTIAL** | FR-12 "termina maior … e não cai de forma contínua"; UJ-4 "não desce de forma estável e termina muito acima"; addendum C3 | "patamar alto" não tem número. "sobe em ao menos uma Época" também vale para o padrão: no modelo de brinquedo, o padrão tem de 3 a 5 Épocas de alta no platô inicial. |
| [médio] Adjetivos no lugar de limites | **PARTIAL** | FR-17 40–60%, FR-10 90% e 10%, FR-14 8–15 s, navegadores | Sobram "contraste claramente maior" (FR-15, C7), "visivelmente mais serrilhada" (FR-12) e "patamar alto" (FR-12). |
| [médio] Assumptions Index sem classificação | **RESOLVED** | §9 "Padrão do build", "nenhuma bloqueia o build"; item do addendum §4 diz o que exige o solicitante | |
| [médio] Máquina de estados dos controles | **RESOLVED** | Tabela em §4.10 + definição de "muda e reinicia, com aviso" | UJ-4 passo 2 (voltar o Learning Rate depois de concluído) agora é coerente. |
| [médio] "Erro" × erro de classificação | **RESOLVED** | Glossário "Classificação Correta / Classificação Errada … 'erro', sozinho, é reservado para a métrica" | Há resíduos de caixa, mas não de sentido (N8). |
| [médio] Brownfield sem referência nem não-regressão | **PARTIAL** | §0 Histórico e §6.1 citam `simulador-neuronio.html`; FR-9 tem a Não-regressão; addendum §7 registra os valores | Igual a F7: o gate de não-regressão falha no primeiro dia (N1). |

Os baixos da rubric foram todos resolvidos: SM-3 restrita, Desenho Novo com classe verdadeira, retomada pausada, Neurônio de Saída, "cada um dos três", aluno/participante, "ao abrir o arquivo", termos em inglês e cobertura das SMs.

---

## 2. Problemas que permanecem ou que a revisão criou

### N1 — [Alta] A Não-regressão de FR-9 já falha no Nível 1 entregue

**Onde:** FR-9, 5º bullet: "a faixa da conta do Nível 1 (FR-5) continua visível na primeira dobra a 1280×720".

**Medição.** Usei o Chrome headless com viewport de exatamente 1280×720. No `simulador-neuronio.html` atual, sem as abas, a `.mathbar` ocupa a faixa de **y = 706 a 754 px**. O SVG do diagrama (viewBox 1040×470, largura 100%) sozinho tem cerca de 553 px de altura. Numa **tela** de 1280×720, o viewport útil do navegador fica perto de 633 px, e a faixa da conta fica inteira abaixo da dobra. A barra de abas de Nível empurra tudo mais para baixo.

**Consequência.** O critério de não-regressão não passa no estado "já validado". Ou o build reprova o Nível 1, ou altera o layout do Nível 1, que o PRD diz que deve "continuar funcionando igual". A mesma ambiguidade entre tela e viewport vale para a exigência de que a faixa do meio do Nível 2 caiba na primeira dobra.

**Correção.** Definir "1280×720" como viewport ou como tela. Depois, escolher uma das opções:
- autorizar explicitamente uma mudança no Nível 1, por exemplo limitar a altura do diagrama com `max-height` em `vh` e registrar isso como alteração aceita da forma visual;
- reescrever o critério como "a faixa da conta continua na mesma posição relativa ao diagrama que na entrega", sem exigir a primeira dobra.

### N2 — [Média-Alta] O aviso de Overfitting dispara no experimento de Learning Rate máximo

**Onde:** FR-18, 3º bullet; UJ-4 passo 1; addendum C3.

**Problema.** O gatilho só olha o Erro de teste: 10% acima do mínimo por 5 Épocas. Com Learning Rate 10, o Erro de teste oscila e fica acima do mínimo. No modelo de brinquedo, o aviso disparou na **Época 5** com Learning Rate 10, e também com Batch Size 1, na Época 21. A tela vai dizer "Overfitting" justamente no passo 1 do UJ-4, que ensina outra lição: instabilidade. Isso cria o equívoco que o produto quer desfazer.

**Correção.**
- Exigir também que o Erro de treino esteja perto do seu mínimo, por exemplo "Erro de treino ≤ 1,05 × o seu mínimo nas mesmas 5 Épocas".
- Acrescentar a Consequência "com Learning Rate no máximo, o aviso não aparece" e incluí-la em C3.
- Definir que o mínimo é o acumulado até a Época atual, contando a Época 0, e se o aviso permanece depois de aparecer.

### N3 — [Média] A alavanca "ambíguos até 15%" contradiz FR-10 e é impossível com a divisão proporcional

**Onde:** addendum §4, alavanca 3, contra FR-10 ("10% dos Exemplos de cada classe são Desenhos Ambíguos") e FR-11 ("distribuídos proporcionalmente").

**Problema.**
- O PRD §9 só permite recalibrar "desde que as Consequências de FR-10 a FR-18 continuem valendo". Subir para 15% viola FR-10.
- A conta também não fecha: 15% de 120 são 18 por classe, e 18 × ¼ = 4,5 ambíguos por classe no teste. Não há divisão proporcional inteira.
- Com 120 Exemplos por classe e ¼ no teste, a parcela só fecha em múltiplos de 1/30 (10% = 3 por classe no teste; 13,3% = 4).

**Correção.** Trocar a alavanca 3 por "aumentar o grau de ambiguidade (interpolação das orelhas mais perto de 50%), mantendo 10%". Se o solicitante aprovar, escrever em FR-10 uma faixa compatível com a divisão.

### N4 — [Média] A inicialização ±0,01 nas duas camadas: a simetria não se quebra na prática e o Treinamento começa num platô

**Onde:** addendum §3, "Quebra de simetria: os ±0,01 aleatórios bastam"; UJ-3 passo 3; FR-15.

**Problema.**
- **Simetria.** Com `W` bem pequeno, todos os neurônios ocultos saem perto de 0,5, e a correção de cada um é aproximadamente `u_j × (o mesmo vetor)`. Os mapas `ΔW_j` nascem iguais, a menos de escala e sinal. Depois de multiplicados pelo sinal de `u_j`, como o addendum manda, **ficam praticamente idênticos**. No modelo de brinquedo, |cos| entre os mapas ficou entre 0,97 e 1,00 em três sementes. O recurso previsto (±0,05) não resolveu: ficou entre 0,75 e 0,997. A verificação "confirmar que os mapas não ficam todos iguais" não tem critério de aceite, e a solução proposta não funciona.
- **Platô.** Com `u` em ±0,01, o gradiente que chega aos pixels é quase nulo. No modelo de brinquedo, o padrão ficou cerca de 10 Épocas no Erro 0,693 (a linha "chute"), e cada `u_j` trocou de sinal de 2 a 8 vezes nas primeiras Épocas. Com isso, os mapas trocam de cor inteira justamente na fase "+1 Época" que o facilitador narra (UJ-3 passo 3), e o Erro não se move.

**Correção.**
- Inicializar a saída maior (ex.: `u` em ±0,3 a 0,5) e o Bias de saída como `c = −0,5·Σu_j`. Como `h_j ≈ 0,5` para todo Desenho, a Probabilidade inicial fica em ≈ 50% para todos, e FR-17 continua valendo, sem platô.
- Para os mapas: ou aceitar mapas parecidos e dizer isso no texto de apoio (FR-15 já não promete diversidade), ou definir um critério mensurável de diversidade em C7 com uma alavanca que funcione de fato.
- Retirar do addendum a afirmação de que ±0,01 "basta".

### N5 — [Baixa-Média] Critérios ainda não testáveis

**Onde:** FR-12 ("para num patamar alto", "visivelmente mais serrilhada", "o Erro de treino continua caindo" nas Épocas máximas) e FR-15 / C7 ("contraste claramente maior").

**Correção.** Sugestões de números:
- **Serrilhado:** contagem de Épocas em que o Erro de treino sobe, ou soma de |ΔErro|, maior que a do padrão.
- **Patamar alto:** Erro de treino final ≥ 2 × o do padrão.
- **"Continua caindo":** Erro de treino final < Erro de treino na Época do mínimo de teste.
- **Contraste:** média de |mapa| nas regiões de orelha e focinho ≥ 3 × a do fundo.

### N6 — [Baixa] O enunciado de FR-8 foi ampliado além do que o Nível 1 entregue faz

**Onde:** FR-8. O enunciado da v1 pedia texto para Entrada, Peso, Bias, Limiar e Resultado. O atual pede "um texto curto explicando cada conceito … (Entrada, Peso, Bias, Soma Ponderada, Função de Ativação, Limiar e Resultado)".

**Problema.** O arquivo entregue cumpre as Consequências (rótulos "Importância de", "Bias (tendência inicial)", subtítulo e legenda do Limiar), mas não tem um texto próprio para Resultado, Entrada ou Peso como conceito. Pelo enunciado, um verificador estrito reprova o Nível 1, ou o build acrescenta textos ao Nível 1. Os demais itens conferem com o entregue:
- Limiar 1 (linha 238);
- Pesos 3 / 2 / 1,5 com Bias −1, e 2 / 1,5 / 3 com Bias −1,5 (linhas 246–263);
- sliders −5..5 e −10..10, passo 0,5 (linhas 650 e 687);
- Entradas em "Não" (linha 742);
- formato da conta e "≥ 1 → ATIVADO" (linhas 856–864);
- teclado nas Entradas (linha 432).

**Correção.** Dizer que FR-8 é atendido pelos rótulos, pelo subtítulo e pela legenda da entrega, ou voltar o enunciado à lista da v1.

### N7 — [Baixa] Imprecisões técnicas no addendum

- **§3, "Os pixels de fundo valem 0 e nunca recebem correção".** Isso é falso se houver "ruído de pixel" (§2), que tira o fundo do zero. Mais grave: a alavanca 1 (aumentar o ruído) trabalha diretamente contra "o fundo continua neutro" (FR-15). No modelo de brinquedo, o |ΔW| médio no fundo ficou em cerca de 1/7 do |ΔW| nos traços. C7 e C2 não aparecem na ordem de prioridade, então o build não sabe se pode sacrificá-los.
- **Custo.** "por volta de 600 mil multiplicações" corresponde só ao forward do treino com H = 8 (180 × 400 × 8 = 576 mil). Somando a correção e a medição dos 240 Exemplos a cada Época, o total fica entre 1,5 e 2 milhões. A conclusão ("irrelevante") continua valendo.
- **Ritmo.** "no máximo uma Época por quadro a ~3 Épocas por segundo" é confuso, porque um quadro dura ~16 ms. A intenção é "~3 Épocas por segundo, agrupadas por quadro só acima de 75 Épocas".
- **Conferidos e corretos:**
  - ln 2 ≈ 0,693 é o Erro de uma rede que responde 50% para tudo, e é a linha "chute" correta;
  - a média do lote está fixada;
  - o limite [1e-7, 1−1e-7] impede `Infinito` e `NaN` no Erro (no JS, a sigmoide com `exp` estourado dá 0 ou 1, não NaN);
  - multiplicar `ΔW_j` pelo sinal de `u_j` faz azul significar sempre "empurra para gato", porque ∂p/∂x_i ∝ u_j·W_ji. Atenção: o sinal deve ser o de `u_j` atual, que oscila no início (N4), e isso contradiz a linguagem "azul = Peso positivo" da forma visual para neurônios com `u_j < 0`.

### N8 — [Baixa] Disciplina do Glossário

- "gera desenhos novos" (UJ-3 passo 5) deve ser "Desenhos Novos". "Classificação errada" (UJ-3 edge case) deve ser "Classificação Errada".
- "acerto" (§1, "acerto no treino é acerto no mundo real"; Forma visual, "verde para acerto") é sinônimo não declarado de Classificação Correta ou Acurácia.
- "barra de chance" (Forma visual, FR-17) e "confiança" (FR-17, critério "confiança acima de 80%") não são termos do Glossário. "confiança" carrega uma Consequência numérica e deveria ser definida (= Probabilidade se gato, 100% − Probabilidade se cão).
- **Aluno** está definido com maiúscula, mas o corpo usa "aluno" em todo o documento. Não muda o sentido. "participante" não aparece mais. Não sobrou nenhum "erro" minúsculo no sentido de classificação.
- "Semente" é definida como "o número que determina todos os sorteios". Depois de "Sortear outra rede", porém, os dados ficam na Semente padrão e a inicialização e o embaralhamento usam outra (addendum §2, quatro fluxos). O Glossário precisa refletir os fluxos.

---

## 3. Checagem numérica cruzada

| Par | Resultado |
|---|---|
| FR-12 "52 a 59 de 60" × SM-C2 "não 60 de 60" | Compatíveis: 86,7% a 98,3%. 51/60 = 85% exatos, fora da faixa, o que é coerente com "acima de 85%". |
| FR-12 × FR-17 "≥ 80% do teste com confiança > 80% na classe certa" | Compatíveis: exige ≥ 48 Classificações Corretas confiantes, e a faixa mínima é 52. Permite até 4 a 11 acertos "em dúvida". |
| FR-18 (≥ 10% por 5 Épocas) × FR-12 Épocas máximas (final ≥ 20% acima do mínimo) × "o padrão nunca dispara" | Compatíveis entre si: o gatilho é mais fraco que C4, então C4 praticamente implica o aviso (não estritamente: um salto só nas últimas 4 Épocas cumpriria C4 sem o aviso). No modelo de brinquedo: padrão final/mínimo = 1,02, sem aviso; 200 Épocas = 1,36, aviso na Época 85. **Incompatível com a lição de Learning Rate** (N2). |
| FR-14: máximo 25 s, padrão 8–15 s, ~3 Épocas/s, 30 Épocas | 30 / 3 = 10 s ✓. 200 Épocas → ~8 Épocas/s para caber em 25 s ✓. Agrupar só a partir de 75 Épocas ✓. |
| Batch Size 1·10·20·45·180 × 180 de treino | Todos dividem 180 ✓ (180, 18, 9, 4 e 1 Correções por Época). Com 180 e 30 Épocas são 30 Correções: no modelo de brinquedo, o Erro ficou parado em 0,693. Cumpre FR-12 ("maior que o padrão"), mas mostra "não aprende nada", e vale avisar o facilitador. |
| Learning Rate 0,01…10 × FR-12 | Degraus em vírgula ✓, padrão 0,5 é um degrau ✓, máximo = 10. O "patamar alto" continua sem número (N5). |
| FR-13: H = 1 > 70% (≥ 43/60); H = 8 ≤ padrão + 3 | Compatíveis com FR-12. |
| FR-10 / FR-11: 10% de 120 = 12 → 3 por classe no teste | ✓. Com 15% (alavanca 3), impossível (N3). |

---

## 4. O que corrigir antes do build (prioridade)

1. **N1 [Alta]:** decidir viewport × tela e a dobra do Nível 1 (FR-9).
2. **N2 [Média-Alta]:** tornar o gatilho do aviso específico de Overfitting e acrescentar "não aparece com Learning Rate máximo" (FR-18, C3).
3. **N3 [Média]:** remover ou reescrever a alavanca de 15% de ambíguos (addendum §4).
4. **N4 [Média]:** inicialização da saída maior com Bias de saída compensado, e decidir o que se promete sobre a diversidade dos mapas (addendum §3, C7).
5. **N5–N8 [Baixa]:** números para os critérios restantes, enunciado de FR-8, correções no addendum e ajustes do Glossário. Podem ir junto, mas não bloqueiam.
