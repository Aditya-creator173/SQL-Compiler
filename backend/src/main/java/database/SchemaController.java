package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SchemaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/schema")
    public ResponseEntity<?> getSchema(@RequestParam String dbName) {
        try {
            // Get all tables in the specified database
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?",
                    dbName);

            Map<String, Object> schema = new HashMap<>();

            for (Map<String, Object> table : tables) {
                String tableName = (String) table.get("TABLE_NAME");

                // Get columns for each table
                List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                        "SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY " +
                                "FROM INFORMATION_SCHEMA.COLUMNS " +
                                "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? " +
                                "ORDER BY ORDINAL_POSITION",
                        dbName, tableName);

                List<Map<String, Object>> columnList = new ArrayList<>();
                for (Map<String, Object> col : columns) {
                    Map<String, Object> columnInfo = new HashMap<>();
                    columnInfo.put("name", col.get("COLUMN_NAME"));
                    columnInfo.put("type", col.get("DATA_TYPE"));
                    columnInfo.put("isPrimary", "PRI".equals(col.get("COLUMN_KEY")));
                    columnList.add(columnInfo);
                }

                Map<String, Object> tableInfo = new HashMap<>();
                tableInfo.put("columns", columnList);
                schema.put(tableName, tableInfo);
            }

            return ResponseEntity.ok(schema);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch schema: " + e.getMessage()));
        }
    }
}
