import { useState, useEffect, useMemo } from 'react';
import { STATUSES, seedCampaigns, seedIdeas, emptyCampaign, emptyIdea } from './constants';
import CampaignCard from './CampaignCard';
import CampaignEditor from './CampaignEditor';
import Calendar from './Calendar';
import ContentIdeas from './ContentIdeas';

const TABS = ['Campaigns', 'Calendar', 'Content Ideas', 'Invoices', 'Contacts'];
const CAMPAIGNS_KEY = 'simplywelles_campaigns_v2';
const IDEAS_KEY = 'simplywelles_ideas_v2';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fallback;
}

function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return date >= startOfWeek && date < endOfWeek;
}

export default function App() {
  const [tab, setTab] = useState('Campaigns');
  const [campaigns, setCampaigns] = useState(() => loadFromStorage(CAMPAIGNS_KEY, seedCampaigns));
  const [ideas, setIdeas] = useState(() => loadFromStorage(IDEAS_KEY, seedIdeas));
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  }, [ideas]);

  const stats = useMemo(() => {
    const active = campaigns.filter((c) => !['Paid', 'Complete'].includes(c.status)).length;
    const outstanding = campaigns
      .filter((c) => c.status === 'Invoice Sent')
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const paidTotal = campaigns
      .filter((c) => ['Paid', 'Complete'].includes(c.status))
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const dueThisWeek = campaigns.filter((c) => isThisWeek(c.dueDate)).length;
    return { active, outstanding, paidTotal, dueThisWeek, total: campaigns.length };
  }, [campaigns]);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (search && !`${c.brand} ${c.contact}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, statusFilter, search]);

  function handleSave(form) {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === form.id);
      if (exists) return prev.map((c) => (c.id === form.id ? form : c));
      return [...prev, form];
    });
    setEditing(null);
  }

  function handleDelete(id) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setEditing(null);
  }

  function handleStatusChange(id, newStatus) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  }

  function handleAddIdea(partial) {
    setIdeas((prev) => [...prev, { ...emptyIdea(), ...partial }]);
  }

  function handleDeleteIdea(id) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 80px' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Simply Welles Studio</h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Campaign tracker</p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: 'Active campaigns', value: stats.active },
          { label: 'Outstanding invoices', value: `$${stats.outstanding.toLocaleString()}` },
          { label: 'Paid this period', value: `$${stats.paidTotal.toLocaleString()}` },
          { label: 'Due this week', value: stats.dueThisWeek },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--sand-light)',
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '4px' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 600, color: 'var(--navy)', fontFamily: 'Cormorant Garamond, serif' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid var(--line)',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: tab === t ? 'var(--navy)' : 'var(--ink-soft)',
              borderBottom: tab === t ? '2px solid var(--navy)' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Campaigns' && (
        <>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <input
              placeholder="Search brand or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: '1 1 220px',
                padding: '9px 12px',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                background: '#fff',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                background: '#fff',
              }}
            >
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setEditing(emptyCampaign())}
              style={{
                background: 'var(--navy)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              + New campaign
            </button>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: 'var(--ink-soft)', padding: '40px 0', textAlign: 'center' }}>
              No campaigns match yet.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {filtered.map((c) => (
                <CampaignCard key={c.id} campaign={c} onEdit={setEditing} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'Calendar' && <Calendar campaigns={campaigns} />}

      {tab === 'Content Ideas' && (
        <ContentIdeas ideas={ideas} campaigns={campaigns} onAdd={handleAddIdea} onDelete={handleDeleteIdea} />
      )}

      {(tab === 'Invoices' || tab === 'Contacts') && (
        <div
          style={{
            padding: '60px 0',
            textAlign: 'center',
            color: 'var(--ink-soft)',
          }}
        >
          <p style={{ fontSize: '15px' }}>{tab} view — carried over from your existing tracker structure.</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Let me know if you want this built out next.</p>
        </div>
      )}

      {editing && (
        <CampaignEditor
          campaign={editing}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
