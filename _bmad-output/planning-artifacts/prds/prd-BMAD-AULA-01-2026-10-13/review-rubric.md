# PRD Quality Review — Simulador de Neurônio Artificial — Nível 1 e Nível 2

*Revisão da versão de 14/10/2026 (prd.md + addendum.md) contra o rubric de qualidade. Contexto: projeto interno/educacional, revisão de um produto já entregue (Nível 1, FR-1 a FR-8, aceito), que acrescenta o Nível 2 (FR-9 a FR-18), com build direto e sem fase de arquitetura. As decisões do solicitante (desenhos gerados, uma Camada Oculta de tamanho escolhido, sigmoide só no Nível 2, mesmo arquivo com abas, Non-Goals restritos ao Nível 1) não foram questionadas aqui.*

## Overall verdict

O PRD é bom. A tese pedagógica é clara: desfazer três equívocos de executivos sobre treinamento. As duas jornadas novas (UJ-3, UJ-4) puxam de fato as FRs do Nível 2, e o Glossário, o addendum e a contra-métrica SM-C2 mostram rigor real, não enfeite. O risco está nas Consequências que carregam a lição: o Overfitting (FR-13), o Learning Rate alto (FR-12) e o aviso de Overfitting (FR-18) são vagos ou dependem de um Treinamento aleatório sem regra de repetibilidade. Além disso, o Nível 2 não tem uma "forma visual" equivalente à do Nível 1, embora exija muita coisa "sempre visível" numa tela de 1280x720 projetada. Com essas quatro correções de prioridade alta, o documento fica pronto para build direto.

## Decision-readiness — adequate

As decisões aparecem como decisões e com a justificativa ao lado. Fotos reais foram descartadas por viabilidade e licença (§4.9 e addendum §1). A sigmoide na Camada Oculta é justificada contra ReLU ("seria um conceito a mais sem ganho visível", addendum §3). A mudança nos Non-Goals está registrada de forma explícita (nota no fim do §5). As Open Questions do §8 foram de fato resolvidas, cada uma com remissão para onde a resposta ficou.

A lacuna é uma tensão real que o documento não nomeia. Três metas puxam a calibração em direções opostas: o Treinamento padrão precisa dar certo ("Acurácia no Conjunto de Teste ... passa de 85%", FR-12), o Overfitting precisa ser reproduzível (FR-13) e a rede não pode chegar a 100% (SM-C2). O addendum §4 lista as alavancas, "aumentar o ruído, reduzir o Conjunto de Treino ou aumentar a parcela de ambíguos". Mas reduzir o Conjunto de Treino quebra as suposições de FR-10 (120 Exemplos) e de FR-11 (80/20), e ruído maior ameaça os 85%. Quem vai construir não sabe qual meta cede primeiro.

### Findings
- **[high]** Tensão de calibração sem `[NOTE FOR PM]` (FR-12, FR-13, SM-C2, addendum §4). Os 85% no teste com os padrões, o Overfitting reproduzível e a proibição de 100% podem não caber juntos, e as alavancas do addendum mexem em suposições ainda "aguardando confirmação" (FR-10, FR-11). *Fix:* incluir um `[NOTE FOR PM]` com a ordem de prioridade (por exemplo: 1º Overfitting reproduzível, 2º padrão > 85%, 3º manter 120 Exemplos e 80/20) e dizer quais suposições o build pode alterar sem nova aprovação.

## Substance over theater — strong

Nada aqui é enfeite. Carla e Ricardo têm cargo, contexto e uma ação que muda o produto. A frase de Ricardo, "é só treinar mais", motiva sozinha a FR-13 e a contra-métrica SM-C2. Os NFRs têm números ("menos de 1 segundo", "menos de 30 segundos", "1280x720", vírgula decimal). As referências de design do addendum §6 dizem o que foi aproveitado de cada uma e por que o resto não serve ("carrega fontes online", "depende de internet"). A Vision não serviria para outro produto da categoria.

### Findings
- **[low]** SM-2 promete demais para o Nível 2 (§7). A métrica pede que "qualquer participante consegue ... começar a interagir em qualquer um dos Níveis sem instrução prévia", mas o próprio PRD apresenta o Nível 2 como conduzido pelo facilitador: UJ-4 começa com "Nível 2 já demonstrado pelo facilitador". *Fix:* restringir SM-2 ao Nível 1, ou reescrever para o Nível 2 como "depois da demonstração do facilitador".

