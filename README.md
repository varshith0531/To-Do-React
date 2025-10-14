## ToDo React App

A simple and responsive ToDo application built with React and Vite. It allows you to add, complete, edit, and delete tasks with a clean UI.
Link:`https://to-do-six-sepia.vercel.app/`

### Features
- **Add tasks**: Quickly create new todos
- **Mark complete**: Toggle completion state
- **Edit tasks**: Update existing todos
- **Delete tasks**: Remove individual items

### Tech Stack
- **Framework**: React 19
- **Bundler/Dev Server**: Vite 7
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Linting**: ESLint 9

### Getting Started
1) Clone the repository
```bash
git clone <your-repo-url>
cd ToDo-React-App
```

2) Install dependencies
```bash
npm install
```

3) Start the development server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Available Scripts
- `dev`: Start Vite dev server
- `build`: Build for production
- `preview`: Preview the production build locally
- `lint`: Run ESLint

### Project Structure (typical)
```
ToDo-React-App/
  ├─ src/
  │  ├─ components/
  │  │  └─ Todo.jsx
  │  ├─ App.jsx
  │  └─ main.jsx
  ├─ index.html
  ├─ package.json
  └─ README.md
```

### How It Works
- `Todo.jsx` renders the list UI and handles add/edit/toggle/delete interactions using React hooks.
- State is managed locally within components using `useState` (and `useEffect` if needed).

### Styling (Tailwind CSS 4)
- Tailwind is integrated via the Vite plugin `@tailwindcss/vite`.
- Ensure your global stylesheet includes Tailwind layers, for example:
```css
@import "tailwindcss";
```

### Contributing
1) Create a feature branch
2) Commit with clear messages
3) Open a pull request with a concise description and screenshots if UI-related
