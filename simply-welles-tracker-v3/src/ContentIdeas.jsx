import { useState } from 'react';

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

function IdeaForm({ campaigns, onSave, onClose }) {
  const [text, setText] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [tags, setTags] = useState('');

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
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '22px' }}>New content idea</h2>

        <div>
          <label style={labelStyle}>Idea</label>
          <textarea
            style={{ ...fieldStyle, minHeight: '70px', resize: 'vertical' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's the idea?"
          />
        </div>

        <div>
          <label style={labelStyle}>Linked brand (optional)</label>
          <select style={fieldStyle} value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
            <option value="">General — not tied to a brand</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tag</label>
          <input style={fieldStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. Lifestyle, Beauty" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
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
            onClick={() => {
              if (!text.trim()) return;
              onSave({ text, campaignId, tags });
            }}
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
  );
}

function IdeaCard({ idea, accentColor, onDelete }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderLeft: accentColor ? `4px solid ${accentColor}` : '1px solid var(--line)',
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.4 }}>{idea.text}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {idea.tags && (
            <span
              style={{
                background: 'var(--sand-light)',
                color: 'var(--ink-soft)',
                fontSize: '11px',
                padding: '3px 9px',
                borderRadius: '100px',
              }}
            >
              {idea.tags}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(idea.id)}
          style={{ background: 'transparent', border: 'none', color: 'var(--ink-soft)', fontSize: '12px' }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function ContentIdeas({ ideas, campaigns, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);

  const general = ideas.filter((i) => !i.campaignId);
  const byBrand = campaigns
    .map((c) => ({ campaign: c, ideas: ideas.filter((i) => i.campaignId === c.id) }))
    .filter((g) => g.ideas.length > 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '20px', color: 'var(--navy)' }}>
          Content ideas
        </span>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          + New idea
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
        General
      </p>
      {general.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '22px' }}>No general ideas yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          {general.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onDelete={onDelete} />
          ))}
        </div>
      )}

      <p style={{ fontSize: '11px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
        By brand
      </p>
      {byBrand.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>No brand-linked ideas yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {byBrand.map(({ campaign, ideas: brandIdeas }) => (
            <div key={campaign.id}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--navy)', marginBottom: '8px' }}>
                {campaign.brand}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brandIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} accentColor="var(--blue)" onDelete={onDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <IdeaForm
          campaigns={campaigns}
          onClose={() => setShowForm(false)}
          onSave={(idea) => {
            onAdd(idea);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
