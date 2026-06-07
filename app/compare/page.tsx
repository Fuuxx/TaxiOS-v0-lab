export default function ComparePage() {
  return (
    <main className="compare-page">
      <header className="compare-header">
        <p className="eyebrow">TaxiOS v0 Lab</p>
        <h1 className="hero-title">Current Main vs Lab Reconstruction</h1>
        <p className="hero-copy">
          Left is the captured TaxiOS.v2 main runtime (localhost:3000/company-dashboard). Right is the current static
          lab render. If these differ, the lab is wrong. The reference is a pinned screenshot because the authenticated
          main runtime is not reachable from inside the lab environment.
        </p>
      </header>

      <section className="compare-grid" aria-label="Desktop comparison">
        <article className="compare-panel">
          <h2>Reference: captured main /company-dashboard</h2>
          <img
            alt="Captured TaxiOS.v2 main company dashboard running on localhost:3000"
            src="/reference/company-dashboard-main-localhost.png"
          />
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
