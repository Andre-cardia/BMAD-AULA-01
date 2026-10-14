---
title: Simulador de Neurônio Artificial — Nível 1 e Nível 2
status: final
created: 2026-10-13
updated: 2026-10-14
---

# PRD: Simulador de Neurônio Artificial — Nível 1 e Nível 2

## 0. Document Purpose

Este PRD define um simulador visual e interativo para ensinar como uma rede neural funciona a um público não técnico. Ele tem dois Níveis no mesmo arquivo. O **Nível 1** mostra um único Neurônio Artificial decidindo algo do cotidiano ("Vai ter churrasco?"), com Pesos e Bias ajustados à mão. O **Nível 2** mostra uma Rede Neural pequena aprendendo sozinha a diferenciar Desenhos de cão e de gato, a partir de Exemplos.

O documento se destina a quem vai construir o artefato e a quem vai facilitar a aula de letramento em IA. O Glossário (§3) fixa o vocabulário, e as funcionalidades são agrupadas em features com Requisitos Funcionais (FRs) numerados globalmente. Detalhes técnicos de implementação (algoritmo, geração dos Desenhos, valores numéricos e plano de calibração) ficam no [addendum.md](addendum.md), não aqui.

**Histórico.** A versão de 13/10/2026 cobria só o Nível 1 e foi entregue no arquivo `simulador-neuronio.html`, validado pelo solicitante. Esta revisão (14/10/2026) faz três coisas: registra a forma visual que o Nível 1 ganhou na entrega (um diagrama animado do neurônio), acrescenta o Nível 2 e ajusta os Non-Goals (§5) que antes proibiam treinamento, redes com várias camadas e a função sigmoide. As FRs do Nível 1 mantêm a numeração original (FR-1 a FR-8); as do Nível 2 vão de FR-9 a FR-18.

## 1. Vision

O simulador é uma página HTML autônoma que roda 100% offline em um notebook, aberta por duplo clique. O Aluno é uma liderança empresarial sem background técnico, que participa de um programa de letramento em IA. A página tem dois Níveis, como fases de um jogo.

**Nível 1 — o neurônio.** Um diagrama animado mostra um único Neurônio Artificial (perceptron) decidindo um Cenário do dia a dia: "vai ter churrasco?" com base em carne, carvão e cerveja, ou "vai chover?" com base em sinais do tempo. O Aluno clica nas Entradas para ligá-las e vê o sinal viajar pelas conexões até o neurônio. Ele ajusta os Pesos (quão importante é cada fator) e o Bias (a tendência inicial) e vê, em tempo real, se a Soma Ponderada chega ao Limiar e se o neurônio dispara. A lição: uma IA "decide" somando fatores com Pesos diferentes.

**Nível 2 — o treinamento.** No Nível 1 quem escolhe os Pesos é o Aluno. No Nível 2 quem escolhe é a própria Rede Neural, olhando Exemplos. O simulador gera um conjunto de Desenhos de cães e gatos com o Rótulo certo de cada um. A Rede Neural tem uma Camada Oculta pequena e, antes de treinar, só chuta: responde perto de 50% para qualquer Desenho. O Aluno define o número de Épocas, o Learning Rate, o Batch Size e o tamanho da Camada Oculta, e então aperta "Treinar". Ele vê os Pesos da rede mudando, o Erro caindo e a Acurácia subindo, Época após Época. No fim, a rede classifica Desenhos que nunca viu, com uma Probabilidade ("87% gato").

O valor central é pedagógico. O Nível 1 torna tangíveis os quatro blocos de qualquer rede neural: Entrada, Peso, Bias e Função de Ativação. O Nível 2 desfaz os equívocos mais comuns de executivos sobre treinamento: que mais Épocas é sempre melhor, que acerto no treino é acerto no mundo real e que Learning Rate maior aprende mais rápido. O facilitador usa a ferramenta ao vivo, projetada ou em notebooks individuais, para que a liderança "brinque" com os números e sinta, na prática, como uma IA aprende. Toda demonstração é reproduzível: o que o facilitador ensaiou é exatamente o que a turma vai ver.

## 2. Target User

### 2.1 Jobs To Be Done
- Como Aluno de um programa de letramento em IA, quero manipular um caso concreto e divertido para entender o que são "peso" e "bias" sem precisar de matemática ou código.
- Como liderança empresarial, quero sair da sessão conseguindo explicar com minhas próprias palavras por que uma IA "decide" algo, usando a analogia do churrasco.
- Como liderança empresarial, quero ver uma IA aprendendo de verdade para entender o que um fornecedor quer dizer com "treinar um modelo", "épocas" ou "acurácia", e saber desconfiar de promessas fáceis.
- Como facilitador do curso, quero uma ferramenta visual, pronta para rodar em qualquer notebook sem internet, para demonstrar os conceitos ao vivo — e com a certeza de que a demonstração vai sair igual ao ensaio.

### 2.2 Non-Users
- Alunos técnicos que querem implementar ou ajustar redes neurais reais — o simulador é didático e não substitui um framework de machine learning.
- Uso em dispositivos móveis ou tablets — o produto é otimizado apenas para notebook. A tela mínima é de 1280×720; descontada a barra do navegador, a **área visível** mínima é de 1280×630 px. Todo critério de "primeira dobra" neste PRD se refere a essa área visível.

### 2.3 Key User Journeys

- **UJ-1. Carla ajusta os Pesos do churrasco e vê a IA "decidir".** *(Nível 1)*
  - **Persona + contexto:** Carla, gerente de operações, está em um workshop de letramento em IA, com o notebook aberto no simulador que o facilitador passou por pendrive/e-mail antes da aula.
  - **Estado inicial:** arquivo HTML aberto direto no navegador (duplo clique), sem login, sem internet. Nível 1 e Cenário "Vai ter Churrasco?" já selecionados por padrão.
  - **Caminho:** (1) Carla vê, no diagrama, três Entradas: "Tem carne?", "Tem carvão?", "Tem cerveja?", todas apagadas. (2) Ela clica em "Tem carne?" e "Tem carvão?", que acendem; o sinal começa a viajar pelas conexões até o neurônio. (3) Ela aumenta bem o Peso de "carne" e vê aquela conexão engrossar. (4) Ela acompanha a Soma Ponderada mudar dentro do neurônio e na faixa da conta. (5) Ela ajusta o Bias para ver o Resultado mudar de "Não vai ter churrasco" para "Vai ter churrasco" sem alterar nenhuma Entrada.
  - **Clímax:** ao mover o Bias, a saída do neurônio dispara ou apaga na hora, e Carla entende visualmente que o Bias é "a vontade inicial de fazer churrasco mesmo sem muita coisa pronta".
  - **Resolução:** Carla troca para o Cenário "Vai Chover?" (UJ-2) para confirmar que entendeu o padrão, não só memorizou um caso.
  - **Edge case:** se Carla zera todos os Pesos e o Bias, o Resultado deve continuar determinístico e mostrar claramente "Não vai ter churrasco" (Soma Ponderada = 0, abaixo do Limiar) — nunca travar ou mostrar estado indefinido.

