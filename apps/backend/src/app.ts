import express from "express";
import cors from "cors";
import prisma from "./lib/prisma";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import { errorHandler } from "./middleware/error";

const app = express();

// CORS configuration - allow all origins in development, specific in production
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? (process.env.FRONTEND_URL || "https://portfolio-frontend.onrender.com")
    : true, // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Database connection test endpoint
app.get("/api/db/status", async (_, res, next) => {
  try {
    // Test database connection
    await prisma.$connect();

    // Get database info
    const userCount = await prisma.user.count();
    const dbInfo = await prisma.$queryRaw`SELECT version() as version`;

    res.json({
      status: "connected",
      message: "Database connection successful! ✅",
      database: {
        provider: "PostgreSQL",
        connected: true,
        userCount,
        version: (dbInfo as any[])[0]?.version || "Unknown",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    next(error);
  }
});

// Get all users endpoint
app.get("/api/users", async (_, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (error: any) {
    next(error);
  }
});

// Serve HTML page for database status
app.get("/", (_, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Status</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2.5em;
        }
        .status-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
        }
        .status-card.success {
            border-left-color: #28a745;
            background: #d4edda;
        }
        .status-card.error {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        .status-indicator {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
            animation: pulse 2s infinite;
        }
        .status-indicator.connected {
            background: #28a745;
        }
        .status-indicator.disconnected {
            background: #dc3545;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 1.1em;
        }
        .users-section {
            margin-top: 30px;
        }
        .users-list {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }
        .user-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
            transition: background 0.3s;
        }
        .refresh-btn:hover {
            background: #5568d3;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-top: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗄️ Database Connection Status</h1>
        <div id="status-card" class="status-card">
            <h2>
                <span id="status-indicator" class="status-indicator"></span>
                <span id="status-text">Checking connection...</span>
            </h2>
            <div id="status-details"></div>
            <div id="users-section" class="users-section" style="display: none;">
                <h3>Users in Database</h3>
                <div id="users-list" class="users-list"></div>
            </div>
            <button class="refresh-btn" onclick="checkConnection()">🔄 Refresh Status</button>
            <div id="timestamp" class="timestamp"></div>
        </div>
    </div>

    <script>
        async function checkConnection() {
            const statusCard = document.getElementById('status-card');
            const statusText = document.getElementById('status-text');
            const statusIndicator = document.getElementById('status-indicator');
            const statusDetails = document.getElementById('status-details');
            const usersSection = document.getElementById('users-section');
            const usersList = document.getElementById('users-list');
            const timestamp = document.getElementById('timestamp');

            statusText.textContent = 'Checking connection...';
            statusIndicator.className = 'status-indicator';
            statusDetails.innerHTML = '';

            try {
                const response = await fetch('/api/db/status');
                const data = await response.json();

                if (data.status === 'connected') {
                    statusCard.className = 'status-card success';
                    statusIndicator.className = 'status-indicator connected';
                    statusText.textContent = data.message;
                    
                    statusDetails.innerHTML = \`
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Database Provider</div>
                                <div class="info-value">\${data.database.provider}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Connection Status</div>
                                <div class="info-value">✅ Connected</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Users Count</div>
                                <div class="info-value">\${data.database.userCount}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">PostgreSQL Version</div>
                                <div class="info-value" style="font-size: 0.9em;">\${data.database.version.split(' ')[0] + ' ' + data.database.version.split(' ')[1]}</div>
                            </div>
                        </div>
                    \`;
                    
                    timestamp.textContent = \`Last checked: \${new Date(data.timestamp).toLocaleString()}\`;
                    
                    // Fetch users
                    const usersResponse = await fetch('/api/users');
                    const usersData = await usersResponse.json();
                    
                    if (usersData.users && usersData.users.length > 0) {
                        usersSection.style.display = 'block';
                        usersList.innerHTML = usersData.users.map(user => \`
                            <div class="user-item">
                                <strong>Email:</strong> \${user.email}<br>
                                <strong>Role:</strong> \${user.role}<br>
                                <strong>Created:</strong> \${new Date(user.createdAt).toLocaleString()}
                            </div>
                        \`).join('');
                    } else {
                        usersSection.style.display = 'block';
                        usersList.innerHTML = '<p style="text-align: center; color: #666;">No users found in database.</p>';
                    }
                } else {
                    throw new Error(data.message || 'Connection failed');
                }
            } catch (error) {
                statusCard.className = 'status-card error';
                statusIndicator.className = 'status-indicator disconnected';
                statusText.textContent = 'Database connection failed! ❌';
                statusDetails.innerHTML = \`
                    <div class="info-item">
                        <div class="info-label">Error</div>
                        <div class="info-value">\${error.message}</div>
                    </div>
                \`;
                timestamp.textContent = \`Last checked: \${new Date().toLocaleString()}\`;
                usersSection.style.display = 'none';
            }
        }

        // Check on page load
        checkConnection();
        
        // Auto-refresh every 10 seconds
        setInterval(checkConnection, 10000);
    </script>
</body>
</html>
  `);
});

// Error handler must be last - catches all errors from routes
app.use(errorHandler);

export default app;
