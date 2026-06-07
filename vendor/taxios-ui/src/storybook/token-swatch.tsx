import type { CSSProperties } from "react";

import type { TokenMetadata } from "../tokens/catalog";

type TokenSwatchProps = {
  token: TokenMetadata;
};

function previewStyle(token: TokenMetadata): CSSProperties {
  if (token.kind === "shadow") {
    return {
      background: "var(--taxis-color-surface)",
      boxShadow: token.value,
    };
  }

  if (token.kind === "radius") {
    return {
      background: "var(--taxis-color-surface)",
      borderRadius: token.value,
    };
  }

  if (token.kind === "motion") {
    return {
      background: "var(--taxis-workspace-accent)",
      transitionDuration: "var(--taxis-motion-duration-short)",
      transitionTimingFunction: token.value,
    };
  }

  if (token.kind === "size") {
    return {
      height: token.value,
      width: token.value,
    };
  }

  return {
    background: token.value,
  };
}

export function TokenSwatch({ token }: TokenSwatchProps) {
  return (
    <article className="grid gap-3 rounded-lg border border-[var(--taxis-color-border-soft)] bg-[var(--taxis-color-surface)] p-4 shadow-[var(--taxis-shadow-soft)]">
      <div
        aria-hidden="true"
        className="h-14 rounded-md border border-[var(--taxis-color-border-soft)]"
        style={previewStyle(token)}
      />
      <div className="grid gap-1">
        <h3 className="font-semibold text-[var(--taxis-color-charcoal-950)] text-sm">
          {token.name}
        </h3>
        <code className="break-all rounded-md bg-[var(--taxis-color-surface-muted)] px-2 py-1 font-medium text-[var(--taxis-color-muted)] text-xs">
          {token.variable}
        </code>
        <p className="text-[var(--taxis-color-muted)] text-xs leading-relaxed">
          {token.description}
        </p>
      </div>
    </article>
  );
}