- **UJ-2. O facilitador troca de Cenário ao vivo para reforçar o conceito.** *(Nível 1)*
  - **Persona + contexto:** o facilitador, projetando a tela para toda a sala, quer mostrar que o mesmo "motor" de neurônio funciona com qualquer conjunto de Entradas.
  - **Estado inicial:** simulador aberto no Cenário "Vai ter Churrasco?".
  - **Caminho:** (1) O facilitador escolhe o Cenário "Vai Chover?". (2) O diagrama é redesenhado com as novas Entradas ("Céu nublado?", "Vento forte?", "Previsão do app diz chuva?"), com Pesos e Bias nos valores padrão daquele Cenário. (3) O facilitador repete a demonstração de ajustar Pesos e Bias ao vivo.
  - **Clímax:** a turma percebe que a estrutura (Entrada → Peso → Soma Ponderada → Bias → Limiar → Resultado) é idêntica e só o "nome" das variáveis muda, o que reforça a generalização do conceito.
  - **Resolução:** o facilitador clica em "Reiniciar cenário" para devolver os valores padrão antes do próximo grupo ou sessão.

- **UJ-3. O facilitador treina a rede ao vivo e a turma vê a IA aprender.** *(Nível 2)*
  - **Persona + contexto:** depois do Nível 1, o facilitador pergunta à turma: "e se ninguém soubesse os Pesos certos?". Ele passa para o Nível 2 na tela projetada.
  - **Estado inicial:** Nível 2 aberto, com os Exemplos visíveis, separados em Conjunto de Treino e Conjunto de Teste, e uma Rede Neural ainda sem Treinamento.
  - **Caminho:** (1) O facilitador mostra alguns Exemplos e pede à turma que diga o que diferencia um cão de um gato. (2) Ele classifica um Desenho com a rede ainda sem treino: a Probabilidade fica perto de 50% — a rede está chutando. (3) Ele avança uma Época de cada vez e narra a mudança dos mapas de Pesos e do Erro. (4) Depois aperta "Treinar" e deixa rodar até o fim; a curva de Erro cai e a de Acurácia sobe. (5) Ele mostra o Conjunto de Teste classificado e gera Desenhos Novos para a rede classificar.
  - **Clímax:** a rede que chutava passa a acertar quase sempre Desenhos que nunca viu, com a Confiança subindo ("Gato — 93%"), e a turma entende que ninguém programou "o que é um gato" — a rede aprendeu com Exemplos.
  - **Resolução:** o facilitador passa para os experimentos de UJ-4.
  - **Edge case:** se o facilitador classifica um Desenho Ambíguo, a rede responde com Confiança mais perto de 50% e pode fazer uma Classificação Errada. O simulador mostra isso como dúvida da rede, não como falha do sistema.

- **UJ-4. Ricardo tenta "acelerar" o treinamento e descobre os limites.** *(Nível 2)*
  - **Persona + contexto:** Ricardo, diretor comercial, ouviu de um fornecedor que "é só treinar mais" e quer testar isso no próprio notebook.
  - **Estado inicial:** Nível 2 já demonstrado pelo facilitador; Ricardo reinicia o Treinamento.
  - **Caminho:** (1) Ricardo coloca o Learning Rate no máximo e treina: o Erro não desce de forma estável e termina muito acima do Erro do Treinamento padrão. (2) Volta ao Learning Rate padrão e coloca o número máximo de Épocas: o Erro de treino continua caindo, mas o Erro de teste para de cair e volta a subir. (3) Por curiosidade, aumenta os neurônios da Camada Oculta: a Acurácia de teste não melhora de forma relevante.
  - **Clímax:** Ricardo vê com os próprios olhos o Overfitting — a rede "decorou" os Exemplos de treino e ficou confiante demais nos Desenhos que não tinha visto — e entende por que a Acurácia de treino não é desempenho real e por que "mais" nem sempre é melhor.
  - **Resolução:** Ricardo sai com três perguntas para fazer ao próximo fornecedor: "qual a acurácia no teste?", "com que dados treinou?" e "como evitaram o overfitting?".

**Escala:** jornadas leves, descritas como fluxo numerado simples — adequado a uma ferramenta de ensino com um único operador por vez, sem autenticação nem navegação complexa.

## 3. Glossário

*Termos definidos uma única vez e usados literalmente no resto do documento. Sinônimos não declarados são violação de disciplina — se uma nova feature introduzir um substantivo de domínio, ele entra aqui na mesma passada. Na interface, os termos que o Aluno vai ouvir de fornecedores aparecem com o original em inglês entre parênteses na primeira menção de cada tela (ex.: "Época (epoch)"), para servir ao terceiro JTBD.*

**Comuns aos dois Níveis**

- **Aluno** — quem usa o simulador na aula: uma liderança empresarial no programa de letramento em IA. É o termo usado em todo o documento; "participante" não é usado.
- **Nível** — uma das duas partes do simulador, cada uma com sua própria tela: **Nível 1** (o neurônio, Pesos ajustados à mão) e **Nível 2** (o treinamento, Pesos aprendidos pela Rede Neural).
- **Neurônio Artificial** — unidade de cálculo que recebe uma ou mais Entradas, aplica Pesos e um Bias, soma tudo (Soma Ponderada) e passa essa soma por uma Função de Ativação para gerar uma saída.
- **Entrada (Input)** — um valor que chega ao Neurônio Artificial. No Nível 1, é um fator binário do Cenário (ex.: "Tem carne?") que o Aluno define como Sim (1) ou Não (0). No Nível 2, é a intensidade de um pixel do Desenho, entre 0 (branco) e 1 (preto), ou a saída de um neurônio da Camada Oculta.
- **Peso (Weight)** — valor numérico que representa a importância de uma Entrada para a saída. Cada Entrada de um Neurônio Artificial tem exatamente um Peso. No Nível 1 o Aluno ajusta os Pesos; no Nível 2 a Rede Neural os aprende.
- **Bias (Viés)** — valor numérico, independente das Entradas, que representa a tendência inicial do Neurônio Artificial antes de considerar qualquer Entrada. Em toda a interface e em todo este documento, o conceito é chamado de **Bias** e explicado ao Aluno como "tendência inicial"; nenhum outro sinônimo é usado.
- **Soma Ponderada** — valor obtido somando (Entrada × Peso) de cada par, mais o Bias. Fórmula: `soma = (entrada1 × peso1) + (entrada2 × peso2) + ... + bias`.
- **Função de Ativação** — regra que transforma a Soma Ponderada na saída do Neurônio Artificial. No Nível 1 é o **degrau**: se Soma Ponderada ≥ Limiar, o neurônio está "ativado"; caso contrário, "não ativado". No Nível 2 é a **sigmoide**: uma curva suave que transforma a Soma Ponderada num valor entre 0 e 1. Só a saída do Neurônio de Saída é lida como Probabilidade.

**Nível 1**

