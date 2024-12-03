const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Parser } = require("json2csv");

const app = express();
app.use(express.json());

// Configurando CORS para aceitar requisições do Netlify
app.use(cors({
    origin: "https://spiffy-chebakia-1c7515.netlify.app", // Substitua pela URL exata do seu frontend no Netlify
}));

// Conexão com o MongoDB
mongoose.connect("mongodb+srv://FaresNunes:12345600Nunes!@megasenafares.rl8vf.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo de Apostas
const BetSchema = new mongoose.Schema({
    name: String,
    bets: [[Number]]
});
const Bet = mongoose.model("Bet", BetSchema);

// Rota para salvar apostas
app.post("/api/bets", async (req, res) => {
    try {
        const bet = new Bet(req.body);
        await bet.save();
        res.status(201).json({ message: "Aposta salva com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao salvar aposta." });
    }
});

// Rota para exportar apostas como CSV
app.get("/api/bets/export", async (req, res) => {
    try {
        const bets = await Bet.find();
        const fields = ["name", "bets"];
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(bets);
        res.header("Content-Type", "text/csv");
        res.attachment("apostas.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: "Erro ao exportar apostas." });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
