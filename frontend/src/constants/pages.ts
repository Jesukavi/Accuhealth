// All accessible pages in the application
// key = route path, label = human-readable name, group = sidebar section

export interface PageDefinition {
  key: string;
  label: string;
  group: string;
}

export const ALL_PAGES: PageDefinition[] = [
  // Core
  { key: '/dashboard', label: 'Dashboard', group: 'Core' },
  { key: '/masters', label: 'Masters', group: 'Core' },
  { key: '/user-management', label: 'User Management', group: 'Core' },

  // Notification – Malaria
  { key: '/malaria-listing', label: 'Malaria – Listing', group: 'Notification' },
  { key: '/malaria-entry', label: 'Malaria – Notification Entry', group: 'Notification' },

  // Notification – TB
  { key: '/tb-notification', label: 'TB – Notification', group: 'Notification' },
  { key: '/tb-screening', label: 'TB – Screening', group: 'Notification' },
  { key: '/tb-listing', label: 'TB – Listing', group: 'Notification' },

  // Notification – Fever & Rash
  { key: '/fever-rash-entry', label: 'Fever & Rash – Entry', group: 'Notification' },
  { key: '/fever-rash-notifications', label: 'Fever & Rash – Listing', group: 'Notification' },

  // Notification – ARI
  { key: '/ari-notification', label: 'ARI – Notification', group: 'Notification' },
  { key: '/ari-listing', label: 'ARI – Listing', group: 'Notification' },

  // Notification – Polio
  { key: '/polio-case-listing', label: 'Polio – Case Listing', group: 'Notification' },
  { key: '/polio-investigation', label: 'Polio – Investigation', group: 'Notification' },

  // Notification – Hemorrhagic
  { key: '/hemorrhagic-diseases', label: 'Hemorrhagic – Entry', group: 'Notification' },
  { key: '/hemorrhagic-notification-listing', label: 'Hemorrhagic – Listing', group: 'Notification' },

  // Notification – Viral Hepatitis
  { key: '/hav-listing', label: 'HAV – Listing', group: 'Notification' },
  { key: '/hbv-listing', label: 'HBV – Listing', group: 'Notification' },
  { key: '/hcv-listing', label: 'HCV – Listing', group: 'Notification' },
  { key: '/hev-listing', label: 'HEV – Listing', group: 'Notification' },

  // Vaccination
  { key: '/vaccin-report', label: 'Vaccination – Reporting Form', group: 'Vaccination' },
  { key: '/vaccination-listing', label: 'Vaccination – Listing Search', group: 'Vaccination' },

  // Reporting
  { key: '/vaccination-report', label: 'Vaccination Report', group: 'Reporting' },
  { key: '/malaria-report', label: 'Malaria Report', group: 'Reporting' },
];

export const PAGE_GROUPS = [...new Set(ALL_PAGES.map((p) => p.group))];

export const getPagesByGroup = (group: string) =>
  ALL_PAGES.filter((p) => p.group === group);