- **Limiar (Threshold)** — valor fixo de referência contra o qual a Soma Ponderada é comparada pela Função de Ativação degrau. Vale **1** e fica exposto na tela, sem ser ajustável pelo Aluno, para não multiplicar o número de variáveis sob controle dele.
- **Cenário** — um conjunto nomeado de Entradas, Pesos padrão, Bias padrão e textos de Resultado (ex.: "Vai ter Churrasco?", "Vai Chover?"). O Nível 1 inclui dois Cenários pré-definidos.
- **Resultado** — saída final do Neurônio Artificial para o Cenário atual, expressa como uma mensagem em linguagem cotidiana acompanhada de emoji (ex.: "Vai ter churrasco! 🍖" quando ativado, "Não vai ter churrasco 😞" quando não ativado), exibida junto ao valor numérico da Soma Ponderada.

**Nível 2**

- **Rede Neural** — conjunto de Neurônios Artificiais organizados em camadas, em que a saída de uma camada é a Entrada da seguinte. No Nível 2 ela tem três camadas: as Entradas (os pixels), a Camada Oculta e o Neurônio de Saída.
- **Camada Oculta** — a camada de Neurônios Artificiais entre os pixels e o Neurônio de Saída. O Aluno escolhe quantos neurônios ela tem.
- **Neurônio de Saída** — o último Neurônio Artificial da Rede Neural. Recebe as saídas da Camada Oculta e produz a Probabilidade.
- **Desenho** — uma imagem de cão ou de gato gerada pelo próprio simulador. Pode ser um Exemplo (quando pertence a um dos dois Conjuntos e tem Rótulo) ou um Desenho Novo.
- **Exemplo** — um Desenho que pertence ao Conjunto de Treino ou ao Conjunto de Teste, acompanhado do seu Rótulo.
- **Desenho Novo** — um Desenho gerado na hora, a pedido do Aluno, que não pertence a nenhum dos dois Conjuntos. O simulador sabe se ele é cão ou gato, porque foi ele quem o gerou.
- **Desenho Ambíguo** — um Desenho cujos traços ficam no meio do caminho entre cão e gato (ex.: orelhas meio pontudas). Tem Rótulo como qualquer outro, igual à classe que o gerou.
- **Rótulo** — a resposta certa de um Exemplo: "cão" ou "gato".
- **Conjunto de Treino** — os Exemplos que a Rede Neural usa para aprender. Ela vê os Rótulos deles durante o Treinamento.
- **Conjunto de Teste** — os Exemplos que a Rede Neural nunca usa para aprender. Servem para medir o desempenho em Desenhos que ela nunca viu.
- **Treinamento** — o processo em que a Rede Neural ajusta sozinha seus Pesos e Bias para reduzir o Erro no Conjunto de Treino, por meio de sucessivas Correções dos Pesos.
- **Correção dos Pesos** — cada ajuste que a Rede Neural faz nos Pesos e Bias depois de comparar suas respostas com os Rótulos. É feita de trás para frente, do Neurônio de Saída até os pixels. É o termo usado na interface; "backpropagation" e "gradiente" não aparecem na tela.
- **Época (Epoch)** — uma passada completa da Rede Neural por todos os Exemplos do Conjunto de Treino.
- **Learning Rate (taxa de aprendizado)** — o tamanho de cada Correção dos Pesos. Pequeno demais, a rede aprende devagar; grande demais, ela passa do ponto e não se estabiliza.
- **Batch Size (tamanho do lote)** — quantos Exemplos a Rede Neural olha antes de fazer cada Correção dos Pesos. Lote pequeno: muitas correções por Época, cada uma baseada em poucos Exemplos e por isso mais "nervosa". Lote grande: poucas correções por Época, mais estáveis.
- **Hiperparâmetro** — cada escolha que o Aluno faz antes do Treinamento e que a Rede Neural não aprende sozinha: número de Épocas, Learning Rate, Batch Size e número de neurônios da Camada Oculta.
- **Semente** — o número que determina todos os sorteios do simulador. Cada tipo de sorteio tem sua própria sequência, derivada da Semente: os Exemplos e a divisão treino/teste (nunca mudam), os Pesos iniciais e a ordem dos Exemplos a cada Época (mudam só com "Sortear outra rede") e os Desenhos Novos. Com a mesma Semente e os mesmos Hiperparâmetros, o Treinamento sai exatamente igual, toda vez.
- **Erro (Loss)** — a métrica que mede o quanto as respostas da Rede Neural estão longe dos Rótulos, considerando também a Confiança da resposta: errar com 99% de certeza custa muito mais que errar com 55%. Quanto menor, melhor. É medido separadamente no Conjunto de Treino e no Conjunto de Teste. Não confundir com Classificação Errada.
- **Acurácia (Accuracy)** — a porcentagem de Exemplos com Classificação Correta. Também é medida separadamente no Conjunto de Treino e no Conjunto de Teste.
- **Probabilidade** — a saída do Neurônio de Saída para um Desenho, entre 0% e 100%, lida como "chance de ser gato". A chance de ser cão é o complemento (100% menos a Probabilidade).
- **Classificação** — a resposta final da Rede Neural para um Desenho: "gato" se a Probabilidade for 50% ou mais, "cão" caso contrário. É sempre mostrada com a sua Confiança (ex.: "Gato — 87%").
- **Confiança** — a chance que a Rede Neural atribui à classe que escolheu: a própria Probabilidade, se a Classificação for "gato"; 100% menos a Probabilidade, se for "cão" (Probabilidade de gato de 13% = "Cão — 87%"). Vai de 50% a 100% e é mostrada numa barra entre cão e gato.
- **Classificação Correta / Classificação Errada** — se a Classificação coincide ou não com a classe verdadeira do Desenho (o Rótulo, num Exemplo; a classe que o gerou, num Desenho Novo). É o termo para o resultado de cada Desenho; "erro", sozinho, é reservado para a métrica.
- **Overfitting** — quando a Rede Neural "decora" o Conjunto de Treino em vez de aprender o padrão geral. O sinal observável é: o Erro de treino continua caindo enquanto o Erro de teste para de cair e volta a subir. A Acurácia de teste costuma parar de melhorar, mas é o Erro que mostra o problema com clareza.

## 4. Features

### Nível 1 — o neurônio

**Forma visual (registrada na entrega de 13/10/2026).** O Nível 1 é organizado em torno de um diagrama animado do Neurônio Artificial, que ocupa o centro da tela. Da esquerda para a direita: as Entradas como círculos clicáveis, as conexões até o neurônio (mais grossas quanto maior o Peso, em vermelho quando o Peso é negativo, com pulsos de luz viajando quando a Entrada está ligada), o Bias entrando como uma conexão própria, o corpo do neurônio com a Soma Ponderada, a Função de Ativação desenhada como um degrau com um ponto marcando onde a soma caiu, e a saída, que acende e dispara pulsos quando o neurônio é ativado. Os controles de Peso e Bias e a faixa da conta ficam abaixo do diagrama. As FRs abaixo valem dentro dessa forma.

### 4.1 Seleção de Cenário
**Descrição:** O Aluno (ou facilitador) escolhe entre Cenários pré-definidos através de um seletor visível no topo do Nível 1. Ao trocar de Cenário, o diagrama e os controles são substituídos pelos do Cenário escolhido — suas Entradas, seus Pesos padrão e seu Bias padrão — sem recarregar a página. Realiza UJ-2.

**Requisitos Funcionais:**

