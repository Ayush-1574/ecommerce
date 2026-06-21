# Software Requirements Specification (SRS)
## Project: ShopVerse E-commerce Platform

---

### 1. Introduction
#### 1.1 Purpose
This document provides a detailed description of the requirements for the ShopVerse E-commerce platform. It outlines the functional and non-functional requirements, system architecture, and user roles.

#### 1.2 Scope
ShopVerse is a full-stack e-commerce application designed to support multi-vendor operations. It allows users to browse products, manage carts, apply coupons, and complete checkouts. It provides specialized portals for Admins (Vendor management) and Super Admins (Site-wide management).

---

### 2. General Description
#### 2.1 Product Perspective
The system is built using a modern MERN-like stack (React, Node.js, Express, PostgreSQL) with Prisma ORM for database management.

#### 2.2 User Classes and Characteristics
*   **Customer:** Unauthenticated or authenticated users who browse products, manage their personal cart, and place orders.
*   **Admin (Vendor):** Authenticated staff members who manage their own inventory, track specific orders, and manage sales for their assigned products.
*   **Super Admin:** The highest level of authority. Can manage site-wide banners (Carousel), user accounts, site settings, and all administrative data.

---

### 3. System Features

#### 3.1 Authentication & Security
*   **JWT Authentication:** Secure login using JSON Web Tokens stored in HTTP-only cookies.
*   **Role-Based Access Control (RBAC):** Strict navigation and API guarding based on User Roles (User, Admin, SuperAdmin).
*   **Password Recovery:** Email-based password reset functionality.

#### 3.2 Shopping Experience
*   **Dynamic Product Feed:** Browsing with category and brand filtering.
*   **Advanced Cart Management:** Real-time cart updates with stock validation.
*   **Coupon System:** Discount application with validation for expiry dates, usage limits, and active status.
*   **Fast-Test Checkout:** A direct checkout bypass for testing environments to skip third-party payment gateways (PayPal).

#### 3.3 Multi-Vendor Isolation (Admin Portal)
*   **Product Ownership:** Admins can only see, edit, and delete products they created.
*   **Inventory Tracking:** Real-time stock management and low-stock alerts.
*   **Sales Analytics:** (Planned) Dashboard for tracking individual vendor performance.

#### 3.4 Site Management (Super Admin)
*   **Hero Carousel:** Dynamic management of home page banners.
*   **User Management:** Creating, demoting, or deleting admin accounts.
*   **Site Configuration:** Global settings for categories, brands, and promotional text.

---

### 4. Technical Requirements
#### 4.1 Frontend
*   **Framework:** React 18+ with Vite.
*   **State Management:** Redux Toolkit.
*   **UI Library:** Tailwind CSS with Shadcn UI for premium aesthetics.

#### 4.2 Backend
*   **Environment:** Node.js with Express.
*   **Database:** PostgreSQL.
*   **ORM:** Prisma.
*   **Storage:** Cloudinary for high-performance image hosting.

---

### 5. Non-Functional Requirements
#### 5.1 Performance
*   The system shall load the landing page in under 2 seconds on a standard broadband connection.
*   Database queries shall be optimized using indexing for product search and filtering.

#### 5.2 Scalability
*   The system uses an asynchronous architecture to handle high-concurrency during peak shopping periods.

#### 5.3 Reliability
*   The system uses Prisma migrations and seeding to ensure database integrity across development and production environments.

---

### 6. Database Schema Summary
*   **User:** Stores identity and role.
*   **Product:** Includes title, pricing, stock, and `adminId` for vendor isolation.
*   **Order:** Tracks customer purchases and payment status.
*   **Cart:** Persistent storage of user shopping sessions.
*   **Coupon:** Tracks codes, expiry, and usage frequency.
