import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  ClipboardList,
  PackageCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../../components/AppShell.jsx';
import StatCard from '../../../components/StatCard.jsx';
import StatusPill from '../../../components/StatusPill.jsx';
import { getDashboardData } from '../../../services/dashboardService.js';

function formatDate(dateValue) {
  if (!dateValue) {
    return '-';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
}

function LoadingSkeleton() {
  return (
    <div className="dashboard-grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="skeleton-card" key={index} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (requestError) {
      setDashboard(null);
      setError(requestError.message || 'Backend verileri alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredMedicines = useMemo(() => {
    const list = dashboard?.medicines || [];
    const searchValue = query.trim().toLocaleLowerCase('tr-TR');

    if (!searchValue) {
      return list;
    }

    return list.filter((medicine) =>
      [medicine.ilac_adi, medicine.barkod]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(searchValue)),
    );
  }, [dashboard, query]);

  return (
    <AppShell>
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">27 Nisan 2026</span>
          <h1>Eczane Stok ve Reçete Kayıt Sistemi</h1>
          <p>
            Kritik stok, son kullanma tarihi yaklaşan ürünler ve günlük reçete yoğunluğu tek ekranda.
          </p>
        </div>

        <button className="refresh-button" type="button" onClick={loadDashboard}>
          <RefreshCw size={18} />
          <span>Yenile</span>
        </button>
      </section>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <section className="error-panel" role="alert">
          <AlertTriangle size={22} />
          <div>
            <h2>Backend verileri alınamadı</h2>
            <p>{error}</p>
          </div>
        </section>
      ) : !dashboard ? (
        <section className="error-panel" role="status">
          <AlertTriangle size={22} />
          <div>
            <h2>Gösterilecek veri yok</h2>
            <p>Stok API'sinden kayıt dönmedi.</p>
          </div>
        </section>
      ) : (
        <>
          <section className="dashboard-grid" aria-label="Özet metrikler">
            <StatCard
              icon={Boxes}
              label="Toplam ilaç"
              value={dashboard.stats.totalMedicines}
              detail={`${dashboard.stats.totalUnits} kutu`}
              tone="teal"
            />
            <StatCard
              icon={AlertTriangle}
              label="Kritik stok"
              value={dashboard.stats.criticalStock}
              detail="Eşik altında"
              tone="coral"
            />
            <StatCard
              icon={CalendarClock}
              label="Son kullanma tarihi"
              value={dashboard.stats.expiringSoon}
              detail="30 gün içinde dolacak"
              tone="amber"
            />
            <StatCard
              icon={ClipboardList}
              label="Bekleyen reçete"
              value={dashboard.stats.waitingPrescriptions}
              detail="İşlem sırası"
              tone="violet"
            />
          </section>

          <section className="content-layout">
            <div className="primary-column">
              <div className="section-heading" id="stok">
                <div>
                  <span className="eyebrow">Stok takibi</span>
                  <h2>İlaç listesi</h2>
                </div>
                <label className="search-box">
                  <Search size={18} />
                  <input
                    type="search"
                    placeholder="İlaç veya barkod ara"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>

              <div className="table-surface">
                <div className="table-responsive d-none d-md-block">
                  <table className="table align-middle medicine-table">
                    <thead>
                      <tr>
                        <th>İlaç</th>
                        <th>Barkod</th>
                        <th>Stok</th>
                        <th>Kritik eşik</th>
                        <th>Son kullanma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-table-cell">
                            Stok kaydı bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredMedicines.map((medicine) => (
                          <tr key={medicine.id || medicine.barkod}>
                            <td>
                              <strong>{medicine.ilac_adi}</strong>
                            </td>
                            <td>{medicine.barkod || '-'}</td>
                            <td>{medicine.stok_miktari}</td>
                            <td>{medicine.kritik_stok_esigi}</td>
                            <td>{formatDate(medicine.son_kullanma_tarihi)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-medicine-list d-md-none">
                  {filteredMedicines.length === 0 ? (
                    <p className="empty-state">Stok kaydı bulunamadı.</p>
                  ) : (
                    filteredMedicines.map((medicine) => (
                      <article className="medicine-card" key={medicine.id || medicine.barkod}>
                        <div>
                          <strong>{medicine.ilac_adi}</strong>
                          <span>{medicine.barkod || '-'}</span>
                        </div>
                        <dl>
                          <div>
                            <dt>Stok</dt>
                            <dd>{medicine.stok_miktari}</dd>
                          </div>
                          <div>
                            <dt>Eşik</dt>
                            <dd>{medicine.kritik_stok_esigi}</dd>
                          </div>
                          <div>
                            <dt>SKT</dt>
                            <dd>{formatDate(medicine.son_kullanma_tarihi)}</dd>
                          </div>
                        </dl>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="side-column" aria-label="Uyarı ve hareketler">
              <section className="alert-panel">
                <div className="section-heading compact">
                  <div>
                    <span className="eyebrow">Öncelik</span>
                    <h2>Kritik stok</h2>
                  </div>
                  <AlertTriangle size={20} />
                </div>
                <ul className="priority-list">
                  {dashboard.criticalStock.length === 0 ? (
                    <li className="empty-list-item">Kritik stok kaydı yok.</li>
                  ) : (
                    dashboard.criticalStock.slice(0, 4).map((medicine) => (
                      <li key={medicine.id || medicine.barkod}>
                        <span>{medicine.ilac_adi}</span>
                        <strong>{medicine.stok_miktari} kutu</strong>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="alert-panel">
                <div className="section-heading compact" id="receteler">
                  <div>
                    <span className="eyebrow">Reçete</span>
                    <h2>Bugünkü durum</h2>
                  </div>
                  <PackageCheck size={20} />
                </div>
                <ul className="prescription-list">
                  {dashboard.prescriptions.length === 0 ? (
                    <li className="empty-list-item">Reçete kaydı yok.</li>
                  ) : (
                    dashboard.prescriptions.map((prescription) => (
                      <li key={prescription.id}>
                        <div>
                          <strong>{prescription.hasta}</strong>
                          <span>{formatDate(prescription.recete_tarihi)}</span>
                        </div>
                        <StatusPill value={prescription.durum} />
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="alert-panel">
                <div className="section-heading compact">
                  <div>
                    <span className="eyebrow">Hareket</span>
                    <h2>Son işlemler</h2>
                  </div>
                </div>
                <ul className="movement-list">
                  {dashboard.movements.length === 0 ? (
                    <li className="empty-list-item">Stok hareketi kaydı yok.</li>
                  ) : (
                    dashboard.movements.map((movement) => (
                      <li key={movement.id}>
                        <StatusPill value={movement.tip} />
                        <div>
                          <strong>{movement.ilac}</strong>
                          <span>
                            {movement.miktar} kutu, {movement.zaman}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </aside>
          </section>
        </>
      )}
    </AppShell>
  );
}
