import express from "express";
import fetch from "node-fetch";
import cors from "cors"

const app = express();
const PORT = 3000;
app.use(cors());

let cachedUsers = [];

// Preload data from real RandomUser API (once)
async function preloadUsers(count = 1000) {
    try {
    const res = await fetch(`https://randomuser.me/api/?results=${count}&noinfo=true`);
    const data = await res.json();
    cachedUsers = data.results;
    console.log(`Preloaded ${cachedUsers.length} users`);
    } catch (err) {
    console.error("Failed to fetch users:", err);
    }
}

// /api → single user by default, or multiple if ?results=n
app.get("/api", (req, res) => {
    const results = parseInt(req.query.results) || 1;
    const sliced = cachedUsers.slice(0, results);

    res.json({
    results: sliced,
    info: {
        seed: "local-mock",
        results: sliced.length,
        page: 1,
        version: "1.0"
    }
    });
});

app.listen(PORT, async () => {
    console.log(`Random User API running at http://localhost:${PORT}/api`);
    await preloadUsers();
});
