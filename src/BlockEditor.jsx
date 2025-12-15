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

// --- Custom Block Definitions ---

// 1. Create Table Block
Blockly.Blocks['sql_create_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("CREATE TABLE")
            .appendField(new Blockly.FieldTextInput("table_name"), "TABLE_NAME");
        this.appendStatementInput("COLUMNS")
            .setCheck("sql_column")
            .appendField("COLUMNS");
        this.setColour(230);
        this.setTooltip("Create a new table");
        this.setHelpUrl("");
    }
};

// 2. Column Block
Blockly.Blocks['sql_column'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Column")
            .appendField(new Blockly.FieldTextInput("col_name"), "COL_NAME")
            .appendField("Type")
            .appendField(new Blockly.FieldDropdown([
                ["INTEGER", "INTEGER"],
                ["VARCHAR(255)", "VARCHAR(255)"],
                ["TEXT", "TEXT"],
                ["BOOLEAN", "BOOLEAN"],
                ["TIMESTAMP", "TIMESTAMP"],
                ["DECIMAL", "DECIMAL(10,2)"]
            ]), "COL_TYPE");
        this.setPreviousStatement(true, "sql_column");
        this.setNextStatement(true, "sql_column");
        this.setColour(160);
        this.setTooltip("Define a column");
        this.setHelpUrl("");
    }
};

// 3. Insert into Block
Blockly.Blocks['sql_insert'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("INSERT INTO")
            .appendField(new Blockly.FieldTextInput("table"), "TABLE");
        this.appendValueInput("VALUES")
            .setCheck("String") // Simplified for MVP, effectively accepts text
            .appendField("VALUES");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("Insert data into a table");
    }
};

// 4. Update Block
Blockly.Blocks['sql_update'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("UPDATE")
            .appendField(new Blockly.FieldTextInput("table"), "TABLE");
        this.appendDummyInput()
            .appendField("SET")
            .appendField(new Blockly.FieldTextInput("col=val"), "ASSIGNMENT");
        this.appendDummyInput()
            .appendField("WHERE")
            .appendField(new Blockly.FieldTextInput("condition"), "CONDITION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("Update data in a table");
    }
};

// 5. Delete Block
Blockly.Blocks['sql_delete'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("DELETE FROM")
            .appendField(new Blockly.FieldTextInput("table"), "TABLE");
        this.appendDummyInput()
            .appendField("WHERE")
            .appendField(new Blockly.FieldTextInput("condition"), "CONDITION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("Delete data from a table");
    }
};

// --- Generator ---

const sqlGenerator = new Blockly.Generator('SQL');

sqlGenerator['sql_create_table'] = function (block) {
    var tableName = block.getFieldValue('TABLE_NAME');
    var columns = sqlGenerator.statementToCode(block, 'COLUMNS');
    // Remove trailing comma if exists (though blockly usually handles statement separation, we might need to join with commas)
    // Standard statementToCode returns a string of all concatenated statements

    // We need to act carefully here. statementToCode concatenates string results of sub-blocks. 
    // We will make sub-blocks return "col_def,\n".

    // Clean up last comma if present
    columns = columns.trim();
    if (columns.endsWith(',')) {
        columns = columns.slice(0, -1);
    }

    var code = `CREATE TABLE ${tableName} (\n${columns}\n);`;
    return code;
};

sqlGenerator['sql_column'] = function (block) {
    var colName = block.getFieldValue('COL_NAME');
    var colType = block.getFieldValue('COL_TYPE');
    return `  ${colName} ${colType},\n`; // Add comma for next item
};

sqlGenerator['sql_insert'] = function (block) {
    var table = block.getFieldValue('TABLE');
    // For MVP, we'll treat VALUES as a simple text input or value block.
    // Ideally, this would be a statement or list of values.
    // Let's assume user connects a text block or we just provide a dummy field for now if it's simpler.
    // Actually, let's change the block def to just use a text field for simplicity if 'value input' is too complex for MVP.
    // BUT the block def above uses 'appendValueInput'. Let's stick to that but handle if empty.
    var values = Blockly.JavaScript.valueToCode(block, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC) || "''";
    return `INSERT INTO ${table} VALUES (${values});\n`;
};

sqlGenerator['sql_update'] = function (block) {
    var table = block.getFieldValue('TABLE');
    var assignment = block.getFieldValue('ASSIGNMENT');
    var condition = block.getFieldValue('CONDITION');
    return `UPDATE ${table} SET ${assignment} WHERE ${condition};\n`;
};

sqlGenerator['sql_delete'] = function (block) {
    var table = block.getFieldValue('TABLE');
    var condition = block.getFieldValue('CONDITION');
    return `DELETE FROM ${table} WHERE ${condition};\n`;
};

sqlGenerator.scrub_ = function (block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? "" : sqlGenerator.blockToCode(nextBlock);
    return code + nextCode;
};


// --- Component ---

const BlockEditor = ({ onQueryChange }) => {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);

    useEffect(() => {
        if (!blocklyDiv.current) return;

        // Define toolbox
        // Define toolbox - Flat structure for persistent sidebar
        const toolbox = {
            kind: 'flyoutToolbox',
            contents: [
                { kind: 'label', text: 'DDL (Structure)' },
                { kind: 'block', type: 'sql_create_table' },
                { kind: 'block', type: 'sql_column' },
                { kind: 'sep', gap: '20' },
                { kind: 'label', text: 'DML (Data)' },
                { kind: 'block', type: 'sql_insert' },
                { kind: 'block', type: 'sql_update' },
                { kind: 'block', type: 'sql_delete' },
                { kind: 'sep', gap: '20' },
                { kind: 'label', text: 'Helpers' },
                { kind: 'block', type: 'text' },
                { kind: 'block', type: 'math_number' },
            ],
        };

        // Inject Blockly
        workspaceRef.current = Blockly.inject(blocklyDiv.current, {
            toolbox: toolbox,
            scrollbars: true,
            trashcan: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.85, // Adjusted per user feedback
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
            theme: DiscordDarkTheme // Applying our custom matched theme
        });

        // Listener
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

        // Initial setup if needed (maybe restore state later)

        return () => {
            workspaceRef.current.dispose();
        };
    }, []); // Run once on mount

    return (
        <div
            ref={blocklyDiv}
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
    );
};

export default BlockEditor;
