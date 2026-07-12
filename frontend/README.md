<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=28&pause=1000&color=10B981&center=true&vCenter=true&width=600&lines=TransitOps+Frontend;React+%7C+Vite+%7C+Tailwind+CSS" alt="Typing SVG" />
</div>

<br/>

The frontend for TransitOps is a high-performance Single Page Application (SPA) built to deliver a seamless, Odoo-inspired user experience. It leverages modern web development standards to ensure fast load times, modular architecture, and beautiful responsive designs.

## Technology Stack

*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (v3)
*   **Data Fetching**: Axios
*   **Routing**: React Router DOM (v7)
*   **Visualizations**: Recharts
*   **Icons**: Lucide React

## Development Guide

If you wish to run the frontend independently of the Docker ecosystem, follow these steps. Note that the backend API must be running concurrently.

### Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Available Scripts

*   `npm run dev` - Starts the Vite development server on `http://localhost:5173`.
*   `npm run build` - Compiles the TypeScript code and bundles the application for production.
*   `npm run preview` - Boots a local server to preview the production build.

## Directory Structure

*   `src/components/` - Reusable UI elements (Sidebar, Header, Layouts).
*   `src/pages/` - Core view components (Dashboard, Fleet, Trips, Analytics).
*   `src/index.css` - Global Tailwind CSS directives and custom properties.
*   `src/App.tsx` - Application routing and context providers.

## Theming

The application utilizes a dark-mode-first approach to prioritize visual excellence and reduce eye strain for operators viewing dashboards continuously. The custom color tokens are defined directly within the Tailwind configuration for strict consistency across all components.

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=14&pause=2000&color=9CA3AF&center=true&vCenter=true&width=300&lines=Sleek.+Dynamic.+Responsive." alt="Footer SVG" />
</div>
