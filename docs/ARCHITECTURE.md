# Architecture

The Expo client captures images and presents recognition results. The Spring Boot API owns identity, persistence, image interpretation, and cart-action orchestration.

```text
Expo app -> Spring Boot API -> PostgreSQL
                         |-> deterministic demo provider
                         |-> OpenAI Responses API (optional development path)
```

## Authentication

Registration and login return a 15-minute JWT plus a refresh token. Refresh tokens are stored as hashes, rotated on refresh, and revoked on logout. The mobile app stores both tokens in Expo SecureStore and retries an authenticated request once after refreshing.

## Demo scan pipeline

1. The client uploads a JPEG, PNG, or WebP multipart image.
2. Spring validates the configured 10 MB multipart limit and the controller validates media type.
3. Demo mode returns a deterministic grocery product with a UPC.
4. The scan and recognized product are persisted for the authenticated user.
5. The client lets the user select the result.
6. The backend returns an explicit `demo-added` result; no external cart is changed.

## Optional OpenAI path

When demo mode is disabled and an OpenAI key is configured, `OpenAiVisionProvider` sends the image to the Responses API. This path extracts recognition details only. It does not currently resolve products against the Kroger catalog, so live recognition results do not have actionable UPCs and the client refuses to claim a cart success.

## Production integration boundary

`VisionProvider` keeps recognition replaceable. A production retail boundary still needs to be implemented for Kroger OAuth callback and token storage, location selection, catalog matching, and cart mutation.
