import { useState, useEffect } from 'react'
import { getMixWeekPlan, getMixTraining, getPersonalTraining } from '../data/exercisesData'
import { formatDate, isTrainingCompleted } from '../data/schedule'
import { getActiveTraining, clearActiveTraining } from '../utils/trainingProgress'
import {
  IconShooting,
  IconDribbling,
  IconDrives,
  IconFinishing,
  IconAthleticism,
  IconIQ,
  IconDefense,
  IconPassing,
  IconRobot,
  IconMoon,
  IconFire,
  IconCooldown,
  IconTrophy,
} from '../components/Icons'

const CATEGORY_META = {
  shooting:    { label: 'Бросок',     Icon: IconShooting },
  dribbling:   { label: 'Дриблинг',   Icon: IconDribbling },
  drives:      { label: 'Проходы',    Icon: IconDrives },
  finishing:   { label: 'Завершения', Icon: IconFinishing },
  athleticism: { label: 'Атлетизм',   Icon: IconAthleticism },
  iq:          { label: 'IQ',         Icon: IconIQ },
  defense:     { label: 'Защита',     Icon: IconDefense },
  passing:     { label: 'Пас',        Icon: IconPassing },
}

const ALL_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// ============================================================
// 🤖 КАРТОЧКА ОТДЫХА
// ============================================================

