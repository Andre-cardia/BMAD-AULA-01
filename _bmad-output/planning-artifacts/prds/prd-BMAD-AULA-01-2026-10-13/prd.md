---
title: Simulador de Neurônio Artificial — "Vai ter Churrasco?"
status: final
created: 2026-10-13
updated: 2026-10-13
---

# PRD: Simulador de Neurônio Artificial — "Vai ter Churrasco?"

## 0. Document Purpose

Este PRD define um simulador visual e interativo de um Neurônio Artificial único. O objetivo é ensinar os princípios básicos de uma rede neural — Entrada, Peso, Bias e Função de Ativação — a um público não-técnico, por meio de Cenários lúdicos do cotidiano.

O documento se destina a duas audiências: quem vai construir o artefato (desenvolvimento direto, sem fase de arquitetura separada, dado o prazo apertado) e quem vai facilitar a aula de letramento em IA. A estrutura segue o padrão BMad: o Glossário (§3) fixa o vocabulário, e as funcionalidades são agrupadas em features com Requisitos Funcionais (FRs) numerados globalmente. Não há inputs prévios — nem brief, nem pesquisa, nem protótipo. Este PRD nasce diretamente da conversa de descoberta com o solicitante.

## 1. Vision

O "Vai ter Churrasco?" é uma página HTML autônoma que roda 100% offline em um notebook. Ela simula o funcionamento de um único Neurônio Artificial (perceptron) através de Cenários do dia a dia: decidir se "vai ter churrasco" com base em carne, carvão e cerveja disponíveis, ou se "vai chover" com base em sinais do tempo.

O aluno é uma liderança empresarial sem background técnico, participando de um programa de letramento em IA. Ele manipula diretamente três coisas: as Entradas (presença ou ausência de cada fator), os Pesos (quão importante é cada fator) e o Bias (a tendência inicial do neurônio). Os controles são visuais e simples — toggles e sliders. A cada ajuste, a tela mostra em tempo real duas camadas de informação: o Resultado lúdico ("Vai ter churrasco! 🍖" ou "Não vai ter churrasco 😞") e a matemática por trás dele (a Soma Ponderada e sua comparação com o Limiar).

O valor central é pedagógico: tornar tangível, em poucos minutos e sem jargão, os quatro blocos conceituais que sustentam qualquer rede neural — Entrada, Peso, Bias, Função de Ativação. A metáfora do churrasco faz esse trabalho porque todo brasileiro a entende instintivamente. O facilitador usa a ferramenta ao vivo, projetada ou em notebooks individuais, para que a liderança "brinque" com os números e sinta, na prática, por que um neurônio "liga" ou "desliga".

## 2. Target User

### 2.1 Jobs To Be Done
- Como participante de um programa de letramento em IA, quero manipular um exemplo concreto e divertido para entender o que são "peso" e "bias" sem precisar de matemática ou código.
- Como liderança empresarial, quero sair da sessão conseguindo explicar com minhas próprias palavras por que uma IA "decide" algo, usando a analogia do churrasco.
- Como facilitador do curso, quero uma ferramenta visual, pronta para rodar em qualquer notebook sem internet, para demonstrar o conceito ao vivo durante a aula.

### 2.2 Non-Users (v1)
- Alunos técnicos buscando implementar redes neurais multicamadas, backpropagation ou treinamento real — fora do escopo (ver §5 Non-Goals).
- Uso em dispositivos móveis/tablet — v1 é otimizado apenas para notebook. `[ASSUMPTION: resolução mínima de notebook ~1280x720; não há otimização para telas menores.]`

### 2.3 Key User Journeys

