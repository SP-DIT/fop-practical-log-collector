import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mainRoutes from './routes/mainRoutes.js';
import { requireAuth, redirectIfAuthenticated } from './middleware/auth.js';

const app = express();
// Add middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//giving the path and directory to show the user
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// all files from the Frontend folder
// app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve login page at root URL
app.get('/', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Protected routes for HTML pages
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Dashboard.html'));
});

app.get('/class-score', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ClassScore.html'));
});

app.get('/fastest-solve', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'FastestSolve.html'));
});

app.get('/least-attempts', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'LeastAttempts.html'));
});

app.get('/profile', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Profile.html'));
});

app.get('/individual-progress', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'IndividualProgress.html'));
});

app.get('/weekly-chart', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'weeklychart.html'));
});

// Public routes for login and signup
app.get('/login', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

app.use('/', mainRoutes);

// 404 handler - redirect to login if not authenticated, otherwise to dashboard
app.use((req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});