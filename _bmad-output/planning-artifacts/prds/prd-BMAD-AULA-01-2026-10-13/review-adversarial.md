---
title: Revisão adversarial — PRD Simulador de Neurônio Artificial (Nível 1 e Nível 2)
reviewed: prd.md (rev. 14/10/2026) + addendum.md
lens: adversarial (revisão de requisitos)
date: 2026-10-14
---

# Revisão adversarial do PRD — Nível 2

## Veredito: **CONCERNS** (bloqueante para o build até corrigir F1–F4)

As decisões de produto (desenhos, uma Camada Oculta, sigmoide, mesmo arquivo com abas) não são questionadas aqui. O problema está nas **Consequências testáveis** do Nível 2. Elas foram escritas como se a medição fosse contínua e o resultado fosse determinístico. Com 120 Exemplos, 24 no teste, 400 Entradas e inicialização aleatória, nenhuma das duas premissas vale. Do jeito que está, o construtor vai "recalibrar no build" (addendum §4) contra metas que se contradizem, e a turma pode ver ao vivo uma demonstração diferente da que o facilitador ensaiou.

Severidade: **Alta** = o requisito não pode ser cumprido ou verificado como está escrito, ou a aula quebra no palco. **Média** = o construtor vai ter que adivinhar, com risco real de errar. **Baixa** = acabamento.

---

## F1 — [Alta] Um teste de 24 imagens torna FR-12, SM-C2 e FR-18 quase incompatíveis, e o resultado muda a cada "Reiniciar"

**Onde:** FR-11 (80/20 → 24 no teste), FR-12 (">85% no teste com padrões"), SM-C2 ("nunca 100%"), FR-16 (exemplo "91,7%"), FR-17, FR-14 ("Reiniciar… com Pesos aleatórios"), addendum §3 (Xavier aleatório).

**Problema.**
- Com 24 imagens no teste, a Acurácia só anda em degraus de **4,17 pontos**. Os valores possíveis acima de 85% são 87,5% (21/24), 91,7%, 95,8% e 100%. Para cumprir ao mesmo tempo ">85%" e "não 100%", o resultado precisa cair em **três valores: 21, 22 ou 23 acertos**. Duas imagens a mais erradas já reprovam o FR-12. Nenhuma errada viola o SM-C2.
- O conjunto usa semente fixa, mas os Pesos iniciais são aleatórios a cada Reiniciar (FR-14). Então cada demonstração é uma amostra nova. Uma conta binomial simples, supondo acurácia real de 90% por imagem: P(≥21/24) ≈ **79%**, P(24/24) ≈ **8%**. Com 92%: 88% e 13,5%. Na prática, **1 em cada 5 a 8 Treinamentos padrão reprova o FR-12 ao vivo**, e cerca de 1 em 10 mostra 100% no teste, que é justamente o que o SM-C2 quer evitar.
- O SM-C2 diz "não calibrar para que *sempre* chegue a 100%", mas não define critério de aceite: quantas execuções e qual frequência é tolerada. O "verificado no build" do FR-13 tem o mesmo problema.

**Consequência.** O facilitador ensaia, vê 91,7% e, na frente dos diretores, aperta Reiniciar e sai 83,3%. A demonstração "bem-sucedida" do UJ-3 fracassa sem explicação. Nenhum teste de aceite com resultado fixo pode ser escrito.

**Correção.**
1. Inicializar os Pesos com um gerador de números aleatórios **com semente fixa**. Assim, "Reiniciar" com os mesmos Hiperparâmetros reproduz exatamente a mesma curva (o mesmo vale para o embaralhamento dos lotes). Se quiser mostrar a variação, ofereça um botão separado, "Sortear outra rede", fora do roteiro padrão.
2. Escrever as Consequências contra essa execução determinística: "com os padrões e a semente padrão, a Acurácia de teste final fica entre 21/24 e 23/24".
3. Se a variação entre sementes continuar permitida, definir a tolerância: "em ≥ 9 de 10 sementes, teste ≥ 21/24; em nenhuma semente, 24/24 com os padrões".
4. Avaliar 30 imagens de teste, 25% de 120. A granularidade cai para 3,3 pontos, e 85% corresponde a 26/30, o que dá mais folga.

---

## F2 — [Alta] O Overfitting do FR-13, como está definido, acontece mesmo com os padrões, e o número de neurônios não é a causa

