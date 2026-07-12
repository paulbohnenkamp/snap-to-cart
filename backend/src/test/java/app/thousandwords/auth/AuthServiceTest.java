package app.thousandwords.auth;

import app.thousandwords.config.AppProperties;
import app.thousandwords.security.JwtService;
import app.thousandwords.user.User;
import app.thousandwords.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final AppProperties properties = new AppProperties(
            "development-secret-change-me-please-123456", 15, 30, true, "", "gpt-4.1-mini", "", "", "x"
    );

    @Test
    void rejectsDuplicateEmail() {
        UserRepository users = mock(UserRepository.class);
        when(users.findByEmailIgnoreCase("a@b.com")).thenReturn(Optional.of(new User("A", "a@b.com", "x")));
        AuthService service = service(users, mock(RefreshSessionRepository.class));

        assertThrows(IllegalArgumentException.class, () -> service.register("A", "a@b.com", "Password123!"));
    }

    @Test
    void refreshRotatesTheSession() {
        RefreshSessionRepository sessions = mock(RefreshSessionRepository.class);
        RefreshSession current = new RefreshSession(new User("A", "a@b.com", "x"), "hash", Instant.now().plusSeconds(60));
        when(sessions.findByTokenHashAndRevokedAtIsNull(anyString())).thenReturn(Optional.of(current));
        AuthService service = service(mock(UserRepository.class), sessions);

        AuthService.Tokens tokens = service.refresh("refresh-token");

        assertNotNull(current.revokedAt);
        assertFalse(tokens.accessToken().isBlank());
        assertFalse(tokens.refreshToken().isBlank());
        verify(sessions).save(any(RefreshSession.class));
    }

    @Test
    void logoutRevokesTheSession() {
        RefreshSessionRepository sessions = mock(RefreshSessionRepository.class);
        RefreshSession current = new RefreshSession(new User("A", "a@b.com", "x"), "hash", Instant.now().plusSeconds(60));
        when(sessions.findByTokenHashAndRevokedAtIsNull(anyString())).thenReturn(Optional.of(current));

        service(mock(UserRepository.class), sessions).logout("refresh-token");

        assertNotNull(current.revokedAt);
    }

    private AuthService service(UserRepository users, RefreshSessionRepository sessions) {
        return new AuthService(users, sessions, new BCryptPasswordEncoder(), new JwtService(properties), properties);
    }
}
