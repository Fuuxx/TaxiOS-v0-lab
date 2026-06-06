import { referenceScreenshots } from "../../data/company-dashboard-data";

export default function ReferencePage() {
  return (
    <main className="reference-page">
      <p className="eyebrow">TaxiOS v0 Lab</p>
      <h1 className="hero-title">Reference Screenshots</h1>
      <p className="hero-copy">
        v0 must compare the runnable baseline against these current Storybook screenshots before proposing any fixes.
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
