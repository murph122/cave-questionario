import type { Lang } from './types'

export const ui = {
  brand: { it: 'CAVE Lab', zh: 'CAVE Lab' },
  navBook: { it: 'Prenota', zh: '预约' },
  navQr: { it: 'QR', zh: '二维码' },
  langIt: { it: 'Italiano', zh: 'Italiano' },
  langZh: { it: '中文', zh: '中文' },
  langAria: { it: 'Cambia lingua', zh: '切换语言' },

  welcomeTitle: {
    it: 'Stress, emozioni e immersione nel CAVE',
    zh: 'CAVE 中的压力、情绪与沉浸',
  },
  welcomeSub: {
    it: 'Scopri l’attività e prenota il tuo orario.',
    zh: '了解活动并预约时段。',
  },
  welcomeBody: {
    it: 'Questa esperienza nel CAVE esplora stress, emozioni e immersione. Prenota una fascia oraria; lo sperimentatore confermerà la tua prenotazione. Conserva il codice CAVE-XXXX ricevuto.',
    zh: '本活动在 CAVE 中探索压力、情绪与沉浸体验。请预约时段，实验者会确认你的预约。请保存收到的 CAVE-XXXX 代码。',
  },
  welcomeConsent: {
    it: 'Continuando dichiari di partecipare volontariamente. I dati di prenotazione sono usati solo per organizzare l’esperimento.',
    zh: '继续即表示自愿参与。预约信息仅用于安排实验。',
  },
  ctaBook: { it: 'Prenota', zh: '预约' },
  ctaQr: { it: 'QR per prenotare', zh: '扫码预约' },

  bookTitle: { it: 'Prenota l’esperimento', zh: '预约实验' },
  bookSub: {
    it: 'Giorni lavorativi 28 set – 9 ott 2026. Quattro fasce al giorno. Lo slot si blocca solo dopo conferma dello sperimentatore.',
    zh: '工作日 2026-09-28–10-09。每天四个时段。仅管理员确认后该时段才会锁定。',
  },
  codeLabel: { it: 'Il tuo codice partecipante', zh: '你的专属代码' },
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
  suggestTitle: {
    it: 'Orari vicini disponibili — tocca per selezionare:',
    zh: '临近可用时段 — 点击选用：',
  },
  errPickSlot: {
    it: 'Seleziona data e fascia oraria.',
    zh: '请选择日期和时段。',
  },
  errContact: {
    it: 'Inserisci almeno un contatto: email o telefono.',
    zh: '请至少填写邮箱或电话。',
  },
  errName: { it: 'Inserisci nome e cognome.', zh: '请填写姓名。' },
  errCode: {
    it: 'Inserisci un codice valido.',
    zh: '请填写有效代码。',
  },
  errSlotTaken: {
    it: 'Questa fascia oraria non è più disponibile.',
    zh: '该时段已满。',
  },
  errSlotTakenSuggest: {
    it: 'Fascia già prenotata. Scegli una delle alternative vicine sotto.',
    zh: '该时段已被预约。请从下方临近推荐中选择。',
  },
  errGeneric: { it: 'Invio non riuscito.', zh: '提交失败。' },
  errEmailRequired: {
    it: 'Inserisci un’email valida: ci invieremo conferma con codice, data e luogo.',
    zh: '请填写有效邮箱：系统会发送含代码、时间与地点的确认邮件。',
  },

  adminTitle: { it: 'Admin — Prenotazioni', zh: '管理 — 预约' },
  adminSub: { it: 'Accesso riservato allo sperimentatore.', zh: '仅实验管理者可访问。' },
  adminListSub: {
    it: 'Orario a sinistra; a destra le richieste in attesa e le confermate.',
    zh: '左侧为时间表；右侧分栏显示待确认与已确认预约。',
  },
  adminColPending: { it: 'In attesa', zh: '待确认' },
  adminColApproved: { it: 'Confermate', zh: '已确认' },
  adminSchedule: { it: 'Calendario fasce', zh: '时段时间表' },
  adminSlotFree: { it: 'Libero', zh: '空闲' },
  adminSlotPending: { it: 'richiesta', zh: '申请中' },
  adminNoneInCol: { it: 'Nessuna in questa colonna.', zh: '此栏暂无。' },
  adminPass: { it: 'Password admin', zh: '管理员密码' },
  adminLogin: { it: 'Accedi', zh: '登录' },
  adminBadPass: { it: 'Password non corretta.', zh: '密码错误。' },
  adminRefresh: { it: 'Aggiorna elenco', zh: '刷新列表' },
  adminEmpty: { it: 'Nessuna prenotazione.', zh: '暂无预约。' },
  adminApprove: { it: 'Conferma', zh: '确认' },
  adminRevoke: { it: 'Revoca', zh: '撤销确认' },
  adminCancel: { it: 'Annulla', zh: '取消预约' },
  adminManualLabel: {
    it: 'Conferma con codice (anche se non compare in elenco)',
    zh: '用代码确认（列表没有也能确认）',
  },
  adminManualApprove: { it: 'Conferma questo codice', zh: '确认此代码' },
  adminManualHint: {
    it: 'Chiedi al partecipante il codice CAVE-XXXX mostrato dopo la prenotazione, incollalo e conferma.',
    zh: '让参与者告诉你预约后显示的 CAVE-XXXX，粘贴后点确认即可。',
  },
  adminHealthOk: { it: 'Webhook Sheets OK', zh: '表格连接正常' },
  adminHealthFail: {
    it: 'Webhook Sheets non risponde — ridistribuisci Code.gs e aggiorna SHEETS_WEBHOOK_URL',
    zh: '表格 Webhook 无响应 — 请重新部署 Code.gs 并更新 SHEETS_WEBHOOK_URL',
  },
  adminEmptyHint: {
    it: 'Elenco vuoto = nessuna riga nel foglio Bookings. 1) Ridistribuisci apps-script/Code.gs 2) Fai una nuova prenotazione su /prenota 3) Aggiorna qui. Se la prenotazione fallisce, controlla SHEETS_WEBHOOK_URL su Vercel.',
    zh: '列表为空 = Google 表 Bookings 里没有预约。请：1）重新部署 apps-script/Code.gs 2）在 /prenota 再预约一次 3）点刷新。若预约失败，检查 Vercel 的 SHEETS_WEBHOOK_URL。',
  },
  adminLoadFail: {
    it: 'Impossibile caricare le prenotazioni. Ridistribuisci lo script Apps Script.',
    zh: '无法加载预约列表。请重新部署 Apps Script。',
  },

  qrTitle: { it: 'QR prenotazione', zh: '预约二维码' },
  qrSub: {
    it: 'Inserisci l’URL pubblico del sito (Vercel), poi scarica il QR.',
    zh: '填写网站的公网地址（Vercel），再生成/下载二维码。',
  },
  qrUrlLabel: { it: 'URL pubblico del sito', zh: '网站公网地址' },
  qrLocalWarn: {
    it: 'Attenzione: localhost / IP locale NON funziona sul telefono. Incolla l’URL Vercel (https://….vercel.app).',
    zh: '注意：localhost / 局域网地址手机打不开。请粘贴 Vercel 公网地址（https://….vercel.app）。',
  },
  qrNeedPublic: {
    it: 'Incolla qui l’URL pubblico da Vercel → Domains / Visit (es. https://nome.vercel.app).',
    zh: '请在此粘贴 Vercel → Domains / Visit 里的公网地址（如 https://名字.vercel.app）。',
  },
  qrWaiting: {
    it: 'Il QR appare solo con un URL https pubblico valido.',
    zh: '只有填写有效的 https 公网地址后才会生成二维码。',
  },
  qrHint: {
    it: 'Apri il sito su Vercel (non localhost), vai su /qr, controlla che sotto al QR ci sia https://….vercel.app/prenota, poi scarica.',
    zh: '请用手机浏览器能打开的 Vercel 网站进入 /qr，确认二维码下方是 https://….vercel.app/prenota，再下载/扫码。',
  },
  qrDownload: { it: 'Scarica PNG', zh: '下载 PNG' },

  thanksTitle: { it: 'Grazie', zh: '谢谢' },
  thanksBookSub: {
    it: 'Prenotazione inviata — in attesa di conferma.',
    zh: '预约已提交 — 等待确认。',
  },
  thanksBookWait: {
    it: 'Conserva il codice. Lo sperimentatore confermerà la prenotazione.',
    zh: '请保存代码。实验者会确认你的预约。',
  },
  thanksBookEmail: {
    it: 'Ti abbiamo inviato un’email di conferma (controlla anche lo spam).',
    zh: '确认邮件已发送（请同时查看垃圾箱）。',
  },
  thanksCode: { it: 'Codice:', zh: '代码：' },
  thanksAppt: { it: 'Appuntamento:', zh: '预约时间：' },
  backHome: { it: 'Torna all’inizio', zh: '返回首页' },
} as const

export type UiKey = keyof typeof ui

export function t(lang: Lang, key: UiKey): string {
  return ui[key][lang]
}
