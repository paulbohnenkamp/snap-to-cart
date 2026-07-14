# AGENTS.md

## Product intent

Snap to Cart turns package photos into useful actions. The first production skill is grocery replenishment through King Soopers/Kroger.

## Engineering rules

- Keep the mobile app in TypeScript with Expo Router.
- Keep credentials and third-party API calls in the Spring Boot backend.
- Prefer small feature-oriented modules over generic utility layers.
- Never log raw passwords, JWTs, Kroger tokens, OpenAI keys, or image bytes.
- Preserve demo mode so contributors can run the full UI without paid credentials.
- Add tests with every behavior change.
- Use accessible labels and minimum 44pt touch targets.

## Core domain

- User
- RefreshSession
- GroceryScan
- RecognizedProduct
- StorePreference
- KrogerConnection
- CartAction

## Mobile conventions

- `app/` contains routes only.
- `src/features/` owns feature UI, state, and services.
- `src/components/` contains reusable presentation components.
- TanStack Query owns server state; Zustand owns local session/preferences.
- Never embed backend secrets in Expo environment variables.

## Backend conventions

- Controllers validate transport input and delegate.
- Services own orchestration and transactions.
- Repositories contain persistence only.
- External integrations live under `integration/`.
- DTOs are records.
- Use Testcontainers for integration tests where Docker is available.

## Definition of done

- Mobile lint, typecheck, and tests pass.
- Backend tests pass.
- Docker Compose starts cleanly.
- README and ROADMAP reflect behavior.
- No placeholder buttons in the primary scan-to-cart path.
