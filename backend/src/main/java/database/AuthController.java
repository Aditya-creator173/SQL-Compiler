package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostConstruct
    public void init() {
        authService.initBaseTables();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing username or password"));
        }

        if (authService.checkUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        authService.register(username, password);
        String dbName = authService.createUserDatabase(username);

        return ResponseEntity.ok(Map.of("message", "Registered successfully", "dbName", dbName));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (authService.checkLogin(username, password)) {
            String dbName = authService.getUserDatabase(username);
            if (dbName == null) {
                dbName = authService.createUserDatabase(username);
            }
            return ResponseEntity.ok(Map.of("message", "Login successful", "username", username, "dbName", dbName));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
}
