import React, { useState } from 'react';
import { GridScan } from './GridScan';
import PixelCard from './PixelCard';
import GlassSurface from './GlassSurface';
import { Database, User, Lock, LogIn } from 'lucide-react';

// Discord Color Themes
const THEMES = {
    dark: {
        bg: '#36393f',
        bgSecondary: '#2f3136',
        bgTertiary: '#202225',
        text: '#dcddde',
        textSecondary: '#b9bbbe',
        textMuted: '#72767d',
        accent: '#5865f2',
        border: '#202225',
    },
    light: {
        bg: '#ffffff',
        bgSecondary: '#f2f3f5',
        bgTertiary: '#e3e5e8',
        text: '#2e3338',
        textSecondary: '#4e5058',
        textMuted: '#747f8d',
        accent: '#5865f2',
        border: '#e3e5e8',
    }
};

// --- AUTH LAYOUT WRAPPER ---
// Standardizes the background and container for both Login and Signup
function AuthLayout({ children, variant = 'blue', className = '', usePixelCard = true }) {
    return (
        <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black text-slate-200">
            {/* Animated Background - Standardized */}
            <div className="absolute inset-0 z-0">
                <GridScan
                    sensitivity={0.55}
                    lineThickness={2.5}
                    linesColor="#000000"
                    gridScale={0.1}
                    scanColor="#dd5aa6"
                    scanOpacity={0.4}
                    lineJitter={0.04}
                    scanGlow={0.5}
                    scanSoftness={2}
                    enablePost
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                />
            </div>

            {/* Main Card Container */}
            {usePixelCard ? (
                <PixelCard variant={variant} speed={5} delayMultiplier={variant === 'blue' ? 0.5 : 0.7} visibleDuration={variant === 'blue' ? 900 : 1300} className={`relative z-10 ${className}`}>
                    <GlassSurface
                        width="100%"
                        height="100%"
                        borderRadius={24}
                        brightness={40}
                        opacity={0.85}
                        blur={14}
                        backgroundOpacity={0.15}
                        className="w-full h-full"
                    >
                        <div className="w-full h-full p-10 relative z-10 flex flex-col justify-center">
                            {children}
                        </div>
                    </GlassSurface>
                </PixelCard>
            ) : (
                <div className={`relative z-10 ${className}`}>
                    <GlassSurface
                        width="100%"
                        height="100%"
                        borderRadius={24}
                        brightness={40}
                        opacity={0.85}
                        blur={14}
                        backgroundOpacity={0.15}
                        className="w-full h-full"
                    >
                        <div className="w-full h-full p-10 relative z-10 flex flex-col justify-center">
                            {children}
                        </div>
                    </GlassSurface>
                </div>
            )}
        </div>
    );
}

// --- LOGIN SCREEN COMPONENT ---
function LoginScreen({ onLogin, theme, onSwitchToSignUp }) {
    const colors = THEMES[theme];
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (username && password) {
            try {
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    onLogin(data);
                } else {
                    alert('Login failed: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                // Backend not available - use mock login
                console.log('Backend not available, using mock login');
                onLogin({ username, dbName: username + '_db' });
            }
        }
    };

    return (
        <AuthLayout variant="blue" className="w-[480px] min-h-[580px]">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                    <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    SQL Thinking Lab
                </h1>
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>Initialize Your Session</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                            placeholder="Enter username"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                            placeholder="Enter password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                >
                    <LogIn className="w-5 h-5" />
                    Initialize Session
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    New to SQL Thinking Lab?{' '}
                    <button
                        onClick={onSwitchToSignUp}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                        Create an Account
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
}

// --- SIGN UP SCREEN COMPONENT ---
function SignUpScreen({ onSignUp, theme, onSwitchToLogin }) {
    const colors = THEMES[theme];
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    setSuccessMessage('Account created successfully! Redirecting to sign in...');
                    setTimeout(() => {
                        onSignUp();
                    }, 2000);
                } else {
                    setErrors({ ...errors, form: data.error || 'Registration failed' });
                }
            } catch (error) {
                // Backend not available - proceed with mock signup
                console.log('Backend not available, using mock signup');
                setSuccessMessage('Account created successfully! Redirecting to sign in...');
                setTimeout(() => {
                    onSignUp();
                }, 2000);
            }
        }
    };

    return (
        <AuthLayout variant="pink" className="w-[480px] min-h-[720px]" usePixelCard={false}>
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                    <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    SQL Thinking Lab
                </h1>
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>Create Your Account</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderColor: errors.username ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                color: '#fff'
                            }}
                            placeholder="Choose a username"
                        />
                    </div>
                    {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderColor: errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                color: '#fff'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderColor: errors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                color: '#fff'
                            }}
                            placeholder="Create a password"
                        />
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderColor: errors.confirmPassword ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                color: '#fff'
                            }}
                            placeholder="Confirm your password"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {errors.form && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{errors.form}</p>}
                {successMessage && <p className="text-green-400 text-sm text-center bg-green-500/10 p-2 rounded">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={!!successMessage}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    <User className="w-5 h-5" />
                    Create Account
                </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                        Sign In
                    </button>
                </p>
            </div>

            {/* Footer */}
            <div className="mt-2 text-center">
                <p className="text-xs" style={{ color: colors.textMuted }}>SQL Learning Platform</p>
            </div>
        </AuthLayout>
    );
}

export { LoginScreen, SignUpScreen, AuthLayout, THEMES };
