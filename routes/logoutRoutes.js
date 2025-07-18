import express from 'express';
const router = express.Router();

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
    }
    res.redirect('/login');
  });
});
export default router;