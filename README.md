# API Documentation

This README serves as documentation for the API endpoints listed in the provided JSON payload. The API is structured into several categories, including Users, Profiles, Authentication, Posts, and Messages.

---

## Project Overview

This project consists of two main components:

1. **Backend**: The backend API (this repository) handles all server-side logic, database interactions, and API endpoints.
2. **Frontend**: The frontend for this project is hosted on [TrustLink](https://github.com/hawkaii/TrustLink). It provides the user interface for interacting with the API.

---

## Hosting and Resources

- **Backend Hosting**: The backend server is hosted on [DigitalOcean](https://www.digitalocean.com).
- **Frontend Repository**: [TrustLink](https://github.com/hawkaii/TrustLink)
- **StarkNet**: StarkNet is used for handling blockchain transactions efficiently.

---

## Endpoints

The detailed API endpoints are documented in the [endpoints.md](./endpoints.md) file.

---

## StarkNet Integration

### Instructions

Refer to the [StarkNet Instructions](./starknet_instructions.md) file for detailed steps on performing transactions using StarkNet.

### Endpoints

StarkNet-specific endpoints are included in the [endpoints.md](./endpoints.md) file under the "StarkNet" section.

---

## Variables

To configure the application, create a `.env` file in the root directory of the backend project and define the following variables:

```
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>"
MONGODB_URI="mongodb://<host>:<port>/<database>"
PRIVATE_KEY="<your_private_key>"
```

Replace `<username>`, `<password>`, `<host>`, `<port>`, `<database>`, and `<your_private_key>` with your actual values.

Example:
```
DATABASE_URL="mysql://root:hawkaii@2020@localhost:3306/mysocial"
MONGODB_URI="mongodb://localhost:27017/trustlink"
PRIVATE_KEY="0x03ecab483b86fd9f987699597d160411cec937039b089e2db1f8abcd58679a1e"
```

---

For more details, refer to the API schema or contact the development team.