- **UJ-1. Carla ajusta os Pesos do churrasco e vê a IA "decidir".**
  - **Persona + contexto:** Carla, gerente de operações, está em um workshop de letramento em IA, com o notebook aberto no simulador que o facilitador passou por pendrive/e-mail antes da aula.
  - **Estado inicial:** arquivo HTML aberto direto no navegador (duplo clique), sem login, sem internet. Cenário "Vai ter Churrasco?" já selecionado por padrão.
  - **Caminho:** (1) Carla vê três Entradas: "Tem carne?", "Tem carvão?", "Tem cerveja?", cada uma com um toggle Sim/Não. (2) Ela ativa "Tem carne? Sim" e "Tem carvão? Sim", deixa "Tem cerveja? Não". (3) Ela observa os sliders de Peso ao lado de cada Entrada e aumenta o Peso de "carne" bem alto. (4) Ela olha o painel de matemática, que mostra a Soma Ponderada sendo recalculada em tempo real. (5) Ela ajusta o slider de Bias para ver o Resultado mudar de "Não vai ter churrasco" para "Vai ter churrasco" sem alterar nenhuma Entrada.
  - **Climax:** ao mover o slider de Bias, o Resultado muda instantaneamente (emoji e mensagem), e Carla entende visualmente que o Bias é "a vontade inicial de fazer churrasco mesmo sem muita coisa pronta".
  - **Resolução:** Carla troca para o Cenário "Vai Chover?" (UJ-2) para confirmar que entendeu o padrão, não só memorizou um exemplo.
  - **Edge case:** se Carla zera todos os Pesos e o Bias, o Resultado deve continuar determinístico e mostrar claramente "Não vai ter churrasco" (Soma Ponderada = 0, abaixo do Limiar) — nunca travar ou mostrar estado indefinido.

- **UJ-2. O facilitador troca de Cenário ao vivo para reforçar o conceito.**
  - **Persona + contexto:** o facilitador, projetando a tela para toda a sala, quer mostrar que o mesmo "motor" de neurônio funciona com qualquer conjunto de Entradas.
  - **Estado inicial:** simulador aberto no Cenário "Vai ter Churrasco?".
  - **Caminho:** (1) Facilitador clica no seletor de Cenário e escolhe "Vai Chover?". (2) Os controles na tela são substituídos pelos do novo Cenário — novas Entradas (ex.: "Céu nublado?", "Vento forte?", "Previsão do app diz chuva?"), com Pesos e Bias nos valores padrão daquele Cenário. (3) Facilitador repete a demonstração de ajustar Pesos e Bias ao vivo.
  - **Climax:** a turma percebe que a estrutura (Entrada → Peso → Soma Ponderada → Bias → Limiar → Resultado) é idêntica, só o "nome" das variáveis muda — reforçando a generalização do conceito.
  - **Resolução:** facilitador clica em "Reiniciar cenário" para devolver os valores padrão antes do próximo grupo/sessão.

**Escala:** jornadas leves, descritas como fluxo numerado simples — adequado a uma ferramenta de ensino com um único operador por vez, sem autenticação nem navegação complexa.

## 3. Glossário

*Termos definidos uma única vez e usados literalmente no resto do documento. Sinônimos não declarados são violação de disciplina — se uma nova feature introduzir um substantivo de domínio, ele entra aqui na mesma passada.*

