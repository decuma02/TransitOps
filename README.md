<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=TransitOps;End-to-End+Fleet+Management;Automate.+Optimize.+Scale." alt="Typing SVG" />
</div>

<br/>

**Developed in the Odoo Hackathon 2026**

TransitOps is a comprehensive transport operations platform designed to streamline fleet management, trip dispatching, driver assignments, and vehicle maintenance logging. Built on a robust, modern technology stack, it provides real-time insights, automated status transitions, and analytical reporting.

## Architecture & Technology Stack

The platform is designed as a monolithic repository containing a decoupled frontend and backend, fully containerized for seamless deployment.

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Recharts
*   **Backend**: Node.js, Express.js, TypeScript
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Infrastructure**: Docker, Docker Compose, Nginx

## Core Features

*   **Role-Based Access Control**: Secure JWT authentication for Administrators, Fleet Managers, Drivers, and Financial Analysts.
*   **Fleet Registry**: Manage the entire vehicle lifecycle, track active capacities, and monitor availability statuses.
*   **Driver Management**: Centralized repository for driver information, compliance documents, and assigned trips.
*   **Automated Trip Dispatcher**: Create, dispatch, and complete trips. The system automatically updates the real-time statuses of the assigned driver and vehicle.
*   **Maintenance & Fuel Logging**: Record workshop visits and fuel expenses to calculate accurate operational ROIs.
*   **Analytics Dashboard**: Visual data representation using Recharts, outlining Operational Cost versus Fuel and Revenue trends.

## Local Development & Deployment

The entire infrastructure can be orchestrated effortlessly using Docker Compose.

### Prerequisites
*   Docker
*   Docker Compose

### Quick Start

1.  Clone the repository and navigate into the root directory.
2.  Start the containers in detached mode:
    ```bash
    docker-compose up -d --build
    ```
3.  Access the platform:
    *   **Frontend User Interface**: `http://localhost`
    *   **Backend API Gateway**: `http://localhost:5000`

### Teardown

To stop the services and remove the containers, run:
```bash
docker-compose down
```

## Repository Structure

*   `/frontend` - Contains the React Vite single-page application.
*   `/backend` - Contains the Express.js REST API an
d Prisma schemas.
*   `docker-compose.yml` - Orchestrates the database, backend server, and Nginx-served frontend.

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=16&pause=2000&color=9CA3AF&center=true&vCenter=true&width=400&lines=Developed+for+operational+excellence" alt="Footer SVG" />
</div>
