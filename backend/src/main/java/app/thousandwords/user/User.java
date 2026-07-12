package app.thousandwords.user;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="app_user") public class User { @Id public UUID id; public String name; public String email; @Column(name="password_hash") public String passwordHash; @Column(name="created_at") public Instant createdAt; protected User(){} public User(String name,String email,String hash){this.id=UUID.randomUUID();this.name=name;this.email=email.toLowerCase();this.passwordHash=hash;this.createdAt=Instant.now();} }
