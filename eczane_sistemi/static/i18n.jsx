// i18n.jsx — TR/EN translations aligned to Penyus/eczane-sistemi backend
// Field naming matches Django models: islem_tipi values, durum values, etc.

const TRANSLATIONS = {
  tr: {
    brand: "Hekim",
    tagline: "Eczane Stok ve Reçete Kayıt Sistemi",
    appShortName: "Eczane Sistemi",

    // ── Login ──────────────────────────────────────────
    welcome: "Hoş geldiniz",
    loginSubtitle: "Hesabınızla giriş yapın",
    username: "Kullanıcı adı",
    password: "Şifre",
    rememberMe: "Beni hatırla",
    forgotPassword: "Şifremi unuttum",
    signIn: "Giriş yap",
    signingIn: "Giriş yapılıyor…",
    loginError: "Kullanıcı adı veya şifre hatalı.",
    networkError: "Sunucuya bağlanılamadı. Django'nun çalıştığından emin olun.",
    apiHint: "API: localhost:8000/api/v1",

    // ── Status / chrome ────────────────────────────────
    online: "API çevrimiçi",
    offline: "API çevrimdışı",
    today: "Bugün",

    // ── Roles (auth groups) ────────────────────────────
    roleEczaci: "Eczacı",
    roleKalfa: "Kalfa",
    roleAdmin: "Yönetici",

    // ── Navigation ─────────────────────────────────────
    dashboard: "Panel",
    medicines: "İlaçlar",
    stockMovements: "Stok Hareketleri",
    prescriptions: "Reçeteler",
    reports: "Raporlar",
    categories: "Kategoriler",
    users: "Kullanıcılar",
    settings: "Ayarlar",
    logout: "Çıkış",

    // ── Dashboard / Stok Özeti ─────────────────────────
    goodMorning: "Günaydın",
    goodAfternoon: "İyi günler",
    goodEvening: "İyi akşamlar",
    overview: "Eczanenin anlık durumu",
    totalMedicines: "Toplam ilaç",       // toplam_ilac
    criticalStock: "Kritik stok",         // kritik_stok_ilac_sayisi
    expiringSoon: "Miadı yaklaşan",       // miad_yaklasan_ilac_sayisi (30 gün)
    expired: "Miadı geçmiş",              // miad_gecmis_ilac_sayisi
    pendingPrescriptions: "Bekleyen reçete", // bekleyen_recete_sayisi
    recentMovements: "Son stok hareketleri",
    upcomingExpirations: "Yaklaşan miadlar",
    viewAll: "Tümünü gör",
    quickActions: "Hızlı işlemler",
    addMedicine: "İlaç ekle",
    newPrescription: "Yeni reçete",
    stockEntry: "Stok girişi",
    stockExit: "Stok çıkışı",

    // ── Medicines (Ilac) ───────────────────────────────
    searchMedicines: "İlaç ara: ad, barkod…",
    barcode: "Barkod",                  // barkod
    medicineName: "İlaç adı",            // ilac_adi
    category: "Kategori",                // kategori_adi
    stockQty: "Stok",                    // stok_miktari
    criticalThreshold: "Kritik eşik",    // kritik_stok_esigi
    expiryDate: "Son kullanma",          // son_kullanma_tarihi
    actions: "İşlemler",
    inStock: "Stokta",
    low: "Az",
    critical: "Kritik",
    outOfStock: "Tükenmiş",
    all: "Tümü",
    addNew: "Yeni ekle",
    filter: "Filtrele",
    eczaciOnly: "Sadece Eczacı",         // permission hint

    // ── Stock movements (StokHareket) ──────────────────
    movement: "Hareket",
    type: "Tür",                         // islem_tipi
    quantity: "Miktar",                  // miktar
    date: "Tarih",                       // islem_tarihi
    user: "Kullanıcı",                   // kullanici
    note: "Açıklama",                    // aciklama
    giris: "Giriş",                      // islem_tipi=giris
    cikis: "Çıkış",                      // islem_tipi=cikis
    satis: "Satış",                      // islem_tipi=satis
    newMovement: "Yeni hareket",

    // ── Prescriptions (Recete) ─────────────────────────
    patient: "Hasta",                    // hasta_ad_soyad
    patientTc: "T.C. Kimlik No",         // hasta_tc
    doctor: "Doktor",                    // doktor_ad_soyad
    doctorDiploma: "Diploma No",         // doktor_diploma_no
    prescriptionDate: "Reçete tarihi",   // recete_tarihi
    prescriptionId: "Reçete No",
    status: "Durum",                     // durum
    bekliyor: "Bekliyor",                // durum=bekliyor
    teslim_edildi: "Teslim Edildi",      // durum=teslim_edildi
    medicineCount: "İlaç sayısı",
    deliverPrescription: "Teslim et",    // POST /receteler/{id}/teslim-et/
    addPrescriptionMedicine: "İlaç ekle",
    instruction: "Talimat",              // talimat
    usedQty: "Kullanılan miktar",        // kullanilan_miktar
    recordedBy: "Kaydeden",              // kaydeden

    // ── Reports (raporlar) ─────────────────────────────
    stockSummary: "Stok özeti",          // raporlar/stok-ozeti/
    criticalStockReport: "Kritik stok",  // raporlar/kritik-stok/
    expiringSoonReport: "Miadı yaklaşan",// raporlar/miad-yaklasan/
    expiredReport: "Miadı geçmiş",       // raporlar/miad-gecmis/
    daysFilter: "Gün",
    units: "adet",
    days: "gün",
    pieces: "kalem",

    // ── Categories ─────────────────────────────────────
    categoryName: "Kategori adı",        // ad
    categoryDesc: "Açıklama",            // aciklama
  },
  en: {
    brand: "Hekim",
    tagline: "Pharmacy Stock & Prescription System",
    appShortName: "Pharmacy System",

    welcome: "Welcome",
    loginSubtitle: "Sign in to your account",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    loginError: "Invalid username or password.",
    networkError: "Could not reach API. Make sure Django is running.",
    apiHint: "API: localhost:8000/api/v1",

    online: "API online",
    offline: "API offline",
    today: "Today",

    roleEczaci: "Pharmacist",
    roleKalfa: "Assistant",
    roleAdmin: "Admin",

    dashboard: "Dashboard",
    medicines: "Medicines",
    stockMovements: "Stock Movements",
    prescriptions: "Prescriptions",
    reports: "Reports",
    categories: "Categories",
    users: "Users",
    settings: "Settings",
    logout: "Sign out",

    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    overview: "Pharmacy at a glance",
    totalMedicines: "Total medicines",
    criticalStock: "Critical stock",
    expiringSoon: "Expiring soon",
    expired: "Expired",
    pendingPrescriptions: "Pending Rx",
    recentMovements: "Recent movements",
    upcomingExpirations: "Upcoming expirations",
    viewAll: "View all",
    quickActions: "Quick actions",
    addMedicine: "Add medicine",
    newPrescription: "New prescription",
    stockEntry: "Stock entry",
    stockExit: "Stock exit",

    searchMedicines: "Search: name, barcode…",
    barcode: "Barcode",
    medicineName: "Medicine name",
    category: "Category",
    stockQty: "Stock",
    criticalThreshold: "Critical threshold",
    expiryDate: "Expiry date",
    actions: "Actions",
    inStock: "In stock",
    low: "Low",
    critical: "Critical",
    outOfStock: "Out of stock",
    all: "All",
    addNew: "Add new",
    filter: "Filter",
    eczaciOnly: "Pharmacist only",

    movement: "Movement",
    type: "Type",
    quantity: "Qty",
    date: "Date",
    user: "User",
    note: "Note",
    giris: "Entry",
    cikis: "Exit",
    satis: "Sale",
    newMovement: "New movement",

    patient: "Patient",
    patientTc: "ID Number",
    doctor: "Doctor",
    doctorDiploma: "Diploma No.",
    prescriptionDate: "Rx date",
    prescriptionId: "Rx No.",
    status: "Status",
    bekliyor: "Pending",
    teslim_edildi: "Delivered",
    medicineCount: "Medicines",
    deliverPrescription: "Deliver",
    addPrescriptionMedicine: "Add medicine",
    instruction: "Instructions",
    usedQty: "Used qty",
    recordedBy: "Recorded by",

    stockSummary: "Stock summary",
    criticalStockReport: "Critical stock",
    expiringSoonReport: "Expiring soon",
    expiredReport: "Expired",
    daysFilter: "Days",
    units: "units",
    days: "days",
    pieces: "items",

    categoryName: "Category name",
    categoryDesc: "Description",
  },
};

window.TRANSLATIONS = TRANSLATIONS;
