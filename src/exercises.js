// ============================================================
// БАЗА УПРАЖНЕНИЙ
// Категории: shooting, dribbling, athleticism, iq, defense, passing
// Уровни: beginner, intermediate, advanced
// Позиции: PG, SG, SF, PF, C
// ============================================================

export const EXERCISES = [
  // ============================================================
  // 🎯 БРОСОК (shooting)
  // ============================================================
  { id: 'sht-1', category: 'shooting', title: 'Форма броска у стены', description: 'Встань в 2 метрах от стены. Бросай мяч одной рукой, следя за локтем и кистью. 50 повторов.', duration: 10, gear: ['ball', 'wall'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'sht-2', category: 'shooting', title: 'Штрафные броски', description: '10 штрафных подряд. Одинаковый ритм: согнул ноги, выпрямил, выпустил. Цель — 7 из 10.', duration: 10, gear: ['ball', 'hoop'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'sht-3', category: 'shooting', title: 'Броски с 5 точек', description: '5 точек по дуге. С каждой — 2 броска. Цель — 6 из 10.', duration: 15, gear: ['ball', 'hoop'], positions: ['PG', 'SG', 'SF'], level: 'beginner' },
  { id: 'sht-4', category: 'shooting', title: 'Броски в движении', description: 'Беги с мячом, остановись на две ноги, прыгни и брось. 10 повторов.', duration: 15, gear: ['ball', 'hoop'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'sht-5', category: 'shooting', title: 'Трёхочковые с 5 точек', description: 'С трёхочковой: 2 броска с каждой из 5 точек. Цель — 5 попаданий.', duration: 15, gear: ['ball', 'hoop'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'sht-6', category: 'shooting', title: 'Catch-and-shoot', description: 'Партнёр отдаёт — ты ловишь и сразу бросаешь, не больше 1 сек на выпуск. 20 повторов.', duration: 15, gear: ['ball', 'hoop', 'partner'], positions: ['SG', 'SF'], level: 'intermediate' },
  { id: 'sht-7', category: 'shooting', title: 'Броски после дриблинга', description: 'Ведёшь, кроссовер, остановка — бросок. 15 бросков с разных точек.', duration: 20, gear: ['ball', 'hoop'], positions: ['PG', 'SG', 'SF'], level: 'advanced' },
  { id: 'sht-8', category: 'shooting', title: 'Усталостные броски', description: '10 приседаний → 5 бросков с 5 точек (25). Повтори 3 круга.', duration: 25, gear: ['ball', 'hoop'], positions: ['SG', 'SF', 'PF'], level: 'advanced' },
  { id: 'sht-9', category: 'shooting', title: 'Крюки из-под кольца', description: 'Крюк правой — 10, крюк левой — 10. Работай над координацией.', duration: 15, gear: ['ball', 'hoop'], positions: ['PF', 'C'], level: 'beginner' },
  { id: 'sht-10', category: 'shooting', title: 'Броски из краски', description: '20 бросков из-под кольца с двух шагов. Имитация атаки после подбора.', duration: 15, gear: ['ball', 'hoop'], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'sht-11', category: 'shooting', title: 'Пост-мувы', description: 'Спиной к кольцу: финт, полукрюк, разворот. 5 приёмов × 5 повторов.', duration: 20, gear: ['ball', 'hoop'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'sht-12', category: 'shooting', title: 'Средние с отклонением', description: 'Прыжок назад, отклонение, бросок. 15 бросков с обеих сторон.', duration: 20, gear: ['ball', 'hoop'], positions: ['SF', 'PF'], level: 'advanced' },

  // ============================================================
  // ⚡ ДРИБЛИНГ (dribbling)
  // ============================================================
  { id: 'drbl-1', category: 'dribbling', title: 'Переводы перед собой', description: '30 секунд переводов: кроссоверы, между ног, за спиной.', duration: 10, gear: ['ball'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'drbl-2', category: 'dribbling', title: 'Восьмёрка вокруг ног', description: '30 секунд ведения восьмёркой. Работай обеими руками.', duration: 10, gear: ['ball'], positions: ['PG', 'SG', 'SF'], level: 'beginner' },
  { id: 'drbl-3', category: 'dribbling', title: 'Дриблинг с закрытыми глазами', description: 'Закрой глаза и веди мяч 30 секунд. Учит чувствовать мяч.', duration: 10, gear: ['ball'], positions: ['PG', 'SG'], level: 'intermediate' },
  { id: 'drbl-4', category: 'dribbling', title: 'Слалом между конусами', description: '6–8 конусов в линию. Слалом туда-обратно. 5 раз.', duration: 15, gear: ['ball', 'cones'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'drbl-5', category: 'dribbling', title: 'Дриблинг под давлением', description: 'Партнёр отбирает мяч — ты держишь 30 сек. 5 раундов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'drbl-6', category: 'dribbling', title: 'Комбо: перед собой + под ногой + за спиной', description: '30 секунд чередуй. Считай касания, цель — 40+.', duration: 10, gear: ['ball'], positions: ['PG', 'SG'], level: 'advanced' },
  { id: 'drbl-7', category: 'dribbling', title: 'Дриблинг на скорости', description: 'Беги с мячом от лицевой до лицевой на максимуме. 10 раз.', duration: 15, gear: ['ball'], positions: ['PG', 'SG', 'SF'], level: 'advanced' },
  { id: 'drbl-8', category: 'dribbling', title: 'Двойной кроссовер + бросок', description: 'Два кроссовера подряд, потом бросок. 20 повторов.', duration: 15, gear: ['ball', 'hoop'], positions: ['PG', 'SG'], level: 'advanced' },
  { id: 'drbl-9', category: 'dribbling', title: 'Ведение спиной к кольцу', description: '5 минут ведения спиной к кольцу: повороты, финты, защита корпусом.', duration: 10, gear: ['ball'], positions: ['PF', 'C'], level: 'beginner' },
  { id: 'drbl-10', category: 'dribbling', title: 'Дриблинг в краске', description: 'Ведение в ограниченном пространстве: 2 метра, конусы. Не теряй мяч.', duration: 15, gear: ['ball', 'cones'], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'drbl-11', category: 'dribbling', title: 'Дроп-степ после ведения', description: 'Ведёшь, останавливаешься, дроп-степ — бросок. 15 повторов.', duration: 15, gear: ['ball', 'hoop'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'drbl-12', category: 'dribbling', title: 'Дриблинг + передача', description: 'Ведёшь, резко останавливаешься, отдаёшь в движении. 20 повторов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },

  // ============================================================
  // 💪 АТЛЕТИЗМ (athleticism)
  // ============================================================
  { id: 'atl-1', category: 'athleticism', title: 'Прыжки на скакалке', description: '3 минуты прыжков. Координация, выносливость, упругость стопы.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'atl-2', category: 'athleticism', title: 'Приседания без веса', description: '3 подхода × 20 приседаний. До параллели. Отдых 60 сек.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'atl-3', category: 'athleticism', title: 'Планка', description: '3 подхода × 45 секунд. Тело прямое, живот втянут.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'atl-4', category: 'athleticism', title: 'Выпады с прыжком', description: 'Выпад → выпрыгни вверх → смена ног. 2 × 15 повторов.', duration: 15, gear: [], positions: ['SF', 'PF', 'C'], level: 'intermediate' },
  { id: 'atl-5', category: 'athleticism', title: 'Прыжки на одной ноге', description: '30 секунд на одной, потом на другой. 2 круга.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'atl-6', category: 'athleticism', title: 'Бёрпи', description: '3 × 12 бёрпи. Присед → планка → отжимание → прыжок.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF'], level: 'intermediate' },
  { id: 'atl-7', category: 'athleticism', title: 'Подтягивания', description: '3 подхода на максимум. Хватом сверху, до подбородка.', duration: 15, gear: ['bar'], positions: ['SG', 'SF', 'PF', 'C'], level: 'advanced' },
  { id: 'atl-8', category: 'athleticism', title: 'Спринт 24 метра', description: '10 спринтов по 24 метра. Отдых 60 сек. Замеряй время.', duration: 20, gear: ['chalk'], positions: ['PG', 'SG', 'SF'], level: 'advanced' },
  { id: 'atl-9', category: 'athleticism', title: 'Прыжок в высоту с места', description: '10 прыжков с места вверх, замеряй высоту.', duration: 15, gear: ['chalk'], positions: ['SF', 'PF', 'C'], level: 'intermediate' },
  { id: 'atl-10', category: 'athleticism', title: 'Жим штанги', description: '4 × 8 жим штанги лёжа. Работа над плечевым поясом.', duration: 20, gear: ['bar'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'atl-11', category: 'athleticism', title: 'Работа на резинке', description: 'Боковые шаги с резинкой 3 × 30 сек. Укрепляет бёдра.', duration: 15, gear: ['band'], positions: ['PG', 'SG', 'SF', 'PF'], level: 'intermediate' },
  { id: 'atl-12', category: 'athleticism', title: 'Запрыгивания на тумбу', description: '3 × 10 запрыгиваний на тумбу 50–60 см. Взрывная сила.', duration: 15, gear: [], positions: ['SF', 'PF', 'C'], level: 'advanced' },

  // ============================================================
  // 🧠 IQ (iq)
  // ============================================================
  { id: 'iq-1', category: 'iq', title: 'Разбор матча NBA', description: '15 минут записи. Следи за одним игроком: движение без мяча, заслоны.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'iq-2', category: 'iq', title: 'Правила баскетбола', description: 'Пройди по ключевым правилам: пробежка, двойное ведение, зона, фолы.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'iq-3', category: 'iq', title: 'Схема 5 на 5', description: 'Нарисуй 5 игроков на площадке. Продумай расстановку.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'iq-4', category: 'iq', title: 'Чтение pick-and-roll', description: 'Изучи базу пик-н-ролла. Проговори 3 варианта развития атаки.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'intermediate' },
  { id: 'iq-5', category: 'iq', title: 'Зонная защита', description: 'Разбери 2-3 и 3-2: где слабые точки, куда отдавать. 15 минут.', duration: 20, gear: ['ball'], positions: ['PG', 'SG', 'SF', 'PF'], level: 'intermediate' },
  { id: 'iq-6', category: 'iq', title: 'Принятие решений 2 в 1', description: 'С партнёром отрабатывай 2 в 1: бросок или пас? 20 раз.', duration: 20, gear: ['ball', 'hoop', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'advanced' },
  { id: 'iq-7', category: 'iq', title: 'Разбор своих ошибок', description: 'Вспомни последнюю игру. Выпиши 3 неоптимальных решения.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'advanced' },
  { id: 'iq-8', category: 'iq', title: 'Изучение соперника', description: 'Разбери будущего соперника: кто лидер, как играет.', duration: 15, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'advanced' },
  { id: 'iq-9', category: 'iq', title: 'Чтение защиты в краске', description: 'Изучи: как читать сдваивание, когда отдавать, когда атаковать.', duration: 15, gear: [], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'iq-10', category: 'iq', title: 'Работа на подборе', description: 'Позиционирование на подборе: где стоять, как толкаться.', duration: 15, gear: ['ball', 'hoop'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'iq-11', category: 'iq', title: 'Прессинг и ловушки', description: 'Как выходить из прессинга. Отработай с партнёром.', duration: 20, gear: ['ball', 'partner'], positions: ['PG', 'SG'], level: 'advanced' },
  { id: 'iq-12', category: 'iq', title: 'Игра без мяча', description: '15 минут движения без мяча: заслоны, открывания, смены направления.', duration: 15, gear: [], positions: ['SG', 'SF'], level: 'intermediate' },

  // ============================================================
  // 🛡️ ЗАЩИТА (defense)
  // ============================================================
  { id: 'def-1', category: 'defense', title: 'Защитная стойка', description: 'Ноги на ширине плеч, колени согнуты. Держи 1 мин. 5 раз.', duration: 10, gear: [], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'def-2', category: 'defense', title: 'Боковые шаги', description: 'Двигайся боком в защитной стойке. 10 раз туда-обратно.', duration: 10, gear: ['chalk'], positions: ['PG', 'SG', 'SF', 'PF'], level: 'beginner' },
  { id: 'def-3', category: 'defense', title: 'Работа рук в защите', description: 'Перед зеркалом: поднял руку — опустил, в сторону — вверх. 30 сек × 3.', duration: 10, gear: ['wall'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'def-4', category: 'defense', title: 'Защита 1 в 1', description: 'Партнёр ведёт, ты защищаешься 30 сек. Не дай пройти. 5 раундов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF', 'PF'], level: 'intermediate' },
  { id: 'def-5', category: 'defense', title: 'Слайд-шаги между конусами', description: '5 конусов. Двигайся между ними в защитной стойке. 3 круга.', duration: 15, gear: ['cones'], positions: ['PG', 'SG', 'SF', 'PF'], level: 'intermediate' },
  { id: 'def-6', category: 'defense', title: 'Перехват передачи', description: 'Между двумя партнёрами. Пытайся перехватить. 20 попыток.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'def-7', category: 'defense', title: 'Блок-шот', description: 'Партнёр бросает, ты ставишь блок. 20 бросков. Читай момент.', duration: 20, gear: ['ball', 'hoop', 'partner'], positions: ['SF', 'PF', 'C'], level: 'advanced' },
  { id: 'def-8', category: 'defense', title: 'Защита через заслоны', description: 'Партнёр ставит заслон, ты проходишь: под, над, через. 15 повторов.', duration: 20, gear: ['partner'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'advanced' },
  { id: 'def-9', category: 'defense', title: 'Защита в краске', description: 'Партнёр атакует кольцо, ты защищаешь. 20 повторов.', duration: 20, gear: ['ball', 'hoop', 'partner'], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'def-10', category: 'defense', title: 'Подбор в защите', description: 'Партнёр бросает — ты выигрываешь подбор. 20 повторов.', duration: 15, gear: ['ball', 'hoop', 'partner'], positions: ['PF', 'C'], level: 'beginner' },
  { id: 'def-11', category: 'defense', title: 'Хедж и возврат', description: 'Защита пик-н-ролла: хедж, возврат. 15 повторов.', duration: 20, gear: ['ball', 'partner'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'def-12', category: 'defense', title: 'Прессинг на всей площадке', description: 'Персональный прессинг 30 секунд. 5 раундов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG'], level: 'advanced' },

  // ============================================================
  // 🎁 ПАС (passing)
  // ============================================================
  { id: 'pass-1', category: 'passing', title: 'Передачи в стену', description: '2 метра от стены. 50 передач от груди, 30 от пола.', duration: 10, gear: ['ball', 'wall'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'pass-2', category: 'passing', title: 'Передачи одной рукой', description: '30 правой, 30 левой. Работай кистью.', duration: 10, gear: ['ball', 'wall'], positions: ['PG', 'SG'], level: 'beginner' },
  { id: 'pass-3', category: 'passing', title: 'Передачи в паре', description: '5 метров. 30 от груди, 30 от пола, 30 одной рукой.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF', 'PF', 'C'], level: 'beginner' },
  { id: 'pass-4', category: 'passing', title: 'Передачи в движении', description: 'Беги с партнёром, перекидывая мяч. 10 кругов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'pass-5', category: 'passing', title: 'Точный пас на 10 метров', description: 'Партнёр в 10 м. 20 передач — попасть в руки без шага.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'pass-6', category: 'passing', title: 'Передачи после ведения', description: 'Ведёшь, останавливаешься, отдаёшь в движении. 20 повторов.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'intermediate' },
  { id: 'pass-7', category: 'passing', title: 'Alley-oop', description: 'Партнёр бежит на кольцо, ты набрасываешь в воздух. 15 попыток.', duration: 20, gear: ['ball', 'hoop', 'partner'], positions: ['PG', 'SG', 'SF'], level: 'advanced' },
  { id: 'pass-8', category: 'passing', title: 'Передачи на скорость', description: '3 метра. 30 передач за 20 сек. Скорость рук и точность.', duration: 15, gear: ['ball', 'partner'], positions: ['PG', 'SG'], level: 'advanced' },
  { id: 'pass-9', category: 'passing', title: 'Передачи из краски', description: 'В позиции центра: сдваивают — отдаёшь на периметр. 20 повторов.', duration: 15, gear: ['ball', 'partner'], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'pass-10', category: 'passing', title: 'Hand-off', description: 'Партнёр бежит на тебя, ты отдаёшь из рук в руки. 20 повторов.', duration: 15, gear: ['ball', 'partner'], positions: ['PF', 'C'], level: 'intermediate' },
  { id: 'pass-11', category: 'passing', title: 'Outlet pass', description: 'С подбора отдай длинный пас на бегущего партнёра. 15 повторов.', duration: 15, gear: ['ball', 'hoop', 'partner'], positions: ['PF', 'C'], level: 'advanced' },
  { id: 'pass-12', category: 'passing', title: 'Скидка после броска', description: 'Партнёр бросает, ты на подборе — сразу пас на дугу. 20 повторов.', duration: 15, gear: ['ball', 'hoop', 'partner'], positions: ['PF', 'C'], level: 'beginner' },
]

// ============================================================
// Получить упражнения под цели / инвентарь / уровень / позицию
// ============================================================
export function getFilteredExercises(goals, gear, level, positions) {
  return EXERCISES.filter((ex) => {
    if (goals.length > 0 && !goals.includes(ex.category)) return false
    const hasAllGear = ex.gear.every((g) => gear.includes(g))
    if (!hasAllGear) return false
    if (ex.level !== level) return false
    if (positions && positions.length > 0) {
      const main = positions[0]
      if (!ex.positions.includes(main)) return false
    }
    return true
  })
}

// ============================================================
// Интенсивность по уровню
// ============================================================
const LEVEL_INTENSITY = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
}

const CATEGORY_META = {
  shooting:    { icon: '🎯', label: 'Бросок' },
  dribbling:   { icon: '⚡', label: 'Дриблинг' },
  athleticism: { icon: '💪', label: 'Атлетизм' },
  iq:          { icon: '🧠', label: 'IQ' },
  defense:     { icon: '🛡️', label: 'Защита' },
  passing:     { icon: '🎁', label: 'Пас' },
}

// ============================================================
// Собрать план на неделю
// user.trainingDays — массив дней недели ['Пн', 'Ср', 'Пт'] (3-6)
// user.trainingLevel — beginner / intermediate / advanced
// ============================================================
export function generateWeekPlan(user) {
  const {
    trainingGoals = [],
    trainingGear = [],
    trainingLevel = 'beginner',
    positions = [],
    trainingDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
  } = user

  const allDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  // Собираем все доступные упражнения по всем выбранным категориям
  const available = getFilteredExercises(
    trainingGoals,
    trainingGear,
    trainingLevel,
    positions
  )

  // Если упражнений мало — ослабляем фильтр
  let finalAvailable = available
  if (finalAvailable.length < 3) {
    // Пробуем без уровня
    finalAvailable = getFilteredExercises(
      trainingGoals,
      trainingGear,
      'beginner',
      positions
    )
  }
  if (finalAvailable.length < 3) {
    // Пробуем без инвентаря
    const allGear = ['ball', 'hoop', 'cones', 'partner', 'wall', 'bar', 'band', 'chalk']
    finalAvailable = getFilteredExercises(
      trainingGoals,
      allGear,
      trainingLevel,
      positions
    )
  }

  // Если совсем ничего — все дни отдых
  if (finalAvailable.length === 0) {
    return allDays.map((day) => ({
      day,
      type: 'rest',
      icon: 'rest',
      label: 'Отдых',
      isTrainingDay: false,
    }))
  }

  // Группируем упражнения по категориям
  const byCategory = {}
  finalAvailable.forEach((ex) => {
    if (!byCategory[ex.category]) byCategory[ex.category] = []
    byCategory[ex.category].push(ex)
  })

  const activeCategories = Object.keys(byCategory)

  // Интенсивность по уровню
  const exercisesPerDay = LEVEL_INTENSITY[trainingLevel] || 3

  // Тренировочные дни — только выбранные
  const trainingDaysSet = new Set(trainingDays)

  // Индекс категории для чередования
  let categoryIndex = 0

  return allDays.map((day) => {
    const isTrainingDay = trainingDaysSet.has(day)

    if (!isTrainingDay) {
      return {
        day,
        type: 'rest',
        icon: 'rest',
        label: 'Отдых',
        isTrainingDay: false,
      }
    }

    // Берём категорию по кругу
    const category = activeCategories[categoryIndex % activeCategories.length]
    categoryIndex++

    // Берём упражнения этой категории (без повторов)
    const categoryExercises = byCategory[category] || []
    const dayExercises = []

    // Случайный выбор N упражнений без повторов
    const shuffled = [...categoryExercises].sort(() => Math.random() - 0.5)
    for (let i = 0; i < exercisesPerDay && i < shuffled.length; i++) {
      dayExercises.push(shuffled[i])
    }

    const totalDuration = dayExercises.reduce((sum, ex) => sum + ex.duration, 0)

    return {
      day,
      type: category,
      icon: CATEGORY_META[category]?.icon || '🏀',
      label: CATEGORY_META[category]?.label || 'Тренировка',
      exercises: dayExercises,
      totalDuration,
      exercisesCount: dayExercises.length,
      isTrainingDay: true,
    }
  })
}