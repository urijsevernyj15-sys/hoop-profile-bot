// src/components/Icons.jsx
// Набор SVG-иконок для приложения

// ========== НИЖНЕЕ МЕНЮ ==========

export function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10H21" />
      <path d="M8 3V7" />
      <path d="M16 3V7" />
    </svg>
  )
}

export function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3V21H21" />
      <rect x="7" y="12" width="3" height="6" rx="0.5" />
      <rect x="12" y="8" width="3" height="10" rx="0.5" />
      <rect x="17" y="5" width="3" height="13" rx="0.5" />
    </svg>
  )
}

export function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" />
    </svg>
  )
}

// ========== ИКОНКИ НАВЫКОВ (для главной) ==========

export function ShootingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3V21" />
      <path d="M3 12H21" />
      <path d="M5.6 5.6C8 8 8 16 5.6 18.4" />
      <path d="M18.4 5.6C16 8 16 16 18.4 18.4" />
    </svg>
  )
}

export function DribblingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5 8C5 8 12 12 12 21" />
      <path d="M19 8C19 8 12 12 12 21" />
      <path d="M3 12C3 12 12 10 21 12" />
    </svg>
  )
}

export function AthleticismIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12H18" />
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="5" y="8" width="2" height="8" rx="0.5" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="17" y="8" width="2" height="8" rx="0.5" />
    </svg>
  )
}

export function IQIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18C9 18 9 16 9 15C9 14 7 13 7 10C7 6.7 9.2 4 12 4C14.8 4 17 6.7 17 10C17 13 15 14 15 15C15 16 15 18 15 18" />
      <path d="M9 20H15" />
      <path d="M10 22H14" />
    </svg>
  )
}

// ========== БОЛЬШАЯ ИКОНКА IQ ==========

export function IQBrainIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18C9 18 9 16 9 15C9 14 7 13 7 10C7 6.7 9.2 4 12 4C14.8 4 17 6.7 17 10C17 13 15 14 15 15C15 16 15 18 15 18" />
      <path d="M9 20H15" />
      <path d="M10 22H14" />
      <path d="M12 7V11" />
      <path d="M10 9H14" />
    </svg>
  )
}

// ========== ИКОНКИ КАТЕГОРИЙ ДЛЯ КАЛЕНДАРЯ/ТЕСТОВ ==========

export function CatShootingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function CatDribblingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" />
    </svg>
  )
}

export function CatAthleticismIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12H18" />
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="5" y="8" width="2" height="8" rx="0.5" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="17" y="8" width="2" height="8" rx="0.5" />
    </svg>
  )
}

export function CatIQIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18C9 18 9 16 9 15C9 14 7 13 7 10C7 6.7 9.2 4 12 4C14.8 4 17 6.7 17 10C17 13 15 14 15 15C15 16 15 18 15 18" />
      <path d="M9 20H15" />
      <path d="M10 22H14" />
    </svg>
  )
}

export function CatDefenseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  )
}

export function CatPassingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 12L16 7" />
      <path d="M8 12L16 17" />
    </svg>
  )
}

export function CatRestIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4A8.5 8.5 0 1 0 20 14.5Z" />
    </svg>
  )
}

// ============================================================
// ИКОНКИ ЦЕЛЕЙ (для настроек тренировок — стиль нижней панели)
// ============================================================

export function GoalShootingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="4" />
      <path d="M12 6V8" />
      <path d="M4 6H20" />
      <path d="M4 6V9" />
      <path d="M20 6V9" />
      <path d="M8 18H16" />
    </svg>
  )
}

export function GoalDribblingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" />
    </svg>
  )
}

export function GoalAthleticismIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12H18" />
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="5" y="8" width="2" height="8" rx="0.5" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="17" y="8" width="2" height="8" rx="0.5" />
    </svg>
  )
}

export function GoalIQIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18C9 18 9 16 9 15C9 14 7 13 7 10C7 6.7 9.2 4 12 4C14.8 4 17 6.7 17 10C17 13 15 14 15 15C15 16 15 18 15 18" />
      <path d="M9 20H15" />
      <path d="M10 22H14" />
    </svg>
  )
}

export function GoalDefenseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  )
}

export function GoalPassingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 12L16 7" />
      <path d="M8 12L16 17" />
    </svg>
  )
}

// ============================================================
// ИКОНКИ ИНВЕНТАРЯ (стиль нижней панели)
// ============================================================

export function GearBallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6C8 8 8 16 5.6 18.4" />
      <path d="M18.4 5.6C16 8 16 16 18.4 18.4" />
      <path d="M3 12H21" />
    </svg>
  )
}

export function GearTwoBallsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Мяч 1 — нижний */}
      <circle cx="8" cy="15" r="5" />
      <path d="M5 11.5C6 12.5 6 17.5 5 18.5" />
      <path d="M11 11.5C10 12.5 10 17.5 11 18.5" />
      <path d="M4 15H12" />
      {/* Мяч 2 — верхний (перекрывает) */}
      <circle cx="16" cy="9" r="5" fill="var(--bg)" />
      <path d="M13 5.5C14 6.5 14 11.5 13 12.5" />
      <path d="M19 5.5C18 6.5 18 11.5 19 12.5" />
      <path d="M12 9H20" />
    </svg>
  )
}

export function GearPartnerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20C3 16.5 5.5 14 9 14C12.5 14 15 16.5 15 20" />
      <path d="M15 14C17.5 14 21 16 21 20" />
    </svg>
  )
}

export function GearConesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L17 21H7L12 3Z" />
      <path d="M9.5 12H14.5" />
      <path d="M6 21H18" />
    </svg>
  )
}

// ========== ИКОНКА ПРОХОДОВ ==========

export function GoalDrivesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12H17" />
      <path d="M13 6L19 12L13 18" />
      <circle cx="5" cy="19" r="2" />
    </svg>
  )
}

// ========== ИКОНКА ЗАВЕРШЕНИЙ ==========

export function GoalFinishingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4V10" />
      <path d="M5 4H15" />
      <path d="M15 4V10" />
      <path d="M2 10H18" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  )
}