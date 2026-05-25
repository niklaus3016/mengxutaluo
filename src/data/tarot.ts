export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string;
  meaning_up: string;
  meaning_rev: string;
  keywords: string[];
  description: string;
}

// Map old IDs to new image filenames
const imageMap: Record<string, string> = {
  // Major Arcana
  'm00': 'the-fool',
  'm01': 'the-magician',
  'm02': 'the-high-priestess',
  'm03': 'the-empress',
  'm04': 'the-emperor',
  'm05': 'the-hierophant',
  'm06': 'the-lovers',
  'm07': 'the-chariot',
  'm08': 'strength',
  'm09': 'the-hermit',
  'm10': 'wheel-of-fortune',
  'm11': 'justice',
  'm12': 'the-hanged-man',
  'm13': 'death',
  'm14': 'temperance',
  'm15': 'the-devil',
  'm16': 'the-tower',
  'm17': 'the-star',
  'm18': 'the-moon',
  'm19': 'the-sun',
  'm20': 'judgement',
  'm21': 'the-world',
  // Wands
  'w01': 'ace-of-wands',
  'w02': 'two-of-wands',
  'w03': 'three-of-wands',
  'w04': 'four-of-wands',
  'w05': 'five-of-wands',
  'w06': 'six-of-wands',
  'w07': 'seven-of-wands',
  'w08': 'eight-of-wands',
  'w09': 'nine-of-wands',
  'w10': 'ten-of-wands',
  'w11': 'page-of-wands',
  'w12': 'knight-of-wands',
  'w13': 'queen-of-wands',
  'w14': 'king-of-wands',
  // Cups
  'c01': 'ace-of-cups',
  'c02': 'two-of-cups',
  'c03': 'three-of-cups',
  'c04': 'four-of-cups',
  'c05': 'five-of-cups',
  'c06': 'six-of-cups',
  'c07': 'seven-of-cups',
  'c08': 'eight-of-cups',
  'c09': 'nine-of-cups',
  'c10': 'ten-of-cups',
  'c11': 'page-of-cups',
  'c12': 'knight-of-cups',
  'c13': 'queen-of-cups',
  'c14': 'king-of-cups',
  // Swords
  's01': 'ace-of-swords',
  's02': 'two-of-swords',
  's03': 'three-of-swords',
  's04': 'four-of-swords',
  's05': 'five-of-swords',
  's06': 'six-of-swords',
  's07': 'seven-of-swords',
  's08': 'eight-of-swords',
  's09': 'nine-of-swords',
  's10': 'ten-of-swords',
  's11': 'page-of-swords',
  's12': 'knight-of-swords',
  's13': 'queen-of-swords',
  's14': 'king-of-swords',
  // Pentacles
  'p01': 'ace-of-pentacles',
  'p02': 'two-of-pentacles',
  'p03': 'three-of-pentacles',
  'p04': 'four-of-pentacles',
  'p05': 'five-of-pentacles',
  'p06': 'six-of-pentacles',
  'p07': 'seven-of-pentacles',
  'p08': 'eight-of-pentacles',
  'p09': 'nine-of-pentacles',
  'p10': 'ten-of-pentacles',
  'p11': 'page-of-pentacles',
  'p12': 'knight-of-pentacles',
  'p13': 'queen-of-pentacles',
  'p14': 'king-of-pentacles',
};

const getLocalImage = (id: string) => {
  const filename = imageMap[id];
  if (!filename) {
    console.warn(`No image mapping found for card ID: ${id}`);
    return `/assets/tarot/${id}.webp`;
  }
  return `/assets/tarot/${filename}.webp`;
};

