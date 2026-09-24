import {
  IconTrophy,
  IconRobot,
  IconShooting,
  IconFire,
  IconAthleticism,
} from './Icons'

export default function TrainingOnboarding({ onComplete, onOpenSettings }) {
  return (
    <div className="training-onboarding">
      {/* Hero */}
      <div className="training-onboarding-hero">
        <div className="training-onboarding-glow" />
        <div className="training-onboarding-icon">
          <IconTrophy size={64} />
        </div>
        <div className="training-onboarding-label">PRO</div>
        <h1 className="training-onboarding-title">
          Добро пожаловать в<br />тренировки!
        </h1>
        <p className="training-onboarding-sub">
          Сейчас покажу, как всё устроено. 30 секунд — и ты в теме.
        </p>
      </div>

      {/* Как это работает */}
      <div className="training-onboarding-card">
        <div className="training-onboarding-card-title">
          <span><IconShooting size={22} /></span>
          <span>Как проходят тренировки</span>
        </div>
        <div className="training-onboarding-list">
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">1</span>
            <div>
              <div className="training-onboarding-item-title">
                Каждая тренировка — 3 части
              </div>
              <div className="training-onboarding-item-text">
                🔥 Разминка → 🎯 Основная часть → 🧘 Заминка
              </div>
            </div>
          </div>
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">2</span>
            <div>
              <div className="training-onboarding-item-title">
                Упражнения идут по одному
              </div>
              <div className="training-onboarding-item-text">
                Видишь упражнение, делаешь, жмёшь «Готово» — переходишь к следующему.
              </div>
            </div>
          </div>
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">3</span>
            <div>
              <div className="training-onboarding-item-title">
                Можно выйти в любой момент
              </div>
              <div className="training-onboarding-item-text">
                Прогресс сохранится. Вернёшься — продолжишь с того же места.
              </div>
            </div>
          </div>
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">4</span>
            <div>
              <div className="training-onboarding-item-title">
                Одна тренировка в день
              </div>
              <div className="training-onboarding-item-text">
                Прошёл — молодец. Возвращайся завтра. Мышцам нужен отдых.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Два режима */}
      <div className="training-onboarding-card">
        <div className="training-onboarding-card-title">
          <span><IconAthleticism size={22} /></span>
          <span>Два режима тренировок</span>
        </div>

        <div className="training-onboarding-mode">
          <div className="training-onboarding-mode-icon">
            <IconShooting size={24} />
          </div>
          <div className="training-onboarding-mode-body">
            <div className="training-onboarding-mode-title">Одна программа</div>
            <div className="training-onboarding-mode-text">
              Идёшь по выбранной программе: Снайпер, Плэймейкер, Зверь,
              Атакующий или Универсал. Каждая прокачивает конкретные навыки.
            </div>
          </div>
        </div>

        <div className="training-onboarding-mode">
          <div className="training-onboarding-mode-icon">
            <IconRobot size={24} />
          </div>
          <div className="training-onboarding-mode-body">
            <div className="training-onboarding-mode-title">Микс</div>
            <div className="training-onboarding-mode-text">
              Робот собирает тренировку по твоим целям. Сам решает, что
              качать в каждый день. Идеально, если хочешь прокачать
              несколько навыков сразу.
            </div>
          </div>
        </div>
      </div>

      {/* Как настроить */}
      <div className="training-onboarding-card">
        <div className="training-onboarding-card-title">
          <span>⚙️</span>
          <span>Как настроить под себя</span>
        </div>
        <div className="training-onboarding-list">
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">1</span>
            <div>
              <div className="training-onboarding-item-title">
                Выбери цели
              </div>
              <div className="training-onboarding-item-text">
                Бросок, дриблинг, атлетизм, IQ, защита, пас, проходы, завершения.
                Можно несколько.
              </div>
            </div>
          </div>
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">2</span>
            <div>
              <div className="training-onboarding-item-title">
                Отметь инвентарь
              </div>
              <div className="training-onboarding-item-text">
                Что у тебя есть: мяч, партнёр, конусы. Упражнения подберём под это.
              </div>
            </div>
          </div>
          <div className="training-onboarding-item">
            <span className="training-onboarding-item-num">3</span>
            <div>
              <div className="training-onboarding-item-title">
                Выбери дни и уровень
              </div>
              <div className="training-onboarding-item-text">
                3–6 дней в неделю. Новичок / любитель / продвинутый — от этого
                зависит объём.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Совет */}
      <div className="training-onboarding-tip">
        <span className="training-onboarding-tip-icon">💡</span>
        <span className="training-onboarding-tip-text">
          <strong>Совет:</strong> не гонись за количеством. Регулярность важнее
          интенсивности. Лучше 3 короткие тренировки в неделю, чем 1 длинная.
        </span>
      </div>

      {/* Кнопки */}
      <div className="training-onboarding-actions">
        <button className="training-onboarding-cta" onClick={onComplete}>
          Понятно, поехали! <span className="arrow">→</span>
        </button>
        <button className="training-onboarding-settings" onClick={onOpenSettings}>
          Сразу к настройкам →
        </button>
      </div>
    </div>
  )
}