**Onde:** FR-13 (3ª consequência), Glossário "Overfitting", UJ-4 passo 2, FR-18 (aviso de Overfitting), addendum §4 (alavancas de calibração).

**Problema.**
- **Há 400 Entradas e só 96 Exemplos de treino.** Com mais dimensões que Exemplos, os dados de treino são quase sempre separáveis por um único neurônio. Então **qualquer** `H`, inclusive `H = 1` e o padrão `H = 4`, tende a chegar perto de 100% de Acurácia de treino. Aumentar a Camada Oculta não produz um efeito visível que se possa atribuir a ela. O UJ-4 ("muitas Épocas **e** muitos neurônios") mistura duas alavancas, e a turma vai concluir que "mais neurônios causam Overfitting" sem que a tela mostre isso.
- O critério do FR-13 ("treino perto de 100% enquanto o teste fica abaixo e para de subir") é **cumprido pela própria execução padrão** do UJ-3: treino em ~100%, teste estabilizado em ~91,7%. É um critério vazio, que não distingue Overfitting de sucesso.
- O "cai" do UJ-4 e do Glossário não é confiável. Com sigmoide e entropia cruzada, sem regularização, e com desenhos gerados de forma limpa, a Acurácia de teste costuma **estabilizar**, não cair. Quando cai, cai de 1 imagem (4,17 pontos), que é o mesmo tamanho do ruído normal entre Épocas. O sinal de Overfitting que aparece de forma confiável é o **Erro de teste voltar a subir**: a rede fica confiante demais e erra os ambíguos com 99% de certeza. O PRD define Overfitting pela métrica menos confiável.
- O aviso do FR-18 ("quando a Acurácia de teste fica *visivelmente* abaixo da de treino") **dispara no clímax do UJ-3**: 100% contra 91,7% é uma diferença de 8 pontos. A demonstração "deu certo" e a tela diz "Overfitting" ao mesmo tempo.
- As alavancas do addendum §4 (mais ruído, menos treino, mais ambíguos) **baixam a Acurácia de teste com os padrões**. Cada ajuste a favor do FR-13 joga contra o FR-12, que já tem só três valores aceitáveis (F1).

**Consequência.** O construtor não consegue satisfazer o FR-12 e o FR-13 juntos por calibração. A lição central do UJ-4 fica ambígua no palco, ou ensina uma causa errada.

**Correção.**
1. Redefinir Overfitting (Glossário e FR-13) pelo **Erro**: "o Erro de treino continua caindo enquanto o Erro de teste para de cair e volta a subir". A Acurácia entra como apoio.
2. Dar ao FR-13 um critério comparativo contra os padrões. Exemplo: "com 200 Épocas e `H = 8`, o Erro de teste no fim é maior que o seu mínimo em pelo menos X%, e maior que o Erro de teste final da execução padrão".
3. Disparar o aviso do FR-18 por um gatilho objetivo, que **não** dispare na execução padrão. Exemplo: Erro de teste subindo por N Épocas seguidas acima do seu mínimo. Escrever no PRD que a execução padrão não exibe o aviso.
4. Ou separar as alavancas no UJ-4 (primeiro só Épocas, depois só neurônios), ou tirar do texto qualquer afirmação de que neurônios causam Overfitting. Com 400 > 96, a alavanca de Overfitting que funciona é o número de Épocas.

---

## F3 — [Alta] A "imagem dos Pesos" vai mostrar o ruído da inicialização, não "orelhas pontudas"

**Onde:** FR-15 (2ª e 3ª consequências), addendum §5 ("um neurônio que passou a procurar orelhas pontudas"), addendum §3 (Xavier), Glossário "Entrada" (0 = branco).

**Problema.**
- A Entrada branca vale **0**, e a correção do Peso de um pixel é proporcional à Entrada daquele pixel. Os pixels de fundo, que nunca são tinta em nenhum Exemplo, **não recebem nenhuma correção e mantêm para sempre o ruído aleatório inicial**: com Xavier, ±0,12 para 400 Entradas. Os cantos e o fundo do mapa 20×20 continuam sal-e-pimenta depois do Treinamento.
- Com Learning Rate 0,5, 30 Épocas e 6 correções por Época, os Pesos aprendidos nas regiões de traço podem ter a mesma ordem de grandeza desse ruído. A diferença "a olho nu" entre rede treinada e não treinada (FR-15) não está garantida.
- Se cada mapa for normalizado pelo seu próprio máximo, a rede não treinada parece tão "forte" quanto a treinada.
- Mesmo sem ruído, o mapa de um neurônio que separa duas classes mostra uma **diferença** (azul onde é gato, vermelho onde é cão), não o retrato de um traço. Prometer "o neurônio que procura orelhas" (§4.11, addendum §5) cria uma expectativa que o facilitador pode não ver ao vivo.

