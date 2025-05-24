# 🖥️ Weyland Corp Terminal Interface

A retro DOS-style React application featuring a desktop environment with multiple windows, terminal emulation, and classic 90s aesthetics. Built with modern web technologies but styled like a vintage computer interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6+-green.svg)
![Deployment](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-success.svg)

## 🌟 Features

### 🖼️ Desktop Environment
- **Draggable & Resizable Windows**: Full window management with minimize, maximize, and close functionality
- **Desktop Icons**: Double-click to launch applications (Terminal, File Manager, Text Editor, etc.)
- **Multi-Window Support**: Open multiple applications simultaneously with proper z-index management
- **Retro Styling**: Authentic Windows 95/DOS aesthetic with pixel-perfect details

### 💻 Terminal Emulation
- **Real xterm.js Integration**: Fully functional terminal with command support
- **Custom DOS Commands**: `dir`, `cd`, `cls`, `help`, and more
- **File System Simulation**: Navigate through a virtual file system
- **Amber CRT Effect**: Classic green-on-black terminal with scanline effects

### 📱 Responsive Design
- **Mobile Optimized**: Touch-friendly interface with responsive layouts
- **Cross-Platform**: Works on Windows, macOS, Linux, and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

### 🎨 Enhanced UI/UX
- **Boot Sequence**: Authentic BIOS-style startup sequence
- **Smooth Animations**: Window open/close animations and hover effects
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: DOS-style loading spinners and progress indicators


## 🛠️ Installation & Development

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/robimdev/didactic-lamp.git
cd didactic-lamp

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Local: http://localhost:5173/didactic-lamp/
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview

# Deploy to GitHub Pages (if configured)
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Desktop.jsx      # Main desktop environment
│   ├── Window.jsx       # Draggable window component
│   ├── WindowManager.jsx# Window management logic
│   ├── ErrorBoundary.jsx# Error handling
│   ├── LoadingSpinner.jsx# Loading states
│   └── *.css           # Component styles
├── pages/              # Route components
│   ├── HomePage.jsx    # Main dashboard
│   ├── AboutPage.jsx   # About information
│   └── ProjectsPage.jsx# Projects showcase
├── hooks/              # Custom React hooks
│   └── useTypewriter.js# Typewriter effect
├── assets/             # Images and static assets
└── App.jsx            # Main application component
```

## 🎮 Usage Guide

### Navigation
- **Desktop Icons**: Double-click to launch applications
- **Navigation Bar**: Use buttons to switch between pages
- **CLI Button**: Toggle the DOS terminal on/off
- **Window Controls**: Minimize (\_), Maximize (□), Close (✕)

### Terminal Commands
```bash
# File system navigation
dir                 # List directory contents
cd [directory]      # Change directory
cls                 # Clear screen

# System commands
help               # Show available commands
ver                # Show system version
time               # Display current time
whoami             # Show current user

# Fun commands
matrix             # Display matrix effect
starwars           # ASCII Star Wars
```

### Keyboard Shortcuts
- **Ctrl + `**: Toggle terminal
- **Alt + Tab**: Switch between windows (planned)
- **F11**: Fullscreen mode (browser)

## 🔧 Configuration

### Customizing the Desktop
Edit `src/components/Desktop.jsx` to modify:
- Desktop icon positions
- Available applications
- Background patterns

### Terminal Commands
Add new commands in `src/DosTerminal.jsx`:
```javascript
// Example: Adding a new command
case 'hello':
  terminal.writeln('Hello, Weyland Corp employee!');
  break;
```

### Styling
The application uses multiple CSS files:
- `src/App.css` - Global styles and layout
- `src/components/*.css` - Component-specific styles
- TUI CSS for retro DOS components

## 🚀 Deployment

### GitHub Pages (Automated)
The project includes GitHub Actions for automatic deployment:

1. **Push to main branch**: Automatically triggers build and deployment
2. **Manual deployment**: Use `npm run deploy`

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to any static hosting service
# Upload the 'dist' folder contents
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **ESLint**: Follow the existing ESLint configuration
- **PropTypes**: Add PropTypes for all component props
- **Comments**: Document complex logic and components
- **Testing**: Add tests for new features (when test framework is added)

### Commit Message Format
```
type(scope): description

# Examples:
feat(terminal): add new DOS command
fix(window): resolve dragging issue
docs(readme): update installation guide
style(css): improve button hover effects
```

## 📦 Dependencies

### Core Technologies
- **React 19**: Modern React with hooks and concurrent features
- **React Router 7**: Client-side routing
- **Vite 6**: Fast build tool and development server

### UI & Styling
- **TUI CSS**: Retro DOS/terminal styling
- **xterm.js**: Terminal emulation
- **PropTypes**: Runtime type checking

### Development Tools
- **ESLint**: Code linting and style enforcement
- **GitHub Actions**: Automated deployment
- **gh-pages**: GitHub Pages deployment utility

## 🐛 Known Issues & Limitations

- **Mobile Gestures**: Some window operations may be challenging on small screens
- **Browser Compatibility**: Designed for modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: Multiple windows may impact performance on older devices

## 🔮 Future Enhancements

- [ ] **File System Persistence**: Save files between sessions
- [ ] **Multiplayer Features**: Shared desktop sessions
- [ ] **More Applications**: Calculator, Paint, Games
- [ ] **Themes**: Additional retro themes (Amiga, Atari, etc.)
- [ ] **Sound Effects**: Authentic system sounds
- [ ] **Virtual Keyboard**: On-screen keyboard for mobile
- [ ] **Unit Tests**: Comprehensive test coverage

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **xterm.js team** for the excellent terminal emulation
- **TUI CSS** for the retro styling framework
- **React team** for the amazing framework
- **Weyland-Yutani Corporation** for fictional inspiration
- **Retro computing enthusiasts** for design inspiration


*"Building Better Worlds, One Terminal at a Time"* - Weyland Corp

---

### 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/robimdev/didactic-lamp?style=social)
![GitHub forks](https://img.shields.io/github/forks/robimdev/didactic-lamp?style=social)
![GitHub issues](https://img.shields.io/github/issues/robimdev/didactic-lamp)
![GitHub pull requests](https://img.shields.io/github/issues-pr/robimdev/didactic-lamp)

Made with ❤️ and lots of ☕ by the development team.
