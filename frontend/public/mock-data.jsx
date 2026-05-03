// mock-data.jsx — Mocks aligned to Penyus/eczane-sistemi backend (develop branch)
// All field names match Django models in stok/models.py exactly.

// ── Kategori (stok.models.Kategori) ───────────────────────────────
const MOCK_KATEGORILER = [
  { id: 1, ad: "Ağrı Kesici", aciklama: "Analjezik ve antiinflamatuvar ilaçlar", ilacSayisi: 28 },
  { id: 2, ad: "Antibiyotik", aciklama: "Bakteriyel enfeksiyon ilaçları", ilacSayisi: 19 },
  { id: 3, ad: "Kardiyovasküler", aciklama: "Kalp ve damar sistemi", ilacSayisi: 34 },
  { id: 4, ad: "Diyabet", aciklama: "Antidiyabetik ilaçlar", ilacSayisi: 12 },
  { id: 5, ad: "Boğaz", aciklama: "Boğaz spreyleri ve pastilleri", ilacSayisi: 8 },
  { id: 6, ad: "Topikal", aciklama: "Krem, jel, merhem", ilacSayisi: 22 },
  { id: 7, ad: "Vitamin", aciklama: "Vitamin ve mineral takviyeleri", ilacSayisi: 41 },
  { id: 8, ad: "Soğuk Algınlığı", aciklama: "Grip, soğuk algınlığı", ilacSayisi: 17 },
];

// ── İlaç (stok.models.Ilac) ───────────────────────────────────────
// Fields: ilac_adi, barkod, kategori (id), kategori_adi (read-only),
//         stok_miktari, kritik_stok_esigi, son_kullanma_tarihi,
//         is_deleted, kritik_mi (computed), created_at, updated_at
const MOCK_ILACLAR = [
  { id: 1,  ilac_adi: "Parol 500mg Tablet",            barkod: "8699514012345", kategori: 1, kategori_adi: "Ağrı Kesici",     stok_miktari: 142, kritik_stok_esigi: 20, son_kullanma_tarihi: "2026-09-15", is_deleted: false },
  { id: 2,  ilac_adi: "Augmentin 1g BID Film Tablet",  barkod: "8699502091234", kategori: 2, kategori_adi: "Antibiyotik",     stok_miktari:   8, kritik_stok_esigi: 10, son_kullanma_tarihi: "2026-06-20", is_deleted: false },
  { id: 3,  ilac_adi: "Nurofen 400mg Tablet",          barkod: "8699580013456", kategori: 1, kategori_adi: "Ağrı Kesici",     stok_miktari:  67, kritik_stok_esigi: 15, son_kullanma_tarihi: "2027-02-10", is_deleted: false },
  { id: 4,  ilac_adi: "Cipro 500mg Film Tablet",       barkod: "8699540023456", kategori: 2, kategori_adi: "Antibiyotik",     stok_miktari:  23, kritik_stok_esigi: 10, son_kullanma_tarihi: "2026-05-08", is_deleted: false },
  { id: 5,  ilac_adi: "Concor 5mg Tablet",             barkod: "8699809345678", kategori: 3, kategori_adi: "Kardiyovasküler", stok_miktari:   0, kritik_stok_esigi: 10, son_kullanma_tarihi: "2027-01-30", is_deleted: false },
  { id: 6,  ilac_adi: "Glifor 1000mg Film Tablet",     barkod: "8699502987654", kategori: 4, kategori_adi: "Diyabet",         stok_miktari: 215, kritik_stok_esigi: 30, son_kullanma_tarihi: "2027-08-12", is_deleted: false },
  { id: 7,  ilac_adi: "Aspirin 100mg Tablet",          barkod: "8699504456789", kategori: 3, kategori_adi: "Kardiyovasküler", stok_miktari:  89, kritik_stok_esigi: 20, son_kullanma_tarihi: "2027-04-22", is_deleted: false },
  { id: 8,  ilac_adi: "Tantum Verde Sprey",            barkod: "8699569123456", kategori: 5, kategori_adi: "Boğaz",           stok_miktari:   4, kritik_stok_esigi: 10, son_kullanma_tarihi: "2026-05-25", is_deleted: false },
  { id: 9,  ilac_adi: "Voltaren Emulgel %1",           barkod: "8699536789012", kategori: 6, kategori_adi: "Topikal",         stok_miktari:  31, kritik_stok_esigi: 12, son_kullanma_tarihi: "2026-11-18", is_deleted: false },
  { id: 10, ilac_adi: "Coraspin 100mg Tablet",         barkod: "8699504112233", kategori: 3, kategori_adi: "Kardiyovasküler", stok_miktari:  56, kritik_stok_esigi: 15, son_kullanma_tarihi: "2027-03-15", is_deleted: false },
  { id: 11, ilac_adi: "Majezik 100mg Film Tablet",     barkod: "8699502334455", kategori: 1, kategori_adi: "Ağrı Kesici",     stok_miktari:  12, kritik_stok_esigi: 15, son_kullanma_tarihi: "2026-07-04", is_deleted: false },
  { id: 12, ilac_adi: "Lipitor 20mg Film Tablet",      barkod: "8699556778899", kategori: 3, kategori_adi: "Kardiyovasküler", stok_miktari:  98, kritik_stok_esigi: 20, son_kullanma_tarihi: "2027-05-09", is_deleted: false },
];
// kritik_mi = stok_miktari <= kritik_stok_esigi (modeldeki @property)
MOCK_ILACLAR.forEach(i => { i.kritik_mi = i.stok_miktari <= i.kritik_stok_esigi; });

