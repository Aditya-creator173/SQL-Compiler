package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private static final String HOST = "localhost";
    private static final String PORT = "3306";
    private static final String BASE_DB = "new_project"; // control DB
    private static final String USER = "root";
    private static final String PASS = "root";

    private static Connection con;

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        if (con == null || con.isClosed()) {
            // Optional: Load driver if needed (modern JDBC often doesn't need this explicit call but good for compatibility)
            // Class.forName("com.mysql.cj.jdbc.Driver");
            
            String url = "jdbc:mysql://" + HOST + ":" + PORT + "/" + BASE_DB + "?useSSL=false";
            con = DriverManager.getConnection(url, USER, PASS);
        }
        return con;
    }
    
    public static void closeConnection() throws SQLException {
        if (con != null && !con.isClosed()) {
            con.close();
        }
    }
}
