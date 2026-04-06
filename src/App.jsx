import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'
import SignIn from './components/signin'



const todaySessions = [
  {
    id: 1,
    time: '5:00pm',
    title: 'Taekwondo',
    duration: '90 minutes',
    attendees: 3,
    status: 'in-progress',
  },
  {
    id: 2,
    time: '6:00pm',
    title: 'BJJ Adults',
    duration: '90 minutes',
    attendees: 0,
    status: 'in-progress',
  },
  {
    id: 3,
    time: '7:30pm',
    title: 'Test One-Off Event',
    duration: '90 minutes',
    attendees: 0,
    status: 'upcoming',
  },
  {
    id: 4,
    time: '8:30pm',
    title: 'Kickboxing',
    duration: '60 minutes',
    attendees: 0,
    status: 'upcoming',
  },
]

const initialRecentCheckIns = [
  {
    id: 1,
    name: 'Mark Aguirre',
    initials: 'MA',
    avatarColor: 'slate',
    sessionsUsed: 4,
    totalSessions: 20,
    daysUsed: 303,
    totalDays: 30,
    progressColor: 'green',
    className: 'Taekwondo',
    checkInTime: '5:00pm',
    checkInDate: 'Jun 29',
  },
  {
    id: 2,
    name: 'Jaxx Le',
    initials: 'JL',
    avatarColor: 'teal',
    sessionsUsed: 7,
    totalSessions: 20,
    daysUsed: 342,
    totalDays: 30,
    progressColor: 'yellow',
    className: 'Taekwondo',
    checkInTime: '5:00pm',
    checkInDate: 'Jun 29',
  },
  {
    id: 3,
    name: 'Ari Scott',
    initials: 'AS',
    avatarColor: 'amber',
    sessionsUsed: 4,
    totalSessions: 20,
    daysUsed: 193,
    totalDays: 30,
    progressColor: 'blue',
    className: 'Taekwondo',
    checkInTime: '5:00pm',
    checkInDate: 'Jun 29',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    initials: 'EW',
    avatarColor: 'violet',
    sessionsUsed: 12,
    totalSessions: 20,
    daysUsed: 28,
    totalDays: 30,
    progressColor: 'green',
    className: 'BJJ Adults',
    checkInTime: '6:05pm',
    checkInDate: 'Jun 29',
  },
  {
    id: 5,
    name: 'David Chen',
    initials: 'DC',
    avatarColor: 'rose',
    sessionsUsed: 18,
    totalSessions: 20,
    daysUsed: 5,
    totalDays: 30,
    progressColor: 'red',
    className: 'Taekwondo',
    checkInTime: '5:10pm',
    checkInDate: 'Jun 29',
  },
]

const mockSearchResults = [
  {
    id: 1,
    name: 'John Smith',
    initials: 'JS',
    avatarColor: 'blue',
    email: 'john.smith@email.com',
    phone: '+1 555-1234',
    membershipStatus: 'active',
    sessionsRemaining: 15,
    daysRemaining: 22,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: 'green',
    email: 'sarah.j@email.com',
    phone: '+1 555-2345',
    membershipStatus: 'active',
    sessionsRemaining: 8,
    daysRemaining: 14,
  },
  {
    id: 3,
    name: 'Michael Brown',
    initials: 'MB',
    avatarColor: 'orange',
    email: 'm.brown@email.com',
    phone: '+1 555-3456',
    membershipStatus: 'trial',
    sessionsRemaining: 3,
    daysRemaining: 5,
  },
  {
    id: 4,
    name: 'Emily Davis',
    initials: 'ED',
    avatarColor: 'pink',
    email: 'emily.d@email.com',
    phone: '+1 555-4567',
    membershipStatus: 'expired',
    sessionsRemaining: 0,
    daysRemaining: 0,
  },
  {
    id: 5,
    name: 'James Wilson',
    initials: 'JW',
    avatarColor: 'indigo',
    email: 'j.wilson@email.com',
    phone: '+1 555-5678',
    membershipStatus: 'active',
    sessionsRemaining: 20,
    daysRemaining: 30,
  },
]

const tabs = ['code', 'name', 'qr']

