package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class RawSqlService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public Object executeRawSql(String sql, String dbName) {
        String upperSql = sql.trim().toUpperCase();

        // Handle USE command specially - changes the session database
        if (upperSql.startsWith("USE ")) {
            jdbcTemplate.execute(sql);
            return "Database changed.";
        }

        // Handle CREATE DATABASE / DROP DATABASE (don't need USE first)
        if (upperSql.startsWith("CREATE DATABASE") || upperSql.startsWith("DROP DATABASE")) {
            jdbcTemplate.execute(sql);
            return "Command executed successfully.";
        }

        // Handle SHOW commands (queries that return results)
        if (upperSql.startsWith("SHOW ")) {
            // Switch database first for SHOW TABLES etc
            if (upperSql.contains("TABLES") && dbName != null && !dbName.isEmpty()) {
                jdbcTemplate.execute("USE `" + dbName + "`");
            }
            return jdbcTemplate.queryForList(sql);
        }

        // Handle DESCRIBE / DESC commands
        if (upperSql.startsWith("DESCRIBE ") || upperSql.startsWith("DESC ")) {
            jdbcTemplate.execute("USE `" + dbName + "`");
            return jdbcTemplate.queryForList(sql);
        }

        // For all other commands, switch to user's database first
        if (dbName != null && !dbName.isEmpty()) {
            jdbcTemplate.execute("USE `" + dbName + "`");
        }

        // SELECT and similar queries
        if (upperSql.startsWith("SELECT")) {
            return jdbcTemplate.queryForList(sql);
        } else {
            // DDL/DML commands (CREATE TABLE, INSERT, UPDATE, DELETE, etc.)
            jdbcTemplate.execute(sql);
            return "Query executed successfully.";
        }
    }
}
