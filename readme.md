# Preference Center API

This project implements a simple Preference Center API that allows users to manage their notification preferences. Users can opt to receive notifications via email, SMS, neither, or both. The API ensures a full history of consent change events for audit purposes.

## Table of Contents
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Database Migrations](#database-migrations)
- [API Overview](#api-overview)
- [Design Decisions](#design-decisions)
- [Limitations](#limitations)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (`.nvmrc` file provided)
- Docker (for running the Postgres database)

### Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:LukaPrebil/preference-manager-api.git
   cd preference-manager-api
   ```
2. Setup Node.JS
   ```sh
   nvm install
   nvm use
   ```
3. Install dependencies:
   ```sh
   npm i
   ```

### Running the Application
```sh
docker-compose up -d
npm run start
```

The API will be available at `http://localhost:3000`.

## Running Tests
To run the unit test suite, use:
```sh
npm test
```
The project also has E2E tests. To run those, a database is required
```sh
docker compose up -d
npm run build
npm run migration:up
```
To run end to end tests, use:
```sh
npm run test:e2e
```

## Database Migrations
To setup the database, run (make sure the postgres container is running):
```sh
npm run build
npm run migration:up
```
To revert the last migration:
```sh
npm run migration:down
```

## API Overview
The full swagger documentation can be found by running the API and navigating to `http://localhost:3000/docs#/`
### Endpoints
#### `POST /users`
Create a new user.

**Request:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "consents": []
}
```

#### `GET /users?email=`
Retrieve user and their latest consent state

#### `DELETE /users`
**Request:**
```json
{
  "id": "user@example.com"
}
```
Soft delete a user (email is hashed, events remain for audit purposes).

#### `POST /events`
Create a consent change event.

**Request:**
```json
{
  "eventType": "string",
  "payload": {
    "user": { "id": "uuid" },
    "consents": [
      { "id": "email_notifications", "enabled": true }
    ],
  }
}
```
**Response:**
```json
{
  "id": "uuid",
  "payload": {
    "user": { "id": "uuid" },
    "consents": [
      { "id": "email_notifications", "enabled": true }
    ]
  },
  "created": "Date"
}
```

## Design Decisions
- **Soft Delete:** When a user is deleted, their email is hashed, but events remain, allowing full restoration if a new create request is made with the same email.
- **Event History:** Every consent change is recorded as an immutable event to maintain an audit log.
- **Generic Events:** The change_event entity also contains a field `event_type`, which allows extending this for any other preferences in the future with minimal code change.

## Limitations
- **Authentication:** Not implemented, as it was not in scope.
- **Rate Limiting:** No rate limits have been enforced on API requests.