function MixRestCard({ user, weekPlan, todayName }) {
  const todayIdx = ALL_DAYS.indexOf(todayName)
  let nextTraining = null
  let daysAhead = 0

  for (let i = 1; i <= 7; i++) {
    const checkIdx = (todayIdx + i) % 7
    const checkDay = ALL_DAYS[checkIdx]
    const plan = weekPlan.find((p) => p.day === checkDay)
    if (plan && plan.categories.length > 0) {
      nextTraining = plan
      daysAhead = i
      break
    }
  }

  function getDaysText(n) {
    if (n === 1) return 'завтра'
    if (n === 2) return 'послезавтра'
    return `через ${n} ${n === 3 || n === 4 ? 'дня' : 'дней'}`
  }

  const TIPS = [
    { icon: '💧', text: 'Пей больше воды — восстановление начинается с гидратации' },
    { icon: '🛌', text: 'Спи 7–9 часов — мышцы растут во сне' },
    { icon: '🧘', text: 'Лёгкая растяжка снимет забитость' },
    { icon: '🍗', text: 'Белковая еда ускоряет восстановление' },
    { icon: '🚶', text: 'Прогулка 20 минут — кровь разгонится' },
  ]

  const tip1 = TIPS[todayIdx % TIPS.length]
  const tip2 = TIPS[(todayIdx + 2) % TIPS.length]

  return (
    <div className="mix-rest-card">
      <div className="mix-rest-glow" />

      <div className="mix-rest-icon-wrap">
        <div className="mix-rest-icon-bg" />
        <div className="mix-rest-icon">
          <IconMoon size={52} />
        </div>
      </div>

      <div className="mix-rest-label">ВОССТАНОВЛЕНИЕ</div>
      <div className="mix-rest-title">Сегодня отдых</div>
      <div className="mix-rest-sub">
        Мышцам нужно восстановиться, чтобы расти
      </div>

      {nextTraining && (
        <div className="mix-rest-next">
          <div className="mix-rest-next-label">Следующая тренировка</div>
          <div className="mix-rest-next-day">
            {nextTraining.day} · {getDaysText(daysAhead)}
          </div>
          <div className="mix-rest-next-cats">
            {nextTraining.categories.map((cat, i) => {
              const meta = CATEGORY_META[cat]
              const IconComp = meta?.Icon
              return (
                <span key={i} className="mix-rest-next-cat">
                  {IconComp ? <IconComp size={14} /> : null}
                  <span>{meta?.label || cat}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="mix-rest-tips">
        <div className="mix-rest-tip">
          <span className="mix-rest-tip-icon">{tip1.icon}</span>
          <span className="mix-rest-tip-text">{tip1.text}</span>
        </div>
        <div className="mix-rest-tip">
          <span className="mix-rest-tip-icon">{tip2.icon}</span>
          <span className="mix-rest-tip-text">{tip2.text}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 📋 СВОРАЧИВАЕМЫЙ ПРЕДПРОСМОТР ТРЕНИРОВКИ
// ============================================================

function PreviewCollapse({ session, isDone }) {
  const [isOpen, setIsOpen] = useState(false)

  const groupedExercises = {
    warmup: session.exercises.filter((ex) => ex.section === 'warmup'),
    main: session.exercises.filter((ex) => ex.section === 'main'),
    cooldown: session.exercises.filter((ex) => ex.section === 'cooldown'),
  }

  const SECTION_META = {
    warmup:   { label: 'Разминка',       Icon: IconFire },
    main:     { label: 'Основная часть', Icon: IconShooting },
    cooldown: { label: 'Заминка',        Icon: IconCooldown },
  }

  return (
    <div className={`card intro-card preview-collapse ${isOpen ? 'open' : ''}`}>
      <button
        className="preview-collapse-head"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="preview-collapse-title-row">
          <span className="preview-collapse-pill">Что в тренировке</span>
          <span className="preview-collapse-count">
            {session.totalExercises} упражнений
          </span>
        </div>
        <span className={`preview-collapse-arrow ${isOpen ? 'open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="preview-collapse-body">
          {['warmup', 'main', 'cooldown'].map((sectionKey) => {
            const sectionExercises = groupedExercises[sectionKey]
            if (sectionExercises.length === 0) return null

            const meta = SECTION_META[sectionKey]
            const SectionIcon = meta.Icon

            return (
              <div key={sectionKey} className="preview-section">
                <div className="preview-section-title">
                  <span className="preview-section-title-left">
                    {SectionIcon && <SectionIcon size={16} />}
                    <span>{meta.label}</span>
                  </span>
                  <span className="preview-section-count">
                    {sectionExercises.length}
                  </span>
                </div>
                {sectionExercises.map((ex, i) => (
                  <div key={ex.id} className="program-preview-item">
                    <div className="program-preview-num">{i + 1}</div>
                    <div className="program-preview-body">
                      <div className="program-preview-title">{ex.title}</div>
                      <div className="program-preview-meta">
                        {ex.sets} × {ex.reps || ex.duration + ' мин'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================
// 🎯 ОСНОВНОЙ КОМПОНЕНТ
// ============================================================

export default function MixTrainingScreen({
  user,
  onOpenSettings,
  onStartMixTraining,
  onOpenPro,
}) {
  const weekPlan = getMixWeekPlan(user)

  const today = new Date()
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const todayName = dayNames[today.getDay()]

  const todayPlan = weekPlan.find((p) => p.day === todayName)
  const todaySession = getMixTraining(user, today)

  const hasGoals = (user.trainingGoals || []).length > 0
  const hasGear = (user.trainingGear || []).length > 0

  const trainingDaysCount = weekPlan.length

  // Проверяем, пройдена ли тренировка сегодня
  const todayStr = formatDate(today)
  const isTodayDone = isTrainingCompleted(user, todayStr)
  const todayCompletion = user.completedTrainings?.[todayStr] || null

  // Активная незавершённая тренировка
  const [activeTraining, setActiveTraining] = useState(null)

  useEffect(() => {
    const active = getActiveTraining()
    if (active && active.programId === '__mix__') {
      setActiveTraining(active)
    } else {
      setActiveTraining(null)
    }
  }, [user])

  function handleResume() {
    if (!activeTraining) return
    onStartMixTraining({
      exercises: activeTraining.exercises,
      totalExercises: activeTraining.exercises.length,
      totalDuration: activeTraining.exercises.reduce(
        (sum, ex) => sum + (ex.duration || 5),
        0
      ),
      categoriesToday: [],
      isRestDay: false,
    })
  }

  // ========== ЗАГЛУШКА: НЕТ ЦЕЛЕЙ ИЛИ ИНВЕНТАРЯ ==========
  if (!hasGoals || !hasGear) {
    return (
      <div className="mix-onboarding">
        <div className="onboarding-icon">🤖</div>
        <h1 className="onboarding-title">Настрой робота</h1>
        <p className="onboarding-sub">
          Чтобы робот собрал тренировку под тебя, нужно выбрать цели и инвентарь.
        </p>

        <div className="onboarding-list">
          <div className="onboarding-item">
            <span className="onboarding-check">✓</span>
            <span>Выбери цели (что качать)</span>
          </div>
          <div className="onboarding-item">
            <span className="onboarding-check">✓</span>
            <span>Выбери инвентарь</span>
          </div>
          <div className="onboarding-item">
            <span className="onboarding-check">✓</span>
            <span>Выбери дни тренировок</span>
          </div>
        </div>

        <button className="onboarding-cta" onClick={onOpenSettings}>
          Настроить <span className="arrow">→</span>
        </button>

        <p className="onboarding-note">
          Займёт 1 минуту
        </p>
      </div>
    )
  }

  // ========== СЕГОДНЯ НЕ ТРЕНИРОВОЧНЫЙ ДЕНЬ ==========
  if (todaySession.isRestDay) {
    return (
      <>
        <div className="training-head">
          <h1 className="training-head-title">Микс</h1>
          <p className="training-head-sub">Робот под твои цели</p>
        </div>

        <div className="mix-hero">
          <div className="mix-hero-glow" />
          <div className="mix-hero-icon">
            <IconRobot size={56} />
          </div>
          <div className="mix-hero-label">МИКС</div>
          <h2 className="mix-hero-title">Робот собирает под тебя</h2>
          <p className="mix-hero-sub">
            Тренировки только по твоим тренировочным дням.
          </p>
          <div className="mix-hero-meta">
            <span className="mix-hero-meta-item">
              🎯 {(user.trainingGoals || []).length} целей
            </span>
            <span className="mix-hero-meta-item">
              📅 {trainingDaysCount} дней/нед
            </span>
          </div>
        </div>

        <MixRestCard
          user={user}
          weekPlan={weekPlan}
          todayName={todayName}
        />

        {/* Расписание недели */}
        <div className="card intro-card">
          <div className="tag-pill mix-week-pill">Расписание на неделю</div>
          <div className="mix-week-list">
            {weekPlan.map((dayPlan, i) => {
              const isToday = dayPlan.day === todayName
              return (
                <div
                  key={i}
                  className={`mix-week-item ${isToday ? 'today' : ''}`}
                >
                  <span className="mix-week-day">{dayPlan.day}</span>
      <div className="mix-week-categories">
  {dayPlan.categories.length > 0 ? (
    dayPlan.categories.map((cat, ci) => {
      const meta = CATEGORY_META[cat]
      const IconComp = meta?.Icon
      return (
        <span key={ci} className="mix-week-cat">
          {IconComp ? <IconComp size={14} /> : null}
          <span className="mix-week-cat-label">{meta?.label || cat}</span>
        </span>
      )
    })
  ) : (
    <span className="mix-week-rest">отдых</span>
  )}
</div>
                </div>
              )
            })}
          </div>
        </div>

        <button className="program-settings-edit" onClick={onOpenSettings}>
          Изменить цели →
        </button>
      </>
    )
  }

  // ========== ТРЕНИРОВКА НА СЕГОДНЯ ==========
  const categoriesToday = todaySession.categoriesToday

  return (
    <>
      <div className="training-head">
        <h1 className="training-head-title">Микс</h1>
        <p className="training-head-sub">Робот под твои цели</p>
      </div>

      {/* Hero */}
      <div className="mix-hero">
        <div className="mix-hero-glow" />
        <div className="mix-hero-icon">
          <IconRobot size={56} />
        </div>
        <div className="mix-hero-label">МИКС</div>
        <h2 className="mix-hero-title">Робот собрал тренировку</h2>
        <p className="mix-hero-sub">
          Сегодня качаем то, что ты выбрал.
        </p>
        <div className="mix-hero-meta">
          <span className="mix-hero-meta-item">
            🎯 {(user.trainingGoals || []).length} целей
          </span>
          <span className="mix-hero-meta-item">
            📅 {trainingDaysCount} дней/нед
          </span>
        </div>
      </div>

      {/* Категории сегодня */}
      <div className="card intro-card">
        <div className="tag-pill">Сегодня качаем</div>
        <div className="mix-today-categories">
          {categoriesToday.map((cat, i) => {
            const meta = CATEGORY_META[cat]
            const IconComp = meta?.Icon
            return (
              <div key={i} className="mix-today-cat">
                <span className="mix-today-cat-icon">
                  {IconComp ? <IconComp size={18} /> : null}
                </span>
                <span className="mix-today-cat-label">{meta?.label || cat}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Инфо о тренировке */}
      <div className={`program-today ${isTodayDone ? 'mix-done' : ''}`}>
        <div className="program-today-head">
          <div className="program-today-label">
            {isTodayDone ? '✓ ВЫПОЛНЕНО' : 'СЕГОДНЯ'}
          </div>
          <h2 className="program-today-title">
            {isTodayDone ? 'Тренировка пройдена!' : 'Тренировка'}
          </h2>
          {isTodayDone && todayCompletion?.completedAt && (
            <div className="mix-done-time">
              Завершено в{' '}
              {new Date(todayCompletion.completedAt).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>

        <div className="program-today-info">
          <div className="program-today-stat">
            <span className="program-today-stat-value">
              {todaySession.totalExercises}
            </span>
            <span className="program-today-stat-label">упражнений</span>
          </div>
          <div className="program-today-stat">
            <span className="program-today-stat-value">
              ~{todaySession.totalDuration}
            </span>
            <span className="program-today-stat-label">минут</span>
          </div>
          <div className="program-today-stat">
            <span className="program-today-stat-value">
              {categoriesToday.length}
            </span>
            <span className="program-today-stat-label">категории</span>
          </div>
        </div>

        {isTodayDone ? (
          <div className="mix-done-badge">
            <span className="mix-done-check">✓</span>
            <span>Отличная работа! Отдыхай</span>
          </div>
        ) : activeTraining ? (
          <button
            className="program-start-btn mix-resume-btn"
            onClick={handleResume}
          >
            Продолжить тренировку <span className="arrow">→</span>
          </button>
        ) : (
          <button
            className="program-start-btn mix-start-btn"
            onClick={() => onStartMixTraining(todaySession)}
          >
            Начать тренировку <span className="arrow">→</span>
          </button>
        )}
      </div>

      {/* Предпросмотр */}
      <PreviewCollapse
        session={todaySession}
        isDone={isTodayDone}
      />

      {/* Расписание недели */}
      <div className="card intro-card">
        <div className="tag-pill mix-week-pill">Расписание на неделю</div>
        <div className="mix-week-list">
          {weekPlan.map((dayPlan, i) => {
            const isToday = dayPlan.day === todayName
            return (
              <div
                key={i}
                className={`mix-week-item ${isToday ? 'today' : ''}`}
              >
                <span className="mix-week-day">{dayPlan.day}</span>
<div className="mix-week-categories">
  {dayPlan.categories.length > 0 ? (
    dayPlan.categories.map((cat, ci) => {
      const meta = CATEGORY_META[cat]
      const IconComp = meta?.Icon
      return (
        <span key={ci} className="mix-week-cat">
          {IconComp ? <IconComp size={14} /> : null}
          <span className="mix-week-cat-label">{meta?.label || cat}</span>
        </span>
      )
    })
  ) : (
    <span className="mix-week-rest">отдых</span>
  )}
</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Настройки */}
      <div className="program-settings-info">
        <div className="program-settings-info-row">
          <span className="program-settings-info-icon">📊</span>
          <span className="program-settings-info-text">
            Уровень: <strong>
              {user.trainingLevel === 'beginner' ? 'Новичок' :
               user.trainingLevel === 'intermediate' ? 'Любитель' : 'Продвинутый'}
            </strong>
          </span>
        </div>
        <div className="program-settings-info-row">
          <span className="program-settings-info-icon">🏀</span>
          <span className="program-settings-info-text">
            Позиция: <strong>{user.positions?.[0] || '—'}</strong>
          </span>
        </div>
        <div className="program-settings-info-row">
          <span className="program-settings-info-icon">🎒</span>
          <span className="program-settings-info-text">
            Инвентарь: <strong>{(user.trainingGear || []).length} шт.</strong>
          </span>
        </div>

        <button className="program-settings-edit" onClick={onOpenSettings}>
          Изменить цели →
        </button>
      </div>
    </>
  )
}