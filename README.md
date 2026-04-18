<div align="center">
  <h1>🎵 Muzak</h1>
  <p>Music intelligence platform powered by AI. Paste a Spotify link and get a deep editorial analysis of any album or artist — historical context, lyrical themes, mood profile, and semantic discovery.</p>

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js)
![Kafka](https://img.shields.io/badge/Apache_Kafka-3.x-231F20?style=flat-square&logo=apachekafka)
![Qdrant](https://img.shields.io/badge/Qdrant-vector_db-DC244C?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker)
</div>

---

## Overview

Muzak is a full-stack SaaS built as a personal learning project to explore event-driven architecture, AI agent workflows, and semantic search at scale.

The user pastes a Spotify link. Laravel publishes an event to **Kafka**. A queue worker picks it up and runs a **Claude AI agent** (via `laravel/ai`) that autonomously calls tools — Spotify API for metadata, Genius for lyrics, Wikipedia for historical context — and generates a rich editorial report. Results are stored in **MySQL** and indexed as vector embeddings in **Qdrant**. The frontend receives the report in real time via **Laravel Reverb** WebSockets.

The second feature is **semantic search**: describe what you want to hear in natural language and Qdrant returns the closest matches from the analyzed catalog.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 + Inertia.js |
| Frontend | Vue 3 + Pinia |
| AI Agent | `laravel/ai` (Anthropic Claude) |
| Message Bus | Apache Kafka (KRaft, no Zookeeper) |
| Queue | Laravel Horizon + Redis |
| Vector DB | Qdrant |
| WebSocket | Laravel Reverb |
| Database | MySQL 8 |
| Infra | Docker Compose |

## Architecture

```
User → Laravel API → Kafka → Queue Worker
                                   ↓
                           laravel/ai Agent
                           ├── Spotify API
                           ├── Genius API
                           └── Wikipedia
                                   ↓
                      MySQL + Qdrant (embeddings)
                                   ↓
                      Reverb → WebSocket → Vue 3
```

Kafka decouples the HTTP request from the AI workload. The agent loop runs asynchronously, streaming progress updates to the frontend as each tool is called. Qdrant enables semantic queries that go beyond keyword matching — finding albums that *feel* a certain way, not just match a string.

## Getting Started

**Requirements:** Docker, Docker Compose, Composer

```bash
# 1. Clone the repo
git clone https://github.com/your-username/muzak
cd muzak

# 2. Create the Laravel project
composer create-project laravel/laravel .

# 3. Configure environment
cp .env.example .env

# Fill in your API keys in .env:
# ANTHROPIC_API_KEY=
# SPOTIFY_CLIENT_ID=
# SPOTIFY_CLIENT_SECRET=
# GENIUS_ACCESS_TOKEN=

# 4. Start all services
docker compose up -d --build

# 5. Initialize Laravel
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate

# 6. Install frontend dependencies
docker compose exec vite npm install
```

Open **http://localhost:8000**

## Services

| Service | Port |
|---|---|
| Application | `localhost:8000` |
| Reverb WebSocket | `localhost:8080` |
| Qdrant API | `localhost:6333` |
| Kafka (external) | `localhost:9094` |
| MySQL | `localhost:3306` |
