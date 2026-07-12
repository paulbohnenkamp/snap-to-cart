package app.thousandwords.kroger;

import app.thousandwords.config.AppProperties;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class KrogerServiceTest {
    @Test
    void demoCartActionIsExplicitlySimulated() {
        KrogerService service = new KrogerService(properties(true));

        assertEquals("demo-added", service.add("011110038948", 2).get("status"));
    }

    @Test
    void productionCartActionDoesNotClaimSuccessWithoutIntegration() {
        KrogerService service = new KrogerService(properties(false));

        assertThrows(IllegalStateException.class, () -> service.add("011110038948", 1));
    }

    private AppProperties properties(boolean demoMode) {
        return new AppProperties("development-secret-change-me-please-123456", 15, 30, demoMode, "", "gpt-4.1-mini", "", "", "x");
    }
}
