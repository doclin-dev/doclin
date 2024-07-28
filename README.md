<div align='center'>
   <img src='https://github.com/doclin-dev/doclin/assets/24940719/dd865064-5b57-4793-9800-bbffdc391d67' alt='Doclin' width='300px' />
   
   **Real-time code discussion and documentation on your IDE**
   
   ![Deploy Status](https://img.shields.io/github/actions/workflow/status/doclin-dev/doclin/deploy.yml?branch=main)
</div>

## Getting Started

To try out Doclin, install the extension in VS Code. [Link to VS Code Marketplace.](https://marketplace.visualstudio.com/items?itemName=Doclin.doclin)

Currently only supports VS Code, but to be extended to other IDEs once we validate the concept.

## What is Doclin?

### Purpose

The purpose of this tool is to build code knowledgebase easily. Traditional code documentation methods are very inefficient. Developers write the documentation simultaneously as their code, which often results in documents that are time-consuming, unhelpful, and missing important points. Above all, it gets out of date quickly and becomes a burden to maintain it. We realized it is more helpful to document the answers when someone asks a question or faces a problem. This ensures the documentation is more meaningful, and we can spend less time writing documentation.

Doclin is still in a very early stage. If you like the idea, please star the repo to show support and use the discussions tab to leave feedback.

### Usage

1. Ask questions on code from your IDE!\
   <img width="600" alt="Ask question on Doclin" src="https://github.com/doclin-dev/doclin/assets/24940719/880b2c43-cb13-43eb-84f5-14d9ba37906c">

2. Get answers in real-time.\
   <img width="500" alt="Get answers on Doclin" src="https://github.com/doclin-dev/doclin/assets/24940719/8bd27a48-e02f-4688-977f-46203f031e7d">

3. Discussions stay coupled with the code.\
   <img width="700" alt="image" src="https://github.com/doclin-dev/doclin/assets/24940719/1ca5574f-7f59-44a6-9f65-c4474fd58b8b">

## Local Setup Instructions

### Pre-requisites

1. Node.js: Ensure you have Node.js installed (minimum version required: 14.x or higher).
2. PostgreSQL: Make sure you have a PostgreSQL database set up and running.
3. VS Code: Ensure you have the latest version of VS Code installed.

### Run the server

1. Setup Database
   1. Install Postgres locally
   2. Create a database named "doclin"
2. Fill up the credentials in .env file
   1. DB_HOST and DB_PASS - These are credentials for your postgres server.
   2. ACCESS_TOKEN_SECRET - This is used to sign the JWT tokens. Use a random string for this.
   3. GITHUB_CLIENT_SECRET and GITHUB_CLIENT_ID - These are used for the github login. Get these by creating a Github app.
   4. SENDGRID_API_KEY - Optional. This is used for email notifications when someone is tagged on a thread. Get your own api key from Sendgrid.
   5. OPENAI_API_KEY - Optional. This is used for the copilot.

```
cd api
npm install
npm run watch
npm run dev
```

### Run the extension

On Visual Studio Code, open the repository. Then on the top bar, select Run, then Start Debugging (F5).

```
cd extension
npm install
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways you can contribute to Doclin.
