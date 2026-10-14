---
title: Addendum — Simulador de Neurônio Artificial, Nível 2
created: 2026-10-14
updated: 2026-10-14
---

# Addendum técnico — Nível 2 (o treinamento)

Este documento guarda os detalhes de implementação e as justificativas técnicas que não pertencem ao PRD. O PRD diz *o quê*; aqui fica *como* e *por quê*. Os valores abaixo são o ponto de partida do build. Podem ser recalibrados nele, desde que as Consequências testáveis do PRD continuem valendo — exceto a quantidade de Exemplos e a divisão treino/teste, que exigem voltar ao solicitante (PRD §9).

## 1. Por que Desenhos gerados e não fotos

- **Viabilidade:** uma regressão logística sobre os pixels crus de fotos reais fica perto do acaso — um relato aponta ~60% em gatos e ~64% em cães no dataset do Kaggle ([DeepLearning.AI](https://community.deeplearning.ai/t/logistic-regression-python-code/32022)). Uma rede com uma Camada Oculta pequena, em 20×20, não muda isso de forma relevante. A aula pareceria quebrada.
- **Licença:** o Kaggle Dogs vs Cats (Asirra) é oferecido "para diversão e pesquisa" sob licença da Microsoft Research ([Microsoft](https://www.microsoft.com/en-us/download/details.aspx?id=54765)) — **não é seguro redistribuir num curso corporativo**. O Oxford-IIIT Pet é CC BY-SA 4.0, mas o copyright das fotos continua com os donos originais ([site](https://www.robots.ox.ac.uk/~vgg/data/pets/)) — risco médio. A Wikimedia Commons exige filtrar CC0 ou domínio público, ou atribuição foto a foto ([licenças](https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Free_Creative_Commons_licenses)).
- **Offline e tamanho:** Desenhos gerados por código não pesam nada no arquivo e não dependem de nada externo.

## 2. Geração dos Desenhos e reprodutibilidade

- **Resolução:** 20×20 pixels em tons de cinza, 400 Entradas, valores de 0 (branco) a 1 (preto).
- **Traços que distinguem as classes**, cada um com variação aleatória:
  - **Gato:** orelhas triangulares pontudas no alto da cabeça, focinho pequeno, bigodes horizontais.
  - **Cão:** orelhas caídas nas laterais, focinho alongado com nariz maior.
- **Variação comum:** tamanho e posição da cabeça (±2 pixels), espessura do traço e ruído de pixel.
- **Desenhos Ambíguos:** 10% de cada classe, com o traço principal (orelha) interpolado a meio caminho entre as duas formas. O Rótulo é sempre a classe que gerou o Desenho.
- **Gerador de números aleatórios com semente** (por exemplo, mulberry32), implementado no próprio arquivo, sem `Math.random()` em nenhum sorteio que afete o resultado. São **quatro fluxos independentes**, cada um com sua própria semente derivada da Semente padrão:
  1. **Dados** — os 240 Exemplos e a divisão treino/teste. Nunca muda.
  2. **Inicialização** — os Pesos iniciais. Muda com "Sortear outra rede".
  3. **Embaralhamento** — a ordem dos Exemplos a cada Época. Muda com "Sortear outra rede".
  4. **Desenhos Novos** — FR-17. Independente dos demais, para que mudar a Camada Oculta não mude os Desenhos Novos.

  Fluxos separados garantem que "Reiniciar" reproduza exatamente a mesma curva e que nenhuma ação do Aluno embaralhe o que deveria ficar fixo.

## 3. Rede Neural

- **Arquitetura:** 400 Entradas → Camada Oculta com `H` neurônios (sigmoide) → 1 Neurônio de Saída (sigmoide). `H` vai de 1 a 8, padrão 4.
- **Por que sigmoide também na Camada Oculta:** mantém um único conceito de Função de Ativação no Nível 2. ReLU treina melhor em redes grandes, mas aqui seria um conceito a mais sem ganho visível.
- **Inicialização** (revisada após simulação na verificação do PRD):
  - Pesos dos pixels para a Camada Oculta: uniformes em ±0,01, bem pequenos. Pixels de fundo recebem pouca correção (só quando o ruído os acende); com inicialização grande, guardariam ruído para sempre e o mapa de Pesos viraria estática. O mapa mostra a *mudança* desde o início (ver abaixo), o que neutraliza o ruído inicial de qualquer forma.
  - Pesos da Camada Oculta para o Neurônio de Saída: uniformes em ±0,3 a ±0,5, **não** pequenos. Com ±0,01 nas duas camadas, a simulação mostrou o Treinamento padrão parado ~10 Épocas na linha "chute" e os Pesos de saída trocando de sinal, o que inverte as cores dos mapas justamente durante a narração do "+1 Época".
  - Bias de saída: calculado na inicialização para compensar os Pesos de saída, de modo que a Probabilidade média inicial fique em 50%. Como os neurônios ocultos começam todos perto de 0,5 para qualquer Desenho, isso mantém toda Probabilidade inicial entre 40% e 60% (FR-17). Demais Bias: zero.
  - **Diversidade dos mapas:** a simulação indicou que os neurônios ocultos tendem a aprender mapas parecidos. O PRD não promete o contrário (FR-15); a calibração (C7) só verifica que o mapa destaca orelha e focinho em relação ao fundo.
- **Erro:** entropia cruzada binária média, com a Probabilidade limitada a [1e-7, 1 − 1e-7] antes do logaritmo, para nunca produzir `Infinito` ou `NaN`. O Erro de uma rede que responde 50% para tudo é ln 2 ≈ 0,693 — é a linha "chute" do gráfico (FR-16). O teto fixo do gráfico é 1,5; valores acima aparecem colados no teto.
- **Correção dos Pesos:** descida do gradiente com mini-lotes e **gradiente médio do lote** (não a soma), implementada à mão em JavaScript puro, sem bibliotecas. A cada Época, o Conjunto de Treino é embaralhado com o fluxo de embaralhamento. Sem regularização no padrão.
- **Mapa de Pesos (FR-15):** mostra `W_atual − W_inicial` de cada pixel, com escala global e fixa (ex.: ±0,5 = cor saturada). Azul = mudança positiva (empurra para "gato", já que a saída é "chance de ser gato"); vermelho = negativa. Para neurônios cuja conexão com a saída é negativa, o sentido se inverte; por isso o mapa deve ser multiplicado pelo sinal **atual** do Peso daquele neurônio para a saída, para que azul signifique sempre "empurra para gato". Com os Pesos de saída inicializados em ±0,3 a ±0,5, esse sinal se estabiliza logo nas primeiras Épocas.
- **Custo:** com 180 Exemplos de treino, 400 Entradas e `H ≤ 8`, uma Época custa por volta de 1,5 a 2 milhões de multiplicações, contando a ida, a Correção dos Pesos e a medição nos dois conjuntos — irrelevante num notebook. O ritmo do Treinamento é limitado pela animação, não pelo cálculo.

## 4. Hiperparâmetros e plano de calibração

| Hiperparâmetro | Valores | Padrão | Observação |
|---|---|---|---|
| Épocas | 1 a 200 | 30 | Com o máximo, o Erro de teste deve subir (Overfitting) |
| Learning Rate | 0,01 · 0,05 · 0,1 · 0,5 · 1 · 3 · 10 | 0,5 | Degraus fixos, para facilitar a narração; o máximo deve fazer o Erro não cair de forma contínua |
| Batch Size | 1 · 10 · 20 · 45 · 180 | 20 | 180 = o Conjunto de Treino inteiro numa única Correção dos Pesos por Época |
| Neurônios da Camada Oculta | 1 a 8 | 4 | Muda e reinicia, com aviso |

**Ritmo (FR-14):** a tela é atualizada ~3 vezes por segundo. No padrão, cada atualização avança uma Época: 30 Épocas levam ~10 s. Se `Épocas ÷ 3` passar de 25 s, cada atualização avança várias Épocas de uma vez, para que o total fique em até 25 s; com 200 Épocas, ~3 Épocas por atualização.

**Plano de calibração — primeira tarefa do build, antes de qualquer interface.** Escrever um script de verificação, no Node, que rode a mesma lógica do arquivo e verifique, com a Semente padrão:

| # | Configuração | Critério (PRD) |
|---|---|---|
| C1 | Padrão | Erro de treino abaixo de 0,693 até a Época 5; teste entre 52 e 59 acertos de 60 (FR-12, SM-C2); ≥ 48 de 60 corretos com Confiança > 80% (FR-17); aviso de Overfitting não dispara (FR-18) |
| C2 | Padrão, antes de treinar | Probabilidade entre 40% e 60% para todos os Desenhos (FR-17) |
| C3 | Learning Rate máximo | Erro de treino final ≥ 2 × o do padrão; aviso de Overfitting não dispara; nunca `NaN` (FR-12, FR-18) |
| C4 | Épocas máximas | Erro de teste final ≥ 1,2 × o seu mínimo; Erro de treino final menor que na Época do mínimo de teste; aviso de Overfitting dispara (FR-12, FR-18) |
| C5 | Batch Size máximo | Erro de treino final ≥ 2 × o do padrão (FR-12); com Batch Size 1, o aviso de Overfitting não dispara em 30 Épocas (diagnóstico) |
| C6 | `H` = 1 e `H` = 8 | Teste > 70% com 1; com 8, no máximo 3 acertos a mais que o padrão (FR-13) |
| C7 | Padrão | Em ≥ metade dos mapas, mudança média de Peso nas regiões de orelha e focinho ≥ 3 × a do fundo (FR-15) |

Rodar também C1 e C4 com 10 outras sementes de inicialização, só como diagnóstico: a demonstração usa a Semente padrão, mas se o resultado depender de sorte com outras sementes, a Semente padrão está escondendo um problema.

**Se o Overfitting (C4) não aparecer**, as alavancas, em ordem e respeitando as quantidades fixas do PRD, são:
1. Aumentar a variação de posição e tamanho dos Desenhos.
2. Aumentar o grau de ambiguidade dos Desenhos Ambíguos, mantendo a parcela de 10% fixada em FR-10 (um Desenho mais ambíguo é mais fácil de "decorar" e mais difícil de generalizar).
3. Aumentar o ruído de pixel, com moderação: ruído acende pixels de fundo e trabalha contra o critério C7 do mapa de Pesos.
4. Reduzir o Learning Rate padrão, para que 30 Épocas correspondam a menos "esforço" e as Épocas máximas fiquem relativamente mais longas.

A cada alavanca, reverificar C1 — o Treinamento padrão bem-sucedido tem prioridade sobre o Overfitting. **Ordem de prioridade quando as metas brigam:** 1º C1 (padrão bem-sucedido e reproduzível), 2º C4 (Overfitting), 3º C3 (Learning Rate máximo), 4º C5 e C6. **Critério de parada:** se, esgotadas as alavancas, C1 e C4 não se sustentarem juntos, o build para e volta ao solicitante, em vez de mudar a quantidade de Exemplos ou a divisão treino/teste sem aprovação.

## 5. Visualização

- **Diagrama da Rede Neural (FR-15):** os 400 pixels de Entrada aparecem como uma miniatura do Desenho atual. Cada neurônio da Camada Oculta mostra seu mapa 20×20 (ver §3). As conexões da Camada Oculta até a saída seguem o estilo do Nível 1: espessura pela força, cor pelo sinal.
- **Curvas (FR-16):** um gráfico de Erro e um de Acurácia, cada um com treino (linha cheia) e teste (linha tracejada), desenhados em SVG, sem biblioteca.
- **Integração com o Nível 1 (FR-9):** todos os ids de SVG, filtros e gradientes recebem prefixo por Nível (`n1-`, `n2-`), para não haver ids duplicados no documento. O loop de animação do Nível 1 para quando a aba do Nível 2 está ativa, e vice-versa. Atalhos de teclado são registrados só no Nível ativo.

## 6. Referências de design

- **TensorFlow Playground:** play, pausa e passo a passo; perda de treino vs. teste lado a lado; Pesos como espessura e cor das linhas ([código](https://raw.githubusercontent.com/tensorflow/playground/master/index.html)). O padrão de controles de player e a comparação treino × teste vêm daqui. A página original carrega fontes online, então não reaproveitar assets.
- **Google Teachable Machine:** expõe só Épocas, Batch Size e Learning Rate e mostra a confiança por classe ao vivo ([codelab](https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab)). Depende de internet para baixar um MobileNet pré-treinado, por isso não serve de base técnica, só de referência de interação.
- **Equívocos a combater** (da pesquisa): "mais Épocas é sempre melhor", "acurácia de treino é o desempenho real" e "Learning Rate maior aprende mais rápido"; como reforço, "o modelo entende o que é um gato" e "basta ter mais dados".

## 7. Valores do Nível 1 entregue (registro)

Valores reais do `simulador-neuronio.html` entregue em 13/10/2026, registrados para a reverificação de não regressão (FR-9):

| Cenário | Entradas e Pesos padrão | Bias padrão | Soma com tudo em "Não" |
|---|---|---|---|
| Vai ter Churrasco? | carne 3 · carvão 2 · cerveja 1,5 | −1 | −1 (não ativado) |
| Vai Chover? | céu nublado 2 · vento forte 1,5 · previsão do app 3 | −1,5 | −1,5 (não ativado) |

Limiar: 1, nos dois Cenários.
