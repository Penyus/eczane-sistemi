// icons.jsx — Sade çizgisel ikonlar (1.5px stroke, currentColor)
// Hekim — eczane yönetim sistemi

const Icon = ({ d, size = 18, stroke = 1.5, fill, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"}
       stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
       strokeLinejoin="round" {...rest}>
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const IconLogo = ({ size = 28 }) => (
  // Stylized "H" with mortar-and-pestle suggestion — apothecary mark
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />
    <path d="M11 9.5v13M21 9.5v13M11 16h10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="6" r="1.6" fill="white" />
  </svg>
);

const IconDashboard = (p) => <Icon {...p} d={<>
  <rect x="3" y="3" width="7" height="9" rx="1.5" />
  <rect x="14" y="3" width="7" height="5" rx="1.5" />
  <rect x="14" y="12" width="7" height="9" rx="1.5" />
  <rect x="3" y="16" width="7" height="5" rx="1.5" />
</>} />;

const IconPill = (p) => <Icon {...p} d={<>
  <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-25 12 12)" />
  <line x1="9.5" y1="6.2" x2="14.5" y2="17.8" />
</>} />;

const IconBoxes = (p) => <Icon {...p} d={<>
  <path d="M3 7l9-4 9 4-9 4-9-4z" />
  <path d="M3 7v10l9 4 9-4V7" />
  <path d="M12 11v10" />
</>} />;

const IconRx = (p) => <Icon {...p} d={<>
  <path d="M6 4h6a3 3 0 0 1 0 6H6V4z" />
  <line x1="6" y1="10" x2="6" y2="20" />
  <line x1="10" y1="10" x2="14" y2="14" />
  <line x1="20" y1="14" x2="14" y2="20" />
  <line x1="14" y1="14" x2="20" y2="20" />
</>} />;

const IconChart = (p) => <Icon {...p} d={<>
  <line x1="3" y1="20" x2="21" y2="20" />
  <rect x="6" y="11" width="3" height="9" />
  <rect x="11" y="6" width="3" height="14" />
  <rect x="16" y="14" width="3" height="6" />
</>} />;

const IconTag = (p) => <Icon {...p} d={<>
  <path d="M3 3h7l11 11-7 7L3 10V3z" />
  <circle cx="7" cy="7" r="1.3" fill="currentColor" stroke="none" />
</>} />;

const IconSettings = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="3" />
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
</>} />;

const IconLogout = (p) => <Icon {...p} d={<>
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" y1="12" x2="9" y2="12" />
</>} />;

const IconSearch = (p) => <Icon {...p} d={<>
  <circle cx="11" cy="11" r="7" />
  <line x1="16.2" y1="16.2" x2="21" y2="21" />
</>} />;

const IconBell = (p) => <Icon {...p} d={<>
  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
</>} />;

const IconPlus = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const IconArrowRight = (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />;
const IconArrowDown = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
const IconArrowUp = (p) => <Icon {...p} d="M18 15l-6-6-6 6" />;
const IconCheck = (p) => <Icon {...p} d="M4 12l5 5L20 6" />;
const IconX = (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />;
const IconClock = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="9" />
  <polyline points="12 7 12 12 15 14" />
</>} />;
const IconAlert = (p) => <Icon {...p} d={<>
  <path d="M12 2L2 21h20L12 2z" />
  <line x1="12" y1="9" x2="12" y2="14" />
  <circle cx="12" cy="17.5" r=".7" fill="currentColor" stroke="none" />
</>} />;
const IconFilter = (p) => <Icon {...p} d="M3 5h18l-7 9v6l-4-2v-4L3 5z" />;
const IconExport = (p) => <Icon {...p} d={<>
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  <polyline points="7 10 12 15 17 10" />
  <line x1="12" y1="15" x2="12" y2="3" />
</>} />;
const IconGlobe = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="9" />
  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
</>} />;
const IconEye = (p) => <Icon {...p} d={<>
  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
  <circle cx="12" cy="12" r="3" />
</>} />;
const IconEyeOff = (p) => <Icon {...p} d={<>
  <path d="M17.94 17.94A10 10 0 0 1 12 19c-6 0-10-7-10-7a18 18 0 0 1 4.6-5.4M9.9 4.24A10 10 0 0 1 12 4c6 0 10 7 10 7a18 18 0 0 1-2.06 3.04M14.12 14.12A3 3 0 1 1 9.88 9.88" />
  <line x1="2" y1="2" x2="22" y2="22" />
</>} />;

const IconArrowDownIn = (p) => <Icon {...p} d="M12 4v14M5 13l7 7 7-7" />; // entry
const IconArrowUpOut = (p) => <Icon {...p} d="M12 20V6M5 11l7-7 7 7" />; // exit
const IconAdjust = (p) => <Icon {...p} d="M3 6h18M7 12h10M10 18h4" />;
const IconReturn = (p) => <Icon {...p} d="M3 7v6h6M3 13a9 9 0 1 0 3-7" />;

const IconCalendar = (p) => <Icon {...p} d={<>
  <rect x="3" y="5" width="18" height="16" rx="2" />
  <line x1="3" y1="10" x2="21" y2="10" />
  <line x1="8" y1="3" x2="8" y2="7" />
  <line x1="16" y1="3" x2="16" y2="7" />
</>} />;

const IconUser = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="8" r="4" />
  <path d="M4 21a8 8 0 0 1 16 0" />
</>} />;

const IconLock = (p) => <Icon {...p} d={<>
  <rect x="4" y="11" width="16" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 1 1 8 0v4" />
</>} />;

const IconShield = (p) => <Icon {...p} d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />;

const IconHeart = (p) => <Icon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;

Object.assign(window, {
  Icon, IconLogo,
  IconDashboard, IconPill, IconBoxes, IconRx, IconChart, IconTag, IconSettings, IconLogout,
  IconSearch, IconBell, IconPlus, IconArrowRight, IconArrowDown, IconArrowUp,
  IconCheck, IconX, IconClock, IconAlert, IconFilter, IconExport, IconGlobe,
  IconEye, IconEyeOff, IconArrowDownIn, IconArrowUpOut, IconAdjust, IconReturn,
  IconCalendar, IconUser, IconLock, IconShield, IconHeart,
});
