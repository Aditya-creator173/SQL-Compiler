package database;

import java.sql.*;
import java.util.Scanner;

public class RawSqlService {

    private Connection con;
    private Scanner sc;

    public RawSqlService(Connection con, Scanner sc) {
        this.con = con;
        this.sc = sc;
    }

    public void handleRawMode() {
        while (true) {
            System.out.print("Enter your SQL action (or type 'exit' to go back): ");
            String action = sc.nextLine();
            if (action.equalsIgnoreCase("exit")) {
                System.out.println("Leaving raw SQL mode.");
                break;
            }

            try {
                userActions(action);
            } catch (SQLException e) {
                System.out.println("SQL Error: " + e.getMessage());
            }
        }
    }

    private void userActions(String actions) throws SQLException {
        try (Statement stmt = con.createStatement()) {
            boolean hasResultSet = stmt.execute(actions);
            if (hasResultSet) {
                try (ResultSet rs = stmt.getResultSet()) {
                    printResultSet(rs);
                }
            } else {
                int updated = stmt.getUpdateCount();
                System.out.println("Query OK, " + updated + " row(s) affected.");
            }
        }
    }

    private void printResultSet(ResultSet rs) throws SQLException {
        ResultSetMetaData meta = rs.getMetaData();
        int cols = meta.getColumnCount();

        // header
        for (int i = 1; i <= cols; i++) {
            System.out.print(meta.getColumnLabel(i) + (i == cols ? "" : " | "));
        }
        System.out.println();

        // rows
        while (rs.next()) {
            for (int i = 1; i <= cols; i++) {
                System.out.print(rs.getString(i) + (i == cols ? "" : " | "));
            }
            System.out.println();
        }
    }
}
