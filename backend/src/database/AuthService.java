package database;

import java.sql.*;

public class AuthService {

    private Connection con;

    public AuthService(Connection con) {
        this.con = con;
    }

    public void initBaseTables() throws SQLException {
        try (Statement stmt = con.createStatement()) {
            stmt.executeUpdate(
                "CREATE TABLE IF NOT EXISTS login_credentials (" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "username VARCHAR(100) UNIQUE," +
                "password VARCHAR(100))"
            );
            stmt.executeUpdate(
                "CREATE TABLE IF NOT EXISTS user_databases (" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "username VARCHAR(100) UNIQUE," +
                "db_name VARCHAR(100))"
            );
        }
    }

    public void register(String username, String password) throws SQLException {
        String sql = "INSERT INTO login_credentials (username, password) VALUES (?, ?)";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.executeUpdate();
            System.out.println("Registration Successful!");
        }
    }

    public boolean checkLogin(String username, String password) throws SQLException {
        String sql = "SELECT * FROM login_credentials WHERE username = ? AND password = ?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    public boolean checkUsername(String username) throws SQLException {
        String sql = "SELECT * FROM login_credentials WHERE username = ?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    public String createUserDatabase(String username) throws SQLException {
        int nextId = 1;
        try (Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT IFNULL(MAX(id), 0) + 1 AS next_id FROM user_databases")) {
            if (rs.next()) {
                nextId = rs.getInt("next_id");
            }
        }
        String dbName = "user_db_" + nextId;

        // Create the actual database
        try (Statement stmt = con.createStatement()) {
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + dbName + "`");
        }

        // Record the mapping
        String sql = "INSERT INTO user_databases (username, db_name) VALUES (?, ?)";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, dbName);
            stmt.executeUpdate();
        }

        System.out.println("Created database '" + dbName + "' for user '" + username + "'.");
        return dbName;
    }

    public String getUserDatabase(String username) throws SQLException {
        String sql = "SELECT db_name FROM user_databases WHERE username = ?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("db_name");
                }
            }
        }
        return null;
    }

    public void useDatabase(String dbName) throws SQLException {
        try (Statement stmt = con.createStatement()) {
            stmt.executeUpdate("USE `" + dbName + "`");
        }
    }
}
