# 🧬 Life OS - Personal Operating System

A comprehensive life management platform that helps you track, monitor, and improve all aspects of your life in one unified dashboard.

---

## 🎯 **Project Goals**

### Primary Goals
- **Centralized Life Management**: Replace multiple apps (habit tracker, finance manager, task manager, etc.) with a single unified platform
- **Holistic Tracking**: Monitor all key life areas - goals, health, finances, relationships, and tasks
- **AI-Powered Insights**: Provide intelligent recommendations based on user data to help improve decision-making
- **Privacy First**: Ensure user data security with JWT authentication and secure password hashing

### Technical Goals
- **Full-Stack Mastery**: Demonstrate proficiency in MERN stack (MongoDB, Express, React, Node.js)
- **Modern Architecture**: Implement Next.js 15 App Router for optimal performance
- **Responsive Design**: Create a seamless experience across desktop, tablet, and mobile devices
- **Scalable Code**: Write clean, maintainable, and well-documented code

---

## 📸 Screenshots

| | |
|---|---|
| **Login Page** | **Register Page** |
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) |

| **Dashboard** |
| ![Dashboard](screenshots/dashboard.png) |

| **Goals** | **Create Goal** |
| ![Goals](screenshots/goals.png) | ![Create Goal](screenshots/add-goal.png) |

| **Health** |
| ![Health](screenshots/health.png) |

| **Finance** | **Add Transaction** |
| ![Finance](screenshots/finance.png) | ![Add Transaction](screenshots/add-transaction.png) |

| **Relationships** | **Add Person** |
| ![Relationships](screenshots/relationships.png) | ![Add Person](screenshots/add-person.png) |

| **Tasks** | **Create Task** |
| ![Tasks](screenshots/tasks.png) | ![Create Task](screenshots/add-task.png) |

| **Insights** |
| ![Insights](screenshots/insights.png) |

---

## ✨ **Key Features**

| Module | Features |
|--------|----------|
| **🎯 Goals** | Set SMART goals, track progress, add milestones, categorize by life areas |
| **💪 Health** | Log daily metrics (steps, sleep, mood, water), view health trends, get wellness tips |
| **💰 Finance** | Track income/expenses, categorize transactions, visualize spending patterns |
| **👥 Relationships** | Manage connections, track important dates, log interactions, never miss birthdays |
| **✅ Tasks** | Organize tasks with priorities, set due dates, filter by status and category |
| **🤖 Insights** | AI-powered personalized recommendations based on your activity patterns |



## 🛠️ **Tech Stack**

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **React Bootstrap** - Component library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---



## 📸 Screenshots

| | |
|---|---|
| **Login Page** | **Register Page** |
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) |

| **Dashboard** |
| ![Dashboard](screenshots/dashboard.png) |

| **Goals** | **Create Goal** |
| ![Goals](screenshots/goals.png) | ![Create Goal](screenshots/add-goal.png) |

| **Health** |
| ![Health](screenshots/health.png) |

| **Finance** | **Add Transaction** |
| ![Finance](screenshots/finance.png) | ![Add Transaction](screenshots/add-transaction.png) |

| **Relationships** | **Add Person** |
| ![Relationships](screenshots/relationships.png) | ![Add Person](screenshots/add-person.png) |

| **Tasks** | **Create Task** |
| ![Tasks](screenshots/tasks.png) | ![Create Task](screenshots/add-task.png) |

| **Insights** |
| ![Insights](screenshots/insights.png) |

---

## ✨ **Key Features**

| Module | Features |
|--------|----------|
| **🎯 Goals** | Set SMART goals, track progress, add milestones, categorize by life areas |
| **💪 Health** | Log daily metrics (steps, sleep, mood, water), view health trends, get wellness tips |
| **💰 Finance** | Track income/expenses, categorize transactions, visualize spending patterns |
| **👥 Relationships** | Manage connections, track important dates, log interactions, never miss birthdays |
| **✅ Tasks** | Organize tasks with priorities, set due dates, filter by status and category |
| **🤖 Insights** | AI-powered personalized recommendations based on your activity patterns |

---

## 🛠️ **Tech Stack**

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **React Bootstrap** - Component library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/VarshaVasudevan/life-os-app
cd life-os

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Run backend (Terminal 1)
cd backend
npm run dev

# Run frontend (Terminal 2)
cd frontend
npm run dev