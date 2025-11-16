# Fashionary - Modern ERP for Fashion Business

Welcome to Fashionary! This is a comprehensive, production-ready ERP starter kit built with Next.js, designed specifically for fashion and apparel businesses. This frontend application provides a complete suite of tools for managing orders, products, inventory, customers, finances, and more, with a clean, modern, and fully responsive user interface.

This project was bootstrapped by **Firebase Studio**.

## Tech Stack

This project is built on a modern, robust, and scalable tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Charts & Data Viz:** [Recharts](https://recharts.org/)

## Features

This application comes packed with a wide range of pre-built features:

- **Secure Authentication:** Complete sign-in and user management powered by Clerk, with invitation-only access for staff.
- **Responsive Dashboard:** A central hub providing a quick overview of business operations.
- **Comprehensive Management Modules:**
  - **Orders:** Create, view, update, and manage customer orders. Includes bulk actions and printing options.
  - **Products:** Manage a detailed product catalog with support for variants and different product types (simple, variable, combo).
  - **Inventory:** Track stock levels and view movement history for each product.
  - **Customers:** Maintain a complete customer database with order history and financial summaries.
  - **Purchases:** Create and manage purchase orders for production and procurement.
  - **Staff:** Manage staff roles, payments, and performance with an invitation-based system.
  - **Partners:** Handle suppliers and vendors, tracking payments and purchase orders.
  - **Finance:** Track expenses and view detailed financial analytics, including profit & loss statements.
- **Advanced Tools:**
  - **All-in-One Scan Mode:** A dedicated, distraction-free UI for rapidly scanning order barcodes, adding them to a list, and applying bulk actions like "Mark as Shipped".
  - **Courier Services:** Integrated courier report search (Hoorin API) and tools for dispatching orders.
  - **SMS Gateway:** Configurable SMS notifications for various events.
- **Public-Facing Features:**
  - **Online Shop:** A clean, responsive, and modern public-facing shop interface (`/shop`) for customers to browse products.
  - **Order Tracking:** A public page (`/track-order`) for customers to track their order status using an Order ID or phone number.
- **Settings:** A modular settings panel to configure every aspect of the application, from business details to third-party integrations.

## Getting Started

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or any other package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd fashionary
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the necessary environment variables. Start with the Clerk keys:
    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
    CLERK_SECRET_KEY=sk_...
    ```
    You can find these keys in your Clerk dashboard.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Project Structure

The project follows a standard Next.js App Router structure, with some key directories to note:

- **/src/app/dashboard**: Contains all the pages and layouts for the main application.
- **/src/app/shop**: Contains the public-facing e-commerce storefront.
- **/src/app/track-order**: Contains the public-facing order tracking pages.
- **/src/components**: Shared UI components, including the ShadCN/UI library.
- **/src/services**: This is a crucial directory for backend integration. It contains functions that fetch placeholder data. **This is where backend API calls will be implemented.**
- **/src/lib**: Contains utility functions and placeholder data.
- **/src/types**: Holds all TypeScript type definitions for the data models used in the app.

## For Backend Developers

This project is designed to be **"Backend-Ready"**. The frontend is fully functional using mock data, and the data-fetching logic is completely decoupled from the UI. Please refer to the `src/BACKEND_DOCUMENTATION.md` file for a detailed guide on how to integrate your backend with this application.
