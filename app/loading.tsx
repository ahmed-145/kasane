export default function Loading() {
  return (
    <div style={{ padding: '80px 24px' }}>
      <div className="max-w-6xl mx-auto">
        {/* Skeleton grid */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: '32px' }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-sm overflow-hidden"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                animation: `pulse 1.6s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ height: '88px', background: 'var(--border)' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ height: '18px', width: '55%', background: 'var(--border)', borderRadius: '2px', marginBottom: '8px' }} />
                <div style={{ height: '12px', width: '75%', background: 'var(--border)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
