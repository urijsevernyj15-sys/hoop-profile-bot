import { useState, useEffect } from 'react'
import './App.css'

import { DEFAULT_USER, freshCategories } from './data/categories'
import { completeTraining } from './data/programs'
import { clearActiveTraining } from './utils/trainingProgress'
import RegistrationScreen from './screens/RegistrationScreen'
import HomeScreen from './screens/HomeScreen'
import TestsScreen from './screens/TestsScreen'
import TestRunScreen from './screens/TestRunScreen'
import CardScreen from './screens/CardScreen'
import TrainingScreen from './screens/TrainingScreen'
import ProgramScreen from './screens/ProgramScreen'
import ActiveTrainingScreen from './screens/ActiveTrainingScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProScreen from './screens/ProScreen'
import TrainingSettingsScreen from './screens/TrainingSettingsScreen'
import SettingsScreen from './screens/SettingsScreen'

import { HomeIcon, CalendarIcon, ChartIcon, ProfileIcon } from './components/Icons'

const STORAGE_KEYS = {
  registered: 'hoop_registered',
  user: 'hoop_user',
}

function App() {
  const [user, setUser] = useState(DEFAULT_USER)
  const [registered, setRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [showCard, setShowCard] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [showTrainingSettings, setShowTrainingSettings] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [runningTest, setRunningTest] = useState(null)

  const [activeProgramId, setActiveProgramId] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  const [isTraining, setIsTraining] = useState(false)

  const [loaded, setLoaded] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)

  useEffect(() => {
    setTransitionKey((k) => k + 1)
  }, [
    activeTab,
    showCard,
    showPro,
    showTrainingSettings,
    showSettings,
    runningTest,
    activeProgramId,
    isTraining,
  ])

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEYS.registered)
      const u = localStorage.getItem(STORAGE_KEYS.user)
      let baseUser = { ...DEFAULT_USER, categories: freshCategories() }
      let reg = false

      if (r === 'true' && u) {
        const parsed = JSON.parse(u)
        baseUser = {
          ...DEFAULT_USER,
          ...parsed,
          categories: parsed.categories || freshCategories(),
        }
        reg = true
      }

      const tg = window.Telegram?.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
        tg.disableVerticalSwipes?.()
        const tgUser = tg.initDataUnsafe?.user
        if (tgUser) {
          baseUser = {
            ...baseUser,
            username: tgUser.username
              ? `@${tgUser.username}`
              : tgUser.first_name || baseUser.username,
            avatarLetter: (tgUser.first_name || 'P')[0].toUpperCase(),
            avatarUrl: tgUser.photo_url || null,
          }
        }
      }

      setUser(baseUser)
      setRegistered(reg)
    } catch (err) {
      console.warn(err)
      setUser({ ...DEFAULT_USER, categories: freshCategories() })
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEYS.registered, String(registered))
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    } catch (err) {
      console.warn(err)
    }
  }, [user, registered, loaded])

useEffect(() => {
  document.body.setAttribute('data-theme', user.theme || 'classic')
}, [user.theme])

