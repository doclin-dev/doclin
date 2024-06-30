# Doclin - Real-time discussion on your IDE

Doclin is a real-time discussion tool on codebase. Currently only supports VS Code, but to be extended to other IDEs.

To try out doclin live, visit [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Doclin.doclin).

## Pre-requisites

1. Node.js: Ensure you have Node.js installed (minimum version required: 14.x or higher).
2. PostgreSQL: Make sure you have a PostgreSQL database set up and running.

## Local Setup Instructions

### Run the server

1. Setup Database
   1. Install Postgres locally
   2. Create a database named doclin
2. Fill up the credentials in .env file
   1. ACCESS_TOKEN_SECRET - This is used to sign the JWT tokens. Use a random string for this.
   2. GITHUB_CLIENT_SECRET and GITHUB_CLIENT_ID - These are used for the github login. Get these by creating a Github app.
   3. SENDGRID_API_KEY - This is used for email notifications when someone is tagged on a thread. Get your own api key from Sendgrid.
   4. DB_HOST and DB_PASS - These are credentials for your postgres server.

```
cd api
npm install
npm run dev
```

### Run the extension

On Visual Studio Code, open the repository. Then on the top bar, select Run, then Start Debugging (F5).