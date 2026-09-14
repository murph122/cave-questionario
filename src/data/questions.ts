import { L, type Loc } from '../i18n/types'

export type LikertQuestion = {
  id: string
  text: Loc
  low: Loc
  high: Loc
  reverse?: boolean
  placeholder?: boolean
}

export type QuestionGroup = {
  id: string
  title: Loc
  description?: boolean
  questions: LikertQuestion[]
}

const MAI = L('Mai', '从不')
const MOLTO_SPESSO = L('Molto spesso', '非常频繁')
const SEMPRE = L('Sempre', '总是')
const PER_NIENTE = L('Per niente', '完全没有')
const MOLTO = L('Molto', '非常')
const DAVVERO_TANTO = L('Davvero tanto', '非常多')
const DISACCORDO = L('Totalmente in disaccordo', '完全不同意')
const ACCORDO = L('Totalmente in accordo', '完全同意')

export const SESSO_OPTION_KEYS = [
  'sexDonna',
  'sexUomo',
  'sexIntersex',
  'sexPreferNot',
] as const

export const SESSO_VALUES = [
  'donna',
  'uomo',
  'intersex',
  'preferisco_non_rispondere',
] as const

export const PSS_QUESTIONS: LikertQuestion[] = [
  {
    id: 'PSS1',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito turbato per qualcosa che le è successa inaspettatamente?',
      '在过去一个月中，你有多经常因为意外发生的事情而感到心烦意乱？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS2',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito incapace di gestire le cose importanti della sua vita?',
      '在过去一个月中，你有多经常感到无法掌控生活中的重要事情？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS3',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito teso e “stressato”?',
      '在过去一个月中，你有多经常感到紧张或“有压力”？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS4',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito sicuro della sua abilità di gestire i problemi personali?',
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
      'Nell’ultimo mese, quanto spesso si è sentito capace di controllare le cose irritanti della sua vita?',
      '在过去一个月中，你有多经常感到能够控制生活中令人恼火的事情？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS8',
    text: L(
      'Nell’ultimo mese, quanto spesso si è sentito di avere le cose sotto controllo?',
      '在过去一个月中，你有多经常感到一切都在掌控之中？',
    ),
    low: MAI,
    high: MOLTO_SPESSO,
  },
  {
    id: 'PSS9',
    text: L(
      'Nell’ultimo mese, quanto spesso si è arrabbiato per cose che sfuggivano al suo controllo?',
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
          'Quanto ti sei sentita/o attivata/o durante questa fase?',
          '在这一阶段，你感到有多兴奋/激活？',
        ),
        low: L('Molto calmo', '非常平静'),
        high: L('Molto attivo', '非常兴奋'),
      },
      {
        id: 'SAM2_Valence',
        text: L(
          'Quanto è stata piacevole o spiacevole questa fase per te?',
          '这一阶段对你来说有多愉快或不愉快？',
        ),
        low: L('Molto spiacevole', '非常不愉快'),
        high: L('Molto piacevole', '非常愉快'),
      },
      {
        id: 'SAM3_Dominance',
        text: L(
          'Quanto ti sei sentita/o in controllo durante questa fase?',
          '在这一阶段，你感到有多处于掌控之中？',
        ),
        low: L('Per nulla in controllo', '完全没有掌控感'),
        high: L('Completamente in controllo', '完全掌控'),
      },
    ],
  },
  {
    id: 'sssq',
    title: L(
      'SSSQ — Short Stress State Questionnaire',
      'SSSQ — 短式压力状态问卷',
    ),
    questions: [
      { id: 'SSSQ1', text: L('Impaziente', '不耐烦'), low: MAI, high: SEMPRE },
      { id: 'SSSQ2', text: L('Irritato', '恼怒'), low: MAI, high: SEMPRE },
      { id: 'SSSQ3', text: L('Irritabile', '易怒'), low: MAI, high: SEMPRE },
      { id: 'SSSQ4', text: L('Stressato', '有压力'), low: MAI, high: SEMPRE },
    ],
  },
  {
    id: 'ieq',
    title: L(
      'IEQ-SF — Immersive Experience Questionnaire (Short Form)',
      'IEQ-SF — 沉浸体验问卷（简版）',
    ),
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
        high: MOLTO,
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
      },
    ],
  },
  {
    id: 'ipq',
    title: L('IPQ — Igroup Presence Questionnaire', 'IPQ — 临场感问卷'),
    description: true,
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
          'Voce IPQ7 — testo in corso di integrazione.',
          'IPQ7 题目 — 文案补充中。',
        ),
        low: DISACCORDO,
        high: ACCORDO,
        placeholder: true,
      },
    ],
  },
]