## Strategic coherence — strong

A tese do Nível 2 está escrita no §1: "desfaz os equívocos mais comuns ... que mais Épocas é sempre melhor, que acerto no treino é acerto no mundo real e que Learning Rate maior aprende mais rápido". Cada equívoco tem uma jornada (UJ-4, passos 1 e 2), uma FR que o torna reproduzível (FR-12, FR-13, FR-16) e uma métrica que verifica a demonstração (SM-3). SM-C2 é uma contra-métrica de verdade: impede justamente a otimização que mataria a tese. O escopo é do tipo "experiência", e a lógica do escopo combina com isso.

Sem findings que alterem o veredito. A cobertura das métricas está nas Mechanical notes: FR-9 e FR-10 não são validadas por nenhuma SM.

## Done-ness clarity — adequate

O Nível 1 e as FRs mecânicas do Nível 2 (FR-9, FR-11, FR-14, FR-16) têm Consequências verificáveis e bem escritas, como "Época 12 de 30", "Acurácia no teste: 91,7%" e "Pausar interrompe ao fim da Época atual". O problema está nas Consequências que carregam a lição. Elas usam adjetivos no lugar de limites, ou dependem de um processo aleatório sem dizer com que frequência precisam se confirmar. Como não haverá fase de arquitetura, quem constrói vai preencher essas lacunas sozinho, justamente onde a aula pode falhar ao vivo.

### Findings
- **[high]** O gatilho do aviso de Overfitting não é testável e tende a disparar no caso de sucesso (FR-18, 3º bullet). A regra "Quando a Acurácia de teste fica visivelmente abaixo da de treino" não define "visivelmente". Com 96 Exemplos de treino e mais de 1.600 Pesos na configuração padrão (400 × 4), a Acurácia de treino tende a chegar perto de 100% também no Treinamento padrão, enquanto a de teste fica em torno de 85–90%. Nesse caso o aviso dispararia na demonstração de sucesso de UJ-3, contradizendo a narrativa. *Fix:* definir uma regra objetiva (por exemplo, "a Acurácia de teste caiu ≥ X pontos em relação ao seu máximo nas últimas N Épocas") e acrescentar a Consequência "com os valores padrão, o aviso não aparece".
- **[high]** Consequências estocásticas sem regra de repetibilidade (FR-12, FR-13, FR-14 "Reiniciar ... com Pesos aleatórios"; addendum §2 "Semente fixa" vale só para os desenhos). A Acurácia acima de 85%, a oscilação com Learning Rate 5 e o Overfitting dependem da inicialização aleatória dos Pesos. O PRD não diz se essas Consequências precisam valer sempre, quase sempre ou com uma semente específica. Isso afeta também o ensaio do facilitador, que é a razão da semente fixa. *Fix:* definir a repetibilidade, por exemplo "Pesos iniciais também gerados a partir de semente fixa; cada Reiniciar avança a semente" ou "cada Consequência vale em 10 de 10 reinícios", e incluir isso no addendum §3.
- **[medium]** O observável do Overfitting é diferente em cada lugar (UJ-4, FR-13, Glossário). O clímax de UJ-4 promete que a rede "piorou com desenhos novos". FR-13 garante só que a Acurácia de teste "fica abaixo dela e para de subir". O Glossário diz que a de treino "continua subindo enquanto a de teste para ou cai". Uma estagnação (platô) não entrega o clímax de "piorou". *Fix:* escolher um único observável, de preferência "a Acurácia de teste cai pelo menos X pontos em relação ao próprio pico" (ou o Erro de teste sobe), e usá-lo igual em FR-13, UJ-4 e no Glossário.
- **[medium]** O observável do Learning Rate alto é ambíguo (FR-12, 3º bullet; UJ-4 passo 1; addendum §4). As três fontes dizem coisas diferentes: "o Erro oscila visivelmente" (FR-12), "oscila e não desce" (UJ-4) e "deve divergir ou oscilar" (addendum). Com sigmoide e 400 Entradas, um Learning Rate de 5 pode saturar os neurônios e deixar o Erro parado num valor alto, sem oscilar. Isso é divergência, mas não é "oscila visivelmente". *Fix:* definir um critério objetivo que cubra os dois casos, por exemplo "ao fim do Treinamento com Learning Rate 5, o Erro de treino não ficou abaixo de X% do Erro inicial", e alinhar o texto de UJ-4.
- **[medium]** Adjetivos no lugar de limites (vários pontos):
  - FR-17: "as Probabilidades ficam perto de 50%";
  - FR-10: "Um humano consegue classificar a maioria dos desenhos" e "alguns são propositalmente ambíguos" (addendum: "parcela pequena");
  - FR-15: "visível a olho nu";
  - FR-13: "com aviso claro na tela";
  - §4.11: "ritmo é lento o bastante para a turma acompanhar";
  - FR-14: "num notebook comum";
  - §6.1: "qualquer navegador moderno".

  *Fix:* trocar cada um por um limite, por exemplo "entre 40% e 60%", "≥ 90% classificáveis por um humano", "5–10% ambíguos", "Chrome/Edge/Safari/Firefox nas duas últimas versões".
