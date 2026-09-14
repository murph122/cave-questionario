import type { Lang } from './types'

export const ui = {
  brand: { it: 'CAVE Lab', zh: 'CAVE Lab' },
  navBook: { it: 'Prenota', zh: '预约' },
  navSurvey: { it: 'Accedi', zh: '进入问卷' },
  navQr: { it: 'QR', zh: '二维码' },
  langIt: { it: 'Italiano', zh: 'Italiano' },
  langZh: { it: '中文', zh: '中文' },
  langAria: { it: 'Cambia lingua', zh: '切换语言' },

  welcomeTitle: {
    it: 'Stress, emozioni e immersione nel CAVE',
    zh: 'CAVE 中的压力、情绪与沉浸',
  },
  welcomeSub: {
    it: 'Prenota → attendi approvazione → compila con il tuo ID CAVE.',
    zh: '预约 → 等待管理员批准 → 用专属 ID 填写问卷。',
  },
  welcomeBody: {
    it: 'Devi prima prenotare un orario. Dopo l’approvazione dello sperimentatore potrai entrare con il codice CAVE-XXXX. Entrambe le condizioni (stressante e non stressante) sono obbligatorie.',
    zh: '必须先预约时段。管理员批准后，用专属代码 CAVE-XXXX 进入。压力与非压力两种条件都必须填写完整，才会写入表格。',
  },
  welcomeConsent: {
    it: 'Continuando dichiari di partecipare volontariamente. I dati sono usati solo per fini scientifici.',
    zh: '继续即表示自愿参与。数据仅用于科研。',
  },
  ctaBook: { it: '1. Prenota', zh: '1. 预约' },
  ctaAccess: { it: '2. Entra con ID', zh: '2. 用 ID 进入' },
  ctaSurvey: { it: 'Questionario', zh: '问卷' },
  ctaQr: { it: 'QR per prenotare', zh: '扫码预约' },

  bookTitle: { it: 'Prenota l’esperimento', zh: '预约实验' },
  bookSub: {
    it: 'Giorni lavorativi 28 set – 9 ott 2026. Una persona per fascia. Conserva il codice CAVE.',
    zh: '工作日 2026-09-28–10-09。每时段 1 人。请保存 CAVE 代码。',
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

  accessTitle: { it: 'Entra nel questionario', zh: '进入问卷' },
  accessSub: {
    it: 'Inserisci il codice CAVE ricevuto dopo la prenotazione. Serve l’approvazione dello sperimentatore.',
    zh: '输入预约后获得的 CAVE 代码。需管理员批准后才能填写。',
  },
  accessCodeLabel: { it: 'Codice CAVE', zh: 'CAVE 代码' },
  accessSubmit: { it: 'Verifica e continua', zh: '验证并继续' },
  accessNeedBook: {
    it: 'Non hai ancora prenotato?',
    zh: '还没有预约？',
  },
  accessPending: {
    it: 'Prenotazione trovata, in attesa di approvazione. Contatta lo sperimentatore o riprova più tardi.',
    zh: '已找到预约，仍在等待管理员批准。请联系实验者或稍后再试。',
  },
  accessCancelled: {
    it: 'Questa prenotazione è stata annullata.',
    zh: '该预约已取消。',
  },
  accessDone: {
    it: 'Questo codice ha già completato l’esperimento.',
    zh: '该代码已完成实验。',
  },
  errAccessCode: {
    it: 'Inserisci un codice CAVE valido (es. CAVE-AB12).',
    zh: '请输入有效的 CAVE 代码（如 CAVE-AB12）。',
  },
  errAccessNotFound: {
    it: 'Codice non trovato. Controlla o prenota prima.',
    zh: '未找到该代码。请核对，或先完成预约。',
  },

  adminTitle: { it: 'Admin — Approvazioni', zh: '管理 — 审批' },
  adminSub: { it: 'Accesso riservato allo sperimentatore.', zh: '仅实验管理者可访问。' },
  adminListSub: {
    it: 'Approva i partecipanti per sbloccare il questionario.',
    zh: '批准后测试者才能填写问卷。',
  },
  adminPass: { it: 'Password admin', zh: '管理员密码' },
  adminLogin: { it: 'Accedi', zh: '登录' },
  adminBadPass: { it: 'Password non corretta.', zh: '密码错误。' },
  adminRefresh: { it: 'Aggiorna elenco', zh: '刷新列表' },
  adminEmpty: { it: 'Nessuna prenotazione.', zh: '暂无预约。' },
  adminApprove: { it: 'Approva', zh: '批准' },
  adminRevoke: { it: 'Revoca', zh: '撤销批准' },
  adminCancel: { it: 'Annulla', zh: '取消预约' },
  adminManualLabel: {
    it: 'Approva con codice (anche se non compare in elenco)',
    zh: '用代码批准（列表没有也能批）',
  },
  adminManualApprove: { it: 'Approva questo codice', zh: '批准此代码' },
  adminManualHint: {
    it: 'Chiedi al partecipante il codice CAVE-XXXX mostrato dopo la prenotazione, incollalo e approva.',
    zh: '让测试者告诉你预约后显示的 CAVE-XXXX，粘贴后点批准即可进入问卷。',
  },
  adminHealthOk: { it: 'Webhook Sheets OK', zh: '表格连接正常' },
  adminHealthFail: {
    it: 'Webhook Sheets non risponde — ridistribuisci Code.gs e aggiorna SHEETS_WEBHOOK_URL',
    zh: '表格 Webhook 无响应 — 请重新部署 Code.gs 并更新 SHEETS_WEBHOOK_URL',
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

  adminEmptyHint: {
    it: 'Elenco vuoto = nessuna riga nel foglio Bookings. 1) Ridistribuisci apps-script/Code.gs 2) Fai una nuova prenotazione su /prenota 3) Aggiorna qui. Se la prenotazione fallisce, controlla SHEETS_WEBHOOK_URL su Vercel.',
    zh: '列表为空 = Google 表 Bookings 里没有预约。请：1）重新部署 apps-script/Code.gs 2）在 /prenota 再预约一次 3）点刷新。若预约失败，检查 Vercel 的 SHEETS_WEBHOOK_URL。',
  },
  adminLoadFail: {
    it: 'Impossibile caricare le prenotazioni. Ridistribuisci lo script Apps Script.',
    zh: '无法加载预约列表。请重新部署 Apps Script。',
  },
  errEmailRequired: {
    it: 'Inserisci un’email valida: ci invieremo conferma con codice, data e luogo.',
    zh: '请填写有效邮箱：系统会发送含代码、时间与地点的确认邮件。',
  },
  thanksBookEmail: {
    it: 'Ti abbiamo inviato un’email di conferma (controlla anche lo spam).',
    zh: '确认邮件已发送（请同时查看垃圾箱）。',
  },

  demoTitle: { it: 'Prima dell’esperienza — Dati', zh: '体验前 — 基本信息' },
  demoSub: {
    it: 'Compila questi dati prima dell’esperienza nel CAVE.',
    zh: '请在进入 CAVE 体验前填写。',
  },
  bookingIdLabel: { it: 'Codice prenotazione (CAVE)', zh: '预约代码（CAVE）' },
  errAge: {
    it: 'Inserisci un’età valida (16–100).',
    zh: '请输入有效年龄（16–100）。',
  },
  saving: { it: 'Salvataggio…', zh: '保存中…' },
  continueDemo: { it: 'Continua ai dati anagrafici', zh: '继续填写基本信息' },
  continueSession: { it: 'Continua alle scale di sessione', zh: '继续填写会话量表' },

  p1Title: { it: 'Baseline — PSS-10', zh: '基线 — PSS-10' },
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
  errPartsIncomplete: {
    it: 'Parti ancora incomplete: ',
    zh: '仍有未完成部分：',
  },

  p2Title: { it: 'Dopo ogni ambiente', zh: '每种环境之后' },
  p2Sub: {
    it: 'Compila ENTRAMBE le condizioni (stressante e non stressante).',
    zh: '必须填写两种条件（压力 + 非压力）。',
  },
  bothConditionsHint: {
    it: 'Stato condizioni:',
    zh: '条件进度：',
  },
  alreadySaved: { it: 'già salvata', zh: '已保存' },
  needStress: {
    it: 'Condizione salvata. Ora compila la condizione stressante.',
    zh: '已保存。请继续填写压力条件。',
  },
  needNonStress: {
    it: 'Condizione salvata. Ora compila la condizione non stressante.',
    zh: '已保存。请继续填写非压力条件。',
  },
  saveCondition: { it: 'Salva questa condizione', zh: '保存本条件' },
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
  sendToP3: { it: 'Vai alla fine esperienza', zh: '进入结束量表' },

  p3Title: { it: 'Fine esperienza — SSQ & SUS', zh: '体验结束 — SSQ 与 SUS' },
  p3Sub: {
    it: 'Compila SSQ e SUS. Solo a questo punto i dati vanno sul Google Sheet.',
    zh: '填写 SSQ 与 SUS。全部完成后才会写入 Google 表格。',
  },
  p3Note: {
    it: 'Servono PSS, anagrafica, entrambe le condizioni, SSQ e SUS.',
    zh: '需完成 PSS、基本信息、两种条件、SSQ 与 SUS。',
  },
  ssqAltro: { it: 'Altro (descrivi)', zh: '其他（请描述）' },
  ssqAltroPh: { it: 'Eventuali altri sintomi…', zh: '其他症状…' },
  finishSurvey: { it: 'Invia e completa l’esperimento', zh: '提交并完成实验' },

  completeTitle: { it: 'Esperimento completato', zh: '实验完成' },
  completeBody: {
    it: 'Grazie. Tutte le sezioni sono state salvate sul foglio di calcolo.',
    zh: '谢谢。所有部分已完整写入表格。',
  },
  completeOk: { it: 'Chiudi', zh: '关闭' },

  thanksTitle: { it: 'Grazie', zh: '谢谢' },
  thanksBookSub: {
    it: 'Prenotazione inviata — in attesa di approvazione.',
    zh: '预约已提交 — 等待管理员批准。',
  },
  thanksBookWait: {
    it: 'Conserva il codice. Quando lo sperimentatore approva, usa “Entra con ID”.',
    zh: '请保存代码。管理员批准后，点「用 ID 进入」填写问卷。',
  },
  thanksSurveySub: {
    it: 'Esperimento completato.',
    zh: '实验已完成。',
  },
  thanksCode: { it: 'Codice:', zh: '代码：' },
  thanksAppt: { it: 'Appuntamento:', zh: '预约时间：' },
  thanksKeep: {
    it: 'Puoi chiudere questa pagina.',
    zh: '可以关闭本页。',
  },
  backHome: { it: 'Torna all’inizio', zh: '返回首页' },
  anotherCondition: {
    it: 'Compila l’altra condizione',
    zh: '填写另一种条件',
  },

  syncGoogleHint: {
    it: 'I dati restano sul dispositivo finché non completi tutte le parti.',
    zh: '全部部分完成前，数据只保存在本机。',
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
