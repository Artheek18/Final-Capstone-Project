import React, { useState, useEffect } from "react";
const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

function Distance({ leg }) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    (leg.distance.value / 1000) * litreCostKM * commutesPerYear
  );

  const [parkingName, setParkingName] = useState("");
  useEffect(() => {
    setParkingName(localStorage.getItem("pkname"));
  });
  return (
    <div>
      <p>
        The Parking Spot {parkingName} is{" "}
        <span className="highlight">{leg.distance.text}</span> away from your
        Entered Location. That would take{" "}
        <span className="highlight">{leg.duration.text}</span>.
      </p>

      {/* <p>
        <span className="highlight">{days} days</span> in your car each year at
        a cost of{" "}
        <span className="highlight">
          ${new Intl.NumberFormat().format(cost)}
        </span>
        .
      </p> */}
    </div>
  );
}

export default Distance;
