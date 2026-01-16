import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Backend running on ${HOST}:${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`📊 Database status: http://localhost:${PORT}/`);
    console.log(`🔍 API endpoint: http://localhost:${PORT}/api/db/status`);
  }
});
