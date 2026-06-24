export const STATUSES = [
  'In Talks',
  'In Progress',
  'Waiting to be Delivered',
  'Awaiting Feedback',
  'Deliverables Sent',
  'Invoice Sent',
  'Paid',
  'Complete',
];

export const STATUS_COLORS = {
  'In Talks': { bg: 'var(--sand-light)', fg: 'var(--ink-soft)', bar: 'var(--line)' },
  'In Progress': { bg: 'var(--blue-pale)', fg: 'var(--navy-soft)', bar: 'var(--blue)' },
  'Waiting to be Delivered': { bg: 'var(--blue-pale)', fg: 'var(--navy-soft)', bar: 'var(--blue)' },
  'Awaiting Feedback': { bg: '#FBF1DE', fg: '#8A6A23', bar: '#D9A93B' },
  'Deliverables Sent': { bg: '#FBF1DE', fg: '#8A6A23', bar: '#D9A93B' },
  'Invoice Sent': { bg: 'var(--coral-pale)', fg: '#92492A', bar: 'var(--coral)' },
  'Paid': { bg: 'var(--sage-pale)', fg: '#3E5A3B', bar: 'var(--sage)' },
  'Complete': { bg: 'var(--sage-pale)', fg: '#3E5A3B', bar: 'var(--sage)' },
};

export const CONTENT_TYPES = ['Dark Ads', 'Whitelisted', 'Spark Ads'];

export const emptyCampaign = () => ({
  id: crypto.randomUUID(),
  brand: '',
  contact: '',
  status: 'In Talks',
  contracted: false,
  amount: '',
  dueDate: '',
  filmingDate: '',
  postingDate: '',
  briefLink: '',
  contentType: 'Dark Ads',
  notes: '',
  createdAt: new Date().toISOString(),
});

export const emptyIdea = () => ({
  id: crypto.randomUUID(),
  text: '',
  campaignId: '', // '' = general idea, otherwise tied to a campaign id
  tags: '',
  createdAt: new Date().toISOString(),
});

export const seedIdeas = [
  {
    id: crypto.randomUUID(),
    text: 'Dock-and-coffee morning routine, slow content with the dog',
    campaignId: '',
    tags: 'Lifestyle',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    text: 'Beach bag packing list, talking-head with product placements',
    campaignId: '',
    tags: 'Beauty',
    createdAt: new Date().toISOString(),
  },
];

export const seedCampaigns = [
  {
    id: crypto.randomUUID(),
    brand: 'Kitsch',
    contact: 'Insense',
    status: 'Paid',
    contracted: true,
    amount: 300,
    dueDate: '2026-06-10',
    filmingDate: '2026-06-08',
    postingDate: '2026-06-09',
    briefLink: '',
    contentType: 'Whitelisted',
    notes: 'Smoothing Air Dry Cream, coastal/humidity angle, 2 talking-head videos.',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    brand: 'CRWD — PUL Aligner Removal Tool',
    contact: 'Walmart campaign',
    status: 'In Progress',
    contracted: false,
    amount: 120,
    dueDate: '2026-06-28',
    filmingDate: '2026-06-25',
    postingDate: '',
    briefLink: '',
    contentType: 'Dark Ads',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    brand: 'Brkaway / Stitch Fix',
    contact: 'Gina',
    status: 'In Talks',
    contracted: false,
    amount: '',
    dueDate: '',
    filmingDate: '',
    postingDate: '',
    briefLink: '',
    contentType: 'Dark Ads',
    notes: 'Pitching postpartum wellness campaign.',
    createdAt: new Date().toISOString(),
  },
];
