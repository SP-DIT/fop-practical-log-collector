// import 'dotenv/config';

// import app from './index.js';
// import mainRoutes from './routes/mainRoutes.js';

// // Use centralized route handler
// app.use('/', mainRoutes);
// const PORT = process.env.PORT || 3000;

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRoutes from './routes/mainRoutes.js';


const app = express();
app.use('/', mainRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//giving the path and directory to show the user
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// all files from the Frontend folder
app.use(express.static(path.join(__dirname, 'Frontend')));


