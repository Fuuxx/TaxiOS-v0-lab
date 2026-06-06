export default function ComparePage() {
  return (
    <main className="compare-page">
      <header className="compare-header">
        <p className="eyebrow">TaxiOS v0 Lab</p>
        <h1 className="hero-title">Storybook Reference vs Lab Reconstruction</h1>
        <p className="hero-copy">
          Left is the real Storybook screenshot. Right is the current static lab render. If these differ, the lab is wrong.
        </p>
      </header>

      <section className="compare-grid" aria-label="Desktop comparison">
        <article className="compare-panel">
          <h2>Reference: Storybook desktop</h2>
          <img alt="Storybook company dashboard desktop reference" src="/reference/company-dashboard-screen.png" />
        </article>
        <article className="compare-panel">
          <h2>Actual: lab desktop render</h2>
          <iframe title="Current lab dashboard render" src="/actual" />
        </article>
      </section>

      <section className="compare-grid compare-grid-mobile" aria-label="Mobile comparison">
        <article className="compare-panel">
          <h2>Reference: Storybook mobile</h2>
          <img alt="Storybook company dashboard mobile reference" src="/reference/company-dashboard-screen-mobile.png" />
        </article>
        <article className="compare-panel">
          <h2>Actual: lab mobile render</h2>
          <iframe title="Current lab dashboard mobile render" src="/actual" />
        </article>
      </section>
    </main>
  );
}
