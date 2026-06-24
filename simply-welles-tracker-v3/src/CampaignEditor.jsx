import { useState, useEffect } from 'react';
import { STATUSES, CONTENT_TYPES } from './constants';

const fieldStyle = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid var(--line)',
  borderRadius: '7px',
  background: 'var(--paper)',
  color: 'var(--ink)',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--ink-soft)',
  marginBottom: '5px',
  display: 'block',
};

export default function CampaignEditor({ campaign, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(campaign);

  useEffect(() => setForm(campaign), [campaign]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 42, 71, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '26px 28px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '88vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '22px' }}>
          {campaign.brand ? 'Edit campaign' : 'New campaign'}
        </h2>

        <div>
          <label style={labelStyle}>Brand</label>
          <input style={fieldStyle} value={form.brand} onChange={set('brand')} placeholder="e.g. Kitsch" />
        </div>

        <div>
          <label style={labelStyle}>Contact / agency</label>
          <input style={fieldStyle} value={form.contact} onChange={set('contact')} placeholder="e.g. Insense" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={fieldStyle} value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Content type</label>
            <select style={fieldStyle} value={form.contentType} onChange={set('contentType')}>
              {CONTENT_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Amount ($)</label>
            <input style={fieldStyle} type="number" value={form.amount} onChange={set('amount')} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Due date</label>
            <input style={fieldStyle} type="date" value={form.dueDate} onChange={set('dueDate')} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Filming date</label>
            <input style={fieldStyle} type="date" value={form.filmingDate} onChange={set('filmingDate')} />
          </div>
          <div>
            <label style={labelStyle}>Posting date</label>
            <input style={fieldStyle} type="date" value={form.postingDate} onChange={set('postingDate')} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Brief link</label>
          <input
            style={fieldStyle}
            type="url"
            value={form.briefLink}
            onChange={set('briefLink')}
            placeholder="https://docs.google.com/..."
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink-soft)' }}>
          <input type="checkbox" checked={form.contracted} onChange={set('contracted')} />
          Contracted
        </label>

        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...fieldStyle, minHeight: '70px', resize: 'vertical' }}
            value={form.notes}
            onChange={set('notes')}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {campaign.brand ? (
            <button
              onClick={() => onDelete(campaign.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--coral)', fontSize: '13px' }}
            >
              Delete campaign
            </button>
          ) : <span />}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: '7px',
                padding: '8px 16px',
                fontSize: '13px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              style={{
                background: 'var(--navy)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
