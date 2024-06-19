import React, { useRef } from "react";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const statusRef = useRef(null);

  return (
    <div key={address} className="card mb-3">
      <div className="card-body">
        <p className="card-text">
          <strong>Arbiter:</strong>{" "}
          <span className="text-break">{arbiter}</span>
        </p>
        <p className="card-text">
          <strong>Beneficiary:</strong>{" "}
          <span className="text-break">{beneficiary}</span>
        </p>
        <p className="card-text">
          <strong>Value (in ether):</strong> {value}
        </p>
        <button
          ref={statusRef}
          className="btn btn-warning"
          onClick={(e) => {
            e.preventDefault();
            handleApprove(statusRef);
          }}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
