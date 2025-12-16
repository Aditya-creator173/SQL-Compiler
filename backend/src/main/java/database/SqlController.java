package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sql")
public class SqlController {

    @Autowired
    private RawSqlService rawSqlService;

    @Autowired
    private BlockSqlService blockSqlService;

    @PostMapping("/raw")
    public ResponseEntity<?> executeRaw(@RequestBody Map<String, String> payload) {
        String sql = payload.get("sql");
        String dbName = payload.get("dbName");

        if (dbName == null)
            return ResponseEntity.badRequest().body(Map.of("error", "dbName is required"));

        try {
            Object result = rawSqlService.executeRawSql(sql, dbName);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "SQL Error: " + e.getMessage()));
        }
    }

    @PostMapping("/block")
    public ResponseEntity<?> executeBlock(@RequestBody Map<String, Object> payload) {
        String dbName = (String) payload.get("dbName");
        if (dbName == null)
            return ResponseEntity.badRequest().body(Map.of("error", "dbName is required"));

        try {
            Object result = blockSqlService.executeBlock(payload);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Block execution error: " + e.getMessage()));
        }
    }
}
