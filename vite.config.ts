import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// Dev-only middleware that runs Vercel-style serverless functions in /api during `vite dev`.
// In production, Vercel handles /api routing natively; this plugin is a no-op there.
function vercelApiDevServer(): Plugin {
  const apiRoot = path.resolve(__dirname, 'api');

  return {
    name: 'vercel-api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const urlPath = req.url.split('?')[0]!;
        const relPath = urlPath.replace(/^\/api\//, '').replace(/\/+$/, '');
        if (!relPath || relPath.includes('..')) return next();

        const candidates = [
          path.join(apiRoot, `${relPath}.ts`),
          path.join(apiRoot, `${relPath}.js`),
          path.join(apiRoot, relPath, 'index.ts'),
          path.join(apiRoot, relPath, 'index.js'),
        ];
        const filePath = candidates.find((p) => fs.existsSync(p) && !p.includes(`${path.sep}_`));
        if (!filePath) return next();

        try {
          const mod = await server.ssrLoadModule(filePath);
          const handler = mod.default;
          if (typeof handler !== 'function') return next();

          let body: unknown = null;
          if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const raw = Buffer.concat(chunks).toString('utf8');
            if (raw) {
              try { body = JSON.parse(raw); } catch { body = raw; }
            }
          }

          const shimReq = { method: req.method, body, headers: req.headers, url: req.url };
          const shimRes = {
            statusCode: 200 as number,
            headers: {} as Record<string, string>,
            status(code: number) {
              this.statusCode = code;
              return {
                json: (data: unknown) => {
                  res.statusCode = this.statusCode;
                  res.setHeader('Content-Type', 'application/json');
                  for (const [k, v] of Object.entries(this.headers)) res.setHeader(k, String(v));
                  res.end(JSON.stringify(data));
                },
                end: () => {
                  res.statusCode = this.statusCode;
                  for (const [k, v] of Object.entries(this.headers)) res.setHeader(k, String(v));
                  res.end();
                },
              };
            },
            setHeader(name: string, value: string) {
              this.headers[name] = value;
            },
          };

          await handler(shimReq, shimRes);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'dev handler error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), vercelApiDevServer()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
