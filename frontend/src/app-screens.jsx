// app-screens.jsx — Hekim main app: Dashboard, Medicines, Stock, Prescriptions, Reports
// Shared sidebar/topbar shell + per-screen content.

const { useState: useStateA, useEffect: useEffectA, useMemo } = React;

// ─── API client (real fetch, fallback to mock) ──────────────────────────────
async function apiGet(path) {
  try {
    const token = (() => { try { return localStorage.getItem("hekim_token"); } catch { return null; } })();
    const res = await fetch("http://localhost:8000/api/v1" + path, {
      headers: token ? { Authorization: "Token " + token } : {},
    });
    if (!res.ok) throw new Error("status " + res.status);
    return { ok: true, data: await res.json() };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── Stock status helper ────────────────────────────────────────────────────
function stockStatus(n) {
  if (n === 0) return "out";
  if (n < 10) return "critical";
  if (n < 30) return "low";
  return "ok";
}

function daysUntil(dateStr) {
  const d = new Date(dateStr).getTime();
  const today = new Date("2026-05-02").getTime();
  return Math.round((d - today) / 86400000);
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, lang, user, onLogout }) {
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
        <IconLogo size={28} />
        <div>
          <div className="hk-brand-name" style={{ fontSize: 15 }}>{TRANSLATIONS[lang].brand}</div>
          <div className="hk-brand-tag" style={{ fontSize: 10.5 }}>{TRANSLATIONS[lang].tagline}</div>
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

// ─── Topbar ─────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle, lang, setLang, apiStatus, search, setSearch, showSearch }) {
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

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ lang, user, data }) {
  const t = TRANSLATIONS[lang];
  const s = data.summary;
  const hour = new Date().getHours();
  const greet = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening;

  const stats = [
    { key: "med", label: t.totalMedicines, value: s.toplamIlac, sub: `${s.toplamStok.toLocaleString("tr-TR")} ${t.units}`, trend: "+12", icon: IconPill, tone: "neutral" },
    { key: "crit", label: t.criticalStock, value: s.kritikSayisi, sub: t.units, trend: "+3", icon: IconAlert, tone: "warn" },
    { key: "exp", label: t.expiringSoon, value: s.miadYaklasanSayisi, sub: lang === "tr" ? "30 gün içinde" : "within 30 days", trend: "+2", icon: IconClock, tone: "alert" },
    { key: "sales", label: t.todaysSales, value: "₺" + s.bugunSatis.toLocaleString("tr-TR", { minimumFractionDigits: 2 }), sub: `${s.bugunReceteSayisi} ${t.prescriptions.toLowerCase()}`, trend: "+18%", icon: IconChart, tone: "good" },
  ];

  const quickActions = [
    { icon: IconPlus, label: t.newSale, tone: "primary" },
    { icon: IconPill, label: t.addMedicine },
    { icon: IconRx, label: t.newPrescription },
    { icon: IconBoxes, label: t.stockEntry },
  ];

  // Weekly sparkline data
  const spark = [42, 58, 51, 72, 64, 89, 78];
  const max = Math.max(...spark);

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
                <span className="hk-stat-icon"><I size={16} /></span>
                <span className="hk-stat-trend">
                  <IconArrowUp size={11} />{st.trend}
                </span>
              </div>
              <div className="hk-stat-value">{st.value}</div>
              <div className="hk-stat-label">{st.label}</div>
              <div className="hk-stat-sub">{st.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="hk-grid-2">
        {/* Recent movements */}
        <div className="hk-card">
          <div className="hk-card-head">
            <h3>{t.recentMovements}</h3>
            <a href="#" className="hk-link" onClick={(e) => e.preventDefault()}>{t.viewAll} <IconArrowRight size={12} /></a>
          </div>
          <ul className="hk-mvlist">
            {data.movements.slice(0, 6).map(m => {
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
        </div>

        {/* Critical + expiring */}
        <div className="hk-card">
          <div className="hk-card-head">
            <h3>{t.upcomingExpirations}</h3>
            <a href="#" className="hk-link" onClick={(e) => e.preventDefault()}>{t.viewAll} <IconArrowRight size={12} /></a>
          </div>
          <ul className="hk-explist">
            {data.medicines
              .filter(m => daysUntil(m.miad) < 200)
              .sort((a, b) => daysUntil(a.miad) - daysUntil(b.miad))
              .slice(0, 5)
              .map(m => {
                const days = daysUntil(m.miad);
                const tone = days < 60 ? "alert" : days < 120 ? "warn" : "ok";
                return (
                  <li key={m.id}>
                    <div className="hk-exp-main">
                      <div className="hk-exp-name">{m.ad}</div>
                      <div className="hk-exp-meta">{m.barkod} · {m.stok} {t.units}</div>
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

      {/* Weekly sales */}
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
              <div className="hk-spark-bar" style={{ height: (v / max * 100) + "%" }}>
                <span className="hk-spark-val">₺{(v * 60).toLocaleString("tr-TR")}</span>
              </div>
              <div className="hk-spark-x">
                {(lang === "tr" ? ["Pzt","Sal","Çar","Per","Cum","Cts","Paz"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Medicines ──────────────────────────────────────────────────────────────
function Medicines({ lang, data, search }) {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useStateA("all");
  const [selected, setSelected] = useStateA(null);

  const filtered = useMemo(() => {
    let list = data.medicines;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.ad.toLowerCase().includes(q) || m.barkod.includes(q) || m.etken.toLowerCase().includes(q));
    }
    if (filter === "critical") list = list.filter(m => stockStatus(m.stok) === "critical" || stockStatus(m.stok) === "out");
    if (filter === "low") list = list.filter(m => stockStatus(m.stok) === "low");
    if (filter === "expiring") list = list.filter(m => daysUntil(m.miad) < 90);
    return list;
  }, [data.medicines, search, filter]);

  const filters = [
    { id: "all", label: t.all, n: data.medicines.length },
    { id: "critical", label: t.critical, n: data.medicines.filter(m => stockStatus(m.stok) === "critical" || stockStatus(m.stok) === "out").length },
    { id: "low", label: t.low, n: data.medicines.filter(m => stockStatus(m.stok) === "low").length },
    { id: "expiring", label: t.expiringSoon, n: data.medicines.filter(m => daysUntil(m.miad) < 90).length },
  ];

  return (
    <div className="hk-page">
      <div className="hk-toolbar">
        <div className="hk-pills">
          {filters.map(f => (
            <button key={f.id} className={"hk-pill " + (filter === f.id ? "active" : "")} onClick={() => setFilter(f.id)}>
              {f.label} <span className="hk-pill-n">{f.n}</span>
            </button>
          ))}
        </div>
        <div className="hk-toolbar-r">
          <button className="hk-btn hk-btn-ghost"><IconFilter size={14} /><span>{t.filter}</span></button>
          <button className="hk-btn hk-btn-ghost"><IconExport size={14} /><span>{t.export}</span></button>
          <button className="hk-btn hk-btn-primary"><IconPlus size={14} /><span>{t.addNew}</span></button>
        </div>
      </div>

      <div className="hk-table-wrap">
        <table className="hk-table">
          <thead>
            <tr>
              <th>{t.barcode}</th>
              <th>{t.name}</th>
              <th>{t.activeIngredient}</th>
              <th>{t.category}</th>
              <th className="num">{t.stock}</th>
              <th className="num">{t.price}</th>
              <th>{t.expiryDate}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const ss = stockStatus(m.stok);
              const days = daysUntil(m.miad);
              return (
                <tr key={m.id} className={selected === m.id ? "selected" : ""} onClick={() => setSelected(m.id)}>
                  <td className="mono">{m.barkod}</td>
                  <td><strong>{m.ad}</strong></td>
                  <td className="muted">{m.etken}</td>
                  <td><span className="hk-chip">{m.kategori}</span></td>
                  <td className="num">
                    <span className={"hk-stockbadge ss-" + ss}>{m.stok}</span>
                  </td>
                  <td className="num mono">₺{m.fiyat.toFixed(2)}</td>
                  <td className={days < 60 ? "alert" : days < 120 ? "warn" : "muted"}>
                    {new Date(m.miad).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}
                    <span className="hk-days-mini"> · {days}{lang === "tr" ? "g" : "d"}</span>
                  </td>
                  <td><button className="hk-row-action"><IconArrowRight size={13} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="hk-empty">{lang === "tr" ? "Sonuç bulunamadı." : "No results."}</div>
        )}
      </div>
    </div>
  );
}

// ─── Stock movements ────────────────────────────────────────────────────────
function StockMovements({ lang, data }) {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useStateA("all");
  const filtered = filter === "all" ? data.movements : data.movements.filter(m => m.tur === filter);

  const types = [
    { id: "all", label: t.all, n: data.movements.length },
    { id: "entry", label: t.entry, n: data.movements.filter(m => m.tur === "entry").length },
    { id: "exit", label: t.exit, n: data.movements.filter(m => m.tur === "exit").length },
    { id: "adjustment", label: t.adjustment, n: data.movements.filter(m => m.tur === "adjustment").length },
    { id: "return", label: t.return, n: data.movements.filter(m => m.tur === "return").length },
  ];

  return (
    <div className="hk-page">
      <div className="hk-toolbar">
        <div className="hk-pills">
          {types.map(f => (
            <button key={f.id} className={"hk-pill " + (filter === f.id ? "active" : "")} onClick={() => setFilter(f.id)}>
              {f.label} <span className="hk-pill-n">{f.n}</span>
            </button>
          ))}
        </div>
        <div className="hk-toolbar-r">
          <div className="hk-daterange">
            <IconCalendar size={14} />
            <span>01 May – 02 May 2026</span>
            <IconArrowDown size={12} />
          </div>
          <button className="hk-btn hk-btn-primary"><IconPlus size={14} /><span>{lang === "tr" ? "Yeni hareket" : "New movement"}</span></button>
        </div>
      </div>

      <div className="hk-table-wrap">
        <table className="hk-table">
          <thead>
            <tr>
              <th>{t.type}</th>
              <th>{lang === "tr" ? "İlaç" : "Medicine"}</th>
              <th className="num">{t.quantity}</th>
              <th>{t.date}</th>
              <th>{t.user}</th>
              <th>{t.note}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const Ic = m.tur === "entry" ? IconArrowDownIn :
                         m.tur === "exit" ? IconArrowUpOut :
                         m.tur === "return" ? IconReturn : IconAdjust;
              const labelMap = { entry: t.entry, exit: t.exit, adjustment: t.adjustment, return: t.return };
              return (
                <tr key={m.id}>
                  <td>
                    <span className={"hk-mvtype mv-" + m.tur}>
                      <Ic size={13} />{labelMap[m.tur]}
                    </span>
                  </td>
                  <td><strong>{m.ilac}</strong></td>
                  <td className={"num mono mv-" + m.tur}>
                    {m.tur === "entry" ? "+" : m.tur === "exit" ? "−" : (m.miktar < 0 ? "−" : "+")}{Math.abs(m.miktar)}
                  </td>
                  <td className="mono">{m.tarih}</td>
                  <td>{m.kullanici}</td>
                  <td className="muted">{m.not}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Prescriptions ──────────────────────────────────────────────────────────
function Prescriptions({ lang, data }) {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useStateA("all");
  const filtered = filter === "all" ? data.prescriptions : data.prescriptions.filter(p => p.durum === filter);

  const filters = [
    { id: "all", label: t.all, n: data.prescriptions.length },
    { id: "pending", label: t.pending, n: data.prescriptions.filter(p => p.durum === "pending").length },
    { id: "completed", label: t.completed, n: data.prescriptions.filter(p => p.durum === "completed").length },
    { id: "cancelled", label: t.cancelled, n: data.prescriptions.filter(p => p.durum === "cancelled").length },
  ];

  return (
    <div className="hk-page">
      <div className="hk-toolbar">
        <div className="hk-pills">
          {filters.map(f => (
            <button key={f.id} className={"hk-pill " + (filter === f.id ? "active" : "")} onClick={() => setFilter(f.id)}>
              {f.label} <span className="hk-pill-n">{f.n}</span>
            </button>
          ))}
        </div>
        <div className="hk-toolbar-r">
          <button className="hk-btn hk-btn-ghost"><IconExport size={14} /><span>{t.export}</span></button>
          <button className="hk-btn hk-btn-primary"><IconPlus size={14} /><span>{t.newPrescription}</span></button>
        </div>
      </div>

      <div className="hk-rxgrid">
        {filtered.map(p => (
          <div key={p.id} className={"hk-rxcard durum-" + p.durum}>
            <div className="hk-rxcard-head">
              <span className="hk-rxno">{p.id}</span>
              <span className={"hk-status durum-" + p.durum}>
                {p.durum === "completed" && <IconCheck size={11} />}
                {p.durum === "pending" && <IconClock size={11} />}
                {p.durum === "cancelled" && <IconX size={11} />}
                {p.durum === "completed" ? t.completed : p.durum === "pending" ? t.pending : t.cancelled}
              </span>
            </div>
            <div className="hk-rxcard-body">
              <div className="hk-rxrow">
                <span className="hk-rxlbl">{t.patient}</span>
                <span className="hk-rxval">{p.hasta}</span>
              </div>
              <div className="hk-rxrow">
                <span className="hk-rxlbl">{t.doctor}</span>
                <span className="hk-rxval">{p.hekim}</span>
              </div>
              <div className="hk-rxrow">
                <span className="hk-rxlbl">{t.date}</span>
                <span className="hk-rxval mono">{p.tarih}</span>
              </div>
            </div>
            <div className="hk-rxcard-foot">
              <span className="muted">{p.kalemSayisi} {t.items.toLowerCase()}</span>
              <strong>₺{p.toplam.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reports ────────────────────────────────────────────────────────────────
function Reports({ lang, data }) {
  const t = TRANSLATIONS[lang];
  const s = data.summary;

  const criticalList = data.medicines.filter(m => stockStatus(m.stok) === "critical" || stockStatus(m.stok) === "out");
  const expiringList = data.medicines.filter(m => daysUntil(m.miad) < 200).sort((a, b) => daysUntil(a.miad) - daysUntil(b.miad));

  // Category distribution
  const catTotals = {};
  data.medicines.forEach(m => { catTotals[m.kategori] = (catTotals[m.kategori] || 0) + m.stok; });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(...catEntries.map(e => e[1]));

  return (
    <div className="hk-page">
      <div className="hk-toolbar">
        <div className="hk-pills">
          <button className="hk-pill active">{t.last7days}</button>
          <button className="hk-pill">{t.last30days}</button>
          <button className="hk-pill">{t.thisMonth}</button>
        </div>
        <div className="hk-toolbar-r">
          <button className="hk-btn hk-btn-ghost"><IconExport size={14} /><span>PDF</span></button>
          <button className="hk-btn hk-btn-ghost"><IconExport size={14} /><span>Excel</span></button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="hk-stats">
        <div className="hk-stat tone-neutral">
          <div className="hk-stat-head"><span className="hk-stat-icon"><IconBoxes size={16} /></span></div>
          <div className="hk-stat-value">{s.toplamStok.toLocaleString("tr-TR")}</div>
          <div className="hk-stat-label">{lang === "tr" ? "Toplam stok adedi" : "Total stock units"}</div>
          <div className="hk-stat-sub">{s.toplamIlac} {t.medicines.toLowerCase()}</div>
        </div>
        <div className="hk-stat tone-good">
          <div className="hk-stat-head"><span className="hk-stat-icon"><IconChart size={16} /></span></div>
          <div className="hk-stat-value">₺{s.toplamDeger.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</div>
          <div className="hk-stat-label">{lang === "tr" ? "Stok değeri" : "Stock value"}</div>
          <div className="hk-stat-sub">{lang === "tr" ? "Maliyet bazlı" : "At cost"}</div>
        </div>
        <div className="hk-stat tone-warn">
          <div className="hk-stat-head"><span className="hk-stat-icon"><IconAlert size={16} /></span></div>
          <div className="hk-stat-value">{criticalList.length}</div>
          <div className="hk-stat-label">{t.criticalStock}</div>
          <div className="hk-stat-sub">{lang === "tr" ? "Acil sipariş" : "Urgent reorder"}</div>
        </div>
        <div className="hk-stat tone-alert">
          <div className="hk-stat-head"><span className="hk-stat-icon"><IconClock size={16} /></span></div>
          <div className="hk-stat-value">{expiringList.filter(m => daysUntil(m.miad) < 90).length}</div>
          <div className="hk-stat-label">{lang === "tr" ? "90 gün içinde miad" : "Expiring in 90d"}</div>
          <div className="hk-stat-sub">{lang === "tr" ? "İade veya promosyon" : "Return or promote"}</div>
        </div>
      </div>

      <div className="hk-grid-2">
        <div className="hk-card">
          <div className="hk-card-head"><h3>{t.criticalStockReport}</h3></div>
          <ul className="hk-replist">
            {criticalList.map(m => (
              <li key={m.id}>
                <div>
                  <div className="hk-rep-name">{m.ad}</div>
                  <div className="hk-rep-meta">{m.kategori} · {m.barkod}</div>
                </div>
                <div className={"hk-stockbadge ss-" + stockStatus(m.stok)}>
                  {m.stok === 0 ? t.outOfStock : `${m.stok} ${t.units}`}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="hk-card">
          <div className="hk-card-head"><h3>{t.expiringSoonReport}</h3></div>
          <ul className="hk-replist">
            {expiringList.slice(0, 6).map(m => {
              const days = daysUntil(m.miad);
              const tone = days < 60 ? "alert" : days < 120 ? "warn" : "ok";
              return (
                <li key={m.id}>
                  <div>
                    <div className="hk-rep-name">{m.ad}</div>
                    <div className="hk-rep-meta">{m.stok} {t.units} · {m.miad}</div>
                  </div>
                  <div className={"hk-exp-days tone-" + tone} style={{ flexDirection: "row", gap: 4, padding: "4px 10px" }}>
                    <span className="hk-exp-d" style={{ fontSize: 14 }}>{days}</span>
                    <span className="hk-exp-l">{t.days}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Category bars */}
      <div className="hk-card">
        <div className="hk-card-head"><h3>{lang === "tr" ? "Kategoriye göre stok dağılımı" : "Stock by category"}</h3></div>
        <div className="hk-bars">
          {catEntries.map(([k, v]) => (
            <div key={k} className="hk-bar">
              <div className="hk-bar-lbl">{k}</div>
              <div className="hk-bar-track">
                <div className="hk-bar-fill" style={{ width: (v / catMax * 100) + "%" }} />
              </div>
              <div className="hk-bar-val mono">{v.toLocaleString("tr-TR")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Categories ─────────────────────────────────────────────────────────────
function Categories({ lang, data }) {
  const t = TRANSLATIONS[lang];
  return (
    <div className="hk-page">
      <div className="hk-toolbar">
        <div></div>
        <div className="hk-toolbar-r">
          <button className="hk-btn hk-btn-primary"><IconPlus size={14} /><span>{t.addNew}</span></button>
        </div>
      </div>
      <div className="hk-catgrid">
        {data.categories.map(c => (
          <div key={c.id} className="hk-catcard">
            <div className="hk-cat-icon"><IconTag size={18} /></div>
            <div className="hk-cat-name">{c.ad}</div>
            <div className="hk-cat-n">{c.ilacSayisi} {t.medicines.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main app shell ─────────────────────────────────────────────────────────
function MainApp({ lang, setLang, user, onLogout, apiStatus }) {
  const t = TRANSLATIONS[lang];
  const [active, setActive] = useStateA("dashboard");
  const [search, setSearch] = useStateA("");
  const [data, setData] = useStateA(window.MOCK);
  const [apiUsed, setApiUsed] = useStateA(false);

  // Try real API in background; if it works, swap data
  useEffectA(() => {
    (async () => {
      const r = await apiGet("/raporlar/stok-ozeti/");
      if (r.ok) setApiUsed(true); // could merge real data here
    })();
  }, []);

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
      <Sidebar active={active} setActive={setActive} lang={lang} user={user} onLogout={onLogout} />
      <div className="hk-main">
        <Topbar {...titles[active]} lang={lang} setLang={setLang} apiStatus={apiStatus}
                search={search} setSearch={setSearch} showSearch={showSearch} />
        <div className="hk-content">
          {active === "dashboard" && <Dashboard lang={lang} user={user} data={data} />}
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

Object.assign(window, { MainApp });
