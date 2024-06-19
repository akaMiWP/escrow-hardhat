import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import deploy from "./deploy";
import connect from "./connect";
import Escrow from "./Escrow";
import SearchBox from "./SearchBox";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  console.log("Approving...");
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
  console.log("Approved event is sent");
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
      value: ethers.utils.formatEther(value),
      handleApprove: async (statusRef) => {
        console.log("Setting up event listener for Approved event");
        escrowContract.on("Approved", () => {
          console.log("Approved event is triggered");
          if (statusRef.current) {
            statusRef.current.className = "btn btn-secondary";
            statusRef.current.innerText = "✓ It's been approved!";
          }
        });

        console.log("Calling approve function");
        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  async function addContractAddress(address) {
    const escrowContract = await connect(address, signer);
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    console.log("Arbiter", arbiter);
    console.log("Beneficiary", beneficiary);
    const balance = await escrowContract.provider.getBalance(
      escrowContract.address
    );
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: ethers.utils.formatEther(balance),
      handleApprove: async (statusRef) => {
        console.log("Setting up event listener for Approved event");
        escrowContract.on("Approved", () => {
          console.log("Approved event is triggered");
          if (statusRef.current) {
            statusRef.current.className = "btn btn-secondary";
            statusRef.current.innerText = "✓ It's been approved!";
          }
        });

        console.log("Calling approve function");
        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  const handleSearch = (query) => {
    console.log("Search query:", query);
    addContractAddress(query);
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-lg-6 mb-4">
          <div className="card p-4 shadow">
            <h1 className="mb-4">New Contract</h1>
            <form>
              <div className="form-group mb-3">
                <label htmlFor="arbiter">Arbiter Address</label>
                <input type="text" className="form-control" id="arbiter" />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="beneficiary">Beneficiary Address</label>
                <input type="text" className="form-control" id="beneficiary" />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="ether">Deposit Amount (in ether)</label>
                <input type="text" className="form-control" id="ether" />
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3 w-100"
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
        <div className="col-lg-6 mb-4">
          <div className="card p-4 shadow">
            <h1 className="mb-4">Existing Contracts</h1>
            <div id="container">
              {escrows.map((escrow) => (
                <Escrow key={escrow.address} {...escrow} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card p-4 shadow">
            <h1 className="mb-4">Search Contracts</h1>
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