**Consequência.** A visualização mais "mágica" do Nível 2 vira estática de TV. Para executivos, isso reforça a ideia de que a IA é uma caixa-preta incompreensível, o oposto da intenção.

**Correção.** Escolher e especificar uma destas opções, ou uma combinação:
1. Inicialização bem pequena (ex.: ±0,01) nos Pesos de Entrada.
2. Exibir **Peso atual − Peso inicial**: o que a rede aprendeu, sem o ruído inicial.
3. Mascarar ou esmaecer pixels que nunca têm tinta.
4. Usar escala de cor **global e fixa** (mesma escala antes e depois do Treinamento).

Trocar no texto "procura orelhas pontudas" por "mostra quais pixels empurram para gato (azul) e para cão (vermelho)". Incluir uma consequência verificável, como "depois do Treinamento padrão, as regiões de orelha e de focinho aparecem com contraste claramente maior que o fundo".

---

## F4 — [Alta] O comportamento do Learning Rate e do Batch Size depende de escolhas que o PRD não faz

**Onde:** FR-12 (consequência "Learning Rate no máximo → Erro oscila"), addendum §3 e §4.

**Problema.**
- O PRD não diz se a correção usa a **média** ou a **soma** do lote. Com soma, o Learning Rate efetivo é multiplicado pelo Batch Size: 0,5 × 96 = 48, e o padrão já diverge. Com média, Batch Size 96 faz **uma única correção por Época**, só 30 no Treinamento inteiro, e a rede quase não aprende com os padrões de Épocas. O resultado das alavancas muda completamente conforme essa escolha.
- Com sigmoide nas duas camadas e Entradas não centralizadas (0..1, com ~100 pixels de tinta), um Learning Rate de 5 tende a **saturar** os neurônios, não a oscilar. O Erro trava num patamar alto e reto ou explode. Se `log(0)` não for limitado, aparece `Infinity`/`NaN` e o gráfico quebra. "Oscila visivelmente" é só um dos resultados possíveis, e o PRD não diz o que aceitar nos outros dois casos.
- O FR-12 não diz com quais **outros** Hiperparâmetros vale a consequência do Learning Rate 5 (com Batch 1? com Batch 96? com H = 1?).
- **O Batch Size não tem nenhuma Consequência testável.** O construtor não sabe o que a turma deveria ver ao mexer nele.
- O FR-12 descreve "Batch Size de 1 a 96", que sugere slider contínuo, enquanto o addendum define degraus fixos (1·8·16·32·96). A opção "96 = Conjunto de Treino inteiro" deixa de ser verdade se a alavanca "reduzir o Conjunto de Treino" do addendum §4 for usada.

**Consequência.** O construtor escolhe uma convenção ao acaso. Um dos três equívocos que o SM-3 manda reproduzir ("Learning Rate maior aprende mais rápido") pode aparecer como uma tela travada ou "NaN", que parece defeito e não lição.

**Correção.**
1. Fixar a convenção: gradiente médio por lote, Exemplos embaralhados a cada Época com semente.
2. Limitar a probabilidade a [1e-7, 1−1e-7] no cálculo do Erro.
3. Definir o comportamento aceito para Learning Rate 5 com os demais padrões: "o Erro de treino fica acima do Erro da execução padrão em toda a curva e não é monotônico". Exibir o Erro numa escala com limite superior fixo.
4. Dar ao Batch Size uma consequência observável, ou rebaixá-lo a controle sem promessa didática. Uma opção é ligar o limite de Batch Size ao tamanho real do Conjunto de Treino.

---

## F5 — [Média] "Rede sem treino perto de 50%" contradiz "começa errando quase tudo" e não está garantido

**Onde:** §1 Visão ("começa errando quase tudo"), UJ-3 passo 2, FR-17 (3ª consequência).

**Problema.**
- Uma rede aleatória acerta ~50%, não "erra quase tudo". As duas frases ensinam coisas diferentes.
- Com Entradas em 0..1, os neurônios ocultos saem todos perto de 0,5. Com Xavier na camada de saída (±1,1 para H = 4), a saída fica deslocada e **igual para todos os desenhos**: por exemplo, "68% gato" para tudo. Isso não é "perto de 50%" e faz a rede parecer ter uma preferência.

