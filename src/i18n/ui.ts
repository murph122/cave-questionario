import type { Lang } from './types'

export const ui = {
  brand: { it: 'CAVE Questionari', zh: 'CAVE 问卷' },
  navBook: { it: 'Prenota', zh: '预约' },
  navSurvey: { it: 'Questionario', zh: '问卷' },
  langIt: { it: 'Italiano', zh: 'Italiano' },
  langZh: { it: '中文', zh: '中文' },
  langAria: { it: 'Cambia lingua', zh: '切换语言' },

  welcomeTitle: {
    it: 'Valutazione dello stress e dell’ambiente CAVE',
    zh: '压力与 CAVE 环境评估问卷',
  },
  welcomeSub: {
    it: 'Questo questionario valuta lo stress generato dall’esperienza nel CAVE e la qualità dell’esperienza immersiva.',
    zh: '本问卷用于评估 CAVE 体验中产生的压力，以及整体沉浸体验质量。',
  },
  welcomeBody: {
    it: 'Puoi prenotare un appuntamento per l’esperimento oppure compilare le sezioni del questionario (dati anagrafici e scale). Ti verrà assegnato un codice anonimo automatico.',
    zh: '你可以预约实验时间，或填写问卷各部分（人口学信息与量表）。系统会自动分配匿名参与者代码。',
  },
  welcomeConsent: {
    it: 'Continuando dichiari di aver compreso lo scopo della ricerca e di partecipare volontariamente. I dati saranno usati solo per fini di ricerca.',
    zh: '继续即表示你理解本研究目的并自愿参与。数据仅用于研究用途。',
  },
  ctaBook: { it: 'Prenota l’esperimento', zh: '预约实验' },
  ctaSurvey: { it: 'Compila il questionario', zh: '填写问卷' },

  bookTitle: { it: 'Prenota l’esperimento', zh: '预约实验' },
  bookSub: {
    it: 'Giorni lavorativi dal 28 settembre al 9 ottobre 2026. Una persona per fascia oraria.',
    zh: '开放工作日：2026年9月28日–10月9日。每个时段限 1 人。',
  },
  codeLabel: { it: 'Il tuo codice partecipante', zh: '你的参与者代码' },
  dateLabel: { it: 'Data', zh: '日期' },
  slotLabel: { it: 'Fascia oraria', zh: '时段' },
  slotFull: { it: '(pieno)', zh: '（已满）' },
  nameLabel: { it: 'Nome', zh: '姓名' },
  namePh: { it: 'Nome e cognome', zh: '姓名' },
  emailLabel: { it: 'Email', zh: '邮箱' },
  phoneLabel: { it: 'Telefono', zh: '电话' },
  noteLabel: { it: 'Note (opzionale)', zh: '备注（可选）' },
  bookSubmit: { it: 'Conferma prenotazione', zh: '确认预约' },
  sending: { it: 'Invio…', zh: '提交中…' },
  errPickSlot: {
    it: 'Seleziona data e fascia oraria.',
    zh: '请选择日期和时段。',
  },
  errContact: {
    it: 'Inserisci almeno un contatto: email o telefono.',
    zh: '请至少填写邮箱或电话以便联系。',
  },
  errName: { it: 'Inserisci il tuo nome.', zh: '请填写姓名。' },
  errSlotTaken: {
    it: 'Questa fascia oraria non è più disponibile.',
    zh: '该时段已满，请另选。',
  },
  errGeneric: { it: 'Invio non riuscito.', zh: '提交失败。' },

  demoTitle: { it: 'Dati anagrafici', zh: '人口学信息' },
  demoSub: {
    it: 'Compila queste informazioni prima della Parte 1 del questionario.',
    zh: '请在第一部分问卷之前填写以下信息。',
  },
  codePartecipante: { it: 'Codice partecipante', zh: '参与者代码' },
  ageLabel: { it: 'Età in anni', zh: '年龄（岁）' },
  sexLabel: { it: 'Sesso assegnato alla nascita', zh: '出生时指定的性别' },
  sexDonna: { it: 'Donna', zh: '女' },
  sexUomo: { it: 'Uomo', zh: '男' },
  sexIntersex: {
    it: 'Intersex / un’altra variazione',
    zh: '双性 / 其他',
  },
  sexPreferNot: {
    it: 'Preferisco non rispondere',
    zh: '不愿回答',
  },
  errAge: {
    it: 'Inserisci un’età valida (18–100).',
    zh: '请输入有效年龄（18–100）。',
  },
  errSex: {
    it: 'Seleziona il sesso assegnato alla nascita.',
    zh: '请选择出生时指定的性别。',
  },
  saving: { it: 'Salvataggio…', zh: '保存中…' },
  continueP1: { it: 'Continua alla Parte 1', zh: '继续到第一部分' },

  p1Title: { it: 'Parte 1 — PSS-10', zh: '第一部分 — PSS-10' },
  p1Sub: {
    it: 'Pensieri e sentimenti nell’ultimo mese (giorno prima dell’esperimento).',
    zh: '过去一个月的想法与感受（实验前一天）。',
  },
  errAllQuestions: {
    it: 'Rispondi a tutte le domande prima di continuare.',
    zh: '请答完所有题目后再继续。',
  },
  errMissingPrefix: {
    it: 'Domande ancora senza risposta: ',
    zh: '还有未作答的题目：',
  },
  sendToP2: { it: 'Invia e vai alla Parte 2', zh: '提交并进入第二部分' },

  p2Title: {
    it: 'Parte 2 — Dopo ogni condizione',
    zh: '第二部分 — 每种条件之后',
  },
  p2Sub: {
    it: 'Compila queste scale dopo ciascuna condizione (stressante o non stressante).',
    zh: '请在每种条件（压力 / 非压力）结束后填写这些量表。',
  },
  conditionLegend: {
    it: 'Condizione appena completata',
    zh: '刚刚完成的条件',
  },
  condStress: { it: 'Condizione stressante', zh: '压力条件' },
  condNonStress: { it: 'Condizione non stressante', zh: '非压力条件' },
  errCondition: {
    it: 'Seleziona la condizione e rispondi a tutte le domande obbligatorie.',
    zh: '请选择条件并完成所有必填题。',
  },
  sendToP3: { it: 'Invia e vai alla Parte 3', zh: '提交并进入第三部分' },

  p3Title: {
    it: 'Parte 3 — Fine dell’esperimento',
    zh: '第三部分 — 实验结束',
  },
  p3Sub: {
    it: 'SSQ (Simulator Sickness) e SUS (System Usability Scale).',
    zh: 'SSQ（模拟器晕动）与 SUS（系统可用性）。',
  },
  p3Note: {
    it: 'Le voci complete saranno aggiunte a breve. Puoi chiudere questa sezione e salvare lo stato attuale.',
    zh: '完整题目即将补充。你可以先结束本部分并保存当前状态。',
  },
  finishSurvey: { it: 'Concludi il questionario', zh: '完成问卷' },

  thanksTitle: { it: 'Grazie', zh: '谢谢' },
  thanksBookSub: {
    it: 'La prenotazione è stata registrata.',
    zh: '预约已登记。',
  },
  thanksSurveySub: {
    it: 'Le tue risposte sono state registrate.',
    zh: '你的回答已保存。',
  },
  thanksCode: { it: 'Codice partecipante:', zh: '参与者代码：' },
  thanksAppt: { it: 'Appuntamento:', zh: '预约时间：' },
  thanksKeep: {
    it: 'Conserva il codice: servirà per collegare prenotazione e questionario.',
    zh: '请保存该代码：用于关联预约与问卷。',
  },
  backHome: { it: 'Torna all’inizio', zh: '返回首页' },
  anotherCondition: {
    it: 'Compila un’altra condizione',
    zh: '再填另一种条件',
  },

  placeholderIt: {
    it: 'Questa sezione / queste domande sono ancora in corso di integrazione.',
    zh: '本部分 / 这些题目仍在补充中。',
  },
  placeholderEn: {
    it: 'This section / these items are still being finalized.',
    zh: 'This section / these items are still being finalized.',
  },
} as const

export type UiKey = keyof typeof ui

export function t(lang: Lang, key: UiKey): string {
  return ui[key][lang]
}
