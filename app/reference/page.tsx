import { referenceScreenshots } from "../../data/company-dashboard-data";

export default function ReferencePage() {
  return (
    <main className="reference-page">
      <p className="eyebrow">TaxiOS v0 Lab</p>
      <h1 className="hero-title">Historical Reference Screenshots</h1>
      <p className="hero-copy">
        These screenshots are kept as historical Storybook references. For the current mirror task, the visual
        source of truth is the authenticated TaxiOS.v2 main runtime at <code>http://localhost:3000/company-dashboard</code>.
      </p>

      <div className="reference-grid">
        {referenceScreenshots.map((name) => (
          <figure className="surface reference-shot" key={name}>
            <img alt={name} src={`/reference/${name}`} />
            <figcaption className="reference-caption">{name}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
