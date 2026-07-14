package app.snaptocart.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
@ConfigurationProperties(prefix="app") public record AppProperties(String jwtSecret,int accessTokenMinutes,int refreshTokenDays,boolean demoMode,String openaiApiKey,String openaiModel,String krogerClientId,String krogerClientSecret,String krogerRedirectUri) {}
