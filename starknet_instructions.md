# StarkNet Transaction Instructions

This document provides step-by-step instructions for performing a transaction using the StarkNet API.

---

## Prerequisites

1. Ensure you have the following environment variables configured in your `.env` file:
   ```
   STARKNET_RPC_URL="https://alpha4.starknet.io"
   STARKNET_ACCOUNT_ADDRESS="<your_account_address>"
   CONTRACT_ABI='[<contract_abi_json>]'
   ```

2. Switch to the `development` branch to test StarkNet-related features:
   ```bash
   git checkout development
   ```

3. Install the required dependencies:
   ```bash
   npm install starknet
   ```

---

## Steps to Perform a Transaction

### 1. Initiate a Transaction

- **Endpoint:** `/starknet/transaction`
- **Method:** POST
- **Payload Example:**
  ```json
  {
    "privateKey": "<your_private_key>",
    "contractAddress": "<contract_address>",
    "functionName": "<function_name>",
    "calldata": ["<calldata_array>"]
  }
  ```
- **Description:** This endpoint initiates a transaction on StarkNet.

- **Example cURL Command:**
  ```bash
  curl -X POST http://localhost:5000/v1/starknet/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "privateKey": "0x123...",
    "contractAddress": "0xabc...",
    "functionName": "transfer",
    "calldata": ["123", "456", "789"]
  }'
  ```

---

### 2. Query Transaction Status

- **Endpoint:** `/starknet/transaction/:hash`
- **Method:** GET
- **Description:** This endpoint queries the status of a transaction using its hash.

- **Example cURL Command:**
  ```bash
  curl -X GET http://localhost:5000/v1/starknet/transaction/0x123...
  ```

---

## Notes

- Replace `<your_private_key>`, `<contract_address>`, `<function_name>`, and `<calldata_array>` with actual values.
- Ensure the StarkNet node is running and accessible via the `STARKNET_RPC_URL`.
- For more details, refer to the [StarkNet.js documentation](https://www.starknet.io/docs/).
