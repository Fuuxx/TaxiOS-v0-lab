type RouteLineProps = {
  from: string;
  to: string;
};

export function RouteLine({ from, to }: RouteLineProps) {
  return (
    <div className="route-line">
      <div className="route-rail" aria-hidden="true">
        <span className="route-dot" />
        <span className="route-dot to" />
      </div>
      <div className="route-points">
        <div>
          <div className="field-label">Von</div>
          <div className="route-address">{from}</div>
        </div>
        <div>
          <div className="field-label">Nach</div>
          <div className="route-address">{to}</div>
        </div>
      </div>
    </div>
  );
}
