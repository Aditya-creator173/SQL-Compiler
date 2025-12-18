# Front Page Extraction - SQL Learning Lab

This folder contains all the components needed for the **Login and Signup screens** (front page) of the SQL Learning Lab application.

## 📁 Files Included

### Main Components
- **FrontPageComponents.jsx** - Login Screen, Signup Screen, and AuthLayout wrapper components
- **GridScan.jsx** - Animated 3D grid background effect with face tracking support
- **PixelCard.jsx** - Pixel animation effect for card borders
- **GlassSurface.jsx** - Glassmorphism surface component with advanced distortion effects
- **index.css** - Base CSS styles including Tailwind directives and custom scrollbar

### Configuration Files
- **dependencies.json** - Complete list of npm dependencies needed
- **README.md** - This file

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react react-dom lucide-react three postprocessing face-api.js
```

Or install all dependencies from the provided list:

```bash
npm install
```

Then copy the contents of `dependencies.json` to your `package.json`.

### 2. Import and Use

```jsx
import { LoginScreen, SignUpScreen } from './FrontPageComponents';
import './index.css';

function App() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [theme, setTheme] = useState('dark');

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    // Handle login logic
  };

  const handleSignUp = () => {
    setIsSignUpMode(false);
    // Handle signup logic
  };

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
```

## 📦 Required Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.294.0",
  "three": "^0.182.0",
  "postprocessing": "^6.38.1",
  "face-api.js": "^0.20.0"
}
```

### Dev Dependencies (for Tailwind CSS)
```json
{
  "tailwindcss": "^3.3.6",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

## 🎨 Component Features

### LoginScreen
- Username and password input fields
- Form validation
- API integration (with fallback to mock login)
- Animated background with GridScan effect
- Glassmorphism design
- Pixel border animation on hover
- Link to switch to signup

### SignUpScreen
- Username, email, password, and confirm password fields
- Real-time form validation
- Error messaging
- Success notification
- API integration (with fallback to mock signup)
- Same beautiful animations as login screen

### GridScan Background
- 3D perspective grid effect
- Animated scan lines
- Mouse tracking for parallax effect
- Optional webcam face tracking
- Customizable colors, thickness, and animation speed
- Post-processing effects (bloom, chromatic aberration)

### PixelCard
- Animated pixel border effect
- Appears on hover with configurable delay
- Multiple color variants (blue, pink, yellow, default)
- Customizable speed and animation duration

### GlassSurface
- Advanced glassmorphism effect
- SVG filter-based distortion
- Responsive to container size
- Dark/light mode support
- Customizable blur, opacity, and brightness

## 🎯 API Endpoints (Optional)

The components are designed to work with these backend endpoints:

- **POST** `/api/login` - User login
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- **POST** `/api/register` - User registration
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

If the backend is not available, the components will fall back to mock authentication.

## 🎨 Customization

### Theme Colors
The components use a Discord-inspired color theme defined in `THEMES` object:
- **dark** - Dark mode colors
- **light** - Light mode colors

### GridScan Parameters
```jsx
<GridScan
  sensitivity={0.55}        // Mouse sensitivity (0-1)
  lineThickness={2.5}       // Grid line thickness
  linesColor="#000000"      // Grid line color
  scanColor="#dd5aa6"       // Scan line color
  scanOpacity={0.4}         // Scan line opacity
  gridScale={0.1}           // Grid cell size
  lineJitter={0.04}         // Line animation jitter
  scanGlow={0.5}            // Scan glow intensity
  scanSoftness={2}          // Scan edge softness
  enablePost={true}         // Enable post-processing
  bloomIntensity={0.6}      // Bloom effect intensity
  chromaticAberration={0.002} // Chromatic aberration
  noiseIntensity={0.01}     // Noise grain
/>
```

### PixelCard Variants
- `variant="blue"` - Blue pixel animation (login)
- `variant="pink"` - Pink pixel animation (signup)
- `variant="yellow"` - Yellow pixel animation
- `variant="default"` - Default gray animation

## 📝 Notes

1. **Tailwind CSS Required**: The components use Tailwind CSS classes. Make sure you have Tailwind configured in your project.

2. **Font**: The design uses the 'Inter' font family. Include it in your project:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **Icons**: Uses `lucide-react` for icons. Make sure it's installed.

4. **Performance**: The GridScan component is GPU-intensive. Consider disabling it on low-end devices.

5. **Browser Compatibility**: The glassmorphism effects work best in modern browsers (Chrome, Firefox, Edge, Safari).

## 🔧 Troubleshooting

### GridScan not rendering
- Check if WebGL is supported in your browser
- Ensure `three` and `postprocessing` are installed correctly

### Pixel animation not working
- Verify the canvas element is rendering
- Check browser console for errors

### Glassmorphism not visible
- Ensure backdrop-filter is supported in your browser
- Check if the background has content to blur

## 📄 License

This code is extracted from the SQL Learning Lab project. Use it according to your project's license.

## 🤝 Support

For issues or questions, refer to the main SQL Learning Lab project documentation.
