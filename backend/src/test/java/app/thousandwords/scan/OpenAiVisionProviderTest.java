package app.thousandwords.scan;
import app.thousandwords.config.AppProperties; import com.fasterxml.jackson.databind.ObjectMapper; import org.junit.jupiter.api.Test; import static org.junit.jupiter.api.Assertions.*;
class OpenAiVisionProviderTest { @Test void demoModeReturnsProduct(){var p=new AppProperties("development-secret-change-me-please-123456",15,30,true,"","gpt-4.1-mini","","","x");var v=new OpenAiVisionProvider(p,new ObjectMapper());assertTrue(v.demoMode());assertFalse(v.recognize(new byte[0],"image/jpeg").isEmpty());} }
