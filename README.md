# EventSphere - Tech Fest & Hackathon Management Platform

A modern, multi-tenant web platform for managing technical fests, hackathons, and inter-college events. Built with Next.js, MongoDB, and TypeScript.

---

## 🤖 Development Note

This project is a clone of [Fest Management Website](https://github.com/fayasnoushad/fest-management-website). It has been enhanced with significant new features developed with the assistance of **GitHub Copilot**, an AI programming assistant. Copilot helped in:

- Improving code quality and structure
- Suggesting efficient algorithms and patterns
- Generating boilerplate code for new components
- Providing documentation and comments for better understanding
- TypeScript type definitions

> This project is a fully vibe coded with the help of AI, showcasing the potential of AI-assisted development.

---

## 🚀 Features

### For Organizers

- **User Authentication** - Secure signup/login system for event organizers
- **Event Management** - Create, edit, delete, and publish tech fests and hackathons
- **Multi-Event Support** - Manage multiple events from a single account
- **Participant Dashboard** - View and manage all registrations
- **Approval System** - Optional manual approval for participants
- **QR-Based Check-in** - Fast contactless verification at events
- **Real-time Statistics** - Track registrations and check-ins

### For Participants

- **Event Discovery** - Browse all available tech fests and hackathons
- **Easy Registration** - Simple, user-friendly registration forms
- **Digital Tickets** - Auto-generated QR code tickets
- **Multi-Competition Support** - Register for multiple sub-events

### General Features

- Multi-tenant architecture with data isolation
- Support for tech-fests, hackathons, workshops
- Payment integration ready
- Certificate generation framework
- Meal preferences & custom guidelines
- Responsive design

---

## 🔧 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fayasnoushad/eventsphere.git
   cd eventsphere
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📖 Usage

- **Organizers**: Sign up → Create events → Manage participants → Check-in with QR scanner
- **Participants**: Browse events → Register → Get QR ticket → Attend event

---

## 🛠️ Tech Stack

- Next.js (framework)
- Tailwind CSS with DaisyUI (styling)
- MongoDB (database)
- Node.js (server-side logic)
- TypeScript (type safety)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## 📄 License

This project is licensed under GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
