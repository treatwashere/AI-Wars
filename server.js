import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve App/Code at root
app.use(express.static(path.join(__dirname, 'App', 'Code')));

// Also serve /App and /Assets routes so asset paths resolve reliably
app.use('/App', express.static(path.join(__dirname, 'App')));
app.use('/Assets', express.static(path.join(__dirname, 'App', 'Assets')));

// SPA / static fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'App', 'Code', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`AI Wars server running on http://${HOST}:${PORT}`);
});
