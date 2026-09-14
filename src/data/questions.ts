import { L, type Loc } from '../i18n/types'

export type SamVisual = 'arousal' | 'valence' | 'dominance'

export type LikertQuestion = {
  id: string
  text: Loc
  low: Loc
  high: Loc
  reverse?: boolean
  placeholder?: boolean
  max?: 4 | 5 | 10
  /** SAM pictorial scale (Self-Assessment Manikin) */
  sam?: SamVisual
}

export type QuestionGroup = {
  id: string
  title: Loc
  description?: boolean
  questions: LikertQuestion[]
}

export type TextField = {
  id: string
  label: Loc
  placeholder?: Loc
  required?: boolean
}

const MAI = L('Mai', '从不')
const MOLTO_SPESSO = L('Molto spesso', '非常频繁')
const SEMPRE = L('Sempre', '总是')
const PER_NIENTE = L('Per niente', '完全没有')
const MOLTO = L('Molto', '非常')
const DAVVERO_TANTO = L('Davvero tanto', '非常多')
const DISACCORDO = L('Totalmente in disaccordo', '完全不同意')
const ACCORDO = L('Totalmente in accordo', '完全同意')
const SUS_LOW = L('Fortemente in disaccordo', '强烈不同意')
const SUS_HIGH = L('Fortemente in accordo', '强烈同意')
const SSQ_LOW = L('Nessuno', '无')
const SSQ_HIGH = L('Forte', '强烈')

export const DEMO_FIELDS: TextField[] = [
  {
    id: 'nome',
    label: L('Nome', '名'),
    placeholder: L('Nome', '名'),
    required: true,
  },
  {
    id: 'cognome',
    label: L('Cognome', '姓'),
    placeholder: L('Cognome', '姓'),
    required: true,
  },
  {
    id: 'codicePersonale',
    label: L(
      'Codice personale (prime tre lettere del nome + prime tre del cognome, es. Mario Rossi → MARROS)',
      '个人代码（名的前三个字母 + 姓的前三个字母，如 Mario Rossi → MARROS）',
    ),
    placeholder: L('MARROS', 'MARROS'),
    required: true,
  },
  {
    id: 'eta',
    label: L('Età in anni', '年龄（岁）'),
    placeholder: L('es. 24', '例如 24'),
    required: true,
  },
]

