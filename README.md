# Scalable Notification Service

A robust, event-driven notification system built with Node.js, Express, RabbitMQ, and MySQL. This project demonstrates microservices architecture by decoupling the API (producer) from the notification processing (consumer) using a message queue.

## 🚀 Architecture

* **API Service:** RESTful API that accepts notification requests and pushes them to RabbitMQ.
* **RabbitMQ:** Message broker that buffers tasks, ensuring reliability even under high load.
* **Consumer Service:** Background worker that pulls messages, fetches templates from the DB, and simulates sending notifications.
* **MySQL:** Relational database storing notification templates.

## 🛠️ Tech Stack
* **Language:** JavaScript (Node.js)
* **Containerization:** Docker & Docker Compose
* **Database:** MySQL
* **Message Queue:** RabbitMQ
* **Testing:** Jest & Supertest

## 📦 Setup & Running

**Prerequisites:** Docker and Docker Compose installed.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd notification-service
    ```

2.  **Start the services:**
    ```bash
    docker-compose up --build
    ```
    *Wait for the logs to say "API Service running on port 8080".*

3.  **Access the API:**
    The API will be available at `http://localhost:5000`.

## 🧪 Testing

The project includes an automated test suite running inside the Docker container.

To run the tests:
```bash
docker-compose exec api npm test
```

## 📡 API Endpoints

### 1. Get All Templates
* **URL:** `/api/templates`
* **Method:** `GET`
* **Success Response:** `200 OK`
* **Response Example:**
    ```json
    [
      {
        "id": "1",
        "name": "welcome-email",
        "subject": "Welcome!",
        "body": "Hi {name}...",
        "type": "EMAIL"
      }
    ]
    ```

### 2. Send Notification
* **URL:** `/api/notifications`
* **Method:** `POST`
* **Body:**
    ```json
    {
      "recipient": "user@example.com",
      "type": "EMAIL",
      "templateId": "1",
      "params": {
        "name": "User Name"
      }
    }
    ```
* **Success Response:** `202 Accepted`