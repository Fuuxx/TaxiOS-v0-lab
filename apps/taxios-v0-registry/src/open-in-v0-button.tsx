type OpenInV0ButtonProps = {
  itemUrl: string;
  title: string;
};

export function OpenInV0Button({ itemUrl, title }: OpenInV0ButtonProps) {
  const openUrl = `https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`;

  return (
    <a
      aria-label={`Open ${title} in v0`}
      className="inline-flex h-9 items-center justify-center rounded-lg bg-button px-3 text-button-foreground text-sm font-semibold shadow-sm transition hover:bg-button-hover focus-visible:border-button-focus focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={openUrl}
      rel="noreferrer"
      target="_blank"
    >
      Open in v0
    </a>
  );
}
