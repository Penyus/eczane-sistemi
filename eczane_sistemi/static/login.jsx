// login.jsx — Hekim login screen with 3 layout variants
// Variants: 'split' (default), 'centered', 'fullbleed'
// Real API attempt to localhost:8000/api/v1/auth/token/

const { useState, useEffect, useRef } = React;

// ─── API auth helper ────────────────────────────────────────────────────────
async function attemptLogin(username, password) {
  // Try real Django API. If unreachable → networkError. If 4xx → loginError.
  try {
    const res = await fetch("http://localhost:8000/api/v1/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, token: data.token || data.access || data.key || "demo-token" };
    }
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ok: false, kind: "auth" };
    }
    return { ok: false, kind: "auth" };
  } catch (e) {
    return { ok: false, kind: "network" };
  }
}

// ─── Decorative pharmacy illustration (left panel) ─────────────────────────
function PharmacyIllustration() {
  return (
    <svg viewBox="0 0 400 500" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F7B5C" />
          <stop offset="100%" stopColor="#0a5a44" />
        </linearGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill="url(#bgGrad)" />
      <rect width="400" height="500" fill="url(#grid)" />

      {/* Mortar (havan) */}
      <g transform="translate(200 280)">
        <ellipse cx="0" cy="0" rx="90" ry="22" fill="rgba(255,255,255,.08)" />
        <path d="M-80 -5 Q-80 70 -55 88 L55 88 Q80 70 80 -5 Z"
              fill="rgba(255,255,255,.95)" stroke="rgba(0,0,0,.06)" strokeWidth="1" />
        <ellipse cx="0" cy="-5" rx="80" ry="18" fill="rgba(15,123,92,.15)" />
        <ellipse cx="0" cy="-5" rx="80" ry="18" fill="none" stroke="rgba(15,123,92,.4)" strokeWidth="1.5" />
        {/* Pestle */}
        <g transform="rotate(-25)">
          <rect x="-6" y="-130" width="12" height="100" rx="4" fill="rgba(255,255,255,.92)" stroke="rgba(0,0,0,.08)" />
          <ellipse cx="0" cy="-30" rx="14" ry="10" fill="rgba(255,255,255,.95)" stroke="rgba(0,0,0,.08)" />
        </g>
      </g>

      {/* Pills floating */}
      <g opacity="0.95">
        <g transform="translate(70 110) rotate(-20)">
          <rect x="-22" y="-9" width="44" height="18" rx="9" fill="white" />
          <rect x="-22" y="-9" width="22" height="18" rx="9" fill="#FFA94D" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(0,0,0,.1)" />
        </g>
        <g transform="translate(330 90) rotate(15)">
          <circle r="14" fill="white" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(15,123,92,.3)" strokeWidth="1.5" />
          <text x="0" y="3" fontSize="9" fontWeight="600" fill="rgba(15,123,92,.6)" textAnchor="middle">500</text>
        </g>
        <g transform="translate(80 410) rotate(35)">
          <rect x="-18" y="-7" width="36" height="14" rx="7" fill="white" />
          <rect x="-18" y="-7" width="18" height="14" rx="7" fill="#5EBA9A" />
        </g>
        <g transform="translate(340 420) rotate(-10)">
          <circle r="11" fill="white" />
          <circle r="11" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,.4)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      </g>

      {/* Caduceus / cross subtle mark */}
      <g transform="translate(200 130)" opacity="0.18">
        <rect x="-8" y="-30" width="16" height="60" fill="white" />
        <rect x="-30" y="-8" width="60" height="16" fill="white" />
      </g>

      {/* Decorative dots */}
      <g fill="rgba(255,255,255,.25)">
        <circle cx="50" cy="200" r="2" />
        <circle cx="60" cy="220" r="1.5" />
        <circle cx="350" cy="220" r="2" />
        <circle cx="340" cy="240" r="1.5" />
        <circle cx="40" cy="350" r="1.5" />
        <circle cx="360" cy="350" r="2" />
      </g>
    </svg>
  );
}

// ─── Date / time chip ───────────────────────────────────────────────────────
function DateChip({ lang }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  const dateStr = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="hk-datechip">
      <IconCalendar size={14} />
      <span>{dateStr}</span>
      <span className="hk-dot" />
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{timeStr}</span>
    </div>
  );
}

