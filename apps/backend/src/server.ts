import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 Database status: http://localhost:${PORT}/`);
  console.log(`🔍 API endpoint: http://localhost:${PORT}/api/db/status`);
});