**Correção.** Trocar "errando quase tudo" por "chutando". Exigir Pesos iniciais da camada de saída próximos de zero. Escrever a consequência como "antes do Treinamento, toda Probabilidade fica entre 40% e 60%".

---

## F6 — [Média] O layout do Nível 2 a 1280×720 projetado não cabe, e o PRD não diz o que tem prioridade

**Onde:** §2.2 (1280×720), FR-10 (120 miniaturas), FR-11, FR-15 (até 8 mapas 20×20 e diagrama), FR-16 (2 gráficos), FR-17 (desenho grande), FR-18 (12 textos de conceito "sempre visíveis" mais textos de Hiperparâmetro), §4.11 "a turma vê as conexões, o Erro e a Acurácia mudando".

**Problema.** É impossível mostrar tudo isso legível ao mesmo tempo em 720 px de altura projetados. A turma precisa ver **ao mesmo tempo** o diagrama e as curvas (clímax de UJ-3 e UJ-4). Se o construtor puser os gráficos abaixo da dobra, o facilitador vai ficar rolando a página durante o Treinamento. A regra "sempre visível" do FR-18 também força texto pequeno, ilegível na projeção.

**Correção.** Definir uma hierarquia mínima: o que fica sempre na primeira dobra durante o Treinamento (controles de player, diagrama, os 2 gráficos, contador) e o que pode ficar abaixo (grade de 120 miniaturas, textos de conceito). Reinterpretar "sempre visível" como "não depende de hover/clique", sem exigir que esteja acima da dobra.

---

## F7 — [Média] Integrar o Nível 2 pode quebrar o Nível 1 entregue sem ninguém perceber, e não há FR de regressão

**Onde:** §6.1 ("Já entregue; nesta revisão, só ganha a aba de Nível"), FR-9, FR-2/FR-8; arquivo atual `simulador-neuronio.html`.

**Problema.** Riscos concretos observados no arquivo entregue:
- O topo já tem uma fileira de botões de Cenário (`#scenarios`, internamente `montarAbas`). As abas de Nível adicionam **uma segunda fileira de "abas"** acima, e o aluno pode confundir Nível com Cenário. O botão "Reiniciar cenário" fica ao lado de um "Reiniciar" do Treinamento com outro significado.
- A nova barra de abas empurra o diagrama para baixo. A faixa da conta (FR-5) e os controles (FR-3, FR-4) podem sair da primeira dobra a 1280×720, o que fere o SM-C1 ("nunca minimizar a conta").
- O SVG do Nível 1 usa ids fixos (`glowOn` etc.). Um segundo SVG no mesmo documento com o mesmo helper cria **ids duplicados**, e os filtros de brilho do Nível 1 podem passar a apontar para o elemento errado.
- Se o Nível 2 ganhar atalhos de teclado globais (espaço = treinar/pausar), eles colidem com o espaço que alterna as Entradas no Nível 1 (FR-2).
- O loop de animação do Nível 1 continua rodando quando a aba está oculta. O custo é pequeno, mas não está especificado.
- O `<title>` atual diz "Vai ter Churrasco?".

**Correção.** Acrescentar ao FR-9: "todas as Consequências de FR-1 a FR-8 continuam valendo depois da integração e são re-verificadas no build". Exigir ids de SVG com prefixo por Nível, atalhos de teclado restritos ao Nível ativo e diferenciação visual clara entre abas de Nível e botões de Cenário. Atualizar o `<title>`.

---

## F8 — [Média] O rótulo dos desenhos ambíguos e a "dúvida" não estão definidos

**Onde:** FR-10 (3ª consequência), FR-17 (4ª), UJ-3 edge case, addendum §2.

**Problema.**
- Um desenho "ambíguo" (orelhas meio pontudas) ainda precisa de um Rótulo. O PRD não diz se ele vem da classe que gerou o desenho ou se é sorteado. Se for sorteado, vira ruído de rótulo, e a rede é cobrada por errar o que nem um humano acerta.
- A parcela de ambíguos ("pequena") não tem número. Com 24 imagens no teste, ela decide sozinha se F1 é viável: 10% dá ~2–3 ambíguos no teste, que já consomem toda a margem entre 21 e 23 acertos.
- O PRD não diz se a divisão garante ambíguos no Conjunto de Teste. Sem isso, o edge case de UJ-3 pode simplesmente não existir com a semente escolhida.
- O Treinamento sem regularização empurra a rede para respostas de **99%** também nos ambíguos. A "dúvida perto de 50%" que o PRD promete tende a sumir justamente na execução longa do UJ-4.

