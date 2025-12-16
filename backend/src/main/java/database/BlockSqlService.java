package database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BlockSqlService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public Object executeBlock(Map<String, Object> payload) {
        String dbName = (String) payload.get("dbName");
        String type = (String) payload.get("type");

        // Switch context
        jdbcTemplate.execute("USE `" + dbName + "`");

        switch (type) {
            case "create_table":
                return createTable(payload);
            case "insert":
                return insertRow(payload);
            case "select":
                return selectRows(payload);
            case "update":
                return updateRows(payload);
            case "delete":
                return deleteRows(payload);
            default:
                throw new IllegalArgumentException("Unknown block type: " + type);
        }
    }

    private String createTable(Map<String, Object> payload) {
        String tableName = (String) payload.get("table");
        List<Map<String, String>> columns = (List<Map<String, String>>) payload.get("columns");

        StringBuilder sb = new StringBuilder();
        sb.append("CREATE TABLE IF NOT EXISTS `").append(tableName).append("` (");
        sb.append("id INT AUTO_INCREMENT PRIMARY KEY");

        for (Map<String, String> col : columns) {
            sb.append(", `").append(col.get("name")).append("` ").append(col.get("type"));
        }
        sb.append(")");

        jdbcTemplate.execute(sb.toString());
        return "Table '" + tableName + "' created.";
    }

    private String insertRow(Map<String, Object> payload) {
        String tableName = (String) payload.get("table");
        List<Map<String, String>> values = (List<Map<String, String>>) payload.get("values");

        StringBuilder sbCols = new StringBuilder();
        StringBuilder sbPlaceholders = new StringBuilder();
        List<Object> args = new ArrayList<>();

        for (int i = 0; i < values.size(); i++) {
            if (i > 0) {
                sbCols.append(", ");
                sbPlaceholders.append(", ");
            }
            sbCols.append("`").append(values.get(i).get("col")).append("`");
            sbPlaceholders.append("?");
            args.add(values.get(i).get("val"));
        }

        String sql = "INSERT INTO `" + tableName + "` (" + sbCols + ") VALUES (" + sbPlaceholders + ")";
        int affected = jdbcTemplate.update(sql, args.toArray());
        return "Inserted " + affected + " row(s).";
    }

    private List<Map<String, Object>> selectRows(Map<String, Object> payload) {
        String tableName = (String) payload.get("table");
        String filterCol = (String) payload.get("filterCol");
        String filterVal = (String) payload.get("filterVal");

        if (filterCol != null && !filterCol.isBlank()) {
            return jdbcTemplate.queryForList("SELECT * FROM `" + tableName + "` WHERE `" + filterCol + "` = ?",
                    filterVal);
        } else {
            return jdbcTemplate.queryForList("SELECT * FROM `" + tableName + "`");
        }
    }

    private String updateRows(Map<String, Object> payload) {
        String tableName = (String) payload.get("table");
        String colToUpdate = (String) payload.get("col");
        String newValue = (String) payload.get("val");
        String filterCol = (String) payload.get("filterCol");
        String filterVal = (String) payload.get("filterVal");

        String sql = "UPDATE `" + tableName + "` SET `" + colToUpdate + "` = ? WHERE `" + filterCol + "` = ?";
        int affected = jdbcTemplate.update(sql, newValue, filterVal);
        return "Updated " + affected + " row(s).";
    }

    private String deleteRows(Map<String, Object> payload) {
        String tableName = (String) payload.get("table");
        String filterCol = (String) payload.get("filterCol");
        String filterVal = (String) payload.get("filterVal");

        String sql = "DELETE FROM `" + tableName + "` WHERE `" + filterCol + "` = ?";
        int affected = jdbcTemplate.update(sql, filterVal);
        return "Deleted " + affected + " row(s).";
    }
}
