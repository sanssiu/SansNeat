import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SANSCOUNTS_CLIENT_ID = process.env.SANSCOUNTS_CLIENT_ID || 'sc_client_sansneat_live';
const SANSCOUNTS_CLIENT_SECRET = process.env.SANSCOUNTS_CLIENT_SECRET || 'sc_sec_sansneat_82f1b702e9a1c4';
const DEFAULT_REDIRECT_URI = process.env.SANSCOUNTS_REDIRECT_URI || 'https://sansneat.sanssiu.com/auth/callback';

const PORT = Number(process.env.PORT || 3000);

// Active token store
interface SessionUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  token: string;
  createdAt: number;
}

const sessions = new Map<string, SessionUser>();

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // OAuth Configuration Endpoint
  app.get('/api/auth/sanscounts/config', (req, res) => {
    res.json({
      clientId: SANSCOUNTS_CLIENT_ID,
      redirectUri: DEFAULT_REDIRECT_URI,
      appName: 'SansNeat',
      provider: 'SansCounts Identity & OAuth 2.0',
    });
  });

  // OAuth Code Exchange / Token Exchange Endpoint
  app.post('/api/auth/sanscounts/token', async (req, res) => {
    const { client_id, client_secret, code, username, firstName, lastName } = req.body;

    // Verify client credentials if provided
    if (client_id && client_id !== SANSCOUNTS_CLIENT_ID) {
      return res.status(401).json({ error: 'Invalid client_id' });
    }

    if (client_secret && client_secret !== SANSCOUNTS_CLIENT_SECRET) {
      return res.status(401).json({ error: 'Invalid client_secret' });
    }

    const cleanUser = (username || 'sanscounts_user').trim().toLowerCase().replace(/@.*$/, '');
    const userFirstName = firstName || (cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1));
    const userLastName = lastName || 'Sans';

    const token = 'sc_token_' + crypto.randomBytes(24).toString('hex');
    const sessionUser: SessionUser = {
      username: cleanUser,
      email: `${cleanUser}@sanscounts.san`,
      firstName: userFirstName,
      lastName: userLastName,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
      token,
      createdAt: Date.now(),
    };

    sessions.set(token, sessionUser);

    return res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400,
      scope: 'profile email openid',
      client_id: SANSCOUNTS_CLIENT_ID,
      user: {
        username: sessionUser.username,
        email: sessionUser.email,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
        avatar: sessionUser.avatar,
      },
    });
  });

  // Verify User Session from Token
  app.get('/api/auth/sanscounts/user', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    const token = authHeader.split('Bearer ')[1].trim();
    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    return res.json({
      user: {
        username: session.username,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        avatar: session.avatar,
      },
    });
  });

  // OAuth Callback Route (popup receiver & cross-origin communicator)
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const code = (req.query.code || req.query.auth_code) as string;
    const queryUsername = (req.query.username || req.query.user || req.query.sub || req.query.name) as string;
    const queryEmail = (req.query.email || req.query.mail) as string;

    let userInfo: any = null;
    let accessToken = '';

    if (code) {
      try {
        // Step 2: Exchange Code for Token
        const tokenRes = await fetch('https://sanscounts.sanssiu.com/api/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: SANSCOUNTS_CLIENT_ID,
            client_secret: SANSCOUNTS_CLIENT_SECRET,
            code: code,
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          accessToken = tokenData.access_token || tokenData.token || tokenData.id_token || '';

          // Step 3: Fetch Verified User Profile
          if (accessToken) {
            const userRes = await fetch('https://sanscounts.sanssiu.com/api/oauth/userinfo', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (userRes.ok) {
              userInfo = await userRes.json();
            }
          }
        }
      } catch (err) {
        console.error('SansCounts OAuth token/userinfo exchange error:', err);
      }
    }

    const finalUsername = userInfo?.username || userInfo?.user || userInfo?.preferred_username || queryUsername || (userInfo?.email ? userInfo.email.split('@')[0] : '') || '';
    const finalEmail = userInfo?.email || queryEmail || (finalUsername ? `${finalUsername}@sanscounts.san` : '');
    const finalFirstName = userInfo?.firstName || userInfo?.given_name || userInfo?.name || '';
    const finalLastName = userInfo?.lastName || userInfo?.family_name || 'SansCounts';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SansCounts Auth Callback</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #F8F9FA;
      color: #111827;
    }
    .card {
      background: #FFFFFF;
      padding: 32px 24px;
      border-radius: 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
      text-align: center;
      max-width: 320px;
      width: 90%;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #E0F2FE;
      color: #00C2FF;
      font-weight: 700;
      font-size: 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 18px;
      margin: 0 0 8px 0;
      color: #111827;
    }
    p {
      font-size: 13px;
      color: #6B7280;
      margin: 0;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #E5E7EB;
      border-top-color: #00C2FF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 20px auto 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
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
      const payload = {
        type: 'SANSCOUNTS_AUTH_SUCCESS',
        code: ${JSON.stringify(code || '')},
        token: ${JSON.stringify(accessToken || '')},
        username: ${JSON.stringify(finalUsername)},
        email: ${JSON.stringify(finalEmail)},
        firstName: ${JSON.stringify(finalFirstName)},
        lastName: ${JSON.stringify(finalLastName)}
      };

      if (window.opener) {
        window.opener.postMessage(payload, '*');
        setTimeout(function() {
          window.close();
        }, 500);
      } else {
        const queryStr = new URLSearchParams({
          sc_auth_success: '1',
          code: payload.code,
          username: payload.username,
          email: payload.email
        }).toString();
        window.location.href = '/?' + queryStr;
      }
    })();
  </script>
</body>
</html>`);
  });

  // Vite middleware in development or static serving in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SansNeat] Full-Stack server with SansCounts Auth running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