**Correção.** Fixar a parcela (ex.: 10% por classe), a regra de Rótulo (a classe que gerou o desenho) e a distribuição estratificada dos ambíguos entre treino e teste. Garantir, pela semente padrão, pelo menos um ambíguo marcado entre os desenhos de demonstração. Aceitar que a dúvida perto de 50% é garantida só com os padrões, não com 200 Épocas, ou incluir no Erro uma regularização leve de Pesos.

---

## F9 — [Média] O ritmo do Treinamento e a duração da aula não fecham

**Onde:** FR-14 ("<30 s com padrões", "algumas Épocas por segundo"), FR-12 (até 200 Épocas), SM-3 (15 min para tudo).

**Problema.** No mesmo ritmo, 200 Épocas levam de ~70 s a 100 s. O roteiro do SM-3 inclui: padrão, Época a Época narrada, Learning Rate 5, Overfitting com 200 Épocas, classificação e possivelmente várias tentativas por causa de F1. Isso estoura os 15 minutos. O PRD não diz se o ritmo é fixo por Época ou por Treinamento, nem se existe um controle de velocidade.

**Correção.** Definir que o tempo total de animação é limitado (ex.: no máximo ~20 s por Treinamento, independentemente das Épocas, agrupando Épocas por quadro) ou oferecer um controle "rápido". Os cálculos são baratos (addendum §3), então só a animação limita o ritmo.

---

## F10 — [Baixa] Lacunas de execução que o construtor vai preencher por conta própria

- **Mudança de Épocas no meio do Treinamento (FR-12):** o que acontece se o novo total for menor que a Época atual? O PRD só fala em "aumentar".
- **"Treinar" depois de terminar (FR-14):** continua a partir da Época final ou exige Reiniciar?
- **Quando o teste é medido (FR-16):** presume-se que no fim de cada Época, mas não está escrito. Também não está escrito se a Época 0, antes de treinar, entra no gráfico (deveria, para o "começa no chute" aparecer).
- **"Gerar desenho novo" (FR-17, addendum §2):** "aleatório a partir da semente" é ambíguo. Se o mesmo gerador alimentar a inicialização (F1), mudar `H` muda os desenhos novos. Use fluxos de números aleatórios separados para dados, inicialização, embaralhamento e desenhos novos.
- **Erro mostrado como número (FR-16):** a entropia cruzada é ilimitada e sem unidade, então "Erro: 0,693" não diz nada para executivos. Defina uma escala com teto fixo no gráfico ou uma faixa de referência ("0,69 = chute").
- **Exibição da Probabilidade para cão (FR-17):** o Glossário define Probabilidade como "chance de ser gato". "Cão — 87%" exige mostrar o complemento; especificar.
- **Reiniciar re-sorteia a divisão treino/teste?** Presume-se que não, mas não está escrito.

---

## F11 — [Baixa] Vocabulário escapando do Glossário

O Glossário proíbe sinônimos não declarados, mas o próprio PRD usa "palpite" (UJ-3), "chance" (FR-17, "barra de chance") e "resposta" no lugar de Probabilidade e Classificação. A interface vai copiar esses termos. Também aparece "correção dos Pesos" (FR-18) sem estar no Glossário, embora seja o termo que a interface deve usar no lugar de "backpropagation". Ele deveria entrar no Glossário.

---

## Resumo das correções que destravam o build

1. Fixar a semente da inicialização e do embaralhamento, e reescrever FR-12/SM-C2 como faixa de acertos sobre 24 (ou 30) imagens numa execução determinística (F1).
2. Redefinir Overfitting pelo Erro de teste, com gatilho objetivo que não dispare na execução padrão, e desacoplar Épocas de neurônios no UJ-4 (F2).
3. Especificar como a imagem dos Pesos é exibida: inicialização pequena ou "Peso − Peso inicial", escala global (F3).
4. Fixar gradiente médio, limite no `log` e o comportamento aceito para Learning Rate 5, e dar uma consequência ao Batch Size (F4).
5. Acrescentar ao FR-9 a re-verificação de FR-1 a FR-8 (F7).
