package app.snaptocart.auth;

import app.snaptocart.config.AppProperties;
import app.snaptocart.security.JwtService;
import app.snaptocart.user.User;
import app.snaptocart.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository users;
    private final RefreshSessionRepository sessions;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AppProperties properties;

    public AuthService(UserRepository users, RefreshSessionRepository sessions, PasswordEncoder encoder, JwtService jwt, AppProperties properties) {
        this.users = users;
        this.sessions = sessions;
        this.encoder = encoder;
        this.jwt = jwt;
        this.properties = properties;
    }

    @Transactional
    public Tokens register(String name, String email, String password) {
        if (users.findByEmailIgnoreCase(email).isPresent()) throw new IllegalArgumentException("Email already registered");
        return issueTokens(users.save(new User(name, email, encoder.encode(password))));
    }

    @Transactional
    public Tokens login(String email, String password) {
        User user = users.findByEmailIgnoreCase(email).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!encoder.matches(password, user.passwordHash)) throw new IllegalArgumentException("Invalid credentials");
        return issueTokens(user);
    }

    @Transactional
    public Tokens refresh(String rawToken) {
        RefreshSession session = sessions.findByTokenHashAndRevokedAtIsNull(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (!session.expiresAt.isAfter(Instant.now())) {
            session.revokedAt = Instant.now();
            throw new IllegalArgumentException("Refresh token expired");
        }
        session.revokedAt = Instant.now();
        return issueTokens(session.user);
    }

    @Transactional
    public void logout(String rawToken) {
        sessions.findByTokenHashAndRevokedAtIsNull(hash(rawToken)).ifPresent(session -> session.revokedAt = Instant.now());
    }

    private Tokens issueTokens(User user) {
        String raw = UUID.randomUUID() + "." + UUID.randomUUID();
        sessions.save(new RefreshSession(user, hash(raw), Instant.now().plus(Duration.ofDays(properties.refreshTokenDays()))));
        return new Tokens(jwt.issue(user), raw);
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) {
            throw new IllegalStateException(error);
        }
    }

    public record Tokens(String accessToken, String refreshToken) {}
}
