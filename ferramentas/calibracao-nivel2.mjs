#!/usr/bin/env node
/* Calibração do Nível 2 (addendum §4, metas C1–C7).
   Extrai o <script id="n2-core"> de simulador-neuronio.html e o avalia
   num contexto com window = {}, para que o que é calibrado seja
   exatamente o que roda na página.

   Uso: node ferramentas/calibracao-nivel2.mjs [caminho/do/simulador.html]
   Código de saída 0 só se todas as metas C1–C7 passarem. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const aqui = dirname(fileURLToPath(import.meta.url));
const caminho = resolve(process.argv[2] || resolve(aqui, "..", "simulador-neuronio.html"));
const html = readFileSync(caminho, "utf8");
const m = html.match(/<script id="n2-core">([\s\S]*?)<\/script>/);
if (!m) { console.error("FALHOU: bloco <script id=\"n2-core\"> não encontrado em " + caminho); process.exit(2); }

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(m[1], ctx, { filename: "n2-core" });
const N2 = ctx.window.N2Core;
if (!N2) { console.error("FALHOU: window.N2Core não foi definido"); process.exit(2); }
const CFG = N2.CFG;

const n = (x, d = 3) => Number(x).toFixed(d).replace(".", ",");
const t0 = Date.now();
const dados = N2.gerarExemplos(CFG.sementePadrao);

function treinar(op, epocas) {
  const est = N2.criarTreinamento(op, dados);
  for (let e = 0; e < epocas; e++) N2.rodarEpoca(est);
  return est;
}
const finito = (est) => est.historico.every((h) =>
  [h.erroTreino, h.erroTeste, h.acTreino, h.acTeste].every(Number.isFinite));
const final = (est) => est.historico[est.historico.length - 1];

const resultados = [];
function meta(id, ok, detalhe) {
  resultados.push({ id, ok });
  console.log(`${ok ? "PASSOU" : "FALHOU"}  ${id}  ${detalhe}`);
}

/* ---- sanidade dos Exemplos (FR-10, FR-11, FR-17) ---- */
{
  const ex = dados.exemplos;
  const gatos = ex.filter((e) => e.classe === "gato").length;
  const amb = (cls, conj) => ex.filter((e) => e.ambiguo && e.classe === cls && (!conj || e.conjunto === conj)).length;
  const conta = (conj, cls) => ex.filter((e) => e.conjunto === conj && e.classe === cls).length;
  const sobreposicao = dados.treino.some((i) => dados.teste.includes(i));
  const ok = ex.length === 240 && gatos === 120 && dados.treino.length === 180 && dados.teste.length === 60 &&
    conta("treino", "gato") === 90 && conta("teste", "gato") === 30 && amb("gato") === 12 && amb("cao") === 12 &&
    amb("gato", "teste") >= 1 && amb("cao", "teste") >= 1 && !sobreposicao &&
    ex.every((e) => e.pixels.every((v) => v >= 0 && v <= 1));
  meta("C0", ok, `Exemplos: ${ex.length} (gatos ${gatos}); treino ${dados.treino.length} / teste ${dados.teste.length}; ` +
    `Ambíguos no teste: gato ${amb("gato", "teste")}, cão ${amb("cao", "teste")}`);
  const outra = N2.gerarExemplos(CFG.sementePadrao);
  meta("C0b", outra.teste.join() === dados.teste.join() && outra.exemplos[7].pixels.join() === ex[7].pixels.join(),
    "Exemplos e divisão reproduzíveis com a mesma Semente");
}

/* ---- C1: Treinamento padrão ---- */
const padrao = treinar({}, CFG.epocasPadrao);
const fp = final(padrao);
{
  const ep5 = padrao.historico.slice(5).every((h) => h.erroTreino < N2.CHUTE);
  const ok = ep5 && fp.acertosTeste >= 52 && fp.acertosTeste <= 59 && fp.confiantesTeste >= 48 &&
    !padrao.aviso.disparou && finito(padrao);
  meta("C1", ok, `Erro treino Época 5 = ${n(padrao.historico[5].erroTreino)} (< 0,693 dali em diante: ${ep5}); ` +
    `teste ${fp.acertosTeste}/60; confiantes > 80% ${fp.confiantesTeste}/60; aviso: ${padrao.aviso.disparou}; ` +
    `Erro final treino ${n(fp.erroTreino)} teste ${n(fp.erroTeste)}`);
  const rep = treinar({}, CFG.epocasPadrao);
  meta("C1b", rep.historico.map((h) => h.erroTeste).join() === padrao.historico.map((h) => h.erroTeste).join(),
    "Reiniciar reproduz exatamente as mesmas curvas");
}

