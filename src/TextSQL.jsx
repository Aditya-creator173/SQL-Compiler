import React, { useState, useRef, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Database, Table, Plus, Trash2, Eraser, Bot, Play, Terminal, Menu, Moon, Sun, FileCode, Box, FileText, Loader2, Sparkles, Send } from 'lucide-react';

const ACTIONS = [
    { id: 'CREATE_TABLE', label: 'Create Table', icon: Table, color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { id: 'CREATE_DATABASE', label: 'Create Database', icon: Database, color: 'bg-cyan-100 text-cyan-900 border-cyan-200' },
    { id: 'INSERT_VALUES', label: 'Insert Values', icon: Plus, color: 'bg-violet-100 text-violet-900 border-violet-200' },
    { id: 'DELETE_TABLE', label: 'Delete Table', icon: Eraser, color: 'bg-lime-100 text-lime-900 border-lime-200' },
    { id: 'DELETE_DATABASE', label: 'Delete Database', icon: Trash2, color: 'bg-gray-200 text-gray-800 border-gray-300' },
    { id: 'DELETE_VALUES', label: 'Delete Values', icon: Trash2, color: 'bg-orange-100 text-orange-900 border-orange-200' },
];

export default function TextSQL({ theme, colors, onSwitchMode, activeMode, onToggleTheme }) {
    const [activeAction, setActiveAction] = useState(null);
    const [formData, setFormData] = useState({});
    const [aiMessage, setAiMessage] = useState("I'm ready to help you construct your query.");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const menuRef = useRef(null);

    // Placeholder for loading state and chat history to match App.jsx structure
    const isLoading = false;
    const chatHistory = [{ role: 'ai', content: aiMessage }];

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleActionClick = (actionId) => {
        setActiveAction(actionId);
        setFormData({}); // Reset form
        const actionLabel = ACTIONS.find(a => a.id === actionId).label;
        setAiMessage(`Selected: ${actionLabel}. Fill in the form above and I'll generate the SQL for you.`);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        // Placeholder for AI chat logic
        setChatInput('');
    };

    const renderInputForm = () => {
        switch (activeAction) {
            case 'CREATE_TABLE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs">1</span>
                            Enter table name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., users"
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />

                        <h3 className="text-lg font-bold flex items-center gap-2 mt-6" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</span>
                            Add Columns:
                        </h3>
                        <div className="p-4 rounded border border-dashed border-white/20 bg-white/5">
                            <p className="text-sm opacity-60 italic" style={{ color: colors.textMuted }}>Column definition inputs would go here...</p>
                        </div>
                    </div>
                );
            case 'CREATE_DATABASE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs">1</span>
                            Enter database name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., my_shop_db"
                            onChange={(e) => handleInputChange('dbName', e.target.value)}
                        />
                    </div>
                );
            case 'INSERT_VALUES':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">1</span>
                            Enter table name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., users"
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">2</span>
                            Enter values (comma separated):
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., 'John', 25"
                            onChange={(e) => handleInputChange('values', e.target.value)}
                        />
                    </div>
                );
            default:
                return (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <div className="p-4 rounded-full bg-cyan-500/10 mb-2">
                            <Sparkles className="w-8 h-8 text-cyan-500" />
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: colors.text }}>Ready to Build</h3>
                        <p className="max-w-xs text-sm" style={{ color: colors.textMuted }}>Select an action from the left sidebar to start generating SQL queries.</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full flex flex-col" style={{ backgroundColor: colors.bgTertiary }}>
            <PanelGroup direction="horizontal">
                {/* 1. LEFT PANE: Actions (15%) */}
                <Panel defaultSize={15} minSize={10} style={{ backgroundColor: colors.bgSecondary }}>
                    <div className="h-full p-4 overflow-y-auto space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4" style={{ color: colors.textMuted }}>Actions</h2>
                        {ACTIONS.map((action, idx) => (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${activeAction === action.id
                                    ? 'ring-2 ring-offset-2 ring-offset-transparent ring-cyan-500 scale-[1.02]'
                                    : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
                                    } ${action.color}`}
                            >
                                <span className="font-mono text-xs opacity-50 w-4">{idx + 1}</span>
                                <action.icon className="w-4 h-4" />
                                <span className="font-bold text-sm">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                {/* 2. MIDDLE PANE: Inputs + AI (55%) */}
                <Panel defaultSize={55} minSize={30}>
                    <PanelGroup direction="vertical">
                        {/* 2a. Top: Toolbar & Inputs (60%) */}
                        <Panel defaultSize={60} minSize={30}>
                            <div className="h-full flex flex-col" style={{ backgroundColor: colors.bg }}>
                                {/* Toolbar (Matches App.jsx) */}
                                <div className="px-4 py-2 backdrop-blur-sm flex items-center gap-3 relative z-50 border-b" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                                    <button
                                        onClick={onToggleTheme}
                                        className="px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 hover:opacity-80 hover:scale-110 hover:shadow-md"
                                        style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                                    >
                                        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    </button>

                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 hover:opacity-80 hover:scale-110 hover:shadow-md"
                                            style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                                        >
                                            <Menu className="w-4 h-4" />
                                            Menu
                                        </button>

                                        {isMenuOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                                                <button
                                                    onClick={() => { onSwitchMode('normal'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    <FileCode className="w-4 h-4" />
                                                    <span>Normal SQL</span>
                                                </button>
                                                <button
                                                    onClick={() => { onSwitchMode('block'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    <Box className="w-4 h-4" />
                                                    <span>Block SQL</span>
                                                </button>
                                                <button
                                                    onClick={() => { onSwitchMode('text'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm font-semibold"
                                                    style={{
                                                        backgroundColor: 'rgba(88, 101, 242, 0.1)',
                                                        color: colors.accent,
                                                        borderLeftWidth: '2px',
                                                        borderLeftColor: colors.accent
                                                    }}
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Text SQL</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <span className="ml-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Text SQL Mode</span>

                                    {/* Run Button (Matches App.jsx position) */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button
                                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 hover:scale-110 hover:shadow-lg"
                                        >
                                            <Play className="w-4 h-4" />
                                            Generate & Run
                                        </button>
                                    </div>
                                </div>

                                {/* Form Area */}
                                <div className="flex-1 p-8 overflow-y-auto">
                                    <div className="max-w-md mx-auto">
                                        <h2 className="text-2xl font-bold mb-6 pb-4 border-b" style={{ color: colors.text, borderColor: colors.border }}>Configuration</h2>
                                        {renderInputForm()}
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="h-1 hover:bg-fuchsia-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                        {/* 2b. Bottom: AI Assistant (40%) */}
                        <Panel defaultSize={40} minSize={20} style={{ backgroundColor: colors.bgSecondary }}>
                            <div className="h-full flex flex-col">
                                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                                    <Bot className="w-5 h-5 text-fuchsia-400" />
                                    <h2 className="font-semibold text-fuchsia-500">AI Assistant</h2>
                                </div>
                                <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-3">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex justify-start`}>
                                            <div className="max-w-[80%] rounded-lg p-3" style={{ color: colors.text, backgroundColor: colors.bgTertiary }}>
                                                <span className="text-fuchsia-500 mr-2">$</span>
                                                <span className="text-sm font-mono">{msg.content}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4" style={{ borderTopColor: colors.border, borderTopWidth: '1px' }}>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Ask AI for help..."
                                            className="flex-1 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                                            style={{ backgroundColor: colors.bgTertiary, borderColor: colors.border, borderWidth: '1px', color: colors.text }}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg font-semibold transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                {/* 3. RIGHT PANE: Results (30%) */}
                <Panel defaultSize={30} minSize={20} style={{ backgroundColor: colors.bgTertiary }}>
                    <div className="h-full flex flex-col p-4">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: colors.border }}>
                            <Terminal className="w-4 h-4 text-emerald-400" />
                            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: colors.text }}>Results</h2>
                        </div>
                        <div className="flex-1 rounded-lg border border-dashed flex items-center justify-center text-sm opacity-40" style={{ borderColor: colors.border, color: colors.textMuted }}>
                            Query results will appear here...
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}