- **Neurônio Artificial** — unidade de cálculo que recebe uma ou mais Entradas, aplica Pesos e um Bias, soma tudo (Soma Ponderada) e passa essa soma por uma Função de Ativação para gerar um Resultado.
- **Entrada (Input)** — um fator binário do Cenário (ex.: "Tem carne?") que o aluno define como Sim (1) ou Não (0).
- **Peso (Weight)** — valor numérico ajustável pelo aluno que representa a importância de uma Entrada específica para o Resultado. Cada Entrada tem exatamente um Peso associado.
- **Bias (Viés)** — valor numérico ajustável pelo aluno, independente das Entradas, que representa a tendência inicial do Neurônio Artificial antes de considerar qualquer Entrada. Em toda a interface e em todo este documento, o conceito é chamado de **Bias** e explicado ao aluno como "tendência inicial"; nenhum outro sinônimo é usado.
- **Soma Ponderada** — valor obtido somando (Entrada × Peso) de cada par, mais o Bias. Fórmula: `soma = (entrada1 × peso1) + (entrada2 × peso2) + ... + bias`.
- **Limiar (Threshold)** — valor fixo de referência contra o qual a Soma Ponderada é comparada pela Função de Ativação para decidir o Resultado. `[ASSUMPTION: Limiar fixo e visível, não ajustável pelo aluno no v1, para não multiplicar o número de variáveis sob controle do aluno — mas exposto na tela para fins didáticos.]`
- **Função de Ativação** — regra que transforma a Soma Ponderada em um Resultado binário: se Soma Ponderada ≥ Limiar, o Neurônio Artificial está "ativado"; caso contrário, "não ativado".
- **Cenário** — um conjunto nomeado de Entradas, Pesos padrão, Bias padrão e textos de Resultado (ex.: "Vai ter Churrasco?", "Vai Chover?"). O v1 inclui dois Cenários pré-definidos.
- **Resultado** — saída final do Neurônio Artificial para o Cenário atual, expressa como uma mensagem em linguagem cotidiana acompanhada de emoji (ex.: "Vai ter churrasco! 🍖" quando ativado, "Não vai ter churrasco 😞" quando não ativado), exibida junto ao valor numérico da Soma Ponderada.

## 4. Features

### 4.1 Seleção de Cenário
**Descrição:** O aluno (ou facilitador) escolhe entre Cenários pré-definidos através de um seletor visível (abas ou menu dropdown) no topo da página. Ao trocar de Cenário, os controles na tela são substituídos pelos do Cenário escolhido — suas Entradas, seus Pesos padrão e seu Bias padrão — sem recarregar a página. Realiza UJ-2.

**Requisitos Funcionais:**

#### FR-1: Seleção entre Cenários pré-definidos
O aluno pode selecionar um Cenário entre os dois Cenários pré-definidos ("Vai ter Churrasco?" e "Vai Chover?") através de um controle visível na tela principal. Realiza UJ-2.

**Consequências (testáveis):**
- Ao clicar em um Cenário diferente do atual, a tela exibe as Entradas, Pesos e Bias padrão daquele Cenário em menos de 1 segundo (sem reload de página).
- O Cenário "Vai ter Churrasco?" está selecionado por padrão ao abrir o arquivo HTML.
- Nenhuma configuração feita em um Cenário é levada para outro Cenário (cada troca reseta para os valores padrão daquele Cenário).

**Out of Scope:**
- Criação de Cenários customizados pelo aluno (ver §6.2).

### 4.2 Ajuste de Entradas
**Descrição:** Para cada Entrada do Cenário atual, o aluno vê um controle de alternância (toggle Sim/Não) com um rótulo claro em linguagem cotidiana (ex.: "Tem carne?"). Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-2: Alternar valor de cada Entrada
O aluno pode alternar cada Entrada do Cenário atual entre "Sim" (valor 1) e "Não" (valor 0) através de um toggle visual. Realiza UJ-1.

**Consequências (testáveis):**
- Cada Entrada do Cenário é exibida com um rótulo em linguagem natural e um toggle Sim/Não.
- Alterar o toggle de qualquer Entrada recalcula a Soma Ponderada e o Resultado imediatamente (sem clique em botão "calcular").
- O estado inicial de cada Entrada ao carregar ou trocar o Cenário é definido pelo próprio Cenário (`[ASSUMPTION: todas as Entradas começam em "Não", para que o aluno veja o efeito de ativar cada uma, uma a uma.]`).

### 4.3 Ajuste de Pesos
**Descrição:** Ao lado de cada Entrada, um slider permite ajustar o Peso correspondente, rotulado como "Importância de {Entrada}". Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-3: Ajustar o Peso de cada Entrada via slider
O aluno pode ajustar o Peso de cada Entrada do Cenário atual através de um slider numérico. Realiza UJ-1.

