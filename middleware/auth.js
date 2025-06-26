// Authentication middleware to check if user is logged in
export const requireAuth = (req, res, next) => {
  // Check if user is authenticated (you can implement session-based or token-based auth)
  // For now, we'll use a simple session check
  if (req.session && req.session.user) {
    // User is authenticated, proceed to next middleware/route
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
};

// Optional: Middleware to check if user is already logged in (for login/signup pages)
export const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is already logged in, redirect to dashboard
    res.redirect('/dashboard');
  } else {
    // User is not logged in, proceed to login/signup page
    next();
  }
}; 