// Определяем редкость по OVR и ставим на body
useEffect(() => {
  if (!user.categories) return

  const allTests = user.categories.flatMap((c) => c.tests)
  const freeTests = allTests.filter((t) => t.plan === 'free')
  const doneTests = freeTests.filter((t) => t.status === 'done' && t.score !== null)

  // Если не все тесты пройдены — редкость "none"
  let rarity = 'none'

  if (doneTests.length === freeTests.length && freeTests.length > 0) {
    // Считаем OVR (упрощённо — как веса по первой позиции)
    const main = user.positions?.[0] || 'default'
    const OVR_WEIGHTS = {
      PG: { 'b-iq-base': 25, 'sht-base': 15, 'drbl-base': 35, 'atl-base': 25 },
      SG: { 'b-iq-base': 20, 'sht-base': 30, 'drbl-base': 25, 'atl-base': 25 },
      SF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
      PF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 15, 'atl-base': 35 },
      C:  { 'b-iq-base': 25, 'sht-base': 20, 'drbl-base': 10, 'atl-base': 45 },
      default: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
    }
    const weights = OVR_WEIGHTS[main] || OVR_WEIGHTS.default

    let weightedSum = 0
    let totalWeight = 0
    freeTests.forEach((t) => {
      const w = weights[t.id] || 0
      weightedSum += (t.score || 0) * w
      totalWeight += w
    })

    const ovr = totalWeight > 0 ? Math.min(99, Math.round(weightedSum / totalWeight)) : 0

    if (ovr >= 95) rarity = 'legend'
    else if (ovr >= 85) rarity = 'elite'
    else if (ovr >= 70) rarity = 'gold'
    else if (ovr >= 50) rarity = 'silver'
    else rarity = 'bronze'
  }

  // Если пользователь выбрал свою редкость в карточке — уважаем её
  if (user.cardRarity) {
    rarity = user.cardRarity
  }

  document.body.setAttribute('data-rarity', rarity)
}, [user.categories, user.positions, user.cardRarity])

  function goToTab(tab) {
    setActiveTab(tab)
    setShowCard(false)
    setShowPro(false)
    setShowTrainingSettings(false)
    setShowSettings(false)
    setRunningTest(null)
    setActiveProgramId(null)
    setActiveSession(null)
    setIsTraining(false)
  }

  function handleRegistration(data) {
    setUser((prev) => ({ ...prev, ...data, categories: freshCategories() }))
    setRegistered(true)
  }

  function handleReset() {
    if (!window.confirm('Точно сбросить все данные?')) return

    localStorage.removeItem(STORAGE_KEYS.registered)
    localStorage.removeItem(STORAGE_KEYS.user)

    const cleanCats = freshCategories()
    cleanCats[0].tests[0].status = 'active'
    cleanCats[1].tests[0].status = 'pending'
    cleanCats[2].tests[0].status = 'pending'
    cleanCats[3].tests[0].status = 'pending'

    let tgBase = {
      ...DEFAULT_USER,
      categories: cleanCats,
    }

    const tg = window.Telegram?.WebApp
    if (tg) {
      const tgUser = tg.initDataUnsafe?.user
      if (tgUser) {
        tgBase = {
          ...tgBase,
          username: tgUser.username
            ? `@${tgUser.username}`
            : tgUser.first_name || '@player',
          avatarLetter: (tgUser.first_name || 'P')[0].toUpperCase(),
          avatarUrl: tgUser.photo_url || null,
        }
      }
    } else {
      tgBase = {
        ...tgBase,
        username:
          user.username && user.username !== '@player'
            ? user.username
            : '@player',
        avatarLetter: user.avatarLetter || 'P',
        avatarUrl: user.avatarUrl || null,
      }
    }

    setUser(tgBase)
    setRegistered(false)
    setActiveTab('home')
    setShowCard(false)
    setShowPro(false)
    setShowTrainingSettings(false)
    setShowSettings(false)
    setRunningTest(null)
    setActiveProgramId(null)
    setActiveSession(null)
    setIsTraining(false)
  }

  function handleChangeTheme(themeId) {
    setUser((prev) => ({ ...prev, theme: themeId }))
  }

  function handleSaveProfile(data) {
    setUser((prev) => ({ ...prev, ...data }))
  }

  function handleSaveTrainingSettings(data) {
    const programChanged =
      data.selectedProgramId !== undefined &&
      data.selectedProgramId !== user.selectedProgramId

    const modeChanged =
      data.trainingMode !== undefined &&
      data.trainingMode !== user.trainingMode

    if (programChanged || modeChanged) {
      clearActiveTraining()
      setActiveSession(null)
      setIsTraining(false)
      setActiveProgramId(null)
    }

    setUser((prev) => ({ ...prev, ...data }))
    setShowTrainingSettings(false)
  }

  function findTest(testId) {
    for (const cat of user.categories) {
      const t = cat.tests.find((x) => x.id === testId)
      if (t) return { test: t, category: cat }
    }
    return null
  }

  function handleSaveTestResult(testId, score) {
    setUser((prev) => {
      const newCategories = prev.categories.map((cat) => {
        const hasTest = cat.tests.some((t) => t.id === testId)
        if (!hasTest) return cat

        const newTests = cat.tests.map((t) =>
          t.id === testId ? { ...t, status: 'done', score } : t
        )

        const hasActive = newTests.some((t) => t.status === 'active')
        if (!hasActive) {
          const nextIdx = newTests.findIndex(
            (t) => t.status === 'pending' && t.plan === 'free'
          )
          if (nextIdx !== -1) {
            newTests[nextIdx] = { ...newTests[nextIdx], status: 'active' }
          }
        }

        return { ...cat, tests: newTests }
      })

      const anyActive = newCategories.some((cat) =>
        cat.tests.some((t) => t.status === 'active')
      )
      if (!anyActive) {
        for (let i = 0; i < newCategories.length; i++) {
          const idx = newCategories[i].tests.findIndex(
            (t) => t.status === 'pending' && t.plan === 'free'
          )
          if (idx !== -1) {
            newCategories[i].tests[idx] = {
              ...newCategories[i].tests[idx],
              status: 'active',
            }
            break
          }
        }
      }

      return { ...prev, categories: newCategories }
    })
    setRunningTest(null)
    setActiveTab('home')
  }

  function handleStartTraining(programId, session) {
    setActiveProgramId(programId)
    setActiveSession(session)
    setIsTraining(true)
  }

  function handleCompleteTraining(completedTrainings) {
    if (!activeProgramId) return

    setUser((prev) => {
      const newProgress = activeProgramId === '__mix__'
        ? prev.trainingProgress || {}
        : completeTraining(activeProgramId, prev)

      const newCompleted = completedTrainings === null
        ? prev.completedTrainings || {}
        : completedTrainings || prev.completedTrainings || {}

      return {
        ...prev,
        trainingProgress: newProgress,
        completedTrainings: newCompleted,
      }
    })

    setIsTraining(false)
    setActiveSession(null)
    setActiveProgramId(null)
  }

  if (!loaded) return <div className="app" />

  if (!registered) {
    return (
      <div className="app">
        <div className="screen-transition" key="registration">
          <RegistrationScreen onComplete={handleRegistration} />
        </div>
      </div>
    )
  }

  const runningTestInfo = runningTest ? findTest(runningTest) : null

  return (
    <div className="app">
      <div className="screen-transition" key={transitionKey}>
        {showSettings ? (
          <SettingsScreen
            user={user}
            onBack={() => setShowSettings(false)}
            onChangeTheme={handleChangeTheme}
            onSaveProfile={handleSaveProfile}
            onReset={handleReset}
          />
        ) : showTrainingSettings ? (
          <TrainingSettingsScreen
            user={user}
            onBack={() => setShowTrainingSettings(false)}
            onSave={handleSaveTrainingSettings}
          />
        ) : showPro ? (
          <ProScreen user={user} onBack={() => setShowPro(false)} />
        ) : showCard ? (
          <CardScreen
            user={user}
            onBack={() => setShowCard(false)}
            onOpenPro={() => {
              setShowCard(false)
              setShowPro(true)
            }}
            onSaveProfile={handleSaveProfile}
          />
        ) : runningTestInfo ? (
          <TestRunScreen
            testId={runningTest}
            testTitle={runningTestInfo.test.title}
            user={user}
            onBack={() => setRunningTest(null)}
            onSave={handleSaveTestResult}
            onGoHome={() => {
              setRunningTest(null)
              setActiveTab('home')
            }}
            onOpenProfile={() => {
              setRunningTest(null)
              setActiveTab('profile')
            }}
          />
        ) : isTraining && activeSession ? (
          <ActiveTrainingScreen
            user={user}
            programId={activeProgramId}
            session={activeSession}
            onBack={() => {
              setIsTraining(false)
              setActiveSession(null)
              setActiveProgramId(null)
            }}
            onComplete={handleCompleteTraining}
          />
        ) : activeProgramId === '__trial__' ? (
          <ProgramScreen
            user={user}
            programId="__trial__"
            onBack={() => setActiveProgramId(null)}
            onStartTraining={handleStartTraining}
            onOpenSettings={() => setShowTrainingSettings(true)}
            onOpenPro={() => setShowPro(true)}
          />
        ) : activeProgramId ? (
          <ProgramScreen
            user={user}
            programId={activeProgramId}
            onBack={() => setActiveProgramId(null)}
            onStartTraining={handleStartTraining}
            onOpenSettings={() => setShowTrainingSettings(true)}
            onOpenPro={() => setShowPro(true)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                user={user}
                onOpenCard={() => setShowCard(true)}
                onOpenPro={() => setShowPro(true)}
                onStartTest={(id) => setRunningTest(id)}
                onOpenTests={() => setActiveTab('test')}
              />
            )}
            {activeTab === 'test' && (
              <TestsScreen
                user={user}
                onOpenPro={() => setShowPro(true)}
                onStartTest={(id) => setRunningTest(id)}
              />
            )}
            {activeTab === 'training' && (
              <TrainingScreen
                user={user}
                onOpenProgram={(programId, session) => {
                  if (programId === 'pro') {
                    setShowPro(true)
                  } else if (session) {
                    setActiveProgramId(programId)
                    setActiveSession(session)
                    setIsTraining(true)
                  } else {
                    setActiveProgramId(programId)
                  }
                }}
                onOpenPro={() => setShowPro(true)}
                onOpenSettings={() => setShowTrainingSettings(true)}
                onSaveProfile={handleSaveProfile}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileScreen
                user={user}
                onOpenPro={() => setShowPro(true)}
                onOpenTrainingSettings={() => setShowTrainingSettings(true)}
                onOpenSettings={() => setShowSettings(true)}
                onSaveProfile={handleSaveProfile}
              />
            )}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${
            activeTab === 'training' &&
            !showCard && !showPro && !runningTest &&
            !showTrainingSettings && !showSettings &&
            !activeProgramId && !isTraining
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('training')}
        >
          <span className="nav-icon"><CalendarIcon /></span>
          <span className="nav-label">Тренировки</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'home' &&
            !showCard && !showPro && !runningTest &&
            !showTrainingSettings && !showSettings &&
            !activeProgramId && !isTraining
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('home')}
        >
          <span className="nav-icon"><HomeIcon /></span>
          <span className="nav-label">Главная</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'test' &&
            !showCard && !showPro && !runningTest &&
            !showTrainingSettings && !showSettings &&
            !activeProgramId && !isTraining
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('test')}
        >
          <span className="nav-icon"><ChartIcon /></span>
          <span className="nav-label">Тест</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'profile' &&
            !showCard && !showPro && !runningTest &&
            !showTrainingSettings && !showSettings &&
            !activeProgramId && !isTraining
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('profile')}
        >
          <span className="nav-icon"><ProfileIcon /></span>
          <span className="nav-label">Профиль</span>
        </button>
      </nav>
    </div>
  )
}

export default App