function App() {
  const [page, setPage] = useState('checkin') // 'checkin' | 'signup'
  const [activeTab, setActiveTab] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)
  const [recentCheckIns, setRecentCheckIns] = useState(initialRecentCheckIns)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  // Derived filtered results based on search query
  const displayMembers = searchQuery.trim().length >= 2
    ? mockSearchResults.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockSearchResults

  const qrPayload = JSON.stringify({
    type: 'member-checkin',
    club: 'Pantheon',
    session: todaySessions[0].title,
    code: 'PANTHEON-CHK-2026',
  })

  // Handle Tab key to switch between modes
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key !== 'Tab' || document.activeElement?.tagName === 'INPUT') {
        return
      }

      event.preventDefault()
      const currentIndex = tabs.indexOf(activeTab)
      const nextIndex = (currentIndex + 1) % tabs.length
      setActiveTab(tabs[nextIndex])
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [activeTab])

  // Generate QR code
  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(qrPayload, {
      width: 224,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrCodeUrl(url)
        }
      })
      .catch(() => {
        if (isMounted) {
          setQrCodeUrl('')
        }
      })

    return () => {
      isMounted = false
    }
  }, [qrPayload])

  const inProgressSessions = todaySessions.filter(
    (session) => session.status === 'in-progress',
  )
  const upcomingSessions = todaySessions.filter(
    (session) => session.status === 'upcoming',
  )

  const resetTransientState = () => {
    setTimeout(() => {
      setCheckInSuccess(false)
      setSelectedMember(null)
      setSearchQuery('')
    }, 2000)
  }

  const handleCheckIn = (member) => {
    setSelectedMember(member)
    setCheckInSuccess(true)

    const now = new Date()
    const newCheckIn = {
      id: Date.now(),
      name: member.name,
      initials: member.initials,
      avatarColor: member.avatarColor,
      sessionsUsed: 20 - member.sessionsRemaining,
      totalSessions: 20,
      daysUsed: 30 - member.daysRemaining,
      totalDays: 30,
      progressColor:
        member.daysRemaining > 15
          ? 'green'
          : member.daysRemaining > 7
            ? 'yellow'
            : 'red',
      className: todaySessions[0].title,
      checkInTime: now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      checkInDate: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }

    setRecentCheckIns((current) => [newCheckIn, ...current.slice(0, 4)])
    setCodeInput('')
    resetTransientState()
  }

  const handleCodeSubmit = () => {
    if (codeInput.trim().length < 4) {
      return
    }

    const member =
      mockSearchResults[Math.floor(Math.random() * mockSearchResults.length)]
    handleCheckIn(member)
  }

  if (page === 'signin') {
    return <SignIn onBack={() => setPage('checkin')} />
  }

  return (
    <div className="checkin-app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">U</div>
          <div>
            <h1>Check-In</h1>
            <p>Pantheon</p>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Sections">
          <button className="nav-tab is-active" type="button">
            Check-in
          </button>
          <button className="nav-tab" type="button" onClick={() => setPage('signin')}>
            Sign-in
          </button>
        </nav>

        <button className="exit-button" type="button">
          Exit
        </button>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar left-sidebar">
          <h2>Today&apos;s Sessions</h2>

          <section className="session-group">
            <p className="group-label group-label-green">In Progress</p>
            <div className="session-list">
              {inProgressSessions.map((session) => (
                <article className="session-card" key={session.id}>
                  <div className="session-main">
                    <span className="session-dot session-dot-green"></span>
                    <div>
                      <p className="session-time">{session.time}</p>
                      <p className="session-title">{session.title}</p>
                      <p className="session-meta">{session.duration}</p>
                    </div>
                  </div>
                  {session.attendees > 0 ? (
                    <span className="attendees-pill">{session.attendees}</span>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="session-group">
            <p className="group-label group-label-amber">Upcoming</p>
            <div className="session-list">
              {upcomingSessions.map((session) => (
                <article className="session-card" key={session.id}>
                  <div className="session-main">
                    <span className="session-dot session-dot-amber"></span>
                    <div>
                      <p className="session-time">{session.time}</p>
                      <p className="session-title">{session.title}</p>
                      <p className="session-meta">{session.duration}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="coach-card">
            <div className="coach-avatar">IN</div>
          </div>
        </aside>

        <main className="center-panel">
          <div className="mode-tabs" role="tablist" aria-label="Check-in mode">
            <button
              className={activeTab === 'code' ? 'mode-tab is-active' : 'mode-tab'}
              onClick={() => setActiveTab('code')}
              type="button"
            >
              Enter Code
            </button>
            <button
              className={activeTab === 'name' ? 'mode-tab is-active' : 'mode-tab'}
              onClick={() => setActiveTab('name')}
              type="button"
            >
              Name Search
            </button>
            <button
              className={activeTab === 'qr' ? 'mode-tab is-active' : 'mode-tab'}
              onClick={() => setActiveTab('qr')}
              type="button"
            >
              QR Code
            </button>
          </div>

          <div className="checkin-panel">
            <h2>Check-In</h2>

            {checkInSuccess && selectedMember ? (
              <section className="success-card">
                <div className="success-icon">✓</div>
                <h3>Welcome, {selectedMember.name.split(' ')[0]}!</h3>
                <p>You&apos;re checked in for {todaySessions[0].title}</p>
              </section>
            ) : null}

            {activeTab === 'code' && !checkInSuccess ? (
              <section className="input-panel">
                <label className="field">
                  <span className="field-icon">#</span>
                  <input
                    type="text"
                    placeholder="Enter member code..."
                    value={codeInput}
                    onChange={(event) =>
                      setCodeInput(event.target.value.toUpperCase())
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleCodeSubmit()
                      }
                    }}
                    maxLength={8}
                  />
                </label>
                <p className="hint">Enter your 4-8 character member code</p>
                <button
                  className="action-button"
                  disabled={codeInput.trim().length < 4}
                  onClick={handleCodeSubmit}
                  type="button"
                >
                  Check In
                </button>
              </section>
            ) : null}

            {activeTab === 'name' && !checkInSuccess ? (
              <section className="input-panel">
                <label className="field">
                  <span className="field-icon">⌕</span>
                  <input
                    type="text"
                    placeholder="Enter first or last name..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>

                {displayMembers.length > 0 ? (
                  <div className="results-list">
                    {displayMembers.map((member) => (
                      <button
                        className="result-card"
                        key={member.id}
                        onClick={() => handleCheckIn(member)}
                        type="button"
                      >
                        <div
                          className={`avatar avatar-${member.avatarColor}`}
                          aria-hidden="true"
                        >
                          {member.initials}
                        </div>
                        <div className="result-copy">
                          <p className="result-name">{member.name}</p>
                          <p className="result-meta">{member.email}</p>
                        </div>
                        <div className="result-side">
                          <span
                            className={`membership membership-${member.membershipStatus}`}
                          >
                            {member.membershipStatus}
                          </span>
                          <p>{member.sessionsRemaining} sessions left</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {searchQuery.trim().length >= 2 && displayMembers.length === 0 ? (
                  <p className="empty-state">
                    No members found matching &quot;{searchQuery}&quot;
                  </p>
                ) : null}
              </section>
            ) : null}

            {activeTab === 'qr' && !checkInSuccess ? (
              <section className="input-panel qr-panel">
                <div className="qr-frame">
                  {qrCodeUrl ? (
                    <img
                      alt="Generated check-in QR code"
                      className="qr-image"
                      height="224"
                      src={qrCodeUrl}
                      width="224"
                    />
                  ) : (
                    <div className="qr-grid" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                <p className="hint">Position QR code in the frame above</p>
                <p className="hint">Scan member QR code from their app</p>
                <code className="qr-payload">{qrPayload}</code>
              </section>
            ) : null}

            <p className="keyboard-hint">
              Press <kbd>Tab</kbd> to switch modes
            </p>
          </div>
        </main>

        <aside className="sidebar right-sidebar">
          <h2>Recent Check-ins</h2>

          <div className="checkins-list">
            {recentCheckIns.map((member) => (
              <article className="checkin-card" key={member.id}>
                <div className={`avatar avatar-${member.avatarColor}`} aria-hidden="true">
                  {member.initials}
                </div>
                <div className="checkin-copy">
                  <div className="checkin-header">
                    <p className="checkin-name">{member.name}</p>
                    <span
                      className={`mini-progress mini-progress-${member.progressColor}`}
                    ></span>
                  </div>
                  <p className="checkin-meta">
                    {member.sessionsUsed} / {member.totalSessions} Sessions
                  </p>
                  <p className="checkin-days">
                    {member.daysUsed} / {member.totalDays} Days
                  </p>
                  <p className="checkin-meta">{member.className}</p>
                  <p className="checkin-time">
                    {member.checkInDate}, {member.checkInTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