export const tarotCards: TarotCard[] = [
  // Major Arcana (22 cards)
  {
    id: "m00",
    name: "愚者 (The Fool)",
    arcana: "major",
    image: getLocalImage("m00"),
    keywords: ["开始", "自由", "纯真", "冒险"],
    meaning_up: "新的开始，自由自在，纯真无邪，冒险精神。",
    meaning_rev: "鲁莽，虚度光阴，缺乏计划，犹豫不决。",
    description: "愚者象征着一段旅程的开始，代表着无限的可能性和对未知的勇气。"
  },
  {
    id: "m01",
    name: "魔术师 (The Magician)",
    arcana: "major",
    image: getLocalImage("m01"),
    keywords: ["意志", "创造力", "能力", "行动"],
    meaning_up: "创造力，行动力，意志坚定，掌握资源。",
    meaning_rev: "操纵，怀才不遇，计划落空，能力未及。",
    description: "魔术师拥有连接天地之间的力量，象征着意识与行动的高度统一。"
  },
  {
    id: "m02",
    name: "女祭司 (The High Priestess)",
    arcana: "major",
    image: getLocalImage("m02"),
    keywords: ["直觉", "神秘", "潜意识", "智慧"],
    meaning_up: "直觉敏锐，静待时机，内心平静，接受智慧。",
    meaning_rev: "肤浅，压抑直觉，由于怀疑，隐藏秘密。",
    description: "女祭司守护着秘密知识的入口，提醒我们要倾听内心的声音。"
  },
  {
    id: "m03",
    name: "皇后 (The Empress)",
    arcana: "major",
    image: getLocalImage("m03"),
    keywords: ["丰饶", "创造", "母性", "自然"],
    meaning_up: "丰饶多产，创造力爆发，母性的关怀，自然的和谐。",
    meaning_rev: "创造力受阻，过度依赖，缺乏安全感，浪费资源。",
    description: "皇后象征着生命的诞生与物质的丰裕，是大自然母亲的化身。"
  },
  {
    id: "m04",
    name: "皇帝 (The Emperor)",
    arcana: "major",
    image: getLocalImage("m04"),
    keywords: ["权威", "结构", "父亲", "控制"],
    meaning_up: "权威地位，严谨结构，保护者，坚强意志。",
    meaning_rev: "暴虐，效率低下，缺乏自信，过度管控。",
    description: "皇帝代表着秩序与法律，他建立了结构，让文明得以繁荣。"
  },
  {
    id: "m05",
    name: "教皇 (The Hierophant)",
    arcana: "major",
    image: getLocalImage("m05"),
    keywords: ["传统", "信仰", "教育", "体制"],
    meaning_up: "遵循传统，寻求精神指导，学习知识，社会认同。",
    meaning_rev: "打破陈规，质疑权威，异端想法，过度死板。",
    description: "教皇是精神世界的导师，体现了人类对信仰与社会契约的追求。"
  },
  {
    id: "m06",
    name: "恋人 (The Lovers)",
    arcana: "major",
    image: getLocalImage("m06"),
    keywords: ["爱情", "和谐", "选择", "价值观"],
    meaning_up: "真挚的爱情，人际关系的和谐，面临重大抉择。",
    meaning_rev: "关系失衡，错误的决定，价值观冲突，逃避责任。",
    description: "恋人牌不仅仅关于爱情，更关乎于灵魂的选择与二元性的统一。"
  },
  {
    id: "m07",
    name: "战车 (The Chariot)",
    arcana: "major",
    image: getLocalImage("m07"),
    keywords: ["胜利", "意志", "控制", "成功"],
    meaning_up: "意志力带来的胜利，克服障碍，自律，成功的航向。",
    meaning_rev: "失控，缺乏动力，方向错误，由于冲动受挫。",
    description: "战车象征着通过坚强的意志 and 自律来驾驭矛盾的力量，最终达成目标。"
  },
  {
    id: "m08",
    name: "力量 (Strength)",
    arcana: "major",
    image: getLocalImage("m08"),
    keywords: ["勇气", "耐力", "慈悲", "内在力量"],
    meaning_up: "内在的勇气，以柔克刚，情绪的掌控，坚韧不拔。",
    meaning_rev: "软弱，挫败感，失去信心，由于恐惧停滞。",
    description: "力量牌展现了一种非暴力的强大，通过爱与慈悲来战胜原始的兽性。"
  },
  {
    id: "m09",
    name: "隐士 (The Hermit)",
    arcana: "major",
    image: getLocalImage("m09"),
    keywords: ["孤独", "反省", "寻求真理", "指引"],
    meaning_up: "反思与独处，内心的指引，寻求智慧，从外界退缩。",
    meaning_rev: "孤立，社交恐惧，过于封闭，迷失方向。",
    description: "隐士独自提灯前行，提醒我们需要暂时放下外界的喧嚣，去寻找内在的光亮。"
  },
  {
    id: "m10",
    name: "命运之轮 (Wheel of Fortune)",
    arcana: "major",
    image: getLocalImage("m10"),
    keywords: ["循环", "转机", "命运", "时机"],
    meaning_up: "好运降临，人生的转折点，顺应自然的法则。",
    meaning_rev: "厄运，抗拒改变，无谓的循环，错失良机。",
    description: "命运之轮时刻在转动，提醒我们世事无常，需把握时机。"
  },
  {
    id: "m11",
    name: "正义 (Justice)",
    arcana: "major",
    image: getLocalImage("m11"),
    keywords: ["公正", "真理", "因果", "法律"],
    meaning_up: "公正无私，真相大白，逻辑冷静，承担责任。",
    meaning_rev: "不公平，成见，不负责任，法律纠纷。",
    description: "正义牌象征着平衡与道德，要求我们在行动前权衡一切利弊。"
  },
  {
    id: "m12",
    name: "倒吊人 (The Hanged Man)",
    arcana: "major",
    image: getLocalImage("m12"),
    keywords: ["牺牲", "换位思考", "停滞", "觉醒"],
    meaning_up: "换个角度看世界，甘愿牺牲，静观其变，灵性觉醒。",
    meaning_rev: "徒劳无功，抗拒牺牲，视野狭隘，物质束缚。",
    description: "倒吊人代表一种暂时的停滞，通过这种停滞，我们能够获得新的洞见。"
  },
  {
    id: "m13",
    name: "死神 (Death)",
    arcana: "major",
    image: getLocalImage("m13"),
    keywords: ["结束", "转变", "新生", "告别"],
    meaning_up: "一段关系的终结，旧事物的消亡，必然的转变，迎接新生。",
    meaning_rev: "抗拒改变，停滞不前，恐惧失败，无法释怀。",
    description: "死神并不意味着真正的死亡，而是生命中一个章节的终结与新生命力的开始。"
  },
  {
    id: "m14",
    name: "节制 (Temperance)",
    arcana: "major",
    image: getLocalImage("m14"),
    keywords: ["平衡", "节制", "融合", "治愈"],
    meaning_up: "寻找生活的平衡点，情感的融合，自我克制，身心治愈。",
    meaning_rev: "失衡，极端的行为，缺乏目标，沟通不合。",
    description: "节制牌通过炼金术般的融合，将对立的事物调和成和谐的整体。"
  },
  {
    id: "m15",
    name: "恶魔 (The Devil)",
    arcana: "major",
    image: getLocalImage("m15"),
    keywords: ["束缚", "欲望", "成瘾", "物质"],
    meaning_up: "被欲望束缚，物质主义的陷阱，难以自拔的关系。",
    meaning_rev: "挣脱束缚，重获自由，直面阴影，精神觉醒。",
    description: "恶魔并不邪恶，它反映的是我们由于恐惧或欲望而自我设置的枷锁。"
  },
  {
    id: "m16",
    name: "高塔 (The Tower)",
    arcana: "major",
    image: getLocalImage("m16"),
    keywords: ["突变", "崩裂", "揭露", "震荡"],
    meaning_up: "意外的剧变，虚假基础的倒塌，真相的突然揭露，剧烈的冲击。",
    meaning_rev: "推迟变革，恐惧动荡，避免灾难，内在冲突。",
    description: "高塔的崩塌是痛苦的，但它摧毁了虚伪的表象，为真正的基础扫清了障碍。"
  },
  {
    id: "m17",
    name: "星星 (The Star)",
    arcana: "major",
    image: getLocalImage("m17"),
    keywords: ["希望", "灵感", "宁静", "未来"],
    meaning_up: "充满希望，灵感迸发，宁静的治愈力，对未来的信心。",
    meaning_rev: "丧失信心，失望，创意干涸，悲观厌世。",
    description: "星星在黑暗的夜晚闪耀，提醒我们即便在最困难的时刻，希望永存。"
  },
  {
    id: "m18",
    name: "月亮 (The Moon)",
    arcana: "major",
    image: getLocalImage("m18"),
    keywords: ["幻觉", "不安", "潜意识", "梦境"],
    meaning_up: "不安与疑惑，隐藏的敌人，梦境的启示，幻象中的迷失。",
    meaning_rev: "揭穿谎言，走出迷雾，直面恐惧，真相大白。",
    description: "月亮照亮了潜意识的幽暗角落，那里充满了未知的幻象与原始的力量。"
  },
  {
    id: "m19",
    name: "太阳 (The Sun)",
    arcana: "major",
    image: getLocalImage("m19"),
    keywords: ["成功", "活力", "喜悦", "真实"],
    meaning_up: "巨大的成功，生命力充沛，纯粹的喜悦，事情的透明化。",
    meaning_rev: "短暂的阴霾，过度自信，延期的成功，由于骄傲失误。",
    description: "太阳牌是塔罗中最积极的牌之一，代表着光明的照耀与生命力的绽放。"
  },
  {
    id: "m20",
    name: "审判 (Judgement)",
    arcana: "major",
    image: getLocalImage("m20"),
    keywords: ["复活", "召唤", "反思", "最终决定"],
    meaning_up: "精神的觉醒，来自内心的召唤，过去业力的清算，人生重大转折。",
    meaning_rev: "逃避自我怀疑，拖延决定，对过去的恐惧，错失使命。",
    description: "天使吹响号角，审判时刻到来，这不仅是对过去的评判，更是对未来的重生。"
  },
  {
    id: "m21",
    name: "世界 (The World)",
    arcana: "major",
    image: getLocalImage("m21"),
    keywords: ["圆满", "旅行", "达成", "融合"],
    meaning_up: "大功告成，世界的融合，圆满的结局，开启新的生命阶段。",
    meaning_rev: "功败垂成，停滞不前，成就感匮乏，抗拒结束。",
    description: "世界牌标志着一个大循环的圆满完成，象征着智慧、成就和新的开始。"
  },

  // Minor Arcana - Wands (14 cards)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const id = `w${num.toString().padStart(2, '0')}`;
    const labels = ["一 (Ace)", "二 (Two)", "三 (Three)", "四 (Four)", "五 (Five)", "六 (Six)", "七 (Seven)", "八 (Eight)", "九 (Nine)", "十 (Ten)", "侍从 (Page)", "骑士 (Knight)", "皇后 (Queen)", "国王 (King)"];
    return {
      id,
      name: `权杖${labels[i]}`,
      arcana: 'minor' as const,
      suit: 'wands' as const,
      image: getLocalImage(id),
      keywords: num <= 10 ? ["激情", "行动", "机遇"] : ["愿景", "勇气", "领导力"],
      meaning_up: "积极的能量，新的项目，对生活的热情。",
      meaning_rev: "能量流失，方向不明，创意受阻。",
      description: "权杖代表火元素，象征着行动、创造力、直觉和生命意志。"
    };
  }),

  // Minor Arcana - Cups (14 cards)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const id = `c${num.toString().padStart(2, '0')}`;
    const labels = ["一 (Ace)", "二 (Two)", "三 (Three)", "四 (Four)", "五 (Five)", "六 (Six)", "七 (Seven)", "八 (Eight)", "九 (Nine)", "十 (Ten)", "侍从 (Page)", "骑士 (Knight)", "皇后 (Queen)", "国王 (King)"];
    return {
      id,
      name: `圣杯${labels[i]}`,
      arcana: 'minor' as const,
      suit: 'cups' as const,
      image: getLocalImage(id),
      keywords: num <= 10 ? ["情感", "直觉", "爱"] : ["同理心", "温柔", "情感成熟"],
      meaning_up: "情感的流动，深入的关系，灵敏的直觉。",
      meaning_rev: "沟通障碍，情感枯竭，过度敏感。",
      description: "圣杯代表水元素，象征着情感、人际关系、直觉 and 潜意识。"
    };
  }),

  // Minor Arcana - Swords (14 cards)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const id = `s${num.toString().padStart(2, '0')}`;
    const labels = ["一 (Ace)", "二 (Two)", "三 (Three)", "四 (Four)", "五 (Five)", "六 (Six)", "七 (Seven)", "八 (Eight)", "九 (Nine)", "十 (Ten)", "侍从 (Page)", "骑士 (Knight)", "皇后 (Queen)", "国王 (King)"];
    return {
      id,
      name: `宝剑${labels[i]}`,
      arcana: 'minor' as const,
      suit: 'swords' as const,
      image: getLocalImage(id),
      keywords: num <= 10 ? ["理智", "真相", "决断"] : ["智慧", "客观", "逻辑"],
      meaning_up: "清晰的思维，果断的决定，有效的沟通。",
      meaning_rev: "思想混乱，言语伤人，犹豫不决。",
      description: "宝剑代表风元素，象征着思维、智慧、沟通和权力。"
    };
  }),

  // Minor Arcana - Pentacles (14 cards)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const id = `p${num.toString().padStart(2, '0')}`;
    const labels = ["一 (Ace)", "二 (Two)", "三 (Three)", "四 (Four)", "五 (Five)", "六 (Six)", "七 (Seven)", "八 (Eight)", "九 (Nine)", "十 (Ten)", "侍从 (Page)", "骑士 (Knight)", "皇后 (Queen)", "国王 (King)"];
    return {
      id,
      name: `星币${labels[i]}`,
      arcana: 'minor' as const,
      suit: 'pentacles' as const,
      image: getLocalImage(id),
      keywords: num <= 10 ? ["工作", "财富", "基础"] : ["可靠", "务实", "物质成功"],
      meaning_up: "物质的丰收，稳固的根基，具体的成果。",
      meaning_rev: "财务困难，目光短浅，基础不稳。",
      description: "星币代表土元素，象征着金钱、财富、物质、感官和自然。"
    };
  })
];
