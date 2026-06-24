import { useState, useMemo } from 'react';

const DOT_COLORS = {
  due: 'var(--blue)',
  filming: 'var(--coral)',
  posting: 'var(--sage)',
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function isoDate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar({ campaigns }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const eventsByDate = useMemo(() => {
    const map = {};
    function addEvent(date, type, campaign) {
      if (!date) return;
      if (!map[date]) map[date] = [];
      map[date].push({ type, campaign });
    }
    campaigns.forEach((c) => {
      addEvent(c.dueDate, 'due', c);
      addEvent(c.filmingDate, 'filming', c);
      addEvent(c.postingDate, 'posting', c);
    });
    return map;
  }, [campaigns]);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

  const upcoming = useMemo(() => {
    return Object.entries(eventsByDate)
      .filter(([date]) => date >= todayIso)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 6);
  }, [eventsByDate, todayIso]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '20px', color: 'var(--navy)' }}>
          {monthLabel}
        </span>
        <div style={{ display: 'flex', gap: '14px' }}>
          <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', fontSize: '16px', color: 'var(--ink-soft)' }}>
            ‹
          </button>
          <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', fontSize: '16px', color: 'var(--ink-soft)' }}>
            ›
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          fontSize: '11px',
          color: 'var(--ink-soft)',
          textAlign: 'center',
          marginBottom: '6px',
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px',
          marginBottom: '20px',
        }}
      >
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateIso = isoDate(year, month, day);
          const events = eventsByDate[dateIso] || [];
          const isToday = dateIso === todayIso;
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                border: isToday ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                background: isToday ? 'var(--blue-pale)' : 'transparent',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: isToday ? 500 : 400,
                color: isToday ? 'var(--navy)' : 'var(--ink-soft)',
                padding: '3px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {day}
              {events.length > 0 && (
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {events.slice(0, 3).map((e, idx) => (
                    <span
                      key={idx}
                      title={`${e.campaign.brand} — ${e.type}`}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: DOT_COLORS[e.type],
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '20px' }}>
        <span><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: DOT_COLORS.due, marginRight: '5px' }} />Due date</span>
        <span><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: DOT_COLORS.filming, marginRight: '5px' }} />Filming</span>
        <span><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: DOT_COLORS.posting, marginRight: '5px' }} />Posting</span>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '14px 16px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '10px' }}>Coming up</p>
        {upcoming.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Nothing scheduled.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcoming.flatMap(([date, events]) =>
              events.map((e, idx) => (
                <div key={`${date}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: DOT_COLORS[e.type], flexShrink: 0 }} />
                  <span>
                    {e.campaign.brand} — {e.type}{' '}
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