/* ---- C2: antes de treinar ---- */
{
  const est = N2.criarTreinamento({}, dados);
  let lo = 1, hi = 0;
  const rngN = N2.fluxo(CFG.sementePadrao, "novos");
  const desenhos = dados.exemplos.map((e) => e.pixels);
  for (let i = 0; i < 50; i++) desenhos.push(N2.gerarDesenho(rngN, rngN() < 0.5 ? "gato" : "cao", rngN() < 0.1).pixels);
  for (let H = 1; H <= 8; H++) {
    const e2 = H === est.H ? est : N2.criarTreinamento({ ocultos: H }, dados);
    for (const px of desenhos) { const p = N2.prever(e2.rede, px).p; lo = Math.min(lo, p); hi = Math.max(hi, p); }
  }
  meta("C2", lo >= 0.4 && hi <= 0.6, `Probabilidade inicial em [${n(lo * 100, 1)}%, ${n(hi * 100, 1)}%] (H 1–8, 240 Exemplos + 50 Desenhos Novos)`);
}

/* ---- C3: Learning Rate máximo ---- */
{
  const lrMax = CFG.LR_VALORES[CFG.LR_VALORES.length - 1];
  const est = treinar({ lr: lrMax }, CFG.epocasPadrao);
  const f = final(est);
  const ok = f.erroTreino >= 2 * fp.erroTreino && !est.aviso.disparou && finito(est);
  meta("C3", ok, `LR ${lrMax}: Erro treino final ${n(f.erroTreino)} (≥ 2 × ${n(fp.erroTreino)} = ${n(2 * fp.erroTreino)}); ` +
    `aviso: ${est.aviso.disparou}; finito: ${finito(est)}; teste ${f.acertosTeste}/60`);
}

/* ---- C4: Épocas máximas ---- */
function avaliarC4(est) {
  const hs = est.historico, f = final(est);
  let iMin = 0;
  hs.forEach((h, i) => { if (h.erroTeste < hs[iMin].erroTeste) iMin = i; });
  const ok = f.erroTeste >= 1.2 * hs[iMin].erroTeste && f.erroTreino < hs[iMin].erroTreino && est.aviso.disparou;
  return { ok, iMin, minTe: hs[iMin].erroTeste, f, trMin: hs[iMin].erroTreino };
}
{
  const est = treinar({}, CFG.EPOCAS_MAX);
  const r = avaliarC4(est);
  const passo = N2.epocasPorAtualizacao(CFG.EPOCAS_MAX);
  const dur = Math.ceil(CFG.EPOCAS_MAX / passo) * CFG.intervaloMs / 1000;
  meta("C4", r.ok && dur <= 25, `200 Épocas: mínimo do Erro de teste ${n(r.minTe)} na Época ${r.iMin}; ` +
    `final teste ${n(r.f.erroTeste)} (razão ${n(r.f.erroTeste / r.minTe, 2)}); ` +
    `treino final ${n(r.f.erroTreino)} < ${n(r.trMin)}; aviso na Época ${est.aviso.epoca}; ` +
    `teste final ${r.f.acertosTeste}/60; duração ~${n(dur, 1)} s (agenda do player; o teste no navegador mede o tempo real)`);
  const durPadrao = Math.ceil(CFG.epocasPadrao / N2.epocasPorAtualizacao(CFG.epocasPadrao)) * CFG.intervaloMs / 1000;
  meta("C4b", durPadrao >= 8 && durPadrao <= 15, `Treinamento padrão dura ~${n(durPadrao, 1)} s (8–15 s)`);
}

