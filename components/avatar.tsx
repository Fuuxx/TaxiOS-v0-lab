type AvatarStackProps = {
  initials: string[];
  extraCount?: number;
  showAdd?: boolean;
};

export function AvatarStack({ initials, extraCount, showAdd = false }: AvatarStackProps) {
  return (
    <div className="avatar-stack" aria-label={`${initials.length + (extraCount ?? 0)} Passagiere`}>
      {initials.map((initial) => (
        <span className="avatar" key={initial}>
          {initial}
        </span>
      ))}
      {typeof extraCount === "number" && extraCount > 0 ? <span className="avatar add">+{extraCount}</span> : null}
      {showAdd ? <span className="avatar add">+</span> : null}
    </div>
  );
}