**Consequências (testáveis):**
- Cada Peso tem um slider com faixa visível de `-5` a `+5` e incrementos de `0.5` (`[ASSUMPTION: faixa e passo escolhidos para permitir Pesos negativos — ensinando que um fator pode "pesar contra" o Resultado — sem exigir precisão decimal fina.]`).
- Mover o slider de Peso recalcula a Soma Ponderada e o Resultado imediatamente.
- O valor numérico atual do Peso é exibido ao lado do slider (ex.: "Peso: 2.5").
- Cada Cenário define Pesos padrão adequados à sua primeira demonstração (`[ASSUMPTION: Pesos padrão definidos de forma que, com as Entradas padrão (todas em "Não"), o Resultado inicial seja "não ativado", para que o aluno veja a transição ao ativar Entradas.]`).

### 4.4 Ajuste de Bias
**Descrição:** Um slider único, separado das Entradas, permite ajustar o Bias do Cenário atual. O rótulo na interface é "Bias (tendência inicial)", acompanhado de uma explicação curta — ex.: "o quanto o neurônio já 'quer' esse Resultado antes de olhar para qualquer Entrada". Realiza UJ-1.

**Requisitos Funcionais:**

#### FR-4: Ajustar o Bias via slider
O aluno pode ajustar o Bias do Cenário atual através de um slider numérico, visualmente distinto dos sliders de Peso. Realiza UJ-1.

**Consequências (testáveis):**
- O slider de Bias tem faixa visível de `-10` a `+10` e incrementos de `0.5` (`[ASSUMPTION: faixa mais ampla que a dos Pesos individuais, pois o Bias precisa poder compensar ou reforçar várias Entradas ao mesmo tempo.]`).
- Mover o slider de Bias recalcula a Soma Ponderada e o Resultado imediatamente.
- O valor numérico atual do Bias é exibido ao lado do slider.

### 4.5 Painel de Matemática (Soma Ponderada)
**Descrição:** Um painel sempre visível — nunca escondido em aba avançada, por decisão explícita do solicitante — mostra a fórmula da Soma Ponderada preenchida com os valores atuais, lado a lado com o Resultado. Realiza UJ-1, UJ-2.

**Requisitos Funcionais:**

#### FR-5: Exibir a fórmula da Soma Ponderada com valores reais
O sistema exibe, a qualquer momento, a fórmula completa da Soma Ponderada com os valores atuais de cada Entrada, Peso e Bias substituídos, além do valor numérico final da soma. Realiza UJ-1, UJ-2.

**Consequências (testáveis):**
- A fórmula exibida segue o formato `(entrada1 × peso1) + (entrada2 × peso2) + ... + bias = soma`, com os números atuais substituídos nas posições de Entrada, Peso e Bias.
- O valor da Soma Ponderada é recalculado e re-exibido em tempo real a cada alteração de Entrada, Peso ou Bias (mesmo ciclo de atualização de FR-2, FR-3 e FR-4).
- O Limiar atual é exibido junto à Soma Ponderada, com indicação visual de qual lado da comparação prevalece (ex.: "Soma: 3.5 ≥ Limiar: 1 → ativado").

#### FR-6: Exibir o Resultado do Cenário
O sistema exibe, junto ao painel de matemática, o Resultado — mensagem em linguagem cotidiana mais emoji — correspondente ao estado atual de ativação do Neurônio Artificial. Realiza UJ-1, UJ-2.

**Consequências (testáveis):**
- Quando Soma Ponderada ≥ Limiar, exibe a mensagem de "ativado" definida pelo Cenário (ex.: "Vai ter churrasco! 🍖") com destaque visual próprio (ex.: cor verde, fundo destacado).
- Quando Soma Ponderada < Limiar, exibe a mensagem de "não ativado" definida pelo Cenário (ex.: "Não vai ter churrasco 😞") com destaque visual distinto (ex.: cor cinza ou vermelha).
- A transição entre os dois estados é visualmente perceptível (mudança de cor e emoji) no mesmo instante em que a Soma Ponderada cruza o Limiar.

