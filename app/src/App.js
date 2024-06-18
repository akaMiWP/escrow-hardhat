import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(
      document.getElementById("ether").value
    );
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-6">
          <div className="card p-4">
            <h1 className="mb-4">New Contract</h1>
            <form>
              <div className="form-group">
                <label htmlFor="arbiter">Arbiter Address</label>
                <input type="text" className="form-control" id="arbiter" />
              </div>
              <div className="form-group">
                <label htmlFor="beneficiary">Beneficiary Address</label>
                <input type="text" className="form-control" id="beneficiary" />
              </div>
              <div className="form-group">
                <label htmlFor="ether">Deposit Amount (in ether)</label>
                <input type="text" className="form-control" id="ether" />
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                id="deploy"
                onClick={(e) => {
                  e.preventDefault();
                  newContract();
                }}
              >
                Deploy
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4">
            <h1 className="mb-4">Existing Contracts</h1>
            <div id="container">
              {escrows.map((escrow) => {
                return <Escrow key={escrow.address} {...escrow} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