/* ---- C5: Batch Size máximo ---- */
{
  const bMax = CFG.BATCH_VALORES[CFG.BATCH_VALORES.length - 1];
  const est = treinar({ batch: bMax }, CFG.epocasPadrao);
  const f = final(est);
  meta("C5", f.erroTreino >= 2 * fp.erroTreino && finito(est),
    `Batch ${bMax}: Erro treino final ${n(f.erroTreino)} (≥ ${n(2 * fp.erroTreino)})`);
  const b1 = treinar({ batch: 1 }, CFG.epocasPadrao);
  console.log(`  diag  Batch 1: aviso ${b1.aviso.disparou ? "DISPAROU (diagnóstico)" : "não dispara"}; ` +
    `teste ${final(b1).acertosTeste}/60; Erro treino ${n(final(b1).erroTreino)}`);
}

/* ---- C6: Camada Oculta 1 e 8 ---- */
{
  const e1 = treinar({ ocultos: 1 }, CFG.epocasPadrao);
  const e8 = treinar({ ocultos: 8 }, CFG.epocasPadrao);
  const a1 = final(e1).acertosTeste, a8 = final(e8).acertosTeste;
  meta("C6", a1 / 60 > 0.7 && a8 <= fp.acertosTeste + 3 && finito(e1) && finito(e8),
    `H 1: teste ${a1}/60 (${n(a1 / 60 * 100, 1)}%); H 8: ${a8}/60 (padrão ${fp.acertosTeste}/60)`);
}

/* ---- C7: mapas de Pesos ---- */
{
  const reg = N2.regioes(dados);
  const mps = N2.mapas(padrao);
  const media = (m, idx) => idx.reduce((s, i) => s + Math.abs(m[i]), 0) / idx.length;
  let bons = 0;
  const det = mps.map((mp, j) => {
    const fu = media(mp, reg.fundo), o = media(mp, reg.orelha), fo = media(mp, reg.focinho);
    const ok = o >= 3 * fu && fo >= 3 * fu;
    if (ok) bons++;
    return `n${j + 1}: orelha ${n(o / fu, 1)}× focinho ${n(fo / fu, 1)}×`;
  });
  let maxAbs = 0;
  mps.forEach((mp) => mp.forEach((v) => { maxAbs = Math.max(maxAbs, Math.abs(v)); }));
  meta("C7", bons >= Math.ceil(mps.length / 2),
    `${bons}/${mps.length} mapas com orelha e focinho ≥ 3× o fundo (${det.join("; ")}); ` +
    `pixels: orelha ${reg.orelha.length}, focinho ${reg.focinho.length}, fundo ${reg.fundo.length}; |mudança| máx ${n(maxAbs, 2)}`);
}

/* ---- diagnóstico: C1 e C4 com 10 outras sementes de inicialização ---- */
console.log("\nDiagnóstico (não reprova): C1 e C4 com outras sementes de rede");
let c1ok = 0, c4ok = 0;
for (let s = 1; s <= 10; s++) {
  const sem = CFG.sementePadrao + s * 7919;
  const p = treinar({ sementeRede: sem }, CFG.epocasPadrao);
  const f = final(p);
  const ok1 = p.historico.slice(5).every((h) => h.erroTreino < N2.CHUTE) && f.acertosTeste >= 52 &&
    f.acertosTeste <= 59 && f.confiantesTeste >= 48 && !p.aviso.disparou;
  const longo = treinar({ sementeRede: sem }, CFG.EPOCAS_MAX);
  const r = avaliarC4(longo);
  if (ok1) c1ok++; if (r.ok) c4ok++;
  console.log(`  semente ${sem}: C1 ${ok1 ? "ok" : "--"} (teste ${f.acertosTeste}/60, confiantes ${f.confiantesTeste}, aviso ${p.aviso.disparou}) · ` +
    `C4 ${r.ok ? "ok" : "--"} (razão ${n(r.f.erroTeste / r.minTe, 2)}, aviso ${longo.aviso.epoca})`);
}
console.log(`  C1 em ${c1ok}/10, C4 em ${c4ok}/10 sementes`);

const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${falhas.length ? "FALHOU" : "PASSOU"}: ${resultados.length - falhas.length}/${resultados.length} metas` +
  ` (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
process.exit(falhas.length ? 1 : 0);
