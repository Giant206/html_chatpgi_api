require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.get("/ping", (req, res) => {
    res.send("Server OK ✅");
});


app.post("/chat", async (req, res) => {
    try {

        const userText = req.body.prompt || "";

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: userText }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply =
            response.data.choices?.[0]?.message?.content ||
            "Tidak ada balasan";

        res.json({ reply });

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        res.status(500).json({ error: "API gagal dipanggil" });
    }
});


app.listen(3000, () => {
    console.log("🚀 Server jalan di:");
    console.log("http://localhost:3000");
});
