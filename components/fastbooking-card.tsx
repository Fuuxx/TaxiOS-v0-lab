import { ArrowRight, Users } from "lucide-react";

import type { FastRoute } from "../data/company-dashboard-data";
import { AvatarStack } from "./avatar";
import { Button } from "./button";
import { RouteLine } from "./route-line";

type FastbookingCardProps = {
  route: FastRoute;
};

export function FastbookingCard({ route }: FastbookingCardProps) {
  return (
    <article className="route-card">
      <div className="route-card-body">
        <div className="route-meta">
          <span className="route-type">Schnellbuchung</span>
          <span className="route-count">
            <Users size={13} aria-hidden="true" />
            {route.passengerCount}
          </span>
        </div>
        <h3 className="route-title">{route.title}</h3>
        <RouteLine from={route.from} to={route.to} />
      </div>
      <div className="route-card-footer">
        <AvatarStack initials={route.passengerInitials} showAdd />
        <Button variant="primary">
          Buchen
          <ArrowRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
