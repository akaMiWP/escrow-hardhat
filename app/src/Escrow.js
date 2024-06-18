export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
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
          <strong>Value:</strong> {value}
        </p>
        <button
          className="btn btn-warning"
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
