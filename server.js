import 'dotenv/config';

import app from './index.js';
import mainRoutes from './routes/mainRoutes.js';

// Use centralized route handler
app.use('/', mainRoutes);
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