export const PSS_QUESTIONS: LikertQuestion[] = [
  {
    id: 'PSS1',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a turbato/a per qualcosa che le è successa inaspettatamente?',
      '在过去一个月中，你有多经常因为意外发生的事情而感到心烦意乱？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS2',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a incapace di gestire le cose importanti della sua vita?',
      '在过去一个月中，你有多经常感到无法掌控生活中的重要事情？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS3',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a teso/a e “stressato/a”?',
      '在过去一个月中，你有多经常感到紧张或“有压力”？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS4',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a sicuro/a della sua abilità di gestire i problemi personali?',
      '在过去一个月中，你有多经常对自己处理个人问题的能力感到有把握？',
    ),
    low: MAI,
    high: SEMPRE,
  },
  {
    id: 'PSS5',
    text: L(
      'Nell’ultimo mese, quanto spesso ha sentito che le cose stavano andando per il verso giusto?',
      '在过去一个月中，你有多经常觉得事情正朝着正确方向发展？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS6',
    text: L(
      'Nell’ultimo mese, quanto spesso si è trovato nella situazione di non riuscire ad affrontare tutte le cose che doveva fare?',
      '在过去一个月中，你有多经常发现自己应付不了必须完成的所有事情？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS7',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a capace di controllare le cose irritanti della sua vita?',
      '在过去一个月中，你有多经常感到能够控制生活中令人恼火的事情？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS8',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito/a di avere le cose sotto controllo?',
      '在过去一个月中，你有多经常感到一切都在掌控之中？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS9',
    text: L(
      'Nell’ultimo mese, quanto spesso si è arrabbiato/a per cose che sfuggivano al suo controllo?',
      '在过去一个月中，你有多经常因为事情超出自己的控制而生气？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS10',
    text: L(
      'Nell’ultimo mese, quanto spesso ha avvertito che le difficoltà si stavano tanto accumulando da non riuscire a superarle?',
      '在过去一个月中，你有多经常觉得困难堆积到无法克服的程度？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
]

export const SESSION_GROUPS: QuestionGroup[] = [
  {
    id: 'sam',
    title: L('SAM — Self-Assessment Manikin', 'SAM — 自我评估小人量表'),
    questions: [
      {
        id: 'SAM1_Arousal',
        text: L(
          'Quanto ti sei sentita/o attivata/o durante questa fase? (Arousal)',
          '在这一阶段，你感到有多兴奋/激活？（唤醒度）',
        ),
        low: L('Molto calmo / Low', '非常平静 / Low'),
        high: L('Molto attivo / High', '非常兴奋 / High'),
        sam: 'arousal',
      },
      {
        id: 'SAM2_Valence',
        text: L(
          'Quanto è stata piacevole o spiacevole questa fase per te? (Valence)',
          '这一阶段对你来说有多愉快或不愉快？（效价）',
        ),
        low: L('Molto spiacevole', '非常不愉快'),
        high: L('Molto piacevole', '非常愉快'),
        sam: 'valence',
      },
      {
        id: 'SAM3_Dominance',
        text: L(
          'Quanto ti sei sentita/o in controllo durante questa fase? (Dominance)',
          '在这一阶段，你感到有多处于掌控之中？（支配感）',
        ),
        low: L('Per nulla in controllo', '完全没有掌控感'),
        high: L('Completamente in controllo', '完全掌控'),
        sam: 'dominance',
      },
    ],
  },
  {
    id: 'ieq',
    title: L('IEQ-SF — Immersive Experience Questionnaire', 'IEQ-SF — 沉浸体验问卷（简版）'),
    questions: [
      {
        id: 'IEQ-SF1',
        text: L(
          'In che misura ti sei sentito/a concentrato/a sulla simulazione? (INV)',
          '你在多大程度上专注于模拟？(INV)',
        ),
        low: PER_NIENTE,
        high: MOLTO,
      },
      {
        id: 'IEQ-SF2',
        text: L(
          'In che misura eri consapevole del mondo reale mentre eri nell’ambiente? (RWD)',
          '在环境中时，你在多大程度上仍意识到现实世界？(RWD)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
        reverse: true,
      },
      {
        id: 'IEQ-SF3',
        text: L(
          'In che misura hai dimenticato le tue preoccupazioni quotidiane? (RWD)',
          '你在多大程度上忘记了日常烦恼？(RWD)',
        ),
        low: PER_NIENTE,
        high: MOLTO,
      },
      {
        id: 'IEQ-SF4',
        text: L(
          'In che misura hai percepito di essere separato/a dal mondo reale? (RWD)',
          '你在多大程度上感到与现实世界分离？(RWD)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
      },
      {
        id: 'IEQ-SF5',
        text: L(
          'In che misura hai sentito che la simulazione fosse qualcosa che stavi vivendo, piuttosto che semplicemente facendo? (INV)',
          '你在多大程度上觉得模拟是你正在“经历”的，而不只是“在做”的事情？(INV)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
      },
      {
        id: 'IEQ-SF6',
        text: L(
          'Ti è capitato di essere così coinvolto/a da non renderti conto di usare i comandi? (RWD)',
          '你是否曾因投入太深而意识不到自己在使用控制器？(RWD)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
      },
      {
        id: 'IEQ-SF7',
        text: L(
          'In che misura hai trovato la simulazione impegnativa? (Ch)',
          '你觉得模拟有多具有挑战性？(Ch)',
        ),
        low: PER_NIENTE,
        high: L('Davvero difficile', '非常困难'),
      },
      {
        id: 'IEQ-SF8',
        text: L(
          'In che misura ti sei sentito/a motivato/a mentre eri nell’ambiente? (INV)',
          '在环境中时，你感到有多有动力？(INV)',
        ),
        low: PER_NIENTE,
        high: MOLTO,
      },
      {
        id: 'IEQ-SF9',
        text: L(
          'In che misura hai trovato la simulazione facile? (Ch)',
          '你觉得模拟有多容易？(Ch)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
        reverse: true,
      },
      {
        id: 'IEQ-SF10',
        text: L(
          'Ero in tensione perché non sapevo se avrei avuto successo o meno nella simulazione? (Ch)',
          '因为不确定自己能否在模拟中成功，我感到紧张。(Ch)',
        ),
        low: PER_NIENTE,
        high: DAVVERO_TANTO,
      },
      {
        id: 'IEQ-SF11',
        text: L(
          'Quanto diresti di aver apprezzato la simulazione? (INV)',
          '你会说自己有多喜欢这次模拟？(INV)',
        ),
        low: PER_NIENTE,
        high: MOLTO,
      },
      {
        id: 'IEQ-SF12',
        text: L('Quanto ti sei sentito immerso/a?', '你感到有多沉浸？'),
        low: L('Per nulla', '完全没有'),
        high: MOLTO,
        max: 10,
      },
    ],
  },
  {
    id: 'ipq',
    title: L('IPQ — Igroup Presence Questionnaire', 'IPQ — 临场感问卷'),
    questions: [
      {
        id: 'IPQ1_G1',
        text: L(
          'Avevo la sensazione di essere davvero lì nel mondo virtuale.',
          '我感觉自己真的置身于虚拟世界之中。',
        ),
        low: PER_NIENTE,
        high: MOLTO,
      },
      {
        id: 'IPQ2_SP1',
        text: L(
          'Ho percepito che il mondo virtuale mi circondava.',
          '我感觉虚拟世界包围着我。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ3_SP2',
        text: L(
          'Mi sembrava di guardare semplicemente delle immagini, non di essere immerso/a.',
          '我感觉只是在看一些画面，而不是沉浸其中。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
        reverse: true,
      },
      {
        id: 'IPQ4_SP3',
        text: L(
          'Non ho avuto la sensazione di trovarmi nello spazio virtuale.',
          '我没有感到自己身处虚拟空间中。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ5_SP4',
        text: L(
          'Avevo la sensazione di agire dentro lo spazio virtuale, non di controllarlo dall’esterno.',
          '我感觉是在虚拟空间内部行动，而不是从外部控制它。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ6_SP5',
        text: L(
          'Mi sono sentito/a presente nello spazio virtuale.',
          '我感到自己临场于虚拟空间中。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ7_INV1',
        text: L(
          'Quanto eri consapevole del mondo reale attorno a te durante la navigazione nel CAVE?',
          '在 CAVE 中导航时，你对周围现实世界有多清醒？',
        ),
        low: L('Molto consapevole', '非常清醒'),
        high: L('Per niente consapevole', '完全不察觉'),
      },
      {
        id: 'IPQ8_INV2',
        text: L(
          'Non ero consapevole dell’ambiente reale.',
          '我没有意识到现实环境。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ9_INV3',
        text: L(
          'Continuavo a prestare attenzione all’ambiente reale.',
          '我仍然在注意现实环境。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
        reverse: true,
      },
      {
        id: 'IPQ10_INV4',
        text: L(
          'Ero completamente catturato/a dal mondo virtuale.',
          '我被虚拟世界完全吸引。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
      {
        id: 'IPQ11_REAL1',
        text: L(
          'Quanto il mondo virtuale ti è sembrato realistico?',
          '虚拟世界对你来说有多真实？',
        ),
        low: L('Completamente reale', '完全真实'),
        high: L('Non reale', '不真实'),
        reverse: true,
      },
      {
        id: 'IPQ12_REAL2',
        text: L(
          'Quanto la tua esperienza nel VE ti è sembrata coerente con quella del mondo reale?',
          '你在虚拟环境中的体验与现实世界有多一致？',
        ),
        low: L('Non coerente', '不一致'),
        high: L('Molto coerente', '非常一致'),
      },
      {
        id: 'IPQ13_REAL3',
        text: L(
          'Quanto il mondo virtuale ti è sembrato reale?',
          '虚拟世界对你来说显得有多真实？',
        ),
        low: L('Reale quanto un mondo immaginario', '像想象中的世界一样'),
        high: L('Indistinguibile dal mondo reale', '与现实世界无法区分'),
      },
      {
        id: 'IPQ14_REAL4',
        text: L(
          'Il mondo virtuale mi è sembrato più realistico del mondo reale.',
          '虚拟世界对我来说比现实世界更真实。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
      },
    ],
  },
  {
    id: 'sssq',
    title: L('SSSQ — Short Stress State Questionnaire', 'SSSQ — 短式压力状态问卷'),
    questions: [
      { id: 'SSSQ1', text: L('Impaziente', '不耐烦'), low: MAI, high: SEMPRE },
      { id: 'SSSQ2', text: L('Irritato', '恼怒'), low: MAI, high: SEMPRE },
      { id: 'SSSQ3', text: L('Irritabile', '易怒'), low: MAI, high: SEMPRE },
      { id: 'SSSQ4', text: L('Stressato', '有压力'), low: MAI, high: SEMPRE },
    ],
  },
]

export const SSQ_QUESTIONS: LikertQuestion[] = [
  { id: 'SSQ1', text: L('Malessere generale', '总体不适'), low: SSQ_LOW, high: SSQ_HIGH, max: 4 },
  { id: 'SSQ2', text: L('Fatica', '疲劳'), low: L('Nessuna', '无'), high: SSQ_HIGH, max: 4 },
  { id: 'SSQ3', text: L('Mal di testa', '头痛'), low: SSQ_LOW, high: SSQ_HIGH, max: 4 },
  { id: 'SSQ4', text: L('Dolore agli occhi', '眼痛'), low: SSQ_LOW, high: SSQ_HIGH, max: 4 },
  {
    id: 'SSQ5',
    text: L('Difficoltà di messa a fuoco', '对焦困难'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  {
    id: 'SSQ6',
    text: L('Aumentata salivazione', '唾液增多'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  { id: 'SSQ7', text: L('Sudorazione', '出汗'), low: L('Nessuna', '无'), high: SSQ_HIGH, max: 4 },
  { id: 'SSQ8', text: L('Nausea', '恶心'), low: L('Nessuna', '无'), high: SSQ_HIGH, max: 4 },
  {
    id: 'SSQ9',
    text: L('Difficoltà di concentrazione', '注意力难以集中'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  {
    id: 'SSQ10',
    text: L('Sensazione di pressione alla testa', '头部压迫感'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  {
    id: 'SSQ11',
    text: L('Visione confusa', '视觉模糊'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  {
    id: 'SSQ12',
    text: L('Capogiro (ad occhi aperti)', '头晕（睁眼）'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  {
    id: 'SSQ13',
    text: L('Capogiro (ad occhi chiusi)', '头晕（闭眼）'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  { id: 'SSQ14', text: L('Vertigini', '眩晕'), low: L('Nessuna', '无'), high: SSQ_HIGH, max: 4 },
  {
    id: 'SSQ15',
    text: L('Mal di pancia', '胃痛'),
    low: L('Nessuna', '无'),
    high: SSQ_HIGH,
    max: 4,
  },
  { id: 'SSQ16', text: L('Eruttamento', '嗳气'), low: SSQ_LOW, high: SSQ_HIGH, max: 4 },
]

export const SUS_QUESTIONS: LikertQuestion[] = [
  {
    id: 'SUS1',
    text: L(
      'Penso che mi piacerebbe utilizzare il CAVE frequentemente.',
      '我认为我会愿意经常使用 CAVE。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS2',
    text: L(
      'Ho trovato il CAVE complesso senza che ce ne fosse bisogno.',
      '我觉得 CAVE 不必要地复杂。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS3',
    text: L('Ho trovato il CAVE molto semplice da usare.', '我觉得 CAVE 非常容易使用。'),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS4',
    text: L(
      'Penso che avrei bisogno del supporto di una persona già in grado di utilizzare il CAVE.',
      '我认为我需要已经会用 CAVE 的人来协助。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS5',
    text: L(
      'Ho trovato le varie funzionalità del CAVE bene integrate.',
      '我觉得 CAVE 的各项功能整合得很好。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS6',
    text: L(
      'Ho trovato incoerenze tra le varie funzionalità del CAVE.',
      '我觉得 CAVE 各项功能之间存在不一致。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS7',
    text: L(
      'Penso che la maggior parte delle persone potrebbero imparare ad utilizzare il CAVE facilmente.',
      '我认为大多数人都能轻松学会使用 CAVE。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS8',
    text: L('Ho trovato il CAVE molto macchinoso da usare.', '我觉得 CAVE 用起来很笨拙。'),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS9',
    text: L(
      'Ho avuto molta confidenza con il CAVE durante l’uso.',
      '使用 CAVE 时我很有信心。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
  {
    id: 'SUS10',
    text: L(
      'Ho avuto bisogno di imparare molti processi prima di riuscire ad utilizzare al meglio il CAVE.',
      '在充分使用 CAVE 之前，我需要学习很多步骤。',
    ),
    low: SUS_LOW,
    high: SUS_HIGH,
  },
]
