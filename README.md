# Thousand Words

A mobile-first grocery assistant: photograph an empty package, identify the product, match it against Kroger/King Soopers, and add it to the shopper's cart.

## Stack

- **Mobile:** React Native + Expo Router + TypeScript
- **Backend:** Java 21 + Spring Boot 3.5 + Spring Security + JWT
- **Database:** PostgreSQL + Flyway
- **AI:** OpenAI Responses API with image input and structured product extraction
- **Retail:** Kroger OAuth, Locations, Products, and Cart APIs
- **Infrastructure:** Docker Compose and GitHub Actions

## Quick start

### 1. Start PostgreSQL and the backend

```bash
cp .env.example .env
docker compose up --build
```

The API runs at `http://localhost:8080`.

### 2. Start the Expo app

```bash
cd apps/mobile
npm install
cp .env.example .env
npm run start
```

Use the iOS simulator, Android emulator, Expo Go, or `npm run web`.

## Demo account

Create an account in the app after starting the backend. Demo mode does not require OpenAI or Kroger credentials and uses deterministic recognition.

The demo cart action is explicitly simulated and does not change an external Kroger cart.

## Main flow

1. Sign in or create an account.
2. Take or select a package photo.
3. In demo mode, the backend returns a deterministic sample product.
4. Review and select the recognized product.
5. Simulate adding the selected UPC and receive an explicit demo result.

Live OpenAI recognition can be enabled for development, but production Kroger OAuth, catalog matching, and cart mutation remain release-candidate work.

## Environment

See `.env.example`, `apps/mobile/.env.example`, and `backend/src/main/resources/application.yml`.

The application runs without OpenAI or Kroger credentials in **demo mode**. Demo recognition and simulated cart actions are deterministic and clearly labeled in the UI.

## Repository layout

```text
apps/mobile              Expo application
backend                  Spring Boot API
.github/workflows        CI pipelines
docs                     Architecture and integration notes
```

## Tests

```bash
cd apps/mobile && npm test
cd backend && mvn test
```

## Security notes

- Passwords are BCrypt hashed.
- Access tokens are short-lived JWTs.
- Refresh tokens are rotated, revocable, and stored as SHA-256 hashes.
- API keys remain server-side.
- Image uploads are size/type limited and are not retained by default.

## Current MVP boundaries

The GitHub MVP is a complete local demo, not a production retail integration. Production release work still includes Kroger OAuth callback handling, token encryption, store and catalog matching, real cart mutation, Kroger application approval, privacy disclosures, App Store assets, observability, and cloud deployment.
