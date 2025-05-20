# msdospro - A Retro-Themed Personal Portfolio

`msdospro` is a personal portfolio website designed with a retro MS-DOS aesthetic. It aims to provide a unique, interactive experience for showcasing projects and information, reminiscent of early computing environments.

Built with modern web technologies, it features a command-line interface (CLI), boot sequence, and typewriter text effects to enhance its nostalgic theme.

## Tech Stack

*   **React 19:** For building the user interface.
*   **Vite:** As the build tool and development server.
*   **React Router DOM:** For navigation between pages.
*   **TUI CSS:** A DOS-themed CSS framework for styling.
*   **Xterm.js:** To power the interactive terminal component.
*   **ESLint:** For code linting.
*   **Vitest:** (Planned) For unit and component testing.
*   **GitHub Pages:** For deployment.

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/robimdev/didactic-lamp.git
    cd didactic-lamp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## Build and Deployment

*   **Build for production:**
    ```bash
    npm run build
    ```
    This command bundles the application into the `dist` directory and prepares it for deployment. It also copies `dist/index.html` to `dist/404.html` to work with GitHub Pages routing for single-page applications.

*   **Deploy to GitHub Pages:**
    ```bash
    npm run deploy
    ```
    This script uses `gh-pages` to deploy the contents of the `dist` directory to the `gh-pages` branch of your repository, making it live on GitHub Pages. Ensure your `package.json`'s `homepage` field is set correctly.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run predeploy`: Automatically runs before `deploy` (usually an alias for `build`).
*   `npm run deploy`: Deploys the app to GitHub Pages.

## Project Goals (Making it "Better")

This project is currently being enhanced with a focus on:

*   **Improved Documentation:** (This README!)
*   **Accessibility (A11y):** Ensuring the site is usable by a wider audience.
*   **Testing:** Adding unit and component tests for reliability.
*   **Code Quality:** Refactoring for clarity and maintainability.

## Contributing

While this is primarily a personal project, suggestions or contributions that align with the project's theme and goals are welcome. Please feel free to open an issue to discuss potential changes.