#### FR-1: Seleção entre Cenários pré-definidos
O Aluno pode selecionar um Cenário entre os dois Cenários pré-definidos ("Vai ter Churrasco?" e "Vai Chover?") através de um controle visível no Nível 1. Realiza UJ-2.

**Consequências (testáveis):**
- Ao clicar em um Cenário diferente do atual, a tela exibe as Entradas, Pesos e Bias padrão daquele Cenário em menos de 1 segundo (sem reload de página).
- O Cenário "Vai ter Churrasco?" está selecionado por padrão ao abrir o arquivo.
- Nenhuma configuração feita em um Cenário é levada para outro Cenário (cada troca reseta para os valores padrão daquele Cenário).

**Out of Scope:**
- Criação de Cenários customizados pelo Aluno (ver §6.2).

### 4.2 Ajuste de Entradas
**Descrição:** Cada Entrada do Cenário atual aparece no diagrama como um círculo com um rótulo em linguagem cotidiana (ex.: "Tem carne?"). O próprio círculo é o interruptor: clicar nele alterna entre Sim e Não. Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-2: Alternar valor de cada Entrada
O Aluno pode alternar cada Entrada do Cenário atual entre "Sim" (valor 1) e "Não" (valor 0) clicando no círculo da Entrada no diagrama, com o mouse ou pelo teclado. Realiza UJ-1.

**Consequências (testáveis):**
- Cada Entrada do Cenário é exibida com um rótulo em linguagem natural e um estado visível: 1/Sim (aceso) ou 0/Não (apagado).
- Alterar qualquer Entrada recalcula a Soma Ponderada e o Resultado imediatamente (sem clique em botão "calcular").
- Todas as Entradas começam em "Não" ao abrir o arquivo ou trocar o Cenário, para que o Aluno veja o efeito de ativar cada uma.

### 4.3 Ajuste de Pesos
**Descrição:** Para cada Entrada, um slider permite ajustar o Peso correspondente, rotulado como "Importância de {Entrada}". O Peso também aparece na conexão do diagrama, cuja espessura acompanha o valor. Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-3: Ajustar o Peso de cada Entrada via slider
O Aluno pode ajustar o Peso de cada Entrada do Cenário atual através de um slider numérico. Realiza UJ-1.

**Consequências (testáveis):**
- Cada Peso tem um slider com faixa visível de `-5` a `+5` e incrementos de `0,5`, permitindo Pesos negativos — um fator pode "pesar contra" o Resultado.
- Mover o slider de Peso recalcula a Soma Ponderada e o Resultado imediatamente.
- O valor numérico atual do Peso é exibido ao lado do slider e na conexão correspondente do diagrama.
- Os Pesos padrão de cada Cenário fazem com que, com todas as Entradas em "Não", o Resultado inicial seja "não ativado" (valores no addendum §7).

### 4.4 Ajuste de Bias
**Descrição:** Um slider único, separado das Entradas, permite ajustar o Bias do Cenário atual. O rótulo na interface é "Bias (tendência inicial)". No diagrama, o Bias entra no neurônio por uma conexão própria, visualmente distinta das Entradas. Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-4: Ajustar o Bias via slider
O Aluno pode ajustar o Bias do Cenário atual através de um slider numérico, visualmente distinto dos sliders de Peso. Realiza UJ-1.

**Consequências (testáveis):**
- O slider de Bias tem faixa visível de `-10` a `+10` e incrementos de `0,5` — mais ampla que a dos Pesos, pois o Bias precisa poder compensar ou reforçar várias Entradas ao mesmo tempo.
- Mover o slider de Bias recalcula a Soma Ponderada e o Resultado imediatamente.
- O valor numérico atual do Bias é exibido ao lado do slider e no diagrama.

### 4.5 Painel de Matemática (Soma Ponderada)
**Descrição:** A conta da Soma Ponderada fica sempre visível — nunca escondida em aba avançada, por decisão explícita do solicitante. O valor aparece dentro do corpo do neurônio, no diagrama, e a fórmula completa aparece numa faixa logo abaixo dele. Realiza UJ-1, UJ-2.

**Requisitos Funcionais:**

#### FR-5: Exibir a fórmula da Soma Ponderada com valores reais
O sistema exibe, a qualquer momento, a fórmula completa da Soma Ponderada com os valores atuais de cada Entrada, Peso e Bias substituídos, além do valor numérico final da soma. Realiza UJ-1, UJ-2.

**Consequências (testáveis):**
- A fórmula exibida segue o formato `(entrada1 × peso1) + (entrada2 × peso2) + ... + bias = soma`, com os números atuais substituídos nas posições de Entrada, Peso e Bias.
- O valor da Soma Ponderada é recalculado e reexibido em tempo real a cada alteração de Entrada, Peso ou Bias (mesmo ciclo de atualização de FR-2, FR-3 e FR-4).
- O Limiar é exibido junto à Soma Ponderada, com indicação visual de qual lado da comparação prevalece (ex.: "4 ≥ 1 → ATIVADO").

#### FR-6: Exibir o Resultado do Cenário
O sistema exibe, na saída do diagrama, o Resultado — mensagem em linguagem cotidiana mais emoji — correspondente ao estado atual de ativação do Neurônio Artificial. Realiza UJ-1, UJ-2.

**Consequências (testáveis):**
- Quando Soma Ponderada ≥ Limiar, exibe a mensagem de "ativado" definida pelo Cenário (ex.: "Vai ter churrasco! 🍖") com destaque visual próprio (cor verde, brilho e pulsos na saída).
- Quando Soma Ponderada < Limiar, exibe a mensagem de "não ativado" definida pelo Cenário (ex.: "Não vai ter churrasco 😞") com destaque visual distinto (saída apagada, em cinza).
- A transição entre os dois estados é visualmente perceptível no mesmo instante em que a Soma Ponderada cruza o Limiar.

### 4.6 Reinício de Cenário
**Descrição:** Um botão devolve o Cenário atual aos seus valores padrão de Entradas, Pesos e Bias, permitindo reuso em múltiplas demonstrações sem reabrir o arquivo. Realiza UJ-2.

**Requisitos Funcionais:**

#### FR-7: Reiniciar o Cenário atual
O Aluno ou facilitador pode reiniciar o Cenário atual para seus valores padrão através de um botão "Reiniciar cenário". Realiza UJ-2.

**Consequências (testáveis):**
- Ao clicar em "Reiniciar cenário", todas as Entradas, Pesos e o Bias do Cenário atual retornam aos valores padrão definidos em §4.2, §4.3 e §4.4.
- A Soma Ponderada e o Resultado são recalculados imediatamente após o reinício.

### 4.7 Apoio Didático do Nível 1
**Descrição:** Textos de apoio curtos explicam, em linguagem simples e sem jargão técnico, o que cada conceito do Nível 1 significa. Como o público é não técnico, este apoio é essencial ao objetivo pedagógico — não é cosmético.

**Requisitos Funcionais:**

#### FR-8: Explicações contextuais dos conceitos
O sistema exibe textos curtos que explicam, em linguagem acessível a um público de negócios, como o neurônio chega ao Resultado: o que fazer com as Entradas, o que significam Peso e Bias, e como a Soma Ponderada é entregue à Função de Ativação e comparada ao Limiar. Os textos não dependem de hover, clique ou foco de teclado. A escolha por texto fixo em vez de tooltip garante a leitura também quando a tela está projetada para a turma.

