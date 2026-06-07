export default function ComparePage() {
  return (
    <main className="compare-page">
      <header className="compare-header">
        <p className="eyebrow">TaxiOS v0 Lab</p>
        <h1 className="hero-title">Current Main vs Lab Reconstruction</h1>
        <p className="hero-copy">
          Left is the authenticated TaxiOS.v2 main runtime on port 3000. Right is the current static lab render.
          If these differ, the lab is wrong.
        </p>
      </header>

      <section className="compare-grid" aria-label="Desktop comparison">
        <article className="compare-panel">
          <h2>Reference: current main /company-dashboard</h2>
          <iframe title="Current TaxiOS main dashboard" src="http://localhost:3000/company-dashboard" />
        </article>
        <article className="compare-panel">
          <h2>Actual: lab desktop render</h2>
          <iframe title="Current lab dashboard render" src="/actual" />
        </article>
      </section>

      <section className="compare-grid compare-grid-mobile" aria-label="Mobile comparison">
        <article className="compare-panel">
          <h2>Reference: historical Storybook mobile</h2>
          <img alt="Historical Storybook company dashboard mobile reference" src="/reference/company-dashboard-screen-mobile.png" />
        </article>
        <article className="compare-panel">
          <h2>Actual: lab mobile render</h2>
          <iframe title="Current lab dashboard mobile render" src="/actual" />
        </article>
      </section>

      <section className="compare-grid" aria-label="New booking overlay comparison">
        <article className="compare-panel">
          <h2>Reference: Storybook new booking overlay</h2>
          <img alt="Storybook new booking overlay reference" src="/reference/new-booking-overlay.png" />
        </article>
        <article className="compare-panel">
          <h2>Actual: lab new booking overlay</h2>
          <iframe title="Current lab new booking overlay render" src="/new-booking" />
        </article>
      </section>
    </main>
  );
}
