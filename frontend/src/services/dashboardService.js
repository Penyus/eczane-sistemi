import { apiGet } from './api';

function normalizeList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

async function getList(path) {
  return normalizeList(await apiGet(path));
}

function createEmptyDashboard() {
  return {
    stats: {
      totalMedicines: 0,
      totalUnits: 0,
      criticalStock: 0,
      expiringSoon: 0,
      waitingPrescriptions: 0,
    },
    medicines: [],
    criticalStock: [],
    expiringSoon: [],
    prescriptions: [],
    movements: [],
  };
}

export async function getDashboardData() {
  let medicines = [];
  let criticalFromApi = [];
  let expiringFromApi = [];

  try {
    [medicines, criticalFromApi, expiringFromApi] = await Promise.all([
      getList('/stock/ilaclar/'),
      getList('/stock/ilaclar/kritik_stok/'),
      getList('/stock/ilaclar/miadi_yaklasanlar/'),
    ]);
  } catch {
    return createEmptyDashboard();
  }

  const totalUnits = medicines.reduce(
    (total, medicine) => total + Number(medicine.stok_miktari || 0),
    0,
  );

  return {
    stats: {
      totalMedicines: medicines.length,
      totalUnits,
      criticalStock: criticalFromApi.length,
      expiringSoon: expiringFromApi.length,
      waitingPrescriptions: 0,
    },
    medicines,
    criticalStock: criticalFromApi,
    expiringSoon: expiringFromApi,
    prescriptions: [],
    movements: [],
  };
}