**Consequências (testáveis):**
- O controle de cada Peso é rotulado como "Importância de {Entrada}".
- O controle de Bias é rotulado como "Bias (tendência inicial)".
- Um texto de apoio explica que o neurônio soma tudo (a Soma Ponderada) e entrega o total à Função de Ativação, que compara com o Limiar.
- Nenhum texto de apoio depende de hover, clique ou foco de teclado para ser lido.

### Nível 2 — o treinamento

**Forma visual.** O Nível 2 segue a mesma linguagem visual do Nível 1 (fundo escuro, verde para acerto, azul e vermelho para Pesos positivos e negativos) e se organiza em três faixas. Durante o Treinamento, a turma precisa ver ao mesmo tempo os Pesos mudando e as curvas se movendo; por isso a faixa do meio, com o contador e a barra de player, fica inteira na área visível de 1280×630 px.

- **Topo:** as abas de Nível e, logo abaixo, a barra de player — Treinar, Pausar, +1 Época, Reiniciar e o contador ("Época 12 de 30").
- **Faixa do meio, em três colunas:**
  - **Exemplos:** grade compacta de miniaturas, com o Conjunto de Treino e o Conjunto de Teste separados e identificados. Depois do Treinamento, cada miniatura do Conjunto de Teste mostra uma marca de Classificação Correta ou Errada. A grade pode rolar dentro da própria coluna.
  - **A Rede:** o diagrama da Rede Neural — o Desenho atual à esquerda, os neurônios da Camada Oculta no meio (cada um com seu mapa de Pesos) e o Neurônio de Saída à direita, com a Probabilidade.
  - **O aprendizado:** as curvas de Erro e de Acurácia, treino e teste, com os valores atuais em número.
- **Faixa de baixo, em duas colunas:** os **Hiperparâmetros**, cada um com sua linha de explicação ao lado, e a **Classificação**, com o Desenho em tamanho grande e a barra de Confiança entre cão e gato.

Textos de apoio ficam ao lado do controle ou do painel a que se referem e não dependem de hover; não precisam estar todos acima da dobra. Nenhum texto do Nível 2 usa fonte menor que 14 px, para continuar legível em projeção. As FRs abaixo valem dentro dessa forma.

### 4.8 Navegação entre Níveis
**Descrição:** O topo da página tem duas abas, "Nível 1: o neurônio" e "Nível 2: o treinamento", visualmente distintas dos botões de Cenário do Nível 1 para que o Aluno não confunda as duas coisas. Cada Nível mantém seu próprio estado, para o facilitador poder voltar ao Nível 1 durante a explicação sem perder o Treinamento em andamento. Realiza UJ-3.

**Requisitos Funcionais:**

#### FR-9: Alternar entre o Nível 1 e o Nível 2 sem quebrar o Nível 1
O Aluno pode alternar entre o Nível 1 e o Nível 2 através de abas sempre visíveis no topo da página. A inclusão do Nível 2 não altera o comportamento do Nível 1. Realiza UJ-3.

**Consequências (testáveis):**
- Ao abrir o arquivo, o Nível 1 está selecionado.
- Trocar de Nível não recarrega a página e não apaga o estado do outro Nível: Entradas, Pesos e Bias do Nível 1, e Hiperparâmetros, Pesos aprendidos e curvas do Nível 2, são preservados.
- Se o Treinamento estiver rodando ao trocar para o Nível 1, ele é pausado. Ao voltar ao Nível 2, continua pausado até o Aluno apertar "Treinar".
- As abas de Nível têm aparência diferente dos botões de Cenário, e o botão "Reiniciar cenário" do Nível 1 e o botão "Reiniciar" do Treinamento nunca aparecem na mesma tela.
- **Não-regressão:** todas as Consequências de FR-1 a FR-8 continuam valendo depois da inclusão do Nível 2 e são reverificadas no build.
- Com as abas de Nível, o diagrama do neurônio e a faixa da conta do Nível 1 (FR-5) ficam inteiros na área visível de 1280×630 px. O arquivo entregue em 13/10/2026 não cumpre isso — a faixa da conta começa em ~706 px —, então o build pode compactar o layout do Nível 1 (texto de abertura, margens e altura do diagrama), desde que nenhum comportamento de FR-1 a FR-8 mude. Os controles de Peso e Bias podem ficar abaixo da dobra.
- Atalhos de teclado de um Nível não têm efeito no outro (ex.: uma tecla de Treinar/Pausar no Nível 2 não alterna Entradas no Nível 1).
- O título da página passa a ser "Simulador de Neurônio Artificial".

### 4.9 Conjunto de Exemplos
**Descrição:** O simulador gera Desenhos simplificados de cães e de gatos. Os traços que diferenciam as duas classes são visíveis para um humano (orelhas pontudas ou caídas, formato do focinho, bigodes), e há variação de tamanho, posição e ruído, além de uma parcela de Desenhos Ambíguos, para que aprender não seja trivial. Todos os sorteios usam a Semente padrão, então toda turma vê exatamente o mesmo conjunto. Fotos reais estão fora do escopo (§5): uma rede deste tamanho acertaria pouco mais que um chute em fotos, e fotos livres para redistribuição exigiriam controle de licença. Realiza UJ-3.

**Requisitos Funcionais:**

#### FR-10: Exibir os Exemplos rotulados
O sistema gera e exibe um conjunto de Exemplos de cães e gatos, cada um com seu Rótulo visível. Realiza UJ-3.

**Consequências (testáveis):**
- O conjunto tem 240 Exemplos, 120 de cada classe.
- Cada Exemplo é exibido como miniatura com seu Rótulo ("cão" ou "gato").
- 10% dos Exemplos de cada classe são Desenhos Ambíguos. Um humano consegue classificar corretamente, só de olhar, ao menos 90% dos Exemplos que não são ambíguos.
- O Rótulo de um Desenho Ambíguo é sempre a classe que o gerou, nunca sorteado.
- Os Exemplos são gerados pelo próprio arquivo, sem imagens externas, sem upload e sem internet.

#### FR-11: Separar o Conjunto de Treino do Conjunto de Teste
O sistema divide os Exemplos em Conjunto de Treino e Conjunto de Teste e mostra claramente a que conjunto cada Exemplo pertence. Realiza UJ-3, UJ-4.

**Consequências (testáveis):**
- A divisão é de 180 Exemplos no Conjunto de Treino e 60 no Conjunto de Teste, com as duas classes balanceadas e os Desenhos Ambíguos distribuídos proporcionalmente nos dois conjuntos.
- A divisão é fixa: "Reiniciar" e "Sortear outra rede" não mudam quais Exemplos estão em cada conjunto.
- Nenhum Exemplo do Conjunto de Teste é usado na Correção dos Pesos.
- Um texto de apoio explica por que o Conjunto de Teste existe: medir o desempenho em Desenhos que a rede nunca viu.

