import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import * as En from 'blockly/msg/en';
import 'blockly/javascript';

// --- Custom Theme Definition ---
const DiscordDarkTheme = Blockly.Theme.defineTheme('discord_dark', {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
        'workspaceBackgroundColour': '#36393f',
        'toolboxBackgroundColour': '#2f3136',
        'toolboxForegroundColour': '#dcddde',
        'flyoutBackgroundColour': '#2f3136',
        'flyoutForegroundColour': '#dcddde',
        'flyoutOpacity': 1,
        'scrollbarColour': '#202225',
        'insertionMarkerColour': '#fff',
        'insertionMarkerOpacity': 0.3,
        'scrollbarOpacity': 0.4,
        'cursorColour': '#d0d0d0',
    },
    'fontStyle': {
        'family': 'sans-serif',
        'weight': 'bold',
        'size': 12,
    },
    'startHats': true,
});

// Initialize Blockly with English
Blockly.setLocale(En);

// =====================================================
// BLOCK DEFINITIONS - Wells and Hills Connector System
// =====================================================

// -----------------------------------------------
// 1. CREATE TABLE Block (Purple #9B59B6)
// Has a WELL (dip) that accepts COLUMN blocks
// -----------------------------------------------
Blockly.Blocks['sql_create_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("CREATE TABLE")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        // WELL for COLUMN blocks - only accepts 'sql_column' type
        this.appendStatementInput("COLUMNS")
            .setCheck("column_type");
        this.setColour("#9B59B6");
        this.setTooltip("Create a new table. Drag COLUMN blocks into the well below.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 2. COLUMN Block (Green #8BC34A with yellow border effect)
// Has a HILL (extrusion) that fits into CREATE TABLE's well
// -----------------------------------------------
Blockly.Blocks['sql_column'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("COLUMN")
            .appendField(new Blockly.FieldTextInput("column_name"), "COL_NAME")
            .appendField(new Blockly.FieldDropdown([
                ["INTEGER", "INTEGER"],
                ["VARCHAR(255)", "VARCHAR(255)"],
                ["TEXT", "TEXT"],
                ["BOOLEAN", "BOOLEAN"],
                ["TIMESTAMP", "TIMESTAMP"],
                ["DECIMAL(10,2)", "DECIMAL(10,2)"]
            ]), "COL_TYPE")
            .appendField(new Blockly.FieldDropdown([
                ["(none)", ""],
                ["PRIMARY KEY", "PRIMARY KEY"],
                ["NOT NULL", "NOT NULL"],
                ["UNIQUE", "UNIQUE"]
            ]), "COL_PROPERTY");
        // HILL - can stack with other COLUMN blocks inside CREATE TABLE
        this.setPreviousStatement(true, "column_type");
        this.setNextStatement(true, "column_type");
        this.setColour("#8BC34A");
        this.setTooltip("Define a column. Fits into CREATE TABLE's well.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 3. INSERT INTO Block (Cyan #00BCD4)
// Has a WELL that accepts COLUMN_VALUE blocks
// -----------------------------------------------
Blockly.Blocks['sql_insert'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("INSERT INTO")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        // WELL for column values - only accepts 'column_value_type'
        this.appendStatementInput("VALUES")
            .setCheck("column_value_type");
        this.setColour("#00BCD4");
        this.setTooltip("Insert data into a table. Drag Column Name blocks into the well.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 4. DELETE FROM Block (Brown #8D6E63)
// Has a WELL that accepts COLUMN_VALUE blocks
// -----------------------------------------------
Blockly.Blocks['sql_delete'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("DELETE FROM")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        // WELL for column values - only accepts 'column_value_type'
        this.appendStatementInput("VALUES")
            .setCheck("column_value_type");
        this.setColour("#8D6E63");
        this.setTooltip("Delete data from a table. Drag Column Name blocks to specify conditions.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 5. COLUMN NAME Block (Yellow #F1C40F)
// Has a HILL that fits into INSERT/DELETE wells
// -----------------------------------------------
Blockly.Blocks['sql_column_value'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("column name")
            .appendField(new Blockly.FieldTextInput("col"), "COL_NAME")
            .appendField("value")
            .appendField(new Blockly.FieldTextInput("value"), "COL_VALUE");
        // HILL - fits into INSERT INTO and DELETE FROM
        this.setPreviousStatement(true, "column_value_type");
        this.setNextStatement(true, "column_value_type");
        this.setColour("#F1C40F");
        this.setTooltip("Column name and value pair. Fits into INSERT INTO or DELETE FROM.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 6. SELECT FROM Block (Cyan #00BCD4)
// Has a WELL that accepts WHERE block
// -----------------------------------------------
Blockly.Blocks['sql_select'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("SELECT")
            .appendField(new Blockly.FieldTextInput("*"), "COLUMNS")
            .appendField("FROM")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        // WELL for WHERE block - only accepts 'where_type'
        this.appendStatementInput("WHERE_CLAUSE")
            .setCheck("where_type");
        this.setColour("#00BCD4");
        this.setTooltip("Select data from a table. Drag WHERE block into the well.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 7. WHERE Block (Orange #FF9800)
// Has a HILL that fits into SELECT's well
// Has a slot for condition blocks
// -----------------------------------------------
Blockly.Blocks['sql_where'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("WHERE");
        // Slot for condition blocks - accepts 'condition_type'
        this.appendValueInput("CONDITION")
            .setCheck("condition_type");
        // HILL - fits into SELECT FROM
        this.setPreviousStatement(true, "where_type");
        this.setColour("#FF9800");
        this.setTooltip("WHERE clause. Drag condition blocks into the slot.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 8. ORDER BY Block (Red #E53935)
// Has a dropdown for column selection
// -----------------------------------------------
Blockly.Blocks['sql_order_by'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("ORDER BY")
            .appendField(new Blockly.FieldTextInput("column_name"), "ORDER_COLUMN")
            .appendField(new Blockly.FieldDropdown([
                ["ASC", "ASC"],
                ["DESC", "DESC"]
            ]), "ORDER_DIR");
        // Can attach after WHERE
        this.setPreviousStatement(true, "where_type");
        this.setColour("#E53935");
        this.setTooltip("Order results by column.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 9. Boolean Condition - Column Compare (Pink #E91E63)
// dropdown(column) + dropdown(operator) + text(value)
// -----------------------------------------------
Blockly.Blocks['sql_condition_compare'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("column"), "LEFT_COL")
            .appendField(new Blockly.FieldDropdown([
                ["=", "="],
                ["!=", "!="],
                ["<", "<"],
                [">", ">"],
                ["<=", "<="],
                [">=", ">="],
                ["LIKE", "LIKE"]
            ]), "OPERATOR")
            .appendField(new Blockly.FieldTextInput("value"), "RIGHT_VALUE");
        // Output type for condition slot
        this.setOutput(true, "condition_type");
        this.setColour("#E91E63");
        this.setTooltip("Compare column to value. Fits into WHERE's condition slot.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 10. Boolean Condition - Column Dropdown Compare (Pink #E91E63)
// Uses dynamic dropdown for columns
// -----------------------------------------------
Blockly.Blocks['sql_condition_column_dropdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("column"), "LEFT_COL")
            .appendField(new Blockly.FieldDropdown([
                ["=", "="],
                ["!=", "!="],
                ["<", "<"],
                [">", ">"],
                ["<=", "<="],
                [">=", ">="]
            ]), "OPERATOR")
            .appendField(new Blockly.FieldTextInput("value"), "RIGHT_VALUE");
        this.setOutput(true, "condition_type");
        this.setColour("#E91E63");
        this.setTooltip("Compare column to value.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 11. Boolean Condition - Compound AND/OR (Pink #E91E63)
// condition + dropdown(AND, OR) + condition
// -----------------------------------------------
Blockly.Blocks['sql_condition_compound'] = {
    init: function () {
        this.appendValueInput("LEFT_CONDITION")
            .setCheck("condition_type");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["AND", "AND"],
                ["OR", "OR"]
            ]), "LOGICAL_OP");
        this.appendValueInput("RIGHT_CONDITION")
            .setCheck("condition_type");
        this.setInputsInline(true);
        this.setOutput(true, "condition_type");
        this.setColour("#E91E63");
        this.setTooltip("Combine two conditions with AND/OR.");
        this.setHelpUrl("");
    }
};

// -----------------------------------------------
// 12. UPDATE Block (Violet #7c3aed)
// -----------------------------------------------
Blockly.Blocks['sql_update'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("UPDATE")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        // WELL for SET values
        this.appendStatementInput("SET_VALUES")
            .setCheck("column_value_type")
            .appendField("SET");
        // WELL for WHERE condition
        this.appendStatementInput("WHERE_CLAUSE")
            .setCheck("where_type");
        this.setColour("#7c3aed");
        this.setTooltip("Update data in a table.");
        this.setHelpUrl("");
    }
};

// =====================================================
// SQL GENERATORS
// =====================================================

const sqlGenerator = new Blockly.Generator('SQL');

// CREATE TABLE generator
sqlGenerator['sql_create_table'] = function (block) {
    var tableName = block.getFieldValue('TABLE_NAME');
    var columns = sqlGenerator.statementToCode(block, 'COLUMNS');

    columns = columns.trim();
    if (columns.endsWith(',')) {
        columns = columns.slice(0, -1);
    }

    return `CREATE TABLE ${tableName} (\n${columns}\n);`;
};

// COLUMN generator
sqlGenerator['sql_column'] = function (block) {
    var colName = block.getFieldValue('COL_NAME');
    var colType = block.getFieldValue('COL_TYPE');
    var colProperty = block.getFieldValue('COL_PROPERTY');

    var propertyStr = colProperty ? ' ' + colProperty : '';
    return `  ${colName} ${colType}${propertyStr},\n`;
};

// INSERT INTO generator
sqlGenerator['sql_insert'] = function (block) {
    var tableName = block.getFieldValue('TABLE_NAME');
    var values = sqlGenerator.statementToCode(block, 'VALUES');

    // Parse column-value pairs
    var lines = values.trim().split('\n').filter(l => l.trim());
    var columns = [];
    var vals = [];

    lines.forEach(line => {
        var match = line.match(/(\w+)\s*=\s*(.+)/);
        if (match) {
            columns.push(match[1]);
            vals.push(match[2]);
        }
    });

    if (columns.length === 0) {
        return `INSERT INTO ${tableName} VALUES ();`;
    }

    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${vals.join(', ')});`;
};

// COLUMN VALUE generator
sqlGenerator['sql_column_value'] = function (block) {
    var colName = block.getFieldValue('COL_NAME');
    var colValue = block.getFieldValue('COL_VALUE');

    // Add quotes if not a number
    var valueStr = isNaN(colValue) ? `'${colValue}'` : colValue;
    return `${colName} = ${valueStr}\n`;
};

// DELETE FROM generator
sqlGenerator['sql_delete'] = function (block) {
    var tableName = block.getFieldValue('TABLE_NAME');
    var values = sqlGenerator.statementToCode(block, 'VALUES');

    // Parse conditions from column-value pairs
    var lines = values.trim().split('\n').filter(l => l.trim());
    var conditions = [];

    lines.forEach(line => {
        var match = line.match(/(\w+)\s*=\s*(.+)/);
        if (match) {
            conditions.push(`${match[1]} = ${match[2]}`);
        }
    });

    if (conditions.length === 0) {
        return `DELETE FROM ${tableName};`;
    }

    return `DELETE FROM ${tableName} WHERE ${conditions.join(' AND ')};`;
};

// SELECT FROM generator
sqlGenerator['sql_select'] = function (block) {
    var columns = block.getFieldValue('COLUMNS');
    var tableName = block.getFieldValue('TABLE_NAME');
    var whereClause = sqlGenerator.statementToCode(block, 'WHERE_CLAUSE');

    var sql = `SELECT ${columns} FROM ${tableName}`;

    if (whereClause.trim()) {
        sql += ' ' + whereClause.trim();
    }

    return sql + ';';
};

// WHERE generator
sqlGenerator['sql_where'] = function (block) {
    var condition = sqlGenerator.valueToCode(block, 'CONDITION', 0) || 'true';
    return `WHERE ${condition}\n`;
};

// ORDER BY generator
sqlGenerator['sql_order_by'] = function (block) {
    var column = block.getFieldValue('ORDER_COLUMN');
    var direction = block.getFieldValue('ORDER_DIR');
    return `ORDER BY ${column} ${direction}\n`;
};

// Condition Compare generator
sqlGenerator['sql_condition_compare'] = function (block) {
    var leftCol = block.getFieldValue('LEFT_COL');
    var operator = block.getFieldValue('OPERATOR');
    var rightValue = block.getFieldValue('RIGHT_VALUE');

    // Add quotes if not a number
    var valueStr = isNaN(rightValue) ? `'${rightValue}'` : rightValue;
    return [`${leftCol} ${operator} ${valueStr}`, 0];
};

// Condition Column Dropdown generator
sqlGenerator['sql_condition_column_dropdown'] = function (block) {
    var leftCol = block.getFieldValue('LEFT_COL');
    var operator = block.getFieldValue('OPERATOR');
    var rightValue = block.getFieldValue('RIGHT_VALUE');

    var valueStr = isNaN(rightValue) ? `'${rightValue}'` : rightValue;
    return [`${leftCol} ${operator} ${valueStr}`, 0];
};

// Compound Condition generator
sqlGenerator['sql_condition_compound'] = function (block) {
    var leftCondition = sqlGenerator.valueToCode(block, 'LEFT_CONDITION', 0) || 'true';
    var logicalOp = block.getFieldValue('LOGICAL_OP');
    var rightCondition = sqlGenerator.valueToCode(block, 'RIGHT_CONDITION', 0) || 'true';

    return [`(${leftCondition} ${logicalOp} ${rightCondition})`, 0];
};

// UPDATE generator
sqlGenerator['sql_update'] = function (block) {
    var tableName = block.getFieldValue('TABLE_NAME');
    var setValues = sqlGenerator.statementToCode(block, 'SET_VALUES');
    var whereClause = sqlGenerator.statementToCode(block, 'WHERE_CLAUSE');

    // Parse SET values
    var lines = setValues.trim().split('\n').filter(l => l.trim());
    var assignments = [];

    lines.forEach(line => {
        var match = line.match(/(\w+)\s*=\s*(.+)/);
        if (match) {
            assignments.push(`${match[1]} = ${match[2]}`);
        }
    });

    var sql = `UPDATE ${tableName} SET ${assignments.join(', ')}`;

    if (whereClause.trim()) {
        sql += ' ' + whereClause.trim();
    }

    return sql + ';';
};

// Scrub function for chaining blocks
sqlGenerator.scrub_ = function (block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? "" : sqlGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// =====================================================
// TOOLBOX DEFINITION
// =====================================================

const toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'DDL - Tables',
            colour: '#9B59B6',
            contents: [
                { kind: 'block', type: 'sql_create_table' },
                { kind: 'block', type: 'sql_column' }
            ]
        },
        {
            kind: 'category',
            name: 'DML - Insert/Update/Delete',
            colour: '#00BCD4',
            contents: [
                { kind: 'block', type: 'sql_insert' },
                { kind: 'block', type: 'sql_update' },
                { kind: 'block', type: 'sql_delete' },
                { kind: 'block', type: 'sql_column_value' }
            ]
        },
        {
            kind: 'category',
            name: 'DQL - Select',
            colour: '#00BCD4',
            contents: [
                { kind: 'block', type: 'sql_select' },
                { kind: 'block', type: 'sql_where' },
                { kind: 'block', type: 'sql_order_by' }
            ]
        },
        {
            kind: 'category',
            name: 'Conditions',
            colour: '#E91E63',
            contents: [
                { kind: 'block', type: 'sql_condition_compare' },
                { kind: 'block', type: 'sql_condition_compound' }
            ]
        }
    ]
};

// =====================================================
// COMPONENT
// =====================================================

const BlockEditor = ({ onQueryChange, onInit }) => {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);

    useEffect(() => {
        if (!blocklyDiv.current) return;

        // Inject Blockly WITHOUT toolbox (blocks come from left panel)
        workspaceRef.current = Blockly.inject(blocklyDiv.current, {
            scrollbars: true,
            trashcan: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.85,
                maxScale: 2,
                minScale: 0.4,
                scaleSpeed: 1.1
            },
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            },
            theme: DiscordDarkTheme
        });

        // Expose workspace
        if (onInit) {
            onInit(workspaceRef.current);
        }

        // Listener for code generation
        const updateListener = (event) => {
            if (event.type === Blockly.Events.BLOCK_CHANGE ||
                event.type === Blockly.Events.BLOCK_MOVE ||
                event.type === Blockly.Events.BLOCK_DELETE) {

                try {
                    const code = sqlGenerator.workspaceToCode(workspaceRef.current);
                    if (onQueryChange) {
                        onQueryChange(code);
                    }
                } catch (e) {
                    console.error("Block generation error", e);
                }
            }
        };

        workspaceRef.current.addChangeListener(updateListener);

        // Resize observer to handle window resizing
        const resizeObserver = new ResizeObserver(() => {
            Blockly.svgResize(workspaceRef.current);
        });
        resizeObserver.observe(blocklyDiv.current);

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
            resizeObserver.disconnect();
        };
    }, []); // Run once on mount

    return (
        <div
            ref={blocklyDiv}
            style={{ width: '100%', height: '100%', minHeight: '400px', display: 'block' }}
        />
    );
};

export default BlockEditor;
