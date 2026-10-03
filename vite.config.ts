import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import crypto from 'crypto';

const SANSCOUNTS_CLIENT_ID = 'sc_client_sansneat_live';
const SANSCOUNTS_CLIENT_SECRET = 'sc_sec_sansneat_82f1b702e9a1c4';
const DEFAULT_REDIRECT_URI = 'https://sansneat.sanssiu.com/auth/callback';

function sansCountsAuthPlugin(): Plugin {
  return {
    name: 'sanscounts-auth-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Config endpoint
        if (url === '/api/auth/sanscounts/config') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              clientId: SANSCOUNTS_CLIENT_ID,
              redirectUri: DEFAULT_REDIRECT_URI,
              appName: 'SansNeat',
              provider: 'SansCounts Identity & OAuth 2.0',
            })
          );
          return;
        }

        // Token endpoint
        if (url === '/api/auth/sanscounts/token' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const { username, firstName, lastName } = data;
              const cleanUser = (username || 'sanscounts_user').trim().toLowerCase().replace(/@.*$/, '');
              const userFirstName = firstName || (cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1));
              const token = 'sc_token_' + crypto.randomBytes(24).toString('hex');

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  access_token: token,
                  token_type: 'Bearer',
                  expires_in: 86400,
                  scope: 'profile email openid',
                  client_id: SANSCOUNTS_CLIENT_ID,
                  user: {
                    username: cleanUser,
                    email: `${cleanUser}@sanscounts.san`,
                    firstName: userFirstName,
                    lastName: lastName || 'Sans',
                    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
                  },
                })
              );
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // OAuth Callback Route
        if (url.startsWith('/auth/callback')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SansCounts Auth Callback</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #F8F9FA; color: #111827; }
    .card { background: #FFFFFF; padding: 32px 24px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); text-align: center; max-width: 320px; width: 90%; }
    .badge { display: inline-block; padding: 4px 12px; background: #E0F2FE; color: #00C2FF; font-weight: 700; font-size: 12px; border-radius: 9999px; margin-bottom: 16px; }
    h2 { font-size: 18px; margin: 0 0 8px 0; }
    p { font-size: 13px; color: #6B7280; margin: 0; }
    .spinner { width: 32px; height: 32px; border: 3px solid #E5E7EB; border-top-color: #00C2FF; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 20px auto 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">SansCounts Auth</div>
    <h2>Connecting Account...</h2>
    <p>Authentication complete. Closing popup window...</p>
    <div class="spinner"></div>
  </div>
  <script>
    (function() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code') || params.get('auth_code');
      const token = params.get('token') || params.get('access_token');
      const username = params.get('username');
      const error = params.get('error');

      const payload = {
        type: 'SANSCOUNTS_AUTH_SUCCESS',
        code: code || '',
        token: token || '',
        username: username || '',
        error: error || null
      };

      if (window.opener) {
        window.opener.postMessage(payload, '*');
        setTimeout(function() {
          window.close();
        }, 500);
      } else {
        window.location.href = '/?sc_auth_success=1&username=' + encodeURIComponent(username || '');
      }
    })();
  </script>
</body>
</html>`);
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sansCountsAuthPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