- **[low]** Desenho novo sem critério de acerto (FR-17; UJ-3 passo 5 e clímax). O clímax diz que a rede "passa a acertar quase sempre desenhos que nunca viu", e o passo 5 inclui gerar desenhos novos. Mas FR-17 só exige indicar acerto ou erro para Exemplos do Conjunto de Teste. O gerador conhece a classe do desenho novo, e o PRD não diz se ela aparece. *Fix:* decidir se o desenho novo mostra o Rótulo e o acerto ou erro, ou se a turma julga a olho, e escrever isso como Consequência.
- **[low]** Volta ao Nível 2 depois da pausa automática (FR-9, 3º bullet). Está definido que o Treinamento pausa ao trocar para o Nível 1, mas não o que acontece na volta. *Fix:* acrescentar "ao voltar ao Nível 2, o Treinamento continua pausado até o aluno apertar Treinar".

## Scope honesty — adequate

Os Non-Goals fazem trabalho real e estão separados por Nível (§5). A nota de mudança em relação à versão anterior é exemplar. As suposições estão marcadas no texto e indexadas, e as duas `[NOTE FOR PM]` estão em adiamentos reais (desenho livre pelo aluno, Cenários customizados).

O problema é a classificação das pendências. O §8 diz "Nenhuma pergunta bloqueante remanescente", enquanto o §9 lista nove suposições "aguardando confirmação" sem dizer quais podem virar padrão do build e quais bloqueiam. Na prática, quase todas são padrões seguros, porque o addendum já traz os valores. As exceções são a suposição de bloqueio de FR-12, que contradiz FR-13 (finding abaixo), e a calibração de FR-13, que é um risco e não uma escolha. Nenhuma das duas está marcada como bloqueante.

### Findings
- **[medium]** Assumptions Index sem classificação de bloqueio (§9, "Novas nesta revisão — aguardando confirmação"; §8, última linha). Para um build direto, "aguardando confirmação" não diz se é permitido começar. *Fix:* marcar cada item como "padrão do build, confirmar depois" ou "bloqueia o build". Pela análise desta revisão, só o item FR-12 (bloqueio dos controles) precisa ser resolvido antes do build, e o item FR-13 (calibração) deveria virar um `[NOTE FOR PM]` ligado ao finding de calibração.
- **[medium]** Contradição na máquina de estados dos controles (suposição de FR-12; FR-13, 2º bullet; UJ-4 passo 2). Segundo a suposição de FR-12, Learning Rate, Batch Size e Camada Oculta "ficam bloqueados até reiniciar". Mas FR-13 diz que "Mudar o número de neurônios redesenha o diagrama da rede e reinicia o Treinamento, com aviso". Se o controle está bloqueado, não há como mudar e reiniciar. Também não está definido o que vale nos estados "pausado" e "concluído": em UJ-4 passo 2, Ricardo "volta ao valor padrão" do Learning Rate depois de treinar. *Fix:* uma tabela pequena com os estados (sem Treinamento / rodando / pausado / concluído) nas linhas e os controles nas colunas (habilitado / bloqueado / "muda e reinicia com aviso").

## Downstream usability — adequate

