import type { Ride } from "../data/company-dashboard-data";
import { AvatarStack } from "./avatar";
import { StatusChip } from "./status-chip";

type RideTableProps = {
  rides: Ride[];
};

export function RideTable({ rides }: RideTableProps) {
  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th className="table-head">Zeit</th>
            <th className="table-head">Passagiere</th>
            <th className="table-head">Route</th>
            <th className="table-head">ID</th>
            <th className="table-head">Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>
                <div className="data strong">{ride.time}</div>
                <div className="table-day">{ride.day}</div>
              </td>
              <td>
                <AvatarStack initials={ride.passengers} extraCount={ride.extraPassengers} />
              </td>
              <td>
                <div className="route-summary">
                  <span className="from">{ride.from}</span>
                  <span className="to strong">{ride.to}</span>
                </div>
              </td>
              <td className="data strong">{ride.publicId}</td>
              <td>
                <StatusChip label={ride.status.label} tone={ride.status.tone} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
