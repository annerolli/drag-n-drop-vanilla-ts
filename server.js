import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (_, res) => {
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    );

    template = await vite.transformIndexHtml('/', template);

    res.setHeader('Content-Type', 'text/html');
    res.send(template);
  });

  app.listen(3000, () => {
    console.log('go to', 'http://localhost:3000');
  });
}

createServer();
