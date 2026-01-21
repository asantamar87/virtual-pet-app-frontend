# 🐾 Virtual Pet Frontend

This is the client-side application for the **Virtual Pet API**, built with modern web technologies and AI-assisted design.

## 🚀 Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) / [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Architecture:** Generated via **v0 by Vercel** for a professional and responsive interface.
- **State Management:** React Hooks (useState, useEffect).
- **Authentication:** JWT (JSON Web Tokens) stored in `localStorage`.

## 🛠️ Key Features
- **Interactive Dashboard:** Real-time visualization of pet stats (Health, Happiness, Hunger, Energy).
- **Secure Authentication:** Dedicated login and registration flows.
- **Role-Based UI:** Conditional rendering based on user permissions (User vs. Admin).
- **Responsive Design:** Fully optimized for mobile and desktop viewing.

## 🔌 API Integration
The frontend communicates with a Spring Boot REST API. 



### Authentication Flow:
1. User logs in -> Receives **JWT**.
2. Token is saved in the browser.
3. Every request includes an `Authorization: Bearer <token>` header.
4. **CORS Policy:** Configured to allow requests to `http://localhost:8080`.

## 🏃 Getting Started
First, install the dependencies:
```bash
npm install
# or
yarn install

Then, run the development server:

npm run dev
# or
yarn dev

Open http://localhost:3000 with your browser to see the result.