### 4.10 Hiperparâmetros
**Descrição:** Antes de treinar, o Aluno escolhe os Hiperparâmetros através de controles compactos, cada um com o valor atual e uma linha de explicação ao lado. Os valores padrão produzem um Treinamento bem-sucedido, que a turma vê dar certo antes de começar a experimentar. Com a Semente padrão, todo resultado descrito abaixo é determinístico: sai igual em todo ensaio e em toda turma. Realiza UJ-3, UJ-4.

**O que cada controle permite em cada estado do Treinamento:**

| Controle | Sem Treinamento | Rodando | Pausado | Concluído |
|---|---|---|---|---|
| Épocas | livre | só aumentar | aumentar ou diminuir até a Época atual | aumentar (e "Treinar" continua) |
| Learning Rate | livre | bloqueado | bloqueado | muda e reinicia, com aviso |
| Batch Size | livre | bloqueado | bloqueado | muda e reinicia, com aviso |
| Neurônios da Camada Oculta | livre | bloqueado | bloqueado | muda e reinicia, com aviso |

"Muda e reinicia, com aviso" significa: o controle aceita o novo valor, a tela avisa em uma frase que o Treinamento recomeça do zero, e a rede volta ao estado sem Treinamento com os novos Hiperparâmetros.

**Requisitos Funcionais:**

#### FR-12: Ajustar Épocas, Learning Rate e Batch Size
O Aluno pode ajustar o número de Épocas, o Learning Rate e o Batch Size, conforme a tabela de estados acima. Realiza UJ-3, UJ-4.

**Consequências (testáveis):**
- Cada um dos três controles tem faixa visível e o valor atual em formato brasileiro (vírgula decimal): Épocas de 1 a 200; Learning Rate e Batch Size em degraus fixos definidos no addendum §4.
- **Treinamento padrão** (todos os Hiperparâmetros e a Semente no padrão): o Erro de treino fica abaixo da linha "chute" (FR-16) até a Época 5; ao final, a Acurácia no Conjunto de Teste fica entre 52 e 59 Classificações Corretas em 60 — acima de 85% e abaixo de 100% —, e o aviso de Overfitting de FR-18 não aparece em nenhuma Época.
- **Learning Rate no máximo** (demais no padrão): o Erro de treino final fica pelo menos 2 vezes acima do Erro de treino final do Treinamento padrão, e o aviso de Overfitting de FR-18 não aparece. Em nenhuma configuração Erro, Acurácia ou Probabilidade aparecem como "NaN" ou "Infinito".
- **Épocas no máximo** (demais no padrão): o Erro de treino final é menor que o Erro de treino na Época em que o Erro de teste atingiu o seu mínimo, e o Erro de teste final fica pelo menos 20% acima desse mínimo — o Overfitting de UJ-4. O aviso de FR-18 aparece. `[NOTE FOR PM: este é o item de maior risco de calibração; ver o plano no addendum §4.]`
- **Batch Size máximo** (demais no padrão): o Erro de treino final fica pelo menos 2 vezes acima do Erro de treino final do Treinamento padrão, porque a rede fez só uma Correção dos Pesos por Época, em vez de nove. Batch Size 1 não tem promessa de resultado; serve para mostrar que muitas correções pequenas também funcionam.

#### FR-13: Escolher o número de neurônios da Camada Oculta
O Aluno pode escolher quantos neurônios a Camada Oculta tem, conforme a tabela de estados acima. Realiza UJ-4.

**Consequências (testáveis):**
- O controle vai de 1 a 8 neurônios, com padrão 4.
- Mudar o número de neurônios redesenha o diagrama da rede, com um mapa de Pesos por neurônio.
- Com 1 neurônio, a rede ainda aprende: a Acurácia de teste no fim fica acima de 70%.
- Com 8 neurônios (demais no padrão), a Acurácia de teste no fim não supera a do Treinamento padrão em mais de 3 Classificações Corretas — mais neurônios não garantem resultado melhor. `[ASSUMPTION: verificado na calibração; se não se sustentar, o texto de UJ-4 passo 3 é ajustado, não o modelo.]`

### 4.11 Treinamento ao vivo
**Descrição:** O Aluno controla o Treinamento como um player: treinar, pausar, avançar uma Época e reiniciar. Enquanto a rede treina, o diagrama da Rede Neural mostra os mapas de Pesos e as conexões mudando, no mesmo estilo visual do Nível 1. O ritmo é deliberadamente lento para a turma acompanhar, mas com duração total limitada, para caber na aula. Realiza UJ-3, UJ-4.

**Requisitos Funcionais:**

#### FR-14: Controlar o Treinamento
O Aluno pode iniciar, pausar, avançar uma Época por vez e reiniciar o Treinamento. Realiza UJ-3, UJ-4.

**Consequências (testáveis):**
- "Treinar" roda as Épocas em sequência até o número escolhido e então para sozinho. Se o Treinamento estiver concluído e o Aluno aumentar as Épocas, "Treinar" continua a partir da Época em que parou.
- "Pausar" interrompe ao fim da Época atual; retomar continua do ponto em que parou.
- "+1 Época" executa exatamente uma Época e atualiza todas as visualizações.
- "Reiniciar" volta a rede ao estado sem Treinamento usando a **mesma Semente**: repetir o Treinamento com os mesmos Hiperparâmetros produz exatamente as mesmas curvas e as mesmas Classificações.
- Um botão "Sortear outra rede", separado de "Reiniciar", troca a Semente dos Pesos iniciais e da ordem dos Exemplos (não os Exemplos), para quem quiser mostrar que redes diferentes aprendem de forma parecida, mas não idêntica. Um botão "Voltar à Semente padrão" desfaz isso.
- Um contador mostra a Época atual e o total (ex.: "Época 12 de 30").
- Qualquer Treinamento completo dura no máximo 25 segundos de animação, independentemente do número de Épocas: com muitas Épocas, várias são calculadas por quadro. Com os valores padrão, dura entre 8 e 15 segundos, para a turma acompanhar.
- O Treinamento roda sem travar a página nas duas últimas versões de Chrome, Edge, Firefox e Safari.

#### FR-15: Visualizar a Rede Neural aprendendo
O sistema exibe um diagrama da Rede Neural — o Desenho atual, a Camada Oculta e o Neurônio de Saída — cujos Pesos aparecem e se atualizam a cada Época. Realiza UJ-3.

**Consequências (testáveis):**
- Os 400 pixels de Entrada não são desenhados como 400 conexões. Cada neurônio da Camada Oculta mostra um mapa 20×20 que indica **o quanto cada Peso mudou desde o início do Treinamento**: em azul, os pixels que empurram para "gato"; em vermelho, os que empurram para "cão". O texto de apoio diz exatamente isso, sem prometer que cada neurônio "procura um traço".
- Os mapas usam uma escala de cor única e fixa para todos os neurônios e para todo o Treinamento. Antes de treinar, todos os mapas aparecem neutros, sem cor.
- Depois do Treinamento padrão, em pelo menos metade dos mapas, a mudança média dos Pesos nas regiões de orelha e de focinho é ao menos 3 vezes maior que no fundo. O PRD não promete que neurônios diferentes aprendam traços diferentes.
- As conexões entre a Camada Oculta e o Neurônio de Saída mostram o sinal (cor) e a força (espessura) de cada Peso, com a mesma linguagem visual do Nível 1.