// ── StokHareket (stok.models.StokHareket) ─────────────────────────
// islem_tipi: "giris" | "cikis" | "satis"  (signal: giris→ekle, cikis/satis→düş)
// miktar: pozitif sayı (signal yön belirler)
const MOCK_HAREKETLER = [
  { id: 1, ilac: 1,  ilac_adi: "Parol 500mg Tablet",          miktar: 12, islem_tipi: "satis",  aciklama: "Reçete #2026-1847",        kullanici: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" }, islem_tarihi: "2026-05-02T14:32:00+03:00" },
  { id: 2, ilac: 2,  ilac_adi: "Augmentin 1g BID",            miktar: 50, islem_tipi: "giris",  aciklama: "Tedarikçi: Selçuk Ecza",   kullanici: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" }, islem_tarihi: "2026-05-02T11:15:00+03:00" },
  { id: 3, ilac: 6,  ilac_adi: "Glifor 1000mg",               miktar: 30, islem_tipi: "satis",  aciklama: "Reçete #2026-1846",        kullanici: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" }, islem_tarihi: "2026-05-02T10:48:00+03:00" },
  { id: 4, ilac: 8,  ilac_adi: "Tantum Verde Sprey",          miktar: 1,  islem_tipi: "satis",  aciklama: "OTC satış",                kullanici: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" }, islem_tarihi: "2026-05-02T09:55:00+03:00" },
  { id: 5, ilac: 5,  ilac_adi: "Concor 5mg",                  miktar: 2,  islem_tipi: "cikis",  aciklama: "Sayım düzeltmesi",         kullanici: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" }, islem_tarihi: "2026-05-01T18:20:00+03:00" },
  { id: 6, ilac: 9,  ilac_adi: "Voltaren Emulgel",            miktar: 1,  islem_tipi: "giris",  aciklama: "Müşteri iadesi",           kullanici: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" }, islem_tarihi: "2026-05-01T16:05:00+03:00" },
  { id: 7, ilac: 7,  ilac_adi: "Aspirin 100mg",               miktar: 8,  islem_tipi: "satis",  aciklama: "Reçete #2026-1844",        kullanici: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" }, islem_tarihi: "2026-05-01T15:30:00+03:00" },
  { id: 8, ilac: 12, ilac_adi: "Lipitor 20mg",                miktar: 100,islem_tipi: "giris",  aciklama: "Tedarikçi: Hedef Ecza",    kullanici: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" }, islem_tarihi: "2026-05-01T12:00:00+03:00" },
];

// ── Recete (stok.models.Recete) ────────────────────────────────────
// durum: "bekliyor" | "teslim_edildi"
const MOCK_RECETELER = [
  {
    id: 1847, hasta_ad_soyad: "Ayşe Yılmaz", hasta_tc: "12345678901",
    doktor_ad_soyad: "Dr. Mehmet Kaya", doktor_diploma_no: "DR-48291",
    recete_tarihi: "2026-05-02", durum: "teslim_edildi", durum_goster: "Teslim Edildi",
    kaydeden: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" },
    recete_ilaclar: [
      { id: 1, ilac: 1, ilac_adi: "Parol 500mg Tablet", kullanilan_miktar: 1, talimat: "Günde 3 kez, yemekten sonra" },
      { id: 2, ilac: 7, ilac_adi: "Aspirin 100mg Tablet", kullanilan_miktar: 1, talimat: "Günde 1 kez sabah" },
      { id: 3, ilac: 3, ilac_adi: "Nurofen 400mg Tablet", kullanilan_miktar: 1, talimat: "Ağrıda 1 tablet" },
    ],
  },
  {
    id: 1846, hasta_ad_soyad: "Hüseyin Demir", hasta_tc: "23456789012",
    doktor_ad_soyad: "Dr. Selin Aydın", doktor_diploma_no: "DR-19384",
    recete_tarihi: "2026-05-02", durum: "teslim_edildi", durum_goster: "Teslim Edildi",
    kaydeden: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" },
    recete_ilaclar: [
      { id: 4, ilac: 6, ilac_adi: "Glifor 1000mg Film Tablet", kullanilan_miktar: 2, talimat: "Sabah-akşam yemekle" },
      { id: 5, ilac: 12, ilac_adi: "Lipitor 20mg Film Tablet", kullanilan_miktar: 1, talimat: "Akşam tek doz" },
    ],
  },
  {
    id: 1845, hasta_ad_soyad: "Fatma Öztürk", hasta_tc: "34567890123",
    doktor_ad_soyad: "Dr. Ali Şahin", doktor_diploma_no: "DR-55217",
    recete_tarihi: "2026-05-02", durum: "bekliyor", durum_goster: "Bekliyor",
    kaydeden: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" },
    recete_ilaclar: [
      { id: 6,  ilac: 2, ilac_adi: "Augmentin 1g BID Film Tablet", kullanilan_miktar: 1, talimat: "Günde 2 kez" },
      { id: 7,  ilac: 1, ilac_adi: "Parol 500mg Tablet",           kullanilan_miktar: 1, talimat: "Ateş yükselince" },
      { id: 8,  ilac: 8, ilac_adi: "Tantum Verde Sprey",           kullanilan_miktar: 1, talimat: "3 saatte bir 2 puff" },
      { id: 9,  ilac: 11, ilac_adi: "Majezik 100mg Film Tablet",   kullanilan_miktar: 1, talimat: "Günde 2 kez" },
    ],
  },
  {
    id: 1844, hasta_ad_soyad: "Mustafa Çelik", hasta_tc: "45678901234",
    doktor_ad_soyad: "Dr. Mehmet Kaya", doktor_diploma_no: "DR-48291",
    recete_tarihi: "2026-05-01", durum: "teslim_edildi", durum_goster: "Teslim Edildi",
    kaydeden: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" },
    recete_ilaclar: [
      { id: 10, ilac: 7, ilac_adi: "Aspirin 100mg Tablet", kullanilan_miktar: 1, talimat: "Günde 1 kez" },
    ],
  },
  {
    id: 1843, hasta_ad_soyad: "Zeynep Arslan", hasta_tc: "56789012345",
    doktor_ad_soyad: "Dr. Elif Korkmaz", doktor_diploma_no: "DR-77104",
    recete_tarihi: "2026-05-01", durum: "bekliyor", durum_goster: "Bekliyor",
    kaydeden: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" },
    recete_ilaclar: [
      { id: 11, ilac: 9,  ilac_adi: "Voltaren Emulgel %1", kullanilan_miktar: 1, talimat: "Ağrıyan bölgeye günde 3 kez" },
      { id: 12, ilac: 11, ilac_adi: "Majezik 100mg",       kullanilan_miktar: 2, talimat: "Sabah-akşam tok karna" },
    ],
  },
  {
    id: 1842, hasta_ad_soyad: "Ahmet Yıldız", hasta_tc: "67890123456",
    doktor_ad_soyad: "Dr. Selin Aydın", doktor_diploma_no: "DR-19384",
    recete_tarihi: "2026-05-01", durum: "teslim_edildi", durum_goster: "Teslim Edildi",
    kaydeden: { id: 2, username: "kahmet", first_name: "Ahmet", last_name: "Korkmaz" },
    recete_ilaclar: [
      { id: 13, ilac: 4,  ilac_adi: "Cipro 500mg Film Tablet",  kullanilan_miktar: 1, talimat: "Günde 2 kez 7 gün" },
      { id: 14, ilac: 1,  ilac_adi: "Parol 500mg Tablet",       kullanilan_miktar: 1, talimat: "Ateş için" },
      { id: 15, ilac: 8,  ilac_adi: "Tantum Verde Sprey",       kullanilan_miktar: 1, talimat: "Boğaza" },
      { id: 16, ilac: 3,  ilac_adi: "Nurofen 400mg Tablet",     kullanilan_miktar: 1, talimat: "Ağrıda" },
      { id: 17, ilac: 11, ilac_adi: "Majezik 100mg Film Tablet",kullanilan_miktar: 1, talimat: "İhtiyaca göre" },
    ],
  },
  {
    id: 1841, hasta_ad_soyad: "Emine Kara", hasta_tc: "78901234567",
    doktor_ad_soyad: "Dr. Ali Şahin", doktor_diploma_no: "DR-55217",
    recete_tarihi: "2026-04-30", durum: "teslim_edildi", durum_goster: "Teslim Edildi",
    kaydeden: { id: 1, username: "ezeynep", first_name: "Zeynep", last_name: "Ergin" },
    recete_ilaclar: [
      { id: 18, ilac: 12, ilac_adi: "Lipitor 20mg Film Tablet", kullanilan_miktar: 1, talimat: "Akşam yemekten sonra" },
      { id: 19, ilac: 10, ilac_adi: "Coraspin 100mg Tablet",    kullanilan_miktar: 1, talimat: "Sabah aç karna" },
    ],
  },
];

// ── Stok Özeti (raporlar/stok-ozeti/) ─────────────────────────────
// Backend exact response shape from StokOzetiView
const MOCK_STOK_OZETI = {
  toplam_ilac: 247,
  kritik_stok_ilac_sayisi: 12,
  miad_yaklasan_ilac_sayisi: 8,
  miad_gecmis_ilac_sayisi: 3,
  bekleyen_recete_sayisi: 6,
};

window.MOCK = {
  kategoriler: MOCK_KATEGORILER,
  ilaclar: MOCK_ILACLAR,
  hareketler: MOCK_HAREKETLER,
  receteler: MOCK_RECETELER,
  stokOzeti: MOCK_STOK_OZETI,

  // app-screens.jsx uyumlu alanlar
  medicines: MOCK_ILACLAR.map(i => ({
    id: i.id,
    ad: i.ilac_adi,
    barkod: i.barkod || "-",
    kategori: i.kategori_adi || "Genel",
    stok: i.stok_miktari,
    esik: i.kritik_stok_esigi,
    miad: i.son_kullanma_tarihi || "2099-01-01",
    fiyat: Math.round(Math.random() * 50 + 10),
  })),
  movements: MOCK_HAREKETLER.map(h => ({
    id: h.id,
    ilac: h.ilac_adi,
    miktar: h.miktar,
    tur: h.islem_tipi === "giris" ? "entry" : h.islem_tipi === "satis" ? "exit" : "exit",
    kullanici: (h.kullanici?.first_name || "") + " " + (h.kullanici?.last_name || ""),
    tarih: (h.islem_tarihi || "").substring(0, 16).replace("T", " "),
  })),
  prescriptions: MOCK_RECETELER.map(r => ({
    id: r.id,
    hasta: r.hasta_ad_soyad,
    doktor: r.doktor_ad_soyad,
    tarih: r.recete_tarihi,
    durum: r.durum,
    ilaclar: r.recete_ilaclar || [],
  })),
  categories: MOCK_KATEGORILER.map(k => ({
    id: k.id,
    ad: k.ad,
    aciklama: k.aciklama,
    ilacSayisi: k.ilacSayisi || 0,
  })),
  summary: {
    toplamIlac: MOCK_STOK_OZETI.toplam_ilac,
    toplamStok: MOCK_ILACLAR.reduce((s, i) => s + i.stok_miktari, 0),
    toplamDeger: MOCK_ILACLAR.reduce((s, i) => s + i.stok_miktari * 25, 0),
    kritikSayisi: MOCK_STOK_OZETI.kritik_stok_ilac_sayisi,
    miadYaklasanSayisi: MOCK_STOK_OZETI.miad_yaklasan_ilac_sayisi,
    bugunSatis: 4280.30,
    bugunReceteSayisi: MOCK_STOK_OZETI.bekleyen_recete_sayisi,
  },
};