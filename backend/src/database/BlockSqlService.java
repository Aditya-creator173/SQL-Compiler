package database;

import java.sql.*;
import java.util.Scanner;

public class BlockSqlService {

    private Connection con;
    private Scanner sc;

    public BlockSqlService(Connection con, Scanner sc) {
        this.con = con;
        this.sc = sc;
    }

    public void handleBlockMode() {
        while (true) {
            System.out.println("\nBlock SQL Menu");
            System.out.println("1. Create table");
            System.out.println("2. Insert row");
            System.out.println("3. Select rows");
            System.out.println("4. Update rows");
            System.out.println("5. Delete rows");
            System.out.println("6. Back to main menu");
            System.out.print("Choose block: ");

            String choice = sc.nextLine();

            try {
                switch (choice) {
                    case "1":
                        blockCreateTable();
                        break;
                    case "2":
                        blockInsertRow();
                        break;
                    case "3":
                        blockSelectRows();
                        break;
                    case "4":
                        blockUpdateRows();
                        break;
                    case "5":
                        blockDeleteRows();
                        break;
                    case "6":
                        System.out.println("Leaving block SQL mode.");
                        return;
                    default:
                        System.out.println("Invalid option. Try again.");
                }
            } catch (SQLException e) {
                System.out.println("SQL Error in block: " + e.getMessage());
            }
        }
    }

    private void blockCreateTable() throws SQLException {
        System.out.print("Enter table name: ");
        String tableName = sc.nextLine();

        System.out.print("How many columns (excluding id)?: ");
        int cols = Integer.parseInt(sc.nextLine());

        StringBuilder sb = new StringBuilder();
        sb.append("CREATE TABLE IF NOT EXISTS `").append(tableName).append("` (");
        sb.append("id INT AUTO_INCREMENT PRIMARY KEY");

        for (int i = 1; i <= cols; i++) {
            System.out.print("Column " + i + " name: ");
            String colName = sc.nextLine();
            System.out.print("Column " + i + " type (e.g., VARCHAR(100), INT): ");
            String colType = sc.nextLine();
            sb.append(", `").append(colName).append("` ").append(colType);
        }
        sb.append(")");

        String sql = sb.toString();
        try (Statement stmt = con.createStatement()) {
            stmt.executeUpdate(sql);
            System.out.println("Table '" + tableName + "' created (if it did not exist).");
        }
    }

    private void blockInsertRow() throws SQLException {
        System.out.print("Enter table name: ");
        String tableName = sc.nextLine();

        System.out.print("Number of columns you want to insert into: ");
        int cols = Integer.parseInt(sc.nextLine());

        String[] colNames = new String[cols];
        for (int i = 0; i < cols; i++) {
            System.out.print("Column " + (i + 1) + " name: ");
            colNames[i] = sc.nextLine();
        }

        StringBuilder sbCols = new StringBuilder();
        StringBuilder sbPlaceholders = new StringBuilder();
        for (int i = 0; i < cols; i++) {
            if (i > 0) {
                sbCols.append(", ");
                sbPlaceholders.append(", ");
            }
            sbCols.append("`").append(colNames[i]).append("`");
            sbPlaceholders.append("?");
        }

        String sql = "INSERT INTO `" + tableName + "` (" + sbCols + ") VALUES (" + sbPlaceholders + ")";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            for (int i = 0; i < cols; i++) {
                System.out.print("Value for " + colNames[i] + ": ");
                String value = sc.nextLine();
                ps.setString(i + 1, value);
            }
            int affected = ps.executeUpdate();
            System.out.println("Inserted " + affected + " row(s).");
        }
    }

    private void blockSelectRows() throws SQLException {
        System.out.print("Enter table name: ");
        String tableName = sc.nextLine();

        System.out.print("Filter column name (or leave empty for no filter): ");
        String filterCol = sc.nextLine();

        String sql;
        boolean hasFilter = filterCol != null && !filterCol.isBlank();

        if (hasFilter) {
            sql = "SELECT * FROM `" + tableName + "` WHERE `" + filterCol + "` = ?";
        } else {
            sql = "SELECT * FROM `" + tableName + "`";
        }

        if (hasFilter) {
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                System.out.print("Filter value: ");
                String value = sc.nextLine();
                ps.setString(1, value);
                try (ResultSet rs = ps.executeQuery()) {
                    printResultSet(rs);
                }
            }
        } else {
            try (Statement stmt = con.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                printResultSet(rs);
            }
        }
    }

    private void blockUpdateRows() throws SQLException {
        System.out.print("Enter table name: ");
        String tableName = sc.nextLine();

        System.out.print("Column to update: ");
        String colToUpdate = sc.nextLine();

        System.out.print("New value: ");
        String newValue = sc.nextLine();

        System.out.print("Filter column name (e.g., id): ");
        String filterCol = sc.nextLine();

        System.out.print("Filter value: ");
        String filterValue = sc.nextLine();

        String sql = "UPDATE `" + tableName + "` SET `" + colToUpdate + "` = ? WHERE `" + filterCol + "` = ?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, newValue);
            ps.setString(2, filterValue);
            int affected = ps.executeUpdate();
            System.out.println("Updated " + affected + " row(s).");
        }
    }

    private void blockDeleteRows() throws SQLException {
        System.out.print("Enter table name: ");
        String tableName = sc.nextLine();

        System.out.print("Filter column name (e.g., id): ");
        String filterCol = sc.nextLine();

        System.out.print("Filter value: ");
        String filterValue = sc.nextLine();

        String sql = "DELETE FROM `" + tableName + "` WHERE `" + filterCol + "` = ?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, filterValue);
            int affected = ps.executeUpdate();
            System.out.println("Deleted " + affected + " row(s).");
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
