import { useState, useEffect } from 'react'
import './App.css'

import { DEFAULT_USER, freshCategories } from './data/categories'
import RegistrationScreen from './screens/RegistrationScreen'
import HomeScreen from './screens/HomeScreen'
import TestsScreen from './screens/TestsScreen'
import TestRunScreen from './screens/TestRunScreen'
import CardScreen from './screens/CardScreen'
import CalendarScreen from './screens/CalendarScreen'
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
  const [loaded, setLoaded] = useState(false)

  // 🎬 Ключ для анимации переходов между экранами
  const [transitionKey, setTransitionKey] = useState(0)

  // Меняем ключ при любой смене экрана — запускает анимацию
   useEffect(() => {
    setTransitionKey((k) => k + 1)
  }, [
    activeTab,
    showCard,
    showPro,
    showTrainingSettings,
    showSettings,
    runningTest,
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

    function goToTab(tab) {
    setActiveTab(tab)
    setShowCard(false)
    setShowPro(false)
    setShowTrainingSettings(false)
    setShowSettings(false)
    setRunningTest(null)
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
  }

  function handleChangeTheme(themeId) {
    setUser((prev) => ({ ...prev, theme: themeId }))
  }
    function handleSaveProfile(data) {
    setUser((prev) => ({ ...prev, ...data }))
  }

  function handleChangeCardTheme(themeId) {
    setUser((prev) => ({ ...prev, cardTheme: themeId }))
  }

  function handleSaveTrainingSettings(data) {
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
      {/* 🎬 Анимированный контейнер экрана — key меняется при переходах */}
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
        ) : showCard ? (
          <CardScreen
            user={user}
            onBack={() => setShowCard(false)}
            onOpenPro={() => setShowPro(true)}
            onChangeCardTheme={handleChangeCardTheme}
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
                         {activeTab === 'calendar' && (
            <CalendarScreen
              user={user}
              onOpenPro={() => setShowPro(true)}
              onSaveProfile={handleSaveProfile}
              onOpenTrainingSettings={() => setShowTrainingSettings(true)}
              onOpenTests={() => setActiveTab('test')}
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
            activeTab === 'calendar' &&
            !showCard &&
            !showPro &&
            !runningTest &&
            !showTrainingSettings&&
            !showSettings
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('calendar')}
        >
          <span className="nav-icon">
            <CalendarIcon />
          </span>
          <span className="nav-label">Календарь</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'home' &&
            !showCard &&
            !showPro &&
            !runningTest &&
            !showTrainingSettings&&
            !showSettings
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('home')}
        >
          <span className="nav-icon">
            <HomeIcon />
          </span>
          <span className="nav-label">Главная</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'test' &&
            !showCard &&
            !showPro &&
            !runningTest &&
            !showTrainingSettings&&
            !showSettings
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('test')}
        >
          <span className="nav-icon">
            <ChartIcon />
          </span>
          <span className="nav-label">Тест</span>
        </button>

        <button
          className={`nav-item ${
            activeTab === 'profile' &&
            !showCard &&
            !showPro &&
            !runningTest &&
            !showTrainingSettings&&
            !showSettings
              ? 'active'
              : ''
          }`}
          onClick={() => goToTab('profile')}
        >
          <span className="nav-icon">
            <ProfileIcon />
          </span>
          <span className="nav-label">Профиль</span>
        </button>
      </nav>
    </div>
  )
}

export default App