// ─── Language toggle ─────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <div className="hk-langtoggle" role="tablist">
      <button className={lang === "tr" ? "active" : ""} onClick={() => setLang("tr")}>TR</button>
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

// ─── API status pill ────────────────────────────────────────────────────────
function ApiPill({ status, lang }) {
  const t = TRANSLATIONS[lang];
  const isOn = status === "online";
  return (
    <div className={"hk-apipill " + (isOn ? "on" : "off")}>
      <span className="hk-apipill-dot" />
      <span>{isOn ? t.online : t.offline}</span>
      <span className="hk-apipill-sep">·</span>
      <span className="hk-apipill-host">localhost:8000</span>
    </div>
  );
}

// ─── Login form (shared) ────────────────────────────────────────────────────
function LoginForm({ lang, onSuccess, extraFields }) {
  const t = TRANSLATIONS[lang];
  const [username, setUsername] = useState("eczaci");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [tcKimlik, setTcKimlik] = useState("");
  const [phone, setPhone] = useState("");
  const [pharmCode, setPharmCode] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError({ kind: "auth", msg: t.loginError });
      return;
    }
    setBusy(true);
    setError(null);
    const res = await attemptLogin(username, password);
    setBusy(false);
    if (res.ok) {
      if (remember) {
        try { localStorage.setItem("hekim_token", res.token); } catch {}
      }
      onSuccess({ username, token: res.token });
    } else {
      setError({ kind: res.kind, msg: res.kind === "network" ? t.networkError : t.loginError });
    }
  }

  return (
    <form className="hk-form" onSubmit={submit} autoComplete="off">
      <div className="hk-field">
        <label>{t.username}</label>
        <div className="hk-input">
          <IconUser size={16} />
          <input value={username} onChange={(e) => setUsername(e.target.value)}
                 placeholder={t.username} autoComplete="username" />
        </div>
      </div>

      <div className="hk-field">
        <label>{t.password}</label>
        <div className="hk-input">
          <IconLock size={16} />
          <input type={showPw ? "text" : "password"} value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••" autoComplete="current-password" />
          <button type="button" className="hk-input-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
            {showPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
          </button>
        </div>
      </div>

      {extraFields?.includes("pharmacyCode") && (
        <div className="hk-field">
          <label>{t.pharmacyCode}</label>
          <div className="hk-input">
            <IconShield size={16} />
            <input value={pharmCode} onChange={(e) => setPharmCode(e.target.value)} placeholder="EZ-00000" />
          </div>
        </div>
      )}
      {extraFields?.includes("tcKimlik") && (
        <div className="hk-field">
          <label>{t.tcKimlik}</label>
          <div className="hk-input">
            <IconUser size={16} />
            <input value={tcKimlik} onChange={(e) => setTcKimlik(e.target.value.replace(/\D/g, "").slice(0, 11))}
                   placeholder="00000000000" inputMode="numeric" />
          </div>
        </div>
      )}
      {extraFields?.includes("phone") && (
        <div className="hk-field">
          <label>{t.phone}</label>
          <div className="hk-input">
            <span style={{ color: "var(--hk-ink-2)", fontSize: 13 }}>+90</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555 000 00 00" />
          </div>
        </div>
      )}

      <div className="hk-row-between">
        <label className="hk-check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span className="hk-check-box"><IconCheck size={11} /></span>
          <span>{t.rememberMe}</span>
        </label>
        <a href="#" className="hk-link" onClick={(e) => e.preventDefault()}>{t.forgotPassword}</a>
      </div>

      {error && (
        <div className={"hk-alert " + error.kind}>
          <IconAlert size={15} />
          <span>{error.msg}</span>
        </div>
      )}

      <button type="submit" className="hk-btn hk-btn-primary" disabled={busy}>
        {busy ? (<><span className="hk-spinner" />{t.signingIn}</>) : (<>{t.signIn}<IconArrowRight size={16} /></>)}
      </button>
    </form>
  );
}

// ─── Variants ───────────────────────────────────────────────────────────────

