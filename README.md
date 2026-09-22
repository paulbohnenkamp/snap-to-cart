# Snap to Cart

Snap to Cart is a mobile-first grocery assistant that turns a package photo into
a recognized product and a simulated cart action.

## What it demonstrates

- Sign-in and protected mobile workflows.
- Image-based product recognition with deterministic demo mode.
- Structured product extraction, catalog matching, and an explicit review step.
- A simulated cart flow that does not mutate a real retailer cart.
- Server-side credentials, short-lived JWTs, refresh-token rotation, and
  integration boundaries for Kroger and OpenAI.

## AI interaction flow

1. A user signs in and submits a package photo.
2. Demo mode or the optional OpenAI path extracts a candidate product.
3. The user reviews the result before the app matches it to a retailer catalog.
4. The app returns a simulated cart action; live retailer mutation is not part
   of the demo flow.

This demonstrates image understanding, structured extraction, human review,
provider isolation, and safe integration boundaries around external APIs.

## Technology used

- **React Native / Expo Router** — provide the mobile scan-and-review UI.
- **TypeScript** — manage client state, navigation, and API boundaries.
- **Java 21 / Spring Boot / Spring Security** — own backend workflows and auth.
- **JWT / PostgreSQL / Flyway** — implement sessions and durable domain state.
- **OpenAI Responses API** — provides optional image understanding.
- **Kroger APIs** — support optional catalog and retailer integration.
- **Docker Compose / GitHub Actions** — support local services and CI.

## Quick start

Start PostgreSQL and the backend:

```bash
cp .env.example .env
docker compose up --build
```

Then start the Expo app:

```bash
cd apps/mobile
npm install
cp .env.example .env
npm run start
```

Demo mode works without OpenAI or Kroger credentials and keeps recognition and
cart actions deterministic.

## Further reading

- [Architecture](docs/ARCHITECTURE.md)
- [Mobile application package](apps/mobile/package.json)
- [Backend build](backend/pom.xml)
- [Contributor guidance](AGENTS.md)