### 4.6 Reinício de Cenário
**Descrição:** Um botão devolve o Cenário atual aos seus valores padrão de Entradas, Pesos e Bias, permitindo reuso em múltiplas demonstrações sem reabrir o arquivo. Realiza UJ-2.

**Requisitos Funcionais:**

#### FR-7: Reiniciar o Cenário atual
O aluno ou facilitador pode reiniciar o Cenário atual para seus valores padrão através de um botão "Reiniciar cenário". Realiza UJ-2.

**Consequências (testáveis):**
- Ao clicar em "Reiniciar cenário", todas as Entradas, Pesos e o Bias do Cenário atual retornam aos valores padrão definidos em §4.2, §4.3 e §4.4.
- A Soma Ponderada e o Resultado são recalculados imediatamente após o reinício.

### 4.7 Apoio Didático
**Descrição:** Textos de apoio curtos explicam, em linguagem simples e sem jargão técnico, o que cada termo do Glossário significa. Ficam posicionados próximos ao controle correspondente e permanecem sempre na tela. Como o público é não-técnico, este apoio é essencial ao objetivo pedagógico — não é cosmético.

**Requisitos Funcionais:**

#### FR-8: Explicações contextuais dos conceitos
O sistema exibe, próximo a cada controle (Entrada, Peso, Bias, Limiar, Resultado), um texto curto e sempre visível explicando o conceito em linguagem acessível a um público de negócios. A escolha por texto fixo em vez de tooltip garante a leitura também quando a tela está projetada para a turma.

**Consequências (testáveis):**
- Cada slider de Peso tem um texto de apoio explicando que "Peso = o quanto esse fator importa para a decisão".
- O slider de Bias tem um texto de apoio explicando que "Bias = tendência inicial, antes de olhar qualquer Entrada".
- O painel de matemática (FR-5) tem um texto de apoio curto explicando que a Soma Ponderada é comparada ao Limiar para decidir o Resultado.
- Nenhum texto de apoio depende de hover, clique ou foco de teclado para ser lido — todos permanecem na tela o tempo todo.

## 5. Non-Goals (Explicit)

- Este produto não implementa uma rede neural multicamada (multi-layer perceptron) nem qualquer forma de treinamento automático (sem backpropagation, sem ajuste automático de Pesos). Todos os ajustes são manuais, feitos pelo aluno, para fins didáticos.
- Este produto não persiste dados entre sessões — sem salvar, exportar ou compartilhar configurações. Decisão explícita do solicitante.
- Este produto não oferece criação de Cenários customizados pelo aluno no v1 — apenas os Cenários pré-definidos pelo autor do curso.
- Este produto não é otimizado para dispositivos móveis ou tablets — apenas notebook.
- Este produto não requer, em nenhum momento, conexão com a internet, backend, servidor, login ou conta de usuário.
- Este produto não usa Função de Ativação sigmoide ou probabilística no v1 — apenas ativação binária com Limiar fixo, por ser mais didática para público não-técnico. Decisão explícita do solicitante.

## 6. MVP Scope

### 6.1 In Scope
- Um único arquivo HTML autônomo (HTML, CSS e JS inline ou em arquivos locais na mesma pasta), aberto por duplo clique em qualquer navegador moderno, sem instalação.
- Dois Cenários pré-definidos, confirmados como escopo fechado do MVP: "Vai ter Churrasco?" (Entradas: carne, carvão, cerveja) e "Vai Chover?" (Entradas: "Céu nublado?", "Vento forte?", "Previsão do app diz chuva?").
- Todos os FR-1 a FR-8: seleção de Cenário, ajuste de Entradas por toggle, Pesos e Bias por slider, painel de matemática sempre visível, Resultado com emoji, botão de reinício e textos de apoio didático.
- Visual simples, com cores contrastantes entre os estados "ativado" e "não ativado", pensado para leitura em sala de aula, incluindo projeção.

