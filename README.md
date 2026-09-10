# 🚀 InfraWatch AI

### Intelligent Infrastructure Project Monitoring & Risk Prediction Platform

> **Predict project risks before they become costly delays.**

InfraWatch AI is an AI-powered web-based infrastructure project monitoring platform designed to track project progress, identify implementation risks, predict cost and schedule issues, and provide early warnings to decision-makers.

The project is developed as a solution for **Smart India Hackathon (SIH) 2026 – Problem Statement SIH26103**.

---

## 📌 Problem Statement

Large infrastructure projects often face problems such as:

- Cost escalation
- Schedule delays
- Slow physical progress
- Financial irregularities
- Implementation issues
- Resource and execution risks
- Lack of timely early warnings
- Difficulty in analyzing large numbers of projects

Traditional monitoring systems mainly show the current status of projects. They may not provide sufficient predictive intelligence to identify which projects are likely to face problems in the future.

**InfraWatch AI aims to move from reactive monitoring to predictive project management.**

---

## 🎯 Objectives

The main objectives of InfraWatch AI are:

1. Monitor infrastructure projects from a centralized dashboard.
2. Track physical and financial progress.
3. Monitor project milestones and issues.
4. Identify high-risk projects.
5. Generate project risk scores.
6. Predict possible cost escalation and schedule delays.
7. Provide early warning alerts.
8. Analyze factors responsible for project risks.
9. Provide project-wise and sector-wise analytics.
10. Help decision-makers take preventive action.

---

## ✨ Key Features

### 📊 Project Dashboard

- Total projects
- Ongoing projects
- Completed projects
- Delayed projects
- At-risk projects
- Overall project performance
- Risk distribution
- Recent alerts
- Key project insights

### 🏗️ Project Management

Users can:

- Add new projects
- View project details
- Edit project information
- Delete projects
- Search projects
- Filter projects by status
- Filter projects by risk level
- Track project progress

### 📈 Progress Monitoring

The platform tracks:

- Physical progress
- Financial progress
- Project expenditure
- Approved cost
- Revised cost
- Expected completion
- Project milestones

### ⚠️ Risk Assessment

Each project can be assigned a risk score and risk level:

- 🟢 Low
- 🟡 Medium
- 🟠 High
- 🔴 Critical

### 🤖 AI/ML Prediction

The machine learning module is designed to predict:

- Cost escalation risk
- Schedule delay risk
- Implementation risk
- Overall project risk

### 🚨 Early Warning System

InfraWatch AI can generate alerts when a project shows signs of:

- Increasing delay
- Cost escalation
- Poor progress
- Financial deviation
- Milestone slippage
- High implementation risk

### 🗺️ Project Location

Projects can be analyzed based on:

- State
- Location
- Sector
- Ministry
- Implementing agency

### 📊 Analytics & Visualization

The dashboard provides visual analytics using charts and graphs for better decision-making.

---

## 🏛️ SIH 2026 Details

| Category | Details |
|---|---|
| Hackathon | Smart India Hackathon 2026 |
| Problem Statement | SIH26103 |
| Problem Title | Use case on web-based integrated project-monitoring platform |
| Organization | Ministry of Statistics & Programme Implementation (MoSPI) |
| Division | Data Informatics & Innovation Division (DIID) |
| Category | Software |
| Theme | Smart Automation |
| Project | InfraWatch AI |

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Recharts
- Framer Motion
- Leaflet / OpenStreetMap

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- REST APIs

### Database

- MongoDB
- Mongoose

### AI / Machine Learning

- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  Dashboard & UI/UX   │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │      Backend         │
                    └───────┬───────┬──────┘
                            │       │
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌─────────────┐
                    │ MongoDB  │  │ Python ML   │
                    │ Database │  │ FastAPI     │
                    └──────────┘  └──────┬──────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │ Risk Prediction  │
                              │ & Analytics      │
                              └──────────────────┘