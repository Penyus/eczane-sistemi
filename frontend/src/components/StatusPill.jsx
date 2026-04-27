const toneMap = {
  GIRIS: 'success',
  CIKIS: 'danger',
  Bekliyor: 'warning',
  Hazırlanıyor: 'info',
  Tamamlandı: 'success',
};

const labelMap = {
  GIRIS: 'Giriş',
  CIKIS: 'Çıkış',
};

export default function StatusPill({ value }) {
  return (
    <span className={`status-pill status-${toneMap[value] || 'neutral'}`}>
      {labelMap[value] || value}
    </span>
  );
}