### 6.2 Out of Scope for MVP
- Criação de Cenários customizados pelo aluno — adiado para v2, caso o curso evolua para um módulo "mão na massa" mais avançado. `[NOTE FOR PM: solicitante mencionou interesse futuro em "o aluno montar como quiser" — vale revisitar após a primeira turma usar o v1.]`
- Salvamento ou exportação de configurações e Resultados — não é necessidade do curso atual.
- Funções de Ativação alternativas (sigmoide, ReLU, tanh) — fora do escopo didático deste módulo introdutório.
- Suporte formal a mobile e tablet — apenas notebook.
- Múltiplos neurônios conectados, formando uma rede de fato — este simulador trata de um único Neurônio Artificial.

## 7. Success Metrics

**Primária**
- **SM-1**: Clareza pedagógica — o facilitador consegue demonstrar os quatro conceitos (Entrada, Peso, Bias, Função de Ativação) usando o simulador em uma única sessão de até 10 minutos, sem precisar de slide de apoio adicional. Valida FR-1 a FR-8.

**Secundária**
- **SM-2**: Autossuficiência de uso — qualquer participante consegue abrir o arquivo e começar a interagir sem instrução prévia, apenas lendo os textos de apoio na tela. Valida FR-8.

**Contra-métricas (não otimizar)**
- **SM-C1**: Simplicidade visual às custas da matemática — o painel de matemática (FR-5) nunca deve ser removido ou minimizado em nome de deixar a tela "mais bonita", pois isso anularia o valor pedagógico central do produto. Contrabalança SM-1 e SM-2.

*Métricas qualitativas e informais, adequadas ao caráter interno e educacional do projeto. Não há instrumentação nem analytics, já que o produto roda offline e sem backend.*

## 8. Open Questions

Todas as perguntas abertas do draft foram resolvidas por aceite explícito do solicitante (ver §9 Assumptions Index e o memlog do workspace): dois Cenários no MVP, Entradas do Cenário "Vai Chover?" confirmadas, textos de apoio sempre visíveis e prazo sem data fixa — "o mais breve possível". Nenhuma pergunta bloqueante remanescente.

1. ~~Quais são exatamente as Entradas, Pesos padrão e Bias padrão do Cenário "Vai Chover?"~~ — Resolvido: confirmado conforme §6.1.
2. ~~Haverá mais de dois Cenários no v1?~~ — Resolvido: MVP fechado em dois Cenários (churrasco e chuva); Cenários adicionais ficam para v2 (ver §6.2).
3. ~~Textos de apoio em tooltip ou sempre visíveis?~~ — Resolvido: sempre visíveis (FR-8).
4. ~~Existe data ou horário específico da aula?~~ — Resolvido: não há data fixa; a prioridade é entregar o quanto antes.

## 9. Assumptions Index

Todas as suposições abaixo foram aceitas explicitamente pelo solicitante — nenhuma pendência bloqueante para o build.

- §2.2 — Resolução mínima assumida de notebook (~1280x720), sem otimização para telas menores. **Aceito.**
- §3 — Limiar (Threshold) fixo e visível, não ajustável pelo aluno no v1. **Aceito.**
- §4.2 — Todas as Entradas começam em "Não" por padrão ao carregar/trocar Cenário. **Aceito.**
- §4.3 — Faixa de Peso de -5 a +5, incrementos de 0.5. **Aceito.**
- §4.3 — Pesos padrão escolhidos para que o Resultado inicial seja "não ativado" com Entradas padrão. **Aceito.**
- §4.4 — Faixa de Bias de -10 a +10, incrementos de 0.5. **Aceito.**
- §6.1 — Entradas do Cenário "Vai Chover?" confirmadas como "Céu nublado?", "Vento forte?", "Previsão do app diz chuva?". **Aceito.**
