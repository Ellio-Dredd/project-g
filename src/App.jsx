import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import {
  playClickSound,
  playWhooshSound,
  playThrillerSweep,
  playRomanceSweep,
  playRomcomSweep,
  playAmbientLoop,
  stopAmbientLoop
} from './audioSynth';

export default function App() {
  // Navigation steps: start | camouflage | single | appreciation | proposal | movies | date | final
  const [currentStep, setCurrentStep] = useState('start');
  const [singleStatus, setSingleStatus] = useState('');
  const [moviePicked, setMoviePicked] = useState('');
  const [datePicked, setDatePicked] = useState(null);
  const [noClicksCount, setNoClicksCount] = useState(0);
  const [noBtnTransform, setNoBtnTransform] = useState({ x: 0, y: 0 });
  const [noBtnText, setNoBtnText] = useState('No');
  const [noToastText, setNoToastText] = useState('');
  const [noToastShow, setNoToastShow] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [customMovieText, setCustomMovieText] = useState('');
  const [showCustomMovieInput, setShowCustomMovieInput] = useState(false);

  // Terminal diagnostics logs
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [terminalRunning, setTerminalRunning] = useState(false);

  // 8-bit visual transitions
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionGenre, setTransitionGenre] = useState('');
  const [transitionTitle, setTransitionTitle] = useState('');

  // Submit states
  const [submitLoading, setSubmitLoading] = useState(false);

  // Date states
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(4); // May

  // Audio References
  const customAudioRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs to bottom on update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Initialize custom background MP3 widgets
  useEffect(() => {
    customAudioRef.current = new Audio('assets/background_music.mp3');
    customAudioRef.current.loop = true;
    customAudioRef.current.volume = 0.55;

    return () => {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      stopAmbientLoop();
    };
  }, []);

  // Sync background music play toggles
  useEffect(() => {
    if (musicPlaying) {
      customAudioRef.current.play().catch(() => {
        console.log("Custom MP3 not found. Initiating 8-bit procedural synth beats...");
        playAmbientLoop(true);
      });
    } else {
      customAudioRef.current.pause();
      stopAmbientLoop();
    }
  }, [musicPlaying]);

  // Generate floating cherry blossom elements in the background
  const [floatingFlowers, setFloatingFlowers] = useState([]);
  useEffect(() => {
    const flowers = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 12}s`,
      scale: `${0.7 + Math.random() * 0.7}`
    }));
    setFloatingFlowers(flowers);
  }, []);

  const handleMusicClick = () => {
    playClickSound();
    setMusicPlaying(prev => !prev);
  };

  // --------------------------------------------------------------------------
  // SOUND GESTURE UNLOCK SCREEN (PRESS START)
  // --------------------------------------------------------------------------

  const startQuest = async () => {
    // Unlocks browser audio context directly through active click gesture
    playClickSound();
    setMusicPlaying(true);
    setCurrentStep('camouflage');

    // Asynchronously log the visit details (location, IP, and device info) to Supabase
    try {
      let geoData = {};
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          geoData = await response.json();
        }
      } catch (err) {
        console.warn("Geolocation service blocked or unreachable. Logging generic client details.", err);
      }

      const payload = {
        ip_address: geoData.ip || 'Unknown',
        city: geoData.city || 'Unknown',
        region: geoData.region || 'Unknown',
        country: geoData.country_name || 'Unknown',
        org: geoData.org || 'Unknown',
        user_agent: navigator.userAgent,
        screen_size: `${window.screen.width}x${window.screen.height}`,
        local_time: new Date().toString()
      };

      const { error } = await supabase
        .from('visits')
        .insert([payload]);

      if (error) {
        console.error("Error logging visit:", error);
      } else {
        console.log("Visit successfully registered in database.");
      }
    } catch (e) {
      console.warn("Database sync inactive or blocked.", e);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 1 LOGIC: TYPEWRITER GAME INITIALIZER
  // --------------------------------------------------------------------------
  const runDiagnostics = () => {
    playClickSound();
    setTerminalRunning(true);
    
    // Core logs written in clear, funny RPG dialogue structure
    const initialLogs = [
      { text: "> Initializing Retro Quest core engine...", color: "text-dim" },
      { text: "> Syncing local game coordinates to Player 2...", color: "text-dim" },
      { text: "> Locating Node: Gimhani_Node_302", color: "text-highlight" },
      { text: "> Connection to Player 2 established [OK]", color: "text-green" },
      { text: "> ALERT: Severe proximity heat spike detected (103.5°F)", color: "text-yellow" },
      { text: "> Analysis identified source: High concentration of charm!", color: "text-highlight" },
      { text: "> Manual controller handshake is REQUIRED to begin quest.", color: "text-yellow" }
    ];

    let index = 0;
    const printNext = () => {
      if (index < initialLogs.length) {
        const currentLog = initialLogs[index];
        setTerminalLogs(prev => [...prev, currentLog]);
        index++;
        setTimeout(printNext, 650);
      } else {
        setTimeout(() => {
          setCurrentStep('single');
        }, 1100);
      }
    };
    setTimeout(printNext, 300);

  };

  // --------------------------------------------------------------------------
  // STEP 2 LOGIC: ARE YOU SINGLE? DYNAMIC RETRO HOPPING
  // --------------------------------------------------------------------------
  const handleNoBtnClick = async () => {
    playClickSound();

    if (noClicksCount < 4) {
      playWhooshSound();

      const maxX = 120;
      const maxY = 45;

      let x = (Math.random() - 0.5) * maxX * 1.8;
      let y = (Math.random() - 0.5) * maxY * 1.8;

      if (Math.abs(x) < 40) x = x > 0 ? 55 : -55;
      if (Math.abs(y) < 30) y = y > 0 ? 45 : -45;

      setNoBtnTransform({ x, y });

      const funnyNoToasts = [
        "Wild 'No' button avoided your click! 🍃",
        "Missed! 'No' button defended itself! 🛡️",
        "Critical Dodge! Button speed increased! ⚡",
        "Warning: Physics threshold reached... ⚠️"
      ];

      setNoToastText(funnyNoToasts[noClicksCount % funnyNoToasts.length]);
      setNoToastShow(true);

      if (noClicksCount === 3) {
        setTimeout(() => {
          setNoBtnTransform({ x: 0, y: 0 });
          setNoBtnText("Fine, click me! 😭");
          setNoToastText("Okay, okay, I will let you select No... but you shouldn't! 😉");
        }, 300);
      }

      setNoClicksCount(prev => prev + 1);
      return;
    }

    setSingleStatus('No (Persistent)');
    setCurrentStep('appreciation');

    // Asynchronously log the committed 'No' response to Supabase
    try {
      const { error } = await supabase
        .from('responses')
        .insert([
          {
            single_status: 'No (Persistent)',
            movie_picked: 'None (Coworker Appreciation Path)',
            date_picked: null,
            user_agent: navigator.userAgent
          }
        ]);

      if (error) {
        console.error("Database insert error logging 'No':", error);
      } else {
        console.log("Committed 'No' response successfully logged to Supabase!");
      }
    } catch (e) {
      console.warn("Database sync inactive or blocked. Action logged locally.", e);
    }
  };



  const handleYesBtnClick = () => {
    playClickSound();
    setSingleStatus('Yes');
    setCurrentStep('proposal');
  };

  const handleBacktrack = () => {
    playClickSound();
    setNoClicksCount(0);
    setNoBtnText('No');
    setNoBtnTransform({ x: 0, y: 0 });
    setNoToastShow(false);
    setCurrentStep('single');
  };

  // --------------------------------------------------------------------------
  // STEP 5 LOGIC: ARCADE MOVIE SELECTIONS
  // --------------------------------------------------------------------------
  const selectMovie = (movie, genre) => {
    setMoviePicked(movie);

    if (genre === 'thriller') {
      playThrillerSweep();
      setTransitionTitle("LOADING THRILLER SHADER...");
      document.body.className = "theme-thriller";
    } else if (genre === 'romance') {
      playRomanceSweep();
      setTransitionTitle("ELEVATING ROMANTIC AURA...");
      document.body.className = "theme-romance";
    } else {
      playRomcomSweep();
      setTransitionTitle("SYNCING RETRO CONFETTI...");
      document.body.className = "theme-romcom";
    }

    setTransitionGenre(genre);
    setTransitionActive(true);

    setTimeout(() => {
      setTransitionActive(false);
      setCurrentStep('date');
    }, 1600);
  };

  // --------------------------------------------------------------------------
  // STEP 6 LOGIC: DATE ARCADE SELECTOR
  // --------------------------------------------------------------------------
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    playClickSound();
    setCalendarMonth(prev => {
      if (prev === 0) {
        setCalendarYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const nextMonth = () => {
    playClickSound();
    setCalendarMonth(prev => {
      if (prev === 11) {
        setCalendarYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const generateDays = () => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    
    const cells = [];
    
    // Empty cells
    for (let x = 0; x < firstDayIndex; x++) {
      cells.push(<div key={`empty-${x}`} className="calendar-day empty"></div>);
    }

    // Days grid
    for (let d = 1; d <= lastDay; d++) {
      const cellDate = new Date(calendarYear, calendarMonth, d);
      const isPast = cellDate < new Date(2026, 4, 26); // Disable dates prior to today
      
      const isSelected = datePicked &&
        datePicked.getDate() === d &&
        datePicked.getMonth() === calendarMonth &&
        datePicked.getFullYear() === calendarYear;

      cells.push(
        <div
          key={`day-${d}`}
          className={`calendar-day ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            if (!isPast) {
              playClickSound();
              setDatePicked(cellDate);
            }
          }}
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  // --------------------------------------------------------------------------
  // STEP 7 LOGIC: SYNC CALENDAR & SUPABASE DATABASE SAVE
  // --------------------------------------------------------------------------
  const submitCalendar = async () => {
    playClickSound();
    setSubmitLoading(true);

    const year = datePicked.getFullYear();
    const month = String(datePicked.getMonth() + 1).padStart(2, '0');
    const day = String(datePicked.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const { error } = await supabase
        .from('responses')
        .insert([
          {
            single_status: singleStatus,
            movie_picked: moviePicked,
            date_picked: formattedDate,
            user_agent: navigator.userAgent
          }
        ]);
        
      if (error) {
        console.error("Database insert error:", error);
      } else {
        console.log("Responses successfully pushed to Supabase!");
      }
    } catch (e) {
      console.warn("Supabase is disconnected, proceeding locally.", e);
    }

    setTimeout(() => {
      setSubmitLoading(false);
      setCurrentStep('final');
    }, 1200);
  };

  return (
    <>
      {/* Dynamic Floating Retro Sprite Elements */}
      <div className="ambient-container">
        {currentStep !== 'start' && currentStep !== 'camouflage' && floatingFlowers.map(flower => (
          <div
            key={flower.id}
            className="pixel-flower"
            style={{
              left: flower.left,
              animationDelay: flower.delay,
              transform: `scale(${flower.scale})`
            }}
          >
            🌸
          </div>
        ))}
      </div>


      {/* Screen Sweep Transitions */}
      <div className={`transition-overlay ${transitionActive ? 'active' : ''} ${transitionGenre}-theme`}>
        <div className="transition-content">
          <div className="transition-spinner"></div>
          <h2 className="transition-title">{transitionTitle}</h2>
        </div>
      </div>

      {/* Floating Retro Sound pill */}
      <div className={`music-player-container ${musicPlaying ? 'playing' : ''}`} onClick={handleMusicClick}>
        <div className="music-info">
          <span className="music-title">RETRO SOUNDS</span>
          <span className="music-sub">{musicPlaying ? 'Mute Music' : 'Tap to Play Music'}</span>
        </div>
        <div className="music-controls">
          <button className="music-btn" aria-label="Toggle Sound Controls">
            <i className={`fas ${musicPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <div className="audio-waves">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <main className="app-wrapper">

        {/* STEP 0: PRESS START (Audio unlock gesture screen) */}
        {currentStep === 'start' && (
          <section className="step-card active centered-content">
            <div className="card-header">
              <div className="badge system-badge"><i className="fas fa-gamepad"></i> RETRO QUEST v1.0</div>
              <h1 className="system-title">Retro Pixel Quest</h1>
              <p className="system-desc">Interactive Sandbox Play-Test</p>
            </div>
            
            <div className="card-body">
              <div className="proposal-visual">
                <i className="fas fa-gamepad animated-icon" style={{ fontSize: '5rem', color: '#e91e63' }}></i>
              </div>
              <p className="question-sub" style={{ fontSize: '1.65rem', margin: '20px 0' }}>
                Verify retro system configurations and audio context to begin the quest!
              </p>
            </div>

            <div className="card-footer centered-content" style={{ justifyContent: 'center', marginTop: '12px' }}>
              <button className="btn btn-primary btn-yes" onClick={startQuest} style={{ minWidth: '220px' }}>
                <span>PRESS START 🎮</span>
              </button>
            </div>
          </section>
        )}


        {/* STEP 1: CAMOUFLAGE SERVER HANDSHAKE */}
        {currentStep === 'camouflage' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge system-badge"><i className="fas fa-gamepad"></i> QUEST HANDSHAKE</div>
              <h1 className="system-title">Quest Setup</h1>
              <p className="system-desc">Syncing local beacons to Player 2</p>
            </div>

            <div className="card-body">
              <div className="terminal-container">
                <div className="terminal-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="terminal-title">quest_initializer.cmd</span>
                </div>
                <div className="terminal-body">
                  <p className="log-line text-dim">&gt; Retro Quest core engine initialized.</p>
                  <p className="log-line text-dim">&gt; Connecting to target Node: <span className="text-highlight">Gimhani_Node_302</span></p>
                  <p className="log-line text-green">&gt; Proximity connection link established [OK]</p>
                  
                  {terminalLogs.map((log, index) => (
                    <p key={index} className={`log-line ${log.color}`}>{log.text}</p>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button className="btn btn-primary" onClick={runDiagnostics} disabled={terminalRunning}>
                {terminalRunning ? (
                  <>
                    <span>Syncing Quest Beacons...</span>
                    <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    <span>Begin Quest 🚀</span>
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: ARE YOU SINGLE */}
        {currentStep === 'single' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge warning-badge"><i className="fas fa-spa"></i> QUEST STAGE 1</div>
              <h2 className="section-title">Stage 1 Handshake</h2>
              <p className="section-desc">Confirm Player status parameter:</p>
            </div>

            <div className="card-body centered-content">
              <h3 className="question-title">Hey! Are you single? 😊</h3>
              <p className="question-sub">Just a quick verification check before we begin! 🌸</p>

              <div className="buttons-container-flow">
                <button className="btn btn-yes" onClick={handleYesBtnClick}>
                  <i className="fas fa-check-circle"></i> Yes, I am
                </button>
                <button
                  className="btn btn-no"
                  onClick={handleNoBtnClick}
                  style={{
                    transform: `translate(${noBtnTransform.x}px, ${noBtnTransform.y}px)`
                  }}
                >
                  <i className="fas fa-times-circle"></i> {noBtnText}
                </button>

              </div>

              <p className={`toast-alert ${noToastShow ? 'show' : ''}`}>{noToastText}</p>
            </div>
          </section>
        )}

        {/* STEP 3: COWORKER APPRECIATION */}
        {currentStep === 'appreciation' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge appreciation-badge"><i className="fas fa-star"></i> SHOUT-OUT</div>
              <h2 className="section-title">Quest Stage Complete! 🏆</h2>
            </div>

            <div className="card-body">
              <div className="appreciation-text-box">
                <p>That is completely okay, Gimhani! Just wanted to say you are a wonderful person and it's great to have you as a friend. 😊</p>
                <p className="appreciation-subtext" style={{ marginTop: '12px', borderTop: '2px dashed rgba(0,0,0,0.1)', paddingTop: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  P.S. Keep this top-secret. If the office finds out I built this on company time, I'm toast! 🤫
                </p>
              </div>
            </div>

            <div className="card-footer buttons-vertical">
              <button className="btn btn-secondary" onClick={handleBacktrack}>
                <i className="fas fa-rotate-left"></i> Try other path
              </button>
              <button className="btn btn-primary" onClick={() => alert("Have an amazing day! 🌸")}>
                <i className="fas fa-check"></i> Close Game Sandbox
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: PROPOSAL GATEWAY */}
        {currentStep === 'proposal' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge proposal-badge"><i className="fas fa-ticket-alt"></i> STAGE 2</div>
              <h2 className="section-title">Quest Stage 2</h2>
            </div>

            <div className="card-body centered-content">
              <div className="proposal-visual">
                <i className="fas fa-popcorn animated-icon"></i>
              </div>
              <h3 className="question-title text-gradient-love">Would you like to go out for a movie sometime? 🍿</h3>
              <p className="question-sub">Grab coffee and catch a cinematic release.</p>
            </div>

            <div className="card-footer buttons-horizontal">
              <button className="btn btn-yes" onClick={() => setCurrentStep('movies')} style={{ minWidth: '180px' }}>
                <span>Yes! 🌸</span>
              </button>
              <button className="btn btn-yes" onClick={() => setCurrentStep('movies')} style={{ minWidth: '180px' }}>
                <span>Sure! ⭐️</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 5: MOVIE ARCADE GRID */}
        {currentStep === 'movies' && (
          <section className="step-card wide-card active">
            <div className="card-header">
              <div className="badge movie-badge"><i className="fas fa-film"></i> MOVIE LIST</div>
              <h2 className="section-title">Select a Movie</h2>
              <p className="section-desc">Choose a release you would prefer to watch:</p>
            </div>

            <div className="card-body">
              {!showCustomMovieInput ? (
                <div className="movie-grid">
                  
                  {/* Movie 1: In the Grey */}
                  <article className="movie-card thriller" onClick={() => selectMovie("In the Grey (Guy Ritchie)", "thriller")}>
                    <div className="movie-cover-wrapper">
                      <img src="/in_the_grey.png" alt="In the Grey Cover" className="movie-cover-img" />
                    </div>
                    <div className="movie-badge-genre thriller-label">
                      <i className="fas fa-skull-crossbones"></i> Thriller
                    </div>
                    <div className="movie-content">
                      <h4 className="movie-title">In the Grey</h4>
                    </div>
                  </article>

                  {/* Movie 2: Michael */}
                  <article className="movie-card romcom" onClick={() => selectMovie("Michael (2025 Biopic)", "romcom")}>
                    <div className="movie-cover-wrapper">
                      <img src="/michael.png" alt="Michael Cover" className="movie-cover-img" />
                    </div>
                    <div className="movie-badge-genre romcom-label">
                      <i className="fas fa-music"></i> Music / Biopic
                    </div>
                    <div className="movie-content">
                      <h4 className="movie-title">Michael</h4>
                    </div>
                  </article>

                  {/* Movie 3: Prada 2 */}
                  <article className="movie-card romcom" onClick={() => selectMovie("The Devil Wears Prada 2", "romcom")}>
                    <div className="movie-cover-wrapper">
                      <img src="/prada2.png" alt="Prada 2 Cover" className="movie-cover-img" />
                    </div>
                    <div className="movie-badge-genre romcom-label">
                      <i className="fas fa-laugh-beam"></i> Comedy / Drama
                    </div>
                    <div className="movie-content">
                      <h4 className="movie-title">The Devil Wears Prada 2</h4>
                    </div>
                  </article>

                  {/* Movie 4: Project Hail Mary */}
                  <article className="movie-card thriller" onClick={() => selectMovie("Project Hail Mary", "thriller")}>
                    <div className="movie-cover-wrapper">
                      <img src="/hail_mary.png" alt="Project Hail Mary Cover" className="movie-cover-img" />
                    </div>
                    <div className="movie-badge-genre thriller-label">
                      <i className="fas fa-rocket"></i> Sci-Fi Thriller
                    </div>
                    <div className="movie-content">
                      <h4 className="movie-title">Project Hail Mary</h4>
                    </div>
                  </article>

                  {/* Movie 5: The Sheep Detective */}
                  <article className="movie-card romance" onClick={() => selectMovie("The Sheep Detective", "romance")}>
                    <div className="movie-cover-wrapper">
                      <img src="/sheep.png" alt="The Sheep Detective Cover" className="movie-cover-img" />
                    </div>
                    <div className="movie-badge-genre romance-label">
                      <i className="fas fa-spa"></i> Cute / Detective
                    </div>
                    <div className="movie-content">
                      <h4 className="movie-title">The Sheep Detective</h4>
                    </div>
                  </article>

                  {/* Movie 6: Custom Choice */}
                  <article className="movie-card romance custom-choice-card" onClick={() => setShowCustomMovieInput(true)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '266px', textAlign: 'center' }}>
                    <div className="custom-choice-icon-wrapper" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '16px', animation: 'retro-jump 1.5s infinite steps(2) alternate' }}>
                      <i className="fas fa-plus-circle"></i>
                    </div>
                    <div className="movie-badge-genre romance-label" style={{ marginBottom: '8px' }}>
                      <i className="fas fa-edit"></i> Write Your Own
                    </div>
                    <h4 className="movie-title" style={{ margin: 0 }}>Custom Choice...</h4>
                  </article>

                </div>
              ) : (
                <div className="custom-movie-input-container centered-content" style={{ padding: '24px 0' }}>
                  <h3 className="question-title">What movie would you like to watch? 🎬</h3>
                  <div style={{ margin: '20px auto', maxWidth: '400px' }}>
                    <input
                      type="text"
                      className="retro-input"
                      value={customMovieText}
                      onChange={(e) => setCustomMovieText(e.target.value)}
                      placeholder="Enter movie title..."
                      maxLength={40}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontFamily: 'inherit',
                        fontSize: '1.5rem',
                        border: '4px solid var(--retro-border-color)',
                        outline: 'none',
                        textAlign: 'center',
                        background: '#fff',
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>
                  <div className="buttons-horizontal">
                    <button className="btn btn-secondary" onClick={() => setShowCustomMovieInput(false)}>
                      <i className="fas fa-arrow-left"></i> Back to Grid
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => selectMovie(customMovieText.trim() || "Your Custom Movie Pick", "romance")}
                      disabled={!customMovieText.trim()}
                    >
                      <span>Confirm 🎬</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}


        {/* STEP 6: DATE RETRO SELECTOR */}
        {currentStep === 'date' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge calendar-badge"><i className="fas fa-calendar-alt"></i> DATE SELECTOR</div>
              <h2 className="section-title">Select a Date</h2>
              <p className="section-desc">Choose a convenient day for our plans:</p>
            </div>

            <div className="card-body">
              <div className="calendar-wrapper">
                <div className="calendar-header-nav">
                  <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous Month"><i className="fas fa-chevron-left"></i></button>
                  <h3 className="calendar-month-year">{monthsList[calendarMonth]} {calendarYear}</h3>
                  <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next Month"><i className="fas fa-chevron-right"></i></button>
                </div>
                
                <div className="calendar-weekdays">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                
                <div className="calendar-days-grid">
                  {generateDays()}
                </div>
              </div>
              
              <div className="selected-date-info">
                <p>Selected Date: <strong className="text-gradient-love">
                  {datePicked ? datePicked.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Please choose a day...'}
                </strong></p>
              </div>
            </div>

            <div className="card-footer">
              <button
                className="btn btn-primary"
                onClick={submitCalendar}
                disabled={!datePicked || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <span>Syncing Calendar...</span>
                    <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    <span>Confirm & Sync Calendar ⏰</span>
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* STEP 7: RETRO VICTORY SCREEN */}
        {currentStep === 'final' && (
          <section className="step-card active">
            <div className="card-header">
              <div className="badge success-badge"><i className="fas fa-trophy"></i> LEVEL CLEAR</div>
              <h2 className="section-title">Quest Complete! 🚀</h2>
            </div>

            <div className="card-body">
              <div className="success-check-icon">
                <i className="fas fa-coffee animated-pulse-icon"></i>
              </div>
              
              <h3 className="success-subheading">Adventure Synchronized!</h3>
              
              <div className="office-checklist">
                <div className="check-item"><i className="fas fa-check-square text-green"></i> <span>Adventure date confirmed</span></div>
                <div className="check-item"><i className="fas fa-check-square text-green"></i> <span>Movie quest locked</span></div>
                <div className="check-item"><i className="fas fa-check-square text-green"></i> <span>Popcorn and alibis ready</span></div>
              </div>

              <div className="final-sarcastic-message">
                <p>Great choice, Gimhani! Your responses are successfully logged. I will coordinate our Outlook schedule details shortly.</p>
                <div className="final-highlight">
                  See you on <span className="text-highlight">{datePicked ? datePicked.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'our selected date'}</span> for <strong>{moviePicked}</strong>! 🎬
                </div>
              </div>
            </div>

            <div className="card-footer centered-content" style={{ marginTop: '16px' }}>
              <div className="signature">Your Favorite Co-Player, <span className="signature-name">Yasas ☕</span></div>
            </div>
          </section>

        )}

      </main>
    </>
  );
}
