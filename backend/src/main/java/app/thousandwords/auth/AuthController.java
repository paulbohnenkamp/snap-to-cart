package app.thousandwords.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    ResponseEntity<?> register(@Valid @RequestBody Register request) {
        try {
            return ResponseEntity.status(201).body(auth.register(request.name(), request.email(), request.password()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
        }
    }

    @PostMapping("/login")
    ResponseEntity<?> login(@Valid @RequestBody Login request) {
        try {
            return ResponseEntity.ok(auth.login(request.email(), request.password()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.status(401).body(Map.of("message", error.getMessage()));
        }
    }

    @PostMapping("/refresh")
    ResponseEntity<?> refresh(@Valid @RequestBody Refresh request) {
        try {
            return ResponseEntity.ok(auth.refresh(request.refreshToken()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.status(401).body(Map.of("message", error.getMessage()));
        }
    }

    @PostMapping("/logout")
    Map<String, String> logout(@Valid @RequestBody Refresh request) {
        auth.logout(request.refreshToken());
        return Map.of("status", "logged-out");
    }

    public record Register(@NotBlank String name, @Email String email, @Size(min = 10) String password) {}
    public record Login(@Email String email, @NotBlank String password) {}
    public record Refresh(@NotBlank String refreshToken) {}
}
