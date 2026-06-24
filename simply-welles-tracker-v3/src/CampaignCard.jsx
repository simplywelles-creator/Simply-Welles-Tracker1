import { useState, useRef, useEffect } from 'react';
import { STATUS_COLORS, STATUSES } from './constants';

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMoney(n) {
  if (n === '' || n === null || n === undefined) return '—';
  return `$${Number(n).toLocaleString()}`;
}

export default function CampaignCard({ campaign, onEdit, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const colors = STATUS_COLORS[campaign.status] || STATUS_COLORS['In Talks'];
  const due = formatDate(campaign.dueDate);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function pickStatus(s) {
    onStatusChange(campaign.id, s);
    setOpen(false);
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderLeft: `4px solid ${colors.bar}`,
        borderRadius: '10px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '180px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '19px', lineHeight: 1.25, marginBottom: '2px' }}>
            {campaign.brand || 'Untitled campaign'}
          </h3>
          {campaign.contact && (
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{campaign.contact}</p>
          )}
        </div>
        <button
          onClick={() => onEdit(campaign)}
          aria-label="Edit campaign"
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--ink-soft)',
            fontSize: '13px',
            flexShrink: 0,
            padding: '2px 4px',
          }}
        >
          Edit
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        <div ref={wrapRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: colors.bg,
              color: colors.fg,
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '100px',
              border: 'none',
            }}
          >
            {campaign.status}
            <span style={{ fontSize: '9px' }}>▾</span>
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: 0,
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(15,42,71,0.12)',
                width: '210px',
                zIndex: 20,
                overflow: 'hidden',
              }}
            >
              {STATUSES.map((s) => {
                const c = STATUS_COLORS[s];
                const active = s === campaign.status;
                return (
                  <button
                    key={s}
                    onClick={() => pickStatus(s)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '12px',
                      border: 'none',
                      background: active ? c.bg : 'transparent',
                      color: active ? c.fg : 'var(--ink-soft)',
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {campaign.contracted && (
          <span
            style={{
              background: 'var(--sand-light)',
              color: 'var(--ink-soft)',
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '100px',
            }}
          >
            Contracted
          </span>
        )}
        <span
          style={{
            background: 'var(--sand-light)',
            color: 'var(--ink-soft)',
            fontSize: '12px',
            padding: '3px 10px',
            borderRadius: '100px',
          }}
        >
          {campaign.contentType}
        </span>
      </div>

      {campaign.notes && (
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          {campaign.notes}
        </p>
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--sand-light)',
          paddingTop: '10px',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', color: 'var(--ink-soft)' }}>
          <span style={{ fontWeight: 500, color: 'var(--navy)' }}>{formatMoney(campaign.amount)}</span>
          {due && <span>Due {due}</span>}
        </div>
        {campaign.briefLink ? (
          <a
            href={campaign.briefLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            Brief ↗
          </a>
        ) : (
          <span style={{ fontSize: '13px', color: 'var(--line)' }}>No brief</span>
        )}
      </div>
    </div>
  );
}
