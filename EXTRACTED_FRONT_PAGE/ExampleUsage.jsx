import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LoginScreen, SignUpScreen } from './FrontPageComponents';
import './index.css';

/**
 * Example App demonstrating how to use the extracted front page components
 */
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('dark');

    // Handle successful login
    const handleLogin = (userData) => {
        console.log('User logged in:', userData);
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Handle successful signup (redirects to login)
    const handleSignUp = () => {
        console.log('User signed up successfully');
        setIsSignUpMode(false);
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    // If not authenticated, show login or signup screen
    if (!isAuthenticated) {
        return isSignUpMode ? (
            <SignUpScreen
                onSignUp={handleSignUp}
                theme={theme}
                onSwitchToLogin={() => setIsSignUpMode(false)}
            />
        ) : (
            <LoginScreen
                onLogin={handleLogin}
                theme={theme}
                onSwitchToSignUp={() => setIsSignUpMode(true)}
            />
        );
    }

    // Main application (after login)
    return (
        <div className="h-screen w-screen bg-slate-900 text-white flex items-center justify-center flex-col gap-4">
            <h1 className="text-4xl font-bold">Welcome, {user?.username}!</h1>
            <p className="text-slate-400">You are now logged in to the application.</p>
            <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all active:scale-95"
            >
                Logout
            </button>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all active:scale-95"
            >
                Toggle Theme (Current: {theme})
            </button>
        </div>
    );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

export default App;
