// ============================================================
// БАЗА УПРАЖНЕНИЙ
// 48 тренировок: 8 на категорию × 6 категорий
// Категории: shooting, dribbling, athleticism, iq, defense, passing
// Уровни: beginner, intermediate, advanced
// ============================================================

export const EXERCISES = [
  // ============================================================
  // 🎯 БРОСОК (shooting)
  // ============================================================
  {
    id: 'sht-1',
    category: 'shooting',
    title: 'Форма броска у стены',
    description: 'Встань в 2 метрах от стены. Бросай мяч одной рукой, следя за тем, чтобы локоть шёл вверх, а кисть «провожала» мяч. 50 повторов. Отличное упражнение для постановки правильной формы без кольца.',
    duration: 10,
    gear: ['ball', 'wall'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'sht-2',
    category: 'shooting',
    title: 'Штрафные броски',
    description: '10 штрафных бросков подряд. Перед каждым — глубокий вдох, одинаковый ритм: согнул ноги, выпрямил, выпустил. Считай попадания. Цель — 7 из 10.',
    duration: 10,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'sht-3',
    category: 'shooting',
    title: 'Броски с 5 точек',
    description: '5 точек по дуге: левый угол, левая 45°, центр, правая 45°, правый угол. С каждой точки — 2 броска. Итого 10. Считай попадания, старайся попасть минимум 6.',
    duration: 15,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG', 'SF'],
    level: 'beginner',
  },
  {
    id: 'sht-4',
    category: 'shooting',
    title: 'Броски в движении',
    description: 'Беги с мячом, на скорости остановись, прыгни и брось. 10 повторов с разных углов. Следи, чтобы остановка была на две ноги, а бросок — в верхней точке прыжка.',
    duration: 15,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'sht-5',
    category: 'shooting',
    title: 'Трёхочковые с 5 точек',
    description: 'То же, что броски с 5 точек, но с трёхочковой линии. 2 броска с каждой точки, итого 10. Цель — 5 попаданий. Работай над стабильностью выпуска.',
    duration: 15,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'sht-6',
    category: 'shooting',
    title: 'Быстрый выпуск после передачи',
    description: 'Партнёр отдаёт тебе мяч, ты ловишь и сразу бросаешь — не больше 1 секунды на выпуск. 20 повторов. Это симуляция игровой ситуации catch-and-shoot.',
    duration: 15,
    gear: ['ball', 'hoop', 'partner'],
    positions: ['SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'sht-7',
    category: 'shooting',
    title: 'Броски после дриблинга',
    description: 'Ведёшь мяч, делаешь кроссовер или уход, останавливаешься и бросаешь. 15 бросков с разных точек. Отрабатывай переход от дриблинга к броску без пробежки.',
    duration: 20,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG', 'SF'],
    level: 'advanced',
  },
  {
    id: 'sht-8',
    category: 'shooting',
    title: 'Усталостные броски',
    description: 'Сделай 10 приседаний, потом 5 бросков с 5 точек (25). Повтори 3 круга. Это имитирует броски в 4-й четверти, когда ноги уже не свои.',
    duration: 25,
    gear: ['ball', 'hoop'],
    positions: ['SG', 'SF', 'PF'],
    level: 'advanced',
  },

  // ============================================================
  // ⚡ ДРИБЛИНГ (dribbling)
  // ============================================================
  {
    id: 'drbl-1',
    category: 'dribbling',
    title: 'Переводы перед собой',
    description: '30 секунд переводов мяча перед собой: кроссоверы, между ног, за спиной. Считай касания. Старайся не смотреть на мяч.',
    duration: 10,
    gear: ['ball'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'drbl-2',
    category: 'dribbling',
    title: 'Восьмёрка вокруг ног',
    description: '30 секунд ведения мяча восьмёркой вокруг ног. Работай обеими руками. Чем ниже мяч — тем лучше контроль.',
    duration: 10,
    gear: ['ball'],
    positions: ['PG', 'SG', 'SF'],
    level: 'beginner',
  },
  {
    id: 'drbl-3',
    category: 'dribbling',
    title: 'Дриблинг с закрытыми глазами',
    description: 'Встань на месте, закрой глаза и веди мяч 30 секунд. Правой, потом левой. Это учит чувствовать мяч, а не смотреть на него.',
    duration: 10,
    gear: ['ball'],
    positions: ['PG', 'SG'],
    level: 'intermediate',
  },
  {
    id: 'drbl-4',
    category: 'dribbling',
    title: 'Слалом между конусами',
    description: 'Расставь 6–8 конусов в линию. Пройди слалом на дриблинге туда и обратно. Повтори 5 раз. Работай над скоростью и контролем.',
    duration: 15,
    gear: ['ball', 'cones'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'drbl-5',
    category: 'dribbling',
    title: 'Дриблинг под давлением партнёра',
    description: 'Партнёр пытается отобрать мяч, ты удерживаешь 30 секунд. 5 раундов. Работай корпусом, прикрывай мяч.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'drbl-6',
    category: 'dribbling',
    title: 'Комбо: перед собой + под ногой + за спиной',
    description: '30 секунд чередуй: перевод перед собой → под ногой → за спиной. Поочерёдно каждой рукой. Считай касания, цель — 40+.',
    duration: 10,
    gear: ['ball'],
    positions: ['PG', 'SG'],
    level: 'advanced',
  },
  {
    id: 'drbl-7',
    category: 'dribbling',
    title: 'Дриблинг на скорости',
    description: 'Беги с мячом от одной базовой линии до другой на максимальной скорости. Повтори 10 раз. Мяч не должен отскакивать выше колена.',
    duration: 15,
    gear: ['ball'],
    positions: ['PG', 'SG', 'SF'],
    level: 'advanced',
  },
  {
    id: 'drbl-8',
    category: 'dribbling',
    title: 'Двойной кроссовер на месте',
    description: 'Быстро делай два кроссовера подряд, потом бросок. 20 повторов. Развивает скорость рук и координацию.',
    duration: 15,
    gear: ['ball', 'hoop'],
    positions: ['PG', 'SG'],
    level: 'advanced',
  },

  // ============================================================
  // 💪 АТЛЕТИЗМ (athleticism)
  // ============================================================
  {
    id: 'atl-1',
    category: 'athleticism',
    title: 'Прыжки на скакалке',
    description: '3 минуты прыжков на скакалке. Работает на координацию, выносливость и упругость стопы. Если скакалки нет — прыгай на месте.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'atl-2',
    category: 'athleticism',
    title: 'Приседания без веса',
    description: '3 подхода по 20 приседаний. Полная амплитуда — до параллели бёдер с полом. Отдых между подходами — 60 секунд.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'atl-3',
    category: 'athleticism',
    title: 'Планка',
    description: '3 подхода по 45 секунд. Держи тело прямым, живот втянут, не прогибайся в пояснице. Между подходами — 30 секунд отдыха.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'atl-4',
    category: 'athleticism',
    title: 'Выпады с прыжком',
    description: 'Сделай выпад, из нижней точки выпрыгни вверх, поменяй ноги, снова выпад. 2 подхода по 15 повторов. Развивает взрывную силу ног.',
    duration: 15,
    gear: [],
    positions: ['SF', 'PF', 'C'],
    level: 'intermediate',
  },
  {
    id: 'atl-5',
    category: 'athleticism',
    title: 'Прыжки на одной ноге',
    description: 'Прыгай на одной ноге 30 секунд, потом на другой. Это улучшает баланс и силу каждой ноги отдельно. 2 круга.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'atl-6',
    category: 'athleticism',
    title: 'Бёрпи',
    description: '3 подхода по 12 бёрпи. Полное упражнение: присед → планка → отжимание → прыжок вверх. Развивает всё тело.',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF'],
    level: 'intermediate',
  },
  {
    id: 'atl-7',
    category: 'athleticism',
    title: 'Подтягивания',
    description: '3 подхода на максимум. Хватом сверху, до подбородка над перекладиной. Если не можешь — используй резинку или делай негативные повторы.',
    duration: 15,
    gear: ['bar'],
    positions: ['SG', 'SF', 'PF', 'C'],
    level: 'advanced',
  },
  {
    id: 'atl-8',
    category: 'athleticism',
    title: 'Спринт 24 метра',
    description: '10 спринтов по 24 метра на максимальной скорости. Отдых между ними — 60 секунд. Замеряй время, старайся улучшить.',
    duration: 20,
    gear: ['chalk'],
    positions: ['PG', 'SG', 'SF'],
    level: 'advanced',
  },

  // ============================================================
  // 🧠 IQ (iq)
  // ============================================================
  {
    id: 'iq-1',
    category: 'iq',
    title: 'Разбор матча NBA',
    description: 'Посмотри 15 минут записи матча NBA и следи за одним игроком. Отмечай, когда он двигается без мяча, ставит заслон, открывается. Просто наблюдай.',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'iq-2',
    category: 'iq',
    title: 'Правила баскетбола — повторение',
    description: 'Пройди по ключевым правилам: пробежка, двойное ведение, зона, фолы. Проговори вслух, что считается нарушением. 10 минут.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'iq-3',
    category: 'iq',
    title: 'Схема расстановки 5 на 5',
    description: 'Возьми лист бумаги и нарисуй 5 игроков на площадке. Продумай: где PG, где SG, где большие. Понимание позиций = половина IQ.',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'iq-4',
    category: 'iq',
    title: 'Чтение pick-and-roll',
    description: 'Изучи базу пик-н-ролла: кто ставит заслон, кто атакует, куда уходит защита. Проговори 3 варианта развития атаки.',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'intermediate',
  },
  {
    id: 'iq-5',
    category: 'iq',
    title: 'Изучение зонной защиты',
    description: 'Разбери 2-3 и 3-2: где слабые точки, куда отдавать мяч, как пробивать зону. 15 минут теории + практика на площадке.',
    duration: 20,
    gear: ['ball'],
    positions: ['PG', 'SG', 'SF', 'PF'],
    level: 'intermediate',
  },
  {
    id: 'iq-6',
    category: 'iq',
    title: 'Принятие решений 2 в 1',
    description: 'С партнёром отрабатывай выход 2 в 1: ты с мячом, защитник на вас. Решай: бросок или передача. 20 повторов, после каждого — анализ.',
    duration: 20,
    gear: ['ball', 'hoop', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'advanced',
  },
  {
    id: 'iq-7',
    category: 'iq',
    title: 'Разбор своих ошибок',
    description: 'Вспомни последнюю игру или тренировку. Выпиши 3 ситуации, где ты принял неоптимальное решение. Что было бы лучше?',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'advanced',
  },
  {
    id: 'iq-8',
    category: 'iq',
    title: 'Изучение соперника',
    description: 'Если знаешь будущего соперника — разбери его игру. Кто их лучший игрок? Как он играет? Как его остановить? 15 минут анализа.',
    duration: 15,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'advanced',
  },

  // ============================================================
  // 🛡️ ЗАЩИТА (defense)
  // ============================================================
  {
    id: 'def-1',
    category: 'defense',
    title: 'Защитная стойка',
    description: 'Встань в защитную стойку: ноги на ширине плеч, колени согнуты, руки в стороны. Держи 1 минуту. Повтори 5 раз.',
    duration: 10,
    gear: [],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'def-2',
    category: 'defense',
    title: 'Боковые шаги',
    description: 'Двигайся боком от одной линии к другой в защитной стойке. 10 раз туда-обратно. Не скрещивай ноги, не подпрыгивай.',
    duration: 10,
    gear: ['chalk'],
    positions: ['PG', 'SG', 'SF', 'PF'],
    level: 'beginner',
  },
  {
    id: 'def-3',
    category: 'defense',
    title: 'Работа рук в защите',
    description: 'Перед зеркалом имитируй защитные движения: поднял руку — опустил, в сторону — вверх. 30 секунд × 3 подхода. Руки всегда активны.',
    duration: 10,
    gear: ['wall'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'def-4',
    category: 'defense',
    title: 'Защита 1 в 1',
    description: 'Партнёр ведёт мяч, ты защищаешься 30 секунд. Задача — не дать пройти. 5 раундов, меняетесь.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF', 'PF'],
    level: 'intermediate',
  },
  {
    id: 'def-5',
    category: 'defense',
    title: 'Слайд-шаги между конусами',
    description: 'Расставь 5 конусов. Двигайся между ними в защитной стойке: боком, вперёд, назад. 3 круга на время.',
    duration: 15,
    gear: ['cones'],
    positions: ['PG', 'SG', 'SF', 'PF'],
    level: 'intermediate',
  },
  {
    id: 'def-6',
    category: 'defense',
    title: 'Перехват передачи',
    description: 'Встань между двумя партнёрами, которые перекидывают мяч. Пытайся перехватить. 20 попыток. Читай глаза и руки соперника.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'def-7',
    category: 'defense',
    title: 'Блок-шот',
    description: 'Партнёр бросает с разных точек, ты пытаешься поставить блок. 20 бросков. Не прыгай на финт — читай момент.',
    duration: 20,
    gear: ['ball', 'hoop', 'partner'],
    positions: ['SF', 'PF', 'C'],
    level: 'advanced',
  },
  {
    id: 'def-8',
    category: 'defense',
    title: 'Защита через заслоны',
    description: 'Партнёр ставит заслон, ты учишься проходить его: под, над, или через. 15 повторов. Отрабатывай коммуникацию — кричи «заслон слева/справа».',
    duration: 20,
    gear: ['partner'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'advanced',
  },

  // ============================================================
  // 🎁 ПАС (passing)
  // ============================================================
  {
    id: 'pass-1',
    category: 'passing',
    title: 'Передачи в стену',
    description: 'Встань в 2 метрах от стены. Делай передачи двумя руками от груди — 50 раз. Потом от пола — 30 раз. Работай над точностью.',
    duration: 10,
    gear: ['ball', 'wall'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'pass-2',
    category: 'passing',
    title: 'Передачи одной рукой',
    description: 'От стены: 30 передач правой, 30 левой. Мяч должен возвращаться в ту же точку. Работай над кистью.',
    duration: 10,
    gear: ['ball', 'wall'],
    positions: ['PG', 'SG'],
    level: 'beginner',
  },
  {
    id: 'pass-3',
    category: 'passing',
    title: 'Передачи в паре',
    description: 'С партнёром на расстоянии 5 метров: 30 передач от груди, 30 от пола, 30 одной рукой. Считай ошибки, цель — не больше 3.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    level: 'beginner',
  },
  {
    id: 'pass-4',
    category: 'passing',
    title: 'Передачи в движении',
    description: 'Беги вместе с партнёром по прямой, перекидывая мяч. 10 кругов. Передача идёт в руки, а не в ноги.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'pass-5',
    category: 'passing',
    title: 'Точный пас на 10 метров',
    description: 'Партнёр стоит в 10 метрах. 20 передач, цель — попасть в руки без шага. Если он делает шаг — передача неточная.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'pass-6',
    category: 'passing',
    title: 'Передачи после ведения',
    description: 'Ведёшь мяч, делаешь остановку и передачу партнёру. 20 повторов на скорость. Работай над тем, чтобы решение принимать за 1 секунду.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'intermediate',
  },
  {
    id: 'pass-7',
    category: 'passing',
    title: 'Alley-oop',
    description: 'С партнёром: он бежит на кольцо, ты набрасываешь ему мяч в воздух. 15 попыток. Это самый сложный пас в баскетболе.',
    duration: 20,
    gear: ['ball', 'hoop', 'partner'],
    positions: ['PG', 'SG', 'SF'],
    level: 'advanced',
  },
  {
    id: 'pass-8',
    category: 'passing',
    title: 'Передачи на скорость',
    description: 'Партнёр в 3 метрах. 30 передач на время — надо уложиться в 20 секунд. Потом меняетесь. Работает на скорость рук и точность.',
    duration: 15,
    gear: ['ball', 'partner'],
    positions: ['PG', 'SG'],
    level: 'advanced',
  },
]

// ============================================================
// Получить упражнения под цели / инвентарь / уровень / позицию
// ============================================================
export function getFilteredExercises(goals, gear, level, positions) {
  return EXERCISES.filter((ex) => {
    // Подходит по цели
    if (goals.length > 0 && !goals.includes(ex.category)) return false

    // Подходит по инвентарю — все предметы должны быть доступны
    const hasAllGear = ex.gear.every((g) => gear.includes(g))
    if (!hasAllGear) return false

    // Подходит по уровню
    if (ex.level !== level) return false

    // Подходит по позиции
    if (positions && positions.length > 0) {
      const main = positions[0]
      if (!ex.positions.includes(main)) return false
    }

    return true
  })
}

// ============================================================
// Собрать план на неделю
// ============================================================
export function generateWeekPlan(user) {
  const {
    trainingGoals = [],
    trainingGear = [],
    trainingLevel = 'beginner',
    positions = [],
  } = user

  const available = getFilteredExercises(
    trainingGoals,
    trainingGear,
    trainingLevel,
    positions
  )

  // Если ничего не подошло — fallback к базовым упражнениям без инвентаря
  if (available.length < 3) {
    return [
      { day: 'Пн', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Вт', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Ср', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Чт', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Пт', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Сб', type: 'rest', icon: '😴', label: 'Отдых' },
      { day: 'Вс', type: 'rest', icon: '😴', label: 'Отдых' },
    ]
  }

  // Перемешиваем упражнения
  const shuffled = [...available].sort(() => Math.random() - 0.5)

  // Иконки по категориям
  const categoryIcons = {
    shooting: '🎯',
    dribbling: '⚡',
    athleticism: '💪',
    iq: '🧠',
    defense: '🛡️',
    passing: '🎁',
  }

  const categoryLabels = {
    shooting: 'Бросок',
    dribbling: 'Дриблинг',
    athleticism: 'Атлетизм',
    iq: 'IQ',
    defense: 'Защита',
    passing: 'Пас',
  }

  // Схема недели: 5 тренировочных дней + 2 отдыха
  // Пн, Вт, Ср, Чт, Пт — тренировки, Сб, Вс — отдых
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const trainingDays = [0, 1, 2, 3, 4] // индексы тренировочных дней
  const restDays = [5, 6]              // индексы отдыха

  let exerciseIndex = 0
  const plan = dayNames.map((dayName, idx) => {
    if (restDays.includes(idx)) {
      return {
        day: dayName,
        type: 'rest',
        icon: '😴',
        label: 'Отдых',
      }
    }

    const ex = shuffled[exerciseIndex % shuffled.length]
    exerciseIndex++

    return {
      day: dayName,
      type: ex.category,
      icon: categoryIcons[ex.category] || '🏀',
      label: categoryLabels[ex.category] || 'Тренировка',
      exercise: ex,
    }
  })

  return plan
}