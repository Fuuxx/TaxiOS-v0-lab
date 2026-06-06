import type { FeedItem } from "../data/company-dashboard-data";

type LiveFeedProps = {
  items: FeedItem[];
};

function dotColor(tone: FeedItem["tone"]) {
  if (tone === "accent") return "var(--taxis-accent)";
  return `var(--status-${tone}-dot)`;
}

export function LiveFeed({ items }: LiveFeedProps) {
  return (
    <div className="live-feed">
      <div className="surface-header">
        <div>
          <h2 className="section-title">Live Feed</h2>
        </div>
        <span className="status-chip status-strong">Live</span>
      </div>
      <div className="live-meta">
        <span>3 Ereignisse heute</span>
        <span className="live-pulse">Aktualisiert gerade</span>
      </div>
      <div className="live-list">
        {items.map((item) => (
          <article className="feed-item" key={item.id}>
            <span className="feed-dot" style={{ background: dotColor(item.tone) }} />
            <div>
              <h3 className="feed-title">{item.title}</h3>
              <div className="feed-body">{item.body}</div>
            </div>
            <time className="feed-time data">{item.time}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
