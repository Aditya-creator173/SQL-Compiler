package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void initBaseTables() {
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS login_credentials (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "username VARCHAR(100) UNIQUE," +
                        "password VARCHAR(100))");
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS user_databases (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "username VARCHAR(100) UNIQUE," +
                        "db_name VARCHAR(100))");
    }

    public void register(String username, String password) {
        String sql = "INSERT INTO login_credentials (username, password) VALUES (?, ?)";
        jdbcTemplate.update(sql, username, password);
    }

    public boolean checkLogin(String username, String password) {
        String sql = "SELECT COUNT(*) FROM login_credentials WHERE username = ? AND password = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username, password);
        return count != null && count > 0;
    }

    public boolean checkUsername(String username) {
        String sql = "SELECT COUNT(*) FROM login_credentials WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    @Transactional
    public String createUserDatabase(String username) {
        // Calculate next ID manually (as per original logic, though AUTO_INCREMENT is
        // better)
        // Original logic: SELECT IFNULL(MAX(id), 0) + 1 ...
        String idSql = "SELECT IFNULL(MAX(id), 0) + 1 FROM user_databases";
        Integer nextId = jdbcTemplate.queryForObject(idSql, Integer.class);
        if (nextId == null)
            nextId = 1;

        String dbName = "user_db_" + nextId;

        // Create database
        jdbcTemplate.execute("CREATE DATABASE IF NOT EXISTS `" + dbName + "`");

        // Record mapping
        String insertSql = "INSERT INTO user_databases (username, db_name) VALUES (?, ?)";
        jdbcTemplate.update(insertSql, username, dbName);

        return dbName;
    }

    public String getUserDatabase(String username) {
        String sql = "SELECT db_name FROM user_databases WHERE username = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, username);
        } catch (Exception e) {
            return null;
        }
    }
}
