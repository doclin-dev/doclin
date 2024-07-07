# Contributing to Doclin

Thank you for considering contributing to Doclin! We welcome contributions from everyone. Here are a few guidelines to help you get started.

## Table of Contents

- [Contributing to Doclin](#contributing-to-doclin)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Pre-requisites](#pre-requisites)
    - [Fork the Repository](#fork-the-repository)
    - [Run the server](#run-the-server)
    - [Run the extension](#run-the-extension)
  - [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Enhancements](#suggesting-enhancements)
    - [Submitting Changes](#submitting-changes)
  - [Style Guide](#style-guide)
  - [Project Structure](#project-structure)
  - [Pull Request Process](#pull-request-process)
  - [License](#license)

## Code of Conduct

Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## Getting Started

### Pre-requisites

1. Git
2. Node.js: Ensure you have Node.js installed (minimum version required: 14.x or higher).
3. PostgreSQL: Make sure you have a PostgreSQL database set up and running.
4. VS Code: Ensure you have the latest version of VS Code installed.

### Fork the Repository

1. Fork the repository by clicking the "Fork" button on the top right of the project page.
2. Clone your forked repository to your local machine:
3. Navigate to the project directory:

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

## How to Contribute

### Reporting Bugs

- Use the [issue tracker](https://github.com/doclin-dev/doclin/issues) to report bugs.
- Provide as much detail as possible including steps to reproduce, expected behavior, and screenshots if applicable.

### Suggesting Enhancements

- Use the [issue tracker](https://github.com/doclin-dev/doclin/issues) to suggest enhancements.
- Explain your idea clearly and provide examples when possible.

### Submitting Changes

1. Create a new branch for your changes.
2. Make your changes.
3. Commit your changes.
4. Push your changes to your forked repository.
5. Open a pull request in the original repository and provide a detailed description of your changes.

## Style Guide

- Follow the [TypeScript style guide by Google](https://google.github.io/styleguide/tsguide.html).
- Follow the [HTML/CSS style guide by Google](https://google.github.io/styleguide/htmlcssguide.html).
- Try to follow [clean code policy](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29).
- Try to avoid inline comments.

## Project Structure

1. `api`: All server-side code is in this directory.
   1. `src`
      1. `index.ts`: Entry point to the server.
      2. `controllers`
      3. `database`
         1. `entities`: Contains the database entities (aka. models, aka. tables) using typeorm.
         2. `repositories`: Contains all the queries to the database.
      4. `middlewares`
      5. `routes`
      6. `types`
2. `extension`: All vscode extension code is in this directory
   1. `media`: Contains css and images
   2. `src`
      1. `api`: Contains all the axios instances to communicate with the server
      2. `providerHelpers`: The middle layer between the server and the extension webview. Contains the core functionality of the extension.
      3. `tests`
   3. `webviews`: Front-end svelte components of the extension.

## Pull Request Process

1. Ensure your changes pass all tests.
   ```
   cd extension
   npm run test
   ```
2. Ensure there are no eslint or prettier errors.

   ```
   cd api
   npm run lint-fix
   npm run prettier-fix

   cd extension
   npm run lint-fix
   npm run prettier-fix
   npm run svelte-check
   ```

3. Ensure your changes adhere to the style guide.
4. Ensure your branch is up to date with the main branch:
   ```sh
   git pull upstream main
   ```
5. Open a pull request and describe your changes.
6. A project maintainer will review your pull request and provide feedback if necessary.

## License

By contributing, you agree that your contributions will be licensed under the [AGPL License](./LICENSE).

Thank you for your contribution!