O Glossário é o ponto forte. Há disciplina declarada ("Sinônimos não declarados são violação de disciplina"), os termos em inglês aparecem uma vez entre parênteses e os termos proibidos na interface estão listados (FR-18, último bullet). Os IDs FR-1 a FR-18 e UJ-1 a UJ-4 são contíguos e todos os "Realiza UJ-n" apontam para jornadas que existem.

As falhas são de dois tipos. Primeiro, substantivos que circulam sem definição ou colidem com termos definidos (detalhes abaixo). Segundo, falta ao Nível 2 o equivalente da "Forma visual" do Nível 1 (§4, antes de §4.1). Sem fase de UX nem de arquitetura, quem constrói vai desenhar o layout sozinho, sob restrições que podem ser incompatíveis entre si.

### Findings
- **[high]** O Nível 2 não tem forma visual, e a densidade de itens "sempre visíveis" pode não caber na tela (§4.8–§4.14; §2.2; §6.1 "pensado para leitura em sala de aula, incluindo projeção"). Na mesma tela de 1280x720 o PRD pede:
  - 120 miniaturas rotuladas e divididas em dois conjuntos (FR-10, FR-11);
  - quatro controles com texto de apoio (FR-12, FR-13, FR-18);
  - controles de player e contador (FR-14);
  - o diagrama da rede com quatro a oito mapas 20×20 (FR-15);
  - dois gráficos com legenda e valores numéricos (FR-16);
  - o desenho grande com a barra de chance (FR-17);
  - textos "sempre visíveis" para doze conceitos (FR-18).

  O Nível 1 resolveu isso com um parágrafo de layout; o Nível 2 não tem nenhum, e não há limite de tamanho de fonte para a projeção. *Fix:* acrescentar um parágrafo "Forma visual do Nível 2" com regiões, ordem e o que pode ser recolhido. Por exemplo: o Conjunto de Exemplos numa faixa rolável, ou os textos de FR-18 ao lado de cada controle em vez de num painel. Se for preciso, relaxar "sempre visível" para "visível sem hover, ao lado do controle correspondente". Incluir também um tamanho mínimo de fonte para a projeção.
- **[medium]** "Erro" (o Loss do Glossário) colide com "erro" no sentido de Classificação errada (FR-17: "destacando os erros", "pode resultar em ... erro"; UJ-3: "errava tudo"; Glossário, em Treinamento: "errar menos"; em Learning Rate: "depois de errar"). Numa tela em que "Erro" é uma métrica com curva e número, "destacando os erros" no Conjunto de Teste é ambíguo, tanto para quem constrói quanto para o aluno. *Fix:* declarar no Glossário "acerto / Classificação errada" como o termo para o resultado de cada desenho e reservar "Erro" para a métrica; revisar FR-17 e os textos de interface.
- **[low]** "desenho" é usado como sinônimo não declarado de "Exemplo" (§4.9, FR-10, FR-17, UJ-3). O Glossário define Exemplo como "um desenho ... acompanhado do seu Rótulo", mas "desenho" sozinho circula como sinônimo ("conjunto de desenhos", "classifica desenhos do Conjunto de Teste"). Também nomeia algo que não é Exemplo: o desenho novo de FR-17, que não pertence a nenhum Conjunto. *Fix:* definir "desenho" no Glossário (a imagem gerada, com ou sem Rótulo) e dizer explicitamente que o desenho novo não é um Exemplo.
- **[low]** "neurônio de saída" não está definido, e a Probabilidade é atribuída de forma ampla demais (§3, entradas Rede Neural e Função de Ativação). O termo aparece em três definições sem entrada própria. A definição de Função de Ativação diz que no Nível 2 a sigmoide gera um valor "lido como Probabilidade", mas, segundo o addendum §3, os neurônios da Camada Oculta também usam sigmoide, e a saída deles não é Probabilidade. *Fix:* criar a entrada "Neurônio de Saída" e restringir a leitura como Probabilidade à saída dele.
- **[low]** Escopo de "Cada Hiperparâmetro" em FR-12 e faixas inconsistentes com o addendum (FR-12, 1º bullet). A FR trata de três Hiperparâmetros, mas o Glossário tem quatro, e não fica claro se o bullet vale para o da Camada Oculta. A suposição diz "Batch Size de 1 a 96", o que sugere um intervalo contínuo, enquanto o addendum §4 define degraus (1 · 8 · 16 · 32 · 96). *Fix:* dizer "cada um dos três Hiperparâmetros desta FR" e escrever "Batch Size em degraus de 1 a 96".