### 4.12 Acompanhamento do aprendizado
**Descrição:** Gráficos mostram, Época após Época, o Erro e a Acurácia nos dois conjuntos, lado a lado. É aqui que a turma vê o aprendizado acontecer e o Overfitting aparecer. Realiza UJ-3, UJ-4.

**Requisitos Funcionais:**

#### FR-16: Exibir as curvas de Erro e de Acurácia
O sistema exibe, atualizando a cada Época, as curvas de Erro e de Acurácia do Conjunto de Treino e do Conjunto de Teste. Realiza UJ-3, UJ-4.

**Consequências (testáveis):**
- As duas métricas são medidas nos dois conjuntos ao fim de cada Época, e também antes da primeira Época (Época 0), para o gráfico mostrar de onde a rede partiu.
- As curvas de treino e de teste aparecem no mesmo gráfico, com cores distintas e legenda.
- O gráfico de Erro tem escala com teto fixo e uma linha de referência marcada "chute", no valor do Erro de uma rede que responde 50% para tudo.
- Os valores atuais de Erro e Acurácia de cada conjunto aparecem também como número, em formato brasileiro (ex.: "Acurácia no teste: 91,7%").
- As curvas são apagadas ao reiniciar o Treinamento.

### 4.13 Classificação de Desenhos
**Descrição:** A qualquer momento — antes, durante ou depois do Treinamento — o Aluno pode pedir à Rede Neural que classifique um Desenho. A resposta é a Classificação com sua Confiança, para a turma ver a rede "em dúvida" e não só certa ou errada. Realiza UJ-3.

**Requisitos Funcionais:**

#### FR-17: Classificar um Desenho com Probabilidade
O Aluno pode escolher um Exemplo do Conjunto de Teste, ou gerar um Desenho Novo, e ver a Classificação da Rede Neural com sua Confiança. Realiza UJ-3.

**Consequências (testáveis):**
- A resposta mostra o Desenho em tamanho grande, a Classificação com sua Confiança (ex.: "Gato — 87%") e a barra entre cão e gato.
- Para Exemplos do Conjunto de Teste e para Desenhos Novos, a tela mostra a classe verdadeira e indica se a Classificação foi Correta ou Errada.
- Antes do Treinamento, a Probabilidade de qualquer Desenho fica entre 40% e 60%.
- Depois do Treinamento padrão, ao menos 48 dos 60 Exemplos do Conjunto de Teste têm Classificação Correta com Confiança acima de 80%.
- Um Desenho Ambíguo pode resultar em Confiança mais perto de 50% ou em Classificação Errada; o simulador apresenta isso como dúvida da rede, nunca como falha do sistema. A Semente padrão garante ao menos um Desenho Ambíguo no Conjunto de Teste.
- O Conjunto de Teste pode ser visto inteiro, com a marca de Classificação Correta ou Errada em cada miniatura.

### 4.14 Apoio Didático do Nível 2
**Descrição:** Como no Nível 1, textos curtos explicam cada conceito do Nível 2 em linguagem de negócios, ao lado do controle ou do painel a que se referem. Além disso, a tela relaciona o Nível 2 ao Nível 1 — "cada neurônio aqui faz a mesma conta do Nível 1; a diferença é quem escolhe os Pesos" — e combate os equívocos comuns de executivos sobre treinamento. Realiza UJ-3, UJ-4.

**Requisitos Funcionais:**

#### FR-18: Explicar os conceitos e os equívocos do treinamento
O sistema exibe, sem depender de hover, clique ou foco de teclado, um texto curto para cada conceito do Nível 2 (Exemplo, Rótulo, Conjunto de Treino, Conjunto de Teste, Época, Learning Rate, Batch Size, Camada Oculta, Erro, Acurácia, Probabilidade e Overfitting), em linguagem acessível a um público de negócios. Realiza UJ-3, UJ-4.

**Consequências (testáveis):**
- Cada controle de Hiperparâmetro tem um texto de apoio de uma ou duas frases, sem fórmulas.
- A tela deixa explícito que cada neurônio do Nível 2 faz a mesma conta do Nível 1, mas com a Função de Ativação sigmoide e com os Pesos aprendidos.
- **Aviso de Overfitting:** aparece quando, por 5 Épocas seguidas, o Erro de teste fica pelo menos 10% acima do seu próprio mínimo **e** o Erro de treino fica a no máximo 5% do seu próprio mínimo — ou seja, a rede continua melhorando no treino enquanto piora no teste. O aviso nomeia o Overfitting e explica em uma frase o que está acontecendo. Não aparece no Treinamento padrão nem com Learning Rate no máximo; aparece com Épocas no máximo.
- Um texto lembra que Desenhos simples são mais fáceis que fotos reais, e que fotos exigem redes muito maiores e muito mais Exemplos.
- A interface nunca usa os termos "backpropagation", "gradiente" ou "função de custo"; usa "Erro" e "Correção dos Pesos".

## 5. Non-Goals (Explicit)

**Nos dois Níveis**
- Este produto não persiste dados entre sessões — sem salvar, exportar ou compartilhar configurações, Pesos aprendidos ou resultados. Decisão explícita do solicitante.
- Este produto não é otimizado para dispositivos móveis ou tablets — apenas notebook.
- Este produto não requer, em nenhum momento, conexão com a internet, backend, servidor, login ou conta de usuário.

**Nível 1**
- O Nível 1 não tem Treinamento: todos os ajustes de Peso e Bias são manuais, feitos pelo Aluno. O Treinamento existe só no Nível 2.
- O Nível 1 não usa Função de Ativação sigmoide ou probabilística — apenas o degrau com Limiar fixo, por ser mais didático para o primeiro contato. Decisão explícita do solicitante.
- O Nível 1 não oferece criação de Cenários customizados pelo Aluno — apenas os Cenários pré-definidos pelo autor do curso.

**Nível 2**
- O Nível 2 não treina nem classifica fotos reais, não aceita upload de imagens e não usa a webcam. Usa apenas Desenhos gerados pelo próprio simulador.
- O Nível 2 não é um framework de machine learning: tem uma única Camada Oculta, uma única arquitetura e um único problema (cão ou gato). Redes convolucionais, várias Camadas Ocultas e outros problemas de classificação estão fora do escopo.
- O Nível 2 não deixa o Aluno desenhar o próprio cão ou gato para classificar. `[NOTE FOR PM: candidato natural para uma próxima versão, se a turma pedir.]`

*Mudança em relação à versão de 13/10/2026: os Non-Goals "sem rede multicamada", "sem treinamento automático (sem backpropagation)" e "sem sigmoide" valiam para o produto inteiro e agora valem só para o Nível 1. O Nível 2 tem as três coisas por decisão explícita do solicitante.*

## 6. MVP Scope

