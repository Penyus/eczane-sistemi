// app-screens-saas.jsx — SaaS variant: hero stat, sparklines, progress bars, quick strip
// Re-exports MainApp under MainAppSaas

const { useState: useStateB, useEffect: useEffectB, useMemo: useMemoB } = React;

function stockStatusB(n) {
  if (n === 0) return "out";
  if (n < 10) return "critical";
  if (n < 30) return "low";
  return "ok";
}
function daysUntilB(dateStr) {
  const d = new Date(dateStr).getTime();
  const today = new Date("2026-05-02").getTime();
  return Math.round((d - today) / 86400000);
}

// Mini sparkline SVG
function MiniSpark({ data, color = "#10B981" }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const W = 56, H = 18;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H * 0.85 - H * 0.075
  ]);
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg className="hk-spark-mini" viewBox={`0 0 ${W} ${H}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  );
}

function SidebarSaas({ active, setActive, lang, user, onLogout }) {
  const t = TRANSLATIONS[lang];
  const items = [
    { id: "dashboard", icon: IconDashboard, label: t.dashboard },
    { id: "medicines", icon: IconPill, label: t.medicines },
    { id: "stock", icon: IconBoxes, label: t.stockMovements },
    { id: "prescriptions", icon: IconRx, label: t.prescriptions },
    { id: "reports", icon: IconChart, label: t.reports },
    { id: "categories", icon: IconTag, label: t.categories },
  ];
  return (
    <aside className="hk-sidebar">
      <div className="hk-sidebar-brand">
        <div className="hk-brand-mark-inner">EYS</div>
        <div>
          <div className="hk-brand-name">{TRANSLATIONS[lang].brand}</div>
          <div className="hk-brand-tag">{lang === "tr" ? "ECZANE YÖNETİM" : "PHARMACY OS"}</div>
        </div>
      </div>
      <nav className="hk-nav">
        {items.map(it => {
          const I = it.icon;
          return (
            <button key={it.id} className={"hk-nav-item " + (active === it.id ? "active" : "")}
                    onClick={() => setActive(it.id)}>
              <I size={17} />
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="hk-sidebar-foot">
        <div className="hk-user">
          <div className="hk-avatar">{(user?.username || "E")[0].toUpperCase()}</div>
          <div className="hk-user-info">
            <div className="hk-user-name">{user?.username || "eczaci"}</div>
            <div className="hk-user-role">{lang === "tr" ? "Sorumlu Eczacı" : "Pharmacist"}</div>
          </div>
        </div>
        <button className="hk-icon-btn" title={t.logout} onClick={onLogout}>
          <IconLogout size={16} />
        </button>
      </div>
    </aside>
  );
}

function TopbarSaas({ title, subtitle, lang, setLang, apiStatus, search, setSearch, showSearch }) {
  const t = TRANSLATIONS[lang];
  return (
    <header className="hk-topbar">
      <div className="hk-topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="hk-topbar-right">
        {showSearch && (
          <div className="hk-search">
            <IconSearch size={15} />
            <input value={search || ""} onChange={(e) => setSearch?.(e.target.value)}
                   placeholder={t.searchMedicines} />
            <kbd>⌘K</kbd>
          </div>
        )}
        <button className="hk-icon-btn" title={t.online}>
          <span className={"hk-status-dot " + (apiStatus === "online" ? "on" : "off")} />
        </button>
        <button className="hk-icon-btn"><IconBell size={17} /><span className="hk-badge">3</span></button>
        <div className="hk-langtoggle small">
          <button className={lang === "tr" ? "active" : ""} onClick={() => setLang("tr")}>TR</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
    </header>
  );
}

function DashboardSaas({ lang, user, data }) {
  const t = TRANSLATIONS[lang];
  const s = data.summary;
  const hour = new Date().getHours();
  const greet = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening;

  const stats = [
    { key: "med", label: t.totalMedicines, value: s.toplamIlac, sub: `${s.toplamStok.toLocaleString("tr-TR")} ${t.units}`,
      trend: "+12", spark: [38, 42, 47, 51, 55, 60, 64], tone: "primary", icon: IconPill },
    { key: "crit", label: t.criticalStock, value: s.kritikSayisi, sub: t.units,
      trend: "+3", spark: [4, 6, 5, 8, 9, 10, 12], tone: "warn", icon: IconAlert, sparkColor: "#F59E0B" },
    { key: "exp", label: t.expiringSoon, value: s.miadYaklasanSayisi, sub: lang === "tr" ? "30 gün içinde" : "within 30d",
      trend: "+2", spark: [2, 3, 5, 5, 6, 7, 8], tone: "alert", icon: IconClock, sparkColor: "#EF4444" },
    { key: "sales", label: t.todaysSales, value: "₺" + s.bugunSatis.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
      sub: `${s.bugunReceteSayisi} ${t.prescriptions.toLowerCase()}`, trend: "+18%",
      spark: [2200, 2800, 2500, 3400, 3100, 3800, 4280], tone: "good", icon: IconChart, sparkColor: "#10B981" },
  ];

  const quickActions = [
    { icon: IconPlus, label: t.newSale, tone: "primary" },
    { icon: IconPill, label: t.addMedicine },
    { icon: IconRx, label: t.newPrescription },
    { icon: IconBoxes, label: t.stockEntry },
  ];

  const spark = [42, 58, 51, 72, 64, 89, 78];
  const max = Math.max(...spark);

  // Daily entry/exit chart data
  const dailyMv = [
    { day: lang === "tr" ? "Pzt" : "Mon", entry: 24, exit: 38 },
    { day: lang === "tr" ? "Sal" : "Tue", entry: 18, exit: 45 },
    { day: lang === "tr" ? "Çar" : "Wed", entry: 32, exit: 41 },
    { day: lang === "tr" ? "Per" : "Thu", entry: 12, exit: 56 },
    { day: lang === "tr" ? "Cum" : "Fri", entry: 28, exit: 62 },
    { day: lang === "tr" ? "Cts" : "Sat", entry: 8, exit: 48 },
    { day: lang === "tr" ? "Paz" : "Sun", entry: 4, exit: 32 },
  ];
  const mvMax = Math.max(...dailyMv.flatMap(d => [d.entry, d.exit]));

  return (
    <div className="hk-page">
      <div className="hk-greet">
        <div>
          <div className="hk-greet-h">{greet}, <strong>{user?.username || "eczacı"}</strong></div>
          <div className="hk-greet-sub">{t.overview}</div>
        </div>
        <div className="hk-quick">
          {quickActions.map((a, i) => {
            const I = a.icon;
            return (
              <button key={i} className={"hk-btn " + (a.tone === "primary" ? "hk-btn-primary" : "hk-btn-ghost")}>
                <I size={15} />
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hk-stats">
        {stats.map(st => {
          const I = st.icon;
          return (
            <div key={st.key} className={"hk-stat tone-" + st.tone}>
              <div className="hk-stat-head">
                <span className="hk-stat-icon"><I size={17} /></span>
                <MiniSpark data={st.spark} color={st.sparkColor || "#10B981"} />
              </div>
              <div className="hk-stat-value">{st.value}</div>
              <div className="hk-stat-label">{st.label}</div>
              <div className="hk-stat-sub">{st.sub}</div>
              <div className="hk-stat-bg-icon"><I size={110} /></div>
            </div>
          );
        })}
      </div>

      <div className="hk-grid-2">
        <div className="hk-card">
          <div className="hk-card-head">
            <h3>{t.recentMovements}</h3>
            <a href="#" className="hk-link" onClick={(e) => e.preventDefault()}>{t.viewAll} <IconArrowRight size={12} /></a>
          </div>
          <ul className="hk-mvlist">
            {data.movements.slice(0, 5).map(m => {
              const Ic = m.tur === "entry" ? IconArrowDownIn :
                         m.tur === "exit" ? IconArrowUpOut :
                         m.tur === "return" ? IconReturn : IconAdjust;
              return (
                <li key={m.id}>
                  <span className={"hk-mv-icon mv-" + m.tur}><Ic size={14} /></span>
                  <div className="hk-mv-main">
                    <div className="hk-mv-name">{m.ilac}</div>
                    <div className="hk-mv-meta">{m.kullanici} · {m.tarih.split(" ")[1]}</div>
                  </div>
                  <div className={"hk-mv-qty mv-" + m.tur}>
                    {m.tur === "entry" ? "+" : m.tur === "exit" ? "−" : m.miktar < 0 ? "−" : "+"}{Math.abs(m.miktar)}
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Mini bar chart for daily entry/exit */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--hk-line)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--hk-ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {lang === "tr" ? "Günlük giriş / çıkış" : "Daily entry / exit"}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
              {dailyMv.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", flex: 1, width: "100%", justifyContent: "center" }}>
                    <div style={{ width: 8, height: (d.entry / mvMax * 100) + "%", background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)", borderRadius: "3px 3px 0 0", minHeight: 3 }} title={"Giriş: " + d.entry} />
                    <div style={{ width: 8, height: (d.exit / mvMax * 100) + "%", background: "linear-gradient(180deg, #818CF8 0%, #6366F1 100%)", borderRadius: "3px 3px 0 0", minHeight: 3 }} title={"Çıkış: " + d.exit} />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--hk-ink-3)", fontWeight: 600 }}>{d.day}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 10.5, color: "var(--hk-ink-3)", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#10B981" }} />{lang === "tr" ? "Giriş" : "Entry"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#6366F1" }} />{lang === "tr" ? "Çıkış" : "Exit"}</span>
            </div>
          </div>
        </div>

        <div className="hk-card">
          <div className="hk-card-head">
            <h3>{t.criticalStock}</h3>
            <a href="#" className="hk-link" onClick={(e) => e.preventDefault()}>{t.viewAll} <IconArrowRight size={12} /></a>
          </div>
          <ul className="hk-replist">
            {data.medicines
              .filter(m => stockStatusB(m.stok) !== "ok")
              .slice(0, 4)
              .map(m => {
                const ss = stockStatusB(m.stok);
                const pct = Math.min(100, Math.max(8, (m.stok / 30) * 100));
                const fill = ss === "critical" || ss === "out" ? "crit" : ss === "low" ? "warn" : "low";
                return (
                  <li key={m.id} style={{ display: "block", padding: "10px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div className="hk-rep-li-l">
                        <div className="hk-rep-name">{m.ad}</div>
                        <div className="hk-rep-meta">{m.kategori}</div>
                      </div>
                      <div className={"hk-stockbadge ss-" + ss}>
                        {m.stok === 0 ? t.outOfStock : `${m.stok}`}
                      </div>
                    </div>
                    <div className="hk-rep-prog"><div className={"hk-rep-prog-fill " + fill} style={{ width: pct + "%" }} /></div>
                  </li>
                );
              })}
          </ul>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--hk-line)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--hk-ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {t.upcomingExpirations}
            </div>
            <ul className="hk-explist">
              {data.medicines
                .filter(m => daysUntilB(m.miad) < 200)
                .sort((a, b) => daysUntilB(a.miad) - daysUntilB(b.miad))
                .slice(0, 3)
                .map(m => {
                  const days = daysUntilB(m.miad);
                  const tone = days < 60 ? "alert" : days < 120 ? "warn" : "ok";
                  return (
                    <li key={m.id}>
                      <div className="hk-exp-main">
                        <div className="hk-exp-name">{m.ad}</div>
                        <div className="hk-exp-meta">{m.stok} {t.units}</div>
                      </div>
                      <div className={"hk-exp-days tone-" + tone}>
                        <div className="hk-exp-d">{days}</div>
                        <div className="hk-exp-l">{t.days}</div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>

      <div className="hk-card">
        <div className="hk-card-head">
          <h3>{lang === "tr" ? "Son 7 gün satış" : "Last 7 days"}</h3>
          <div className="hk-pills">
            <button className="hk-pill active">7g</button>
            <button className="hk-pill">30g</button>
            <button className="hk-pill">90g</button>
          </div>
        </div>
        <div className="hk-spark">
          {spark.map((v, i) => (
            <div key={i} className="hk-spark-col">
              <div className="hk-spark-bar-wrap">
                <div className="hk-spark-bar" style={{ height: (v / max * 100) + "%" }}>
                  <span className="hk-spark-val">₺{(v * 60).toLocaleString("tr-TR")}</span>
                </div>
              </div>
              <div className="hk-spark-x">
                {(lang === "tr" ? ["Pzt","Sal","Çar","Per","Cum","Cts","Paz"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="hk-quickstrip">
        <div className="hk-quickstrip-item">
          <div className="hk-qs-icon" style={{ background: "var(--hk-good-l)", color: "#047857" }}><IconRx size={18} /></div>
          <div className="hk-qs-info">
            <div className="hk-qs-value">{s.bugunReceteSayisi}</div>
            <div className="hk-qs-label">{lang === "tr" ? "Bugün reçete" : "Today's Rx"}</div>
          </div>
        </div>
        <div className="hk-quickstrip-item">
          <div className="hk-qs-icon" style={{ background: "var(--hk-info-l)", color: "#1D4ED8" }}><IconArrowUpOut size={18} /></div>
          <div className="hk-qs-info">
            <div className="hk-qs-value">142</div>
            <div className="hk-qs-label">{lang === "tr" ? "Bugün satış" : "Today's sales"}</div>
          </div>
        </div>
        <div className="hk-quickstrip-item">
          <div className="hk-qs-icon"><IconPlus size={18} /></div>
          <div className="hk-qs-info">
            <div className="hk-qs-value">7</div>
            <div className="hk-qs-label">{lang === "tr" ? "Yeni ilaç (hafta)" : "New meds (week)"}</div>
          </div>
        </div>
        <div className="hk-quickstrip-item">
          <div className="hk-qs-icon" style={{ background: "var(--hk-warn-l)", color: "#92400E" }}><IconUser size={18} /></div>
          <div className="hk-qs-info">
            <div className="hk-qs-value">38</div>
            <div className="hk-qs-label">{lang === "tr" ? "Aktif müşteri" : "Active customers"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainAppSaas({ lang, setLang, user, onLogout, apiStatus }) {
  const t = TRANSLATIONS[lang];
  const [active, setActive] = useStateB("dashboard");
  const [search, setSearch] = useStateB("");
  const [data] = useStateB(window.MOCK);

  const titles = {
    dashboard: { title: t.dashboard, subtitle: lang === "tr" ? "Eczane operasyonlarına genel bakış" : "Overview of pharmacy operations" },
    medicines: { title: t.medicines, subtitle: lang === "tr" ? `${data.medicines.length} kayıtlı ilaç` : `${data.medicines.length} medicines` },
    stock: { title: t.stockMovements, subtitle: lang === "tr" ? "Giriş, çıkış, düzeltme ve iadeler" : "Entries, exits, adjustments, returns" },
    prescriptions: { title: t.prescriptions, subtitle: lang === "tr" ? `${data.prescriptions.length} kayıtlı reçete` : `${data.prescriptions.length} prescriptions` },
    reports: { title: t.reports, subtitle: lang === "tr" ? "Stok özeti, kritik stok, miad takibi" : "Stock summary, critical stock, expiry" },
    categories: { title: t.categories, subtitle: lang === "tr" ? "İlaç kategorileri" : "Medicine categories" },
  };
  const showSearch = active === "medicines";

  return (
    <div className="hk-app" data-screen-label={"Hekim · " + titles[active].title}>
      <SidebarSaas active={active} setActive={setActive} lang={lang} user={user} onLogout={onLogout} />
      <div className="hk-main">
        <TopbarSaas {...titles[active]} lang={lang} setLang={setLang} apiStatus={apiStatus}
                search={search} setSearch={setSearch} showSearch={showSearch} />
        <div className="hk-content">
          {active === "dashboard" && <DashboardSaas lang={lang} user={user} data={data} />}
          {active === "medicines" && <Medicines lang={lang} data={data} search={search} />}
          {active === "stock" && <StockMovements lang={lang} data={data} />}
          {active === "prescriptions" && <Prescriptions lang={lang} data={data} />}
          {active === "reports" && <Reports lang={lang} data={data} />}
          {active === "categories" && <Categories lang={lang} data={data} />}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MainAppSaas });