## Shape fit — adequate

O formato combina com o produto. São quatro UJs leves, cada uma com protagonista (Carla, Ricardo ou o facilitador), adequadas a uma ferramenta de sala de aula com um operador por vez. O próprio PRD justifica essa escala ("jornadas leves ... adequado a uma ferramenta de ensino"). As métricas são qualitativas e isso está declarado. A separação PRD × addendum está correta: o "o quê" fica no PRD, o "como" no addendum.

O ponto fraco é o lado brownfield. A revisão estende um artefato já entregue, mas não diz onde ele está nem exige que o Nível 1 continue funcionando igual.

### Findings
- **[medium]** Falta a referência ao artefato entregue e uma garantia de não-regressão (§0 Histórico; §6.1, item do Nível 1, "Já entregue; nesta revisão, só ganha a aba de Nível"). O PRD não diz o nome nem o caminho do arquivo HTML entregue, e nenhuma Consequência protege o Nível 1 de regressões ao inserir as abas e o código do Nível 2. *Fix:* citar o arquivo existente e acrescentar a FR-9 a Consequência "FR-1 a FR-8 continuam valendo sem alteração de comportamento depois da inclusão das abas".
- **[low]** Conflito de redação herdado da v1 (FR-1, 2º bullet, contra FR-9, 2º bullet). FR-1 diz que "Vai ter Churrasco?" está selecionado "ao abrir o Nível 1". Com abas, isso pode ser lido como "toda vez que a aba do Nível 1 é aberta", o que apagaria o estado que FR-9 manda preservar. *Fix:* trocar por "ao abrir o arquivo".

## Mechanical notes

- **Volta do Assumptions Index ao texto:** todas as suposições marcadas no texto (§2.2, §3, §4.2, as duas de §4.3, §4.4, FR-9, FR-10, FR-11, as duas de FR-12, as duas de FR-13, FR-14 e FR-15) estão no §9. Há uma entrada órfã: "§6.1 — Entradas do Cenário 'Vai Chover?'", que já não tem tag no texto porque foi resolvida. Pode ficar como histórico, mas convém marcar "(resolvida, sem tag no texto)". O item FR-14 do índice junta uma suposição ("ritmo de algumas Épocas por segundo") com uma Consequência ("menos de 30 segundos").
- **Referência que não resolve:** o item 1 do §8 diz que Entradas, Pesos padrão e Bias padrão de "Vai Chover?" foram "confirmado[s] conforme §6.1", mas o §6.1 só lista as Entradas. O valor do Limiar do Nível 1 também nunca é dito; o exemplo "4 ≥ 1" sugere 1. Como o Nível 1 já foi entregue, o impacto é baixo, mas vale registrar os valores reais da entrega.
- **Cobertura das métricas:** FR-9 e FR-10 não são validadas por nenhuma SM, porque SM-3 cobre "FR-12 a FR-17". As SMs aparecem fora de ordem (SM-1 e SM-3 em Primárias, SM-2 e SM-4 em Secundárias). Os IDs não têm lacunas, mas a leitura engana.
- **IDs:** FR-1 a FR-18, UJ-1 a UJ-4 e SM-1 a SM-4 mais SM-C1 e SM-C2 são contíguos e únicos. Todos os "Realiza UJ-n" e "Valida FR-n" resolvem.
- **Glossário (menor):** "aluno" e "participante" são usados como sinônimos (FR-9, FR-12 contra SM-2, SM-4). O efeito é pequeno, mas o Glossário declara que sinônimos são violação. "correção dos Pesos" (FR-18) é o termo de interface que substitui "gradiente" e deveria constar no Glossário.
- **Termos em inglês na interface:** não está claro se "Loss" e "Epoch" aparecem na tela entre parênteses. O JTBD 3 ("entender o que um fornecedor quer dizer com 'treinar um modelo', 'épocas' ou 'acurácia'") sugere que mostrar o termo em inglês ajuda. Vale decidir.
- **Seções exigidas:** todas presentes para o nível de risco e o tipo de produto.
