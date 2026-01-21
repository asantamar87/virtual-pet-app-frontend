# 🐾 Virtual Pet API - Backend

This is the robust RESTful Backend for the **Virtual Pet** application, developed using **Java 17** and **Spring Boot 3**. It handles the core business logic, pet state management, and secure authentication.

## 🚀 Tech Stack

* **Framework:** [Spring Boot 3](https://spring.io/projects/spring-boot)
* **Security:** Spring Security & JWT (JSON Web Tokens)
* **Database:** H2 (In-Memory) / PostgreSQL
* **ORM:** Spring Data JPA / Hibernate
* **Language:** Java 17
* **Documentation:** Swagger / OpenAPI (Optional)

## 🛠️ Key Technical Features

### 🔐 Authentication & Authorization
* **JWT Stateless Auth:** Secure communication using Bearer tokens.
* **RBAC (Role-Based Access Control):** * `ROLE_USER`: Can create and manage their own pets.
    * `ROLE_ADMIN`: Can monitor all pets across the entire system.
* **Method Security:** Annotated controllers using `@PreAuthorize` for granular access control.

### 🧬 Business Logic
* **State Machine:** Pets have dynamic attributes (Hunger, Energy, Happiness, Health) that update through specific service actions (`feed()`, `play()`, `sleep()`).
* **Ownership Validation:** Secure logic ensuring users can only interact with pets they own.

### 📦 Optimized Data Transfer (DTOs)
* **Java Records:** Used for immutable and lightweight data transfer.
* **Infinite Recursion Prevention:** Specifically designed DTOs to break circular references between `User` and `Pet` entities during JSON serialization.

## 🛠️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/virtualpet-api.git](https://github.com/your-username/virtualpet-api.git)
    cd virtualpet-api
    ```

2.  **Configure Database:**
    By default, the project uses **H2 In-Memory Database**. Configuration can be found in `src/main/resources/application.properties`.

3.  **Build and Run:**
    ```bash
    ./mvnw spring-boot:run
    ```
    The API will be available at `http://localhost:8080`.

## 🛣️ API Endpoints

### Auth
* `POST /api/auth/register` - Register a new user.
* `POST /api/auth/login` - Authenticate and receive a JWT.

### Pets (User)
* `GET /api/pets` - List all pets owned by the authenticated user.
* `POST /api/pets` - Create a new pet.
* `POST /api/pets/{id}/feed` - Increase pet hunger stats.
* `POST /api/pets/{id}/play` - Increase happiness/decrease energy.

### Pets (Admin)
* `GET /api/pets/all` - List every pet in the system (Requires `ROLE_ADMIN`).

## 🧠 AI Collaboration & Troubleshooting

During development, we collaborated with **Gemini 3 Flash** to resolve critical architectural challenges:

* **JSON Parsing Errors:** Refactored Controller responses from plain `String` to `Map` or `DTO` to ensure valid JSON output for the frontend.
* **CORS Configuration:** Implemented a global CORS policy to allow secure requests from the Next.js frontend (port 3000).
* **H2 Console Security:** Adjusted Spring Security filters to allow frame-options for database debugging without compromising API security.

## 📂 Project Structure

```text
src/main/java/com/virtualpet/virtualpetapi/
├── config/         # Security and CORS configurations
├── controller/     # REST Controllers
├── dto/            # Request and Response (Records)
├── model/          # JPA Entities (User, Pet, Role)
├── repository/     # Spring Data JPA Repositories
└── service/        # Business logic implementation