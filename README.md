<div align='center'>
   <img src='https://github.com/doclin-dev/doclin/assets/24940719/dd865064-5b57-4793-9800-bbffdc391d67' alt='Doclin' width='300px' />
   
   Real-time code discussion and documentation on your IDE
</div>

## Getting Started

### Purpose

The purpose of this tool is to build code knowledgebase easily. Traditional code documentation methods is very inefficient. Developers write the documentation at the same time as their code, and it often resulted in unhelpful, missing important points, time-consuming and quickly got out of date. We realized it is more helpful to only document the answers when someone asks a question or faces a problem. This not only make sures the documentation is more meaningful, but we can spend less time in writing documentation.

Doclin is still in very early-stage. If you like the idea, please show support my star-ring this repository!


### Installation

Currently only supports VS Code, but to be extended to other IDEs once we validate the concept. To try out Doclin, install extension in VS Code. [Link to VS Code Marketplace.](https://marketplace.visualstudio.com/items?itemName=Doclin.doclin)

## Local Setup Instructions

### Pre-requisites

1. Node.js: Ensure you have Node.js installed (minimum version required: 14.x or higher).
2. PostgreSQL: Make sure you have a PostgreSQL database set up and running.
3. VS Code: Ensure you have the latest version of VS Code installed.

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
npm run watch
npm run dev
```

### Run the extension

On Visual Studio Code, open the repository. Then on the top bar, select Run, then Start Debugging (F5).