### 6.1 In Scope
- Um único arquivo HTML autônomo — a evolução do `simulador-neuronio.html` já entregue —, com HTML, CSS e JS inline, aberto por duplo clique, sem instalação e sem internet, com os dois Níveis.
- **Nível 1:** dois Cenários pré-definidos — "Vai ter Churrasco?" (Entradas: carne, carvão, cerveja) e "Vai Chover?" (Entradas: "Céu nublado?", "Vento forte?", "Previsão do app diz chuva?") — com o diagrama animado e todas as FRs de FR-1 a FR-8. Já entregue; nesta revisão, ganha a aba de Nível e precisa continuar funcionando igual (FR-9).
- **Nível 2:** abas de Nível, 240 Exemplos de cães e gatos rotulados, divisão fixa em treino e teste, quatro Hiperparâmetros, Treinamento ao vivo e reproduzível com controles de player, diagrama da Rede Neural com mapas de Pesos, curvas de Erro e Acurácia, Classificação com Probabilidade e apoio didático — FR-9 a FR-18.
- Visual consistente entre os Níveis, pensado para leitura em sala de aula, incluindo projeção.

### 6.2 Out of Scope for MVP
- Criação de Cenários customizados pelo Aluno no Nível 1 — adiado. `[NOTE FOR PM: solicitante mencionou interesse em "o aluno montar como quiser"; o Nível 2 foi priorizado na frente.]`
- O Aluno desenhar o próprio cão ou gato para a rede classificar — adiado (ver §5).
- Fotos reais, upload ou webcam no Nível 2 — fora de escopo (ver §5).
- Mais de uma Camada Oculta, outras Funções de Ativação (ReLU, tanh) e outros problemas de classificação além de cão e gato.
- Salvamento ou exportação de configurações, Pesos aprendidos e resultados.
- Suporte formal a mobile e tablet.

## 7. Success Metrics

**Primárias**
- **SM-1**: Clareza pedagógica do Nível 1 — o facilitador consegue demonstrar os quatro conceitos (Entrada, Peso, Bias, Função de Ativação) em uma única sessão de até 10 minutos, sem precisar de slide de apoio adicional. Valida FR-1 a FR-8.
- **SM-2**: Clareza pedagógica do Nível 2 — numa sessão de até 15 minutos, o facilitador consegue mostrar a rede aprendendo do zero e reproduzir ao vivo os três equívocos: Learning Rate alto demais, Overfitting com muitas Épocas e a diferença entre Acurácia de treino e de teste. A demonstração sai igual ao ensaio. Valida FR-9 a FR-17.

**Secundárias**
- **SM-3**: Autossuficiência de uso — no Nível 1, qualquer Aluno consegue começar a interagir sem instrução prévia, apenas lendo os textos de apoio. No Nível 2, depois da demonstração do facilitador, o Aluno consegue repetir sozinho ao menos um dos experimentos de UJ-4. Valida FR-8, FR-18.
- **SM-4**: Transferência para o trabalho — ao fim do Nível 2, o Aluno consegue formular ao menos uma pergunta crítica a um fornecedor de IA sobre dados de treino, Conjunto de Teste ou Overfitting. Valida FR-11, FR-16, FR-18.

**Contramétricas (não otimizar)**
- **SM-C1**: Simplicidade visual às custas da matemática — a conta da Soma Ponderada (FR-5) nunca deve ser removida ou minimizada em nome de deixar a tela "mais bonita", pois isso anularia o valor pedagógico central do Nível 1. Contrabalança SM-1 e SM-3.
- **SM-C2**: Acurácia perfeita — o conjunto de Exemplos e os Hiperparâmetros padrão não devem ser calibrados para que a rede chegue a 60 de 60 no teste. As Classificações Erradas, a dúvida perto de 50% e o Overfitting são parte da lição; esconder isso ensinaria justamente o equívoco que o Nível 2 deve desfazer. Contrabalança SM-2.

*Métricas qualitativas e informais, adequadas ao caráter interno e educacional do projeto. Não há instrumentação nem analytics, já que o produto roda offline e sem backend.*

## 8. Open Questions

Perguntas da versão de 13/10/2026, todas resolvidas:

1. ~~Quais são as Entradas, os Pesos padrão e o Bias padrão do Cenário "Vai Chover?"~~ — Resolvido: Entradas no §6.1, valores no addendum §7.
2. ~~Haverá mais de dois Cenários no Nível 1?~~ — Resolvido: fechado em dois Cenários; Cenários adicionais ficaram para depois (ver §6.2).
3. ~~Textos de apoio em tooltip ou sempre visíveis?~~ — Resolvido: nunca dependem de hover (FR-8, FR-18).
4. ~~Existe data ou horário específico da aula?~~ — Resolvido: não há data fixa; a prioridade é entregar o quanto antes.

Perguntas desta revisão, todas resolvidas:

5. ~~Fotos reais ou Desenhos gerados?~~ — Resolvido: Desenhos gerados pelo simulador (§4.9).
6. ~~Um neurônio só ou uma rede com Camada Oculta?~~ — Resolvido: Rede Neural com uma Camada Oculta, de tamanho escolhido pelo Aluno (FR-13); o Non-Goal de multicamadas passou a valer só para o Nível 1.
7. ~~Degrau ou Probabilidade no Nível 2?~~ — Resolvido: Probabilidade, com a sigmoide (§3).
8. ~~Mesmo arquivo ou arquivo separado?~~ — Resolvido: mesmo arquivo, com abas de Nível (FR-9).
9. ~~Como a tela do Nível 2 se organiza?~~ — Resolvido: layout em três faixas aprovado pelo solicitante (Forma visual do Nível 2, §4).
10. ~~Como garantir que a demonstração saia igual ao ensaio?~~ — Resolvido: Semente fixa para todos os sorteios (§3, FR-14).

**Risco aberto, não bloqueante:** a calibração simultânea de FR-12 (Treinamento padrão bem-sucedido, Learning Rate máximo e Overfitting com Épocas máximas) e de SM-C2. O build começa por ela, com a ordem de prioridade e o critério de parada definidos no addendum §4.

## 9. Assumptions Index

**Aceitas na versão de 13/10/2026** — incorporadas ao texto como requisitos:
- §2.2 — Resolução mínima de notebook (~1280×720), sem otimização para telas menores.
- §3 — Limiar fixo em 1 no Nível 1, visível e não ajustável.
- FR-2 — Todas as Entradas do Nível 1 começam em "Não".
- FR-3 — Faixa de Peso de -5 a +5, incrementos de 0,5; Pesos padrão que deixam o Resultado inicial "não ativado".
- FR-4 — Faixa de Bias de -10 a +10, incrementos de 0,5.

**Novas nesta revisão** — nenhuma bloqueia o build:
- FR-13 — Com 8 neurônios, a Acurácia de teste não supera a do padrão em mais de 3 Classificações Corretas. **Padrão do build, verificado na calibração;** se não se sustentar, ajusta-se o texto de UJ-4, não o modelo.
- Addendum §4 — Valores padrão dos Hiperparâmetros, quantidade de ruído e parcela de Desenhos Ambíguos. **Padrão do build;** o build pode recalibrá-los sem nova aprovação, desde que as Consequências de FR-10 a FR-18 continuem valendo. Mudar a quantidade de Exemplos (FR-10) ou a divisão treino/teste (FR-11) exige voltar ao solicitante.
- §3 — Termos em inglês entre parênteses na primeira menção de cada tela. **Padrão do build, confirmar depois.**
