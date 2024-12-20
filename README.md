# Hyand Skills Matrix Frontend

The frontend of the Hyand Skills Matrix Framework is a React-based web application designed to provide a user-friendly interface for managing skills, career paths, and feedback processes. It connects with the backend services to communicate.

## Features

- **Dynamic Skill Management:**
  - Users can view and update their skills in an intuitive interface.

- **Career Path Visualization:**
  - Provides an easy-to-understand representation of career progression and required skills.

- **Feedback Integration:**
  - Allows users to view and manage feedback received from peers or during reviews.

- **Secure Access:**
  - Implements robust client-side authentication using JWT.

## Technology Stack of Frontend

- **Framework:** React
- **State Management:** Default React
- **Styling:** MaterialUI 
- **API Communication:** Axios and Fetch API

## Prerequisites

- Node.js 18 or higher
- NPM or Yarn package manager

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/hyand-skills-matrix-frontend.git
   cd hyand-skills-matrix-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm start
   ```

4. **Access the Application:**
   - Open your browser and navigate to `http://localhost:5173`, or whatever port you have set up for Vite.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
