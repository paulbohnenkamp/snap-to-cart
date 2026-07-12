# Roadmap

## GitHub MVP — included

- Email/password registration and sign-in
- JWT access tokens with rotating, revocable refresh sessions
- Camera and photo-library capture
- Deterministic, clearly labeled demo recognition
- Explicitly simulated demo cart actions
- Scan history
- PostgreSQL migration, Docker Compose, and GitHub Actions CI
- Mobile lint, typecheck, and component tests
- Backend unit tests for authentication, demo recognition, and cart simulation

## Release candidate

- Structured OpenAI recognition hardened for production responses
- Kroger OAuth callback, encrypted token storage, and connection status
- Store selection and preferences
- Kroger product search, ranking, and alternate-match selection
- Quantity controls and real Kroger cart mutation
- End-to-end and Testcontainers integration coverage
- Hosted backend and managed PostgreSQL
- Universal/deep links for OAuth return
- Apple Sign in
- Image compression and background upload
- Crash reporting, structured logs, metrics, and tracing
- Privacy policy, data deletion, and account export
- TestFlight build and App Store metadata

## Post-launch

- Household sharing
- Pantry quantities and low-stock predictions
- Receipt reconciliation
- Nutrition-label extraction
- Dietary preferences and substitute ranking
- Multiple retailers through provider adapters
- Voice commands such as “add two of these”
- Home-screen widgets and Siri/App Intents

## Thousand Words platform

Future photo-to-action skills may include receipts, warranties, home inventory, contacts, repair parts, and nutrition. Grocery remains an isolated skill so platform expansion does not complicate the first release.
