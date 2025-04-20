import express from "express";
import { Provider, Contract, Account, ec } from "starknet";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize StarkNet provider
const provider = new Provider({ baseUrl: process.env.STARKNET_RPC_URL });

// Endpoint to initiate a transaction
router.post("/starknet/transaction", async (req, res) => {
  const { privateKey, contractAddress, functionName, calldata } = req.body;

  if (!privateKey || !contractAddress || !functionName || !calldata) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const keyPair = ec.getKeyPair(privateKey);
    const account = new Account(provider, process.env.STARKNET_ACCOUNT_ADDRESS, keyPair);
    const contract = new Contract(JSON.parse(process.env.CONTRACT_ABI), contractAddress, provider);

    const txResponse = await account.execute({
      contractAddress: contract.address,
      entrypoint: functionName,
      calldata,
    });

    res.status(200).json({ transactionHash: txResponse.transaction_hash });
  } catch (error) {
    console.error("Error initiating transaction:", error);
    res.status(500).json({ message: "Transaction failed", error: error.message });
  }
});

// Endpoint to query transaction status
router.get("/starknet/transaction/:hash", async (req, res) => {
  const { hash } = req.params;

  if (!hash) {
    return res.status(400).json({ message: "Transaction hash is required" });
  }

  try {
    const txStatus = await provider.getTransactionStatus(hash);
    res.status(200).json(txStatus);
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    res.status(500).json({ message: "Failed to fetch transaction status", error: error.message });
  }
});

export default router;