function LoginSplit({ lang, setLang, apiStatus, onSuccess, extraFields }) {
  const t = TRANSLATIONS[lang];
  return (
    <div className="hk-login hk-login-split">
      <aside className="hk-login-aside">
        <PharmacyIllustration />
        <div className="hk-aside-overlay">
          <div className="hk-aside-brand">
            <IconLogo size={32} />
            <div>
              <div className="hk-brand-name">{t.brand}</div>
              <div className="hk-brand-tag">{t.tagline}</div>
            </div>
          </div>
          <div className="hk-aside-quote">
            <div className="hk-quote-mark">”</div>
            <div className="hk-quote-text">
              {lang === "tr"
                ? "Stok, reçete ve raporlama — tek bir panelde, gün boyu sessiz çalışan bir asistan gibi."
                : "Stock, prescriptions, reporting — one dashboard, quietly working all day like an assistant."}
            </div>
          </div>
          <div className="hk-aside-foot">
            <span>v2.4.0</span>
            <span className="hk-dot" />
            <span>© 2026 {t.brand}</span>
          </div>
        </div>
      </aside>

      <main className="hk-login-main">
        <header className="hk-login-head">
          <DateChip lang={lang} />
          <div className="hk-head-right">
            <ApiPill status={apiStatus} lang={lang} />
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </header>

        <div className="hk-login-card">
          <h1 className="hk-h1">{t.welcome}</h1>
          <p className="hk-sub">{t.loginSubtitle}</p>
          <LoginForm lang={lang} onSuccess={onSuccess} extraFields={extraFields} />
        </div>

        <footer className="hk-login-foot">
          <span>{t.apiHint}</span>
        </footer>
      </main>
    </div>
  );
}

function LoginCentered({ lang, setLang, apiStatus, onSuccess, extraFields }) {
  const t = TRANSLATIONS[lang];
  return (
    <div className="hk-login hk-login-centered">
      <header className="hk-login-head hk-login-head-c">
        <div className="hk-head-brand">
          <IconLogo size={26} />
          <div>
            <div className="hk-brand-name" style={{ fontSize: 16 }}>{t.brand}</div>
          </div>
        </div>
        <div className="hk-head-right">
          <DateChip lang={lang} />
          <ApiPill status={apiStatus} lang={lang} />
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="hk-centered-wrap">
        <div className="hk-login-card hk-card-bordered">
          <div className="hk-card-icon"><IconLogo size={36} /></div>
          <h1 className="hk-h1" style={{ textAlign: "center" }}>{t.welcome}</h1>
          <p className="hk-sub" style={{ textAlign: "center" }}>{t.loginSubtitle}</p>
          <LoginForm lang={lang} onSuccess={onSuccess} extraFields={extraFields} />
        </div>
        <div className="hk-centered-foot">
          <span>v2.4.0</span>
          <span className="hk-dot" />
          <span>© 2026 {t.brand}</span>
          <span className="hk-dot" />
          <span>{t.apiHint}</span>
        </div>
      </div>
    </div>
  );
}

function LoginFullbleed({ lang, setLang, apiStatus, onSuccess, extraFields }) {
  const t = TRANSLATIONS[lang];
  return (
    <div className="hk-login hk-login-fullbleed">
      <div className="hk-fb-bg">
        <PharmacyIllustration />
      </div>
      <div className="hk-fb-overlay" />

      <header className="hk-login-head hk-login-head-fb">
        <div className="hk-head-brand">
          <div className="hk-brand-mark"><IconLogo size={28} /></div>
          <div>
            <div className="hk-brand-name" style={{ color: "white", fontSize: 17 }}>{t.brand}</div>
            <div className="hk-brand-tag" style={{ color: "rgba(255,255,255,.7)" }}>{t.tagline}</div>
          </div>
        </div>
        <div className="hk-head-right">
          <ApiPill status={apiStatus} lang={lang} />
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="hk-fb-wrap">
        <div className="hk-login-card hk-card-glass">
          <h1 className="hk-h1">{t.welcome}</h1>
          <p className="hk-sub">{t.loginSubtitle}</p>
          <LoginForm lang={lang} onSuccess={onSuccess} extraFields={extraFields} />
        </div>
      </div>

      <footer className="hk-login-foot hk-login-foot-fb">
        <DateChip lang={lang} />
        <span style={{ marginLeft: "auto" }}>v2.4.0 · © 2026 {t.brand}</span>
      </footer>
    </div>
  );
}

function LoginScreen(props) {
  const variant = props.variant || "split";
  if (variant === "centered") return <LoginCentered {...props} />;
  if (variant === "fullbleed") return <LoginFullbleed {...props} />;
  return <LoginSplit {...props} />;
}

Object.assign(window, { LoginScreen, attemptLogin });
