const axios = require("axios");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    try {
        const data = req.body;

        // Извлекаем данные из GSI
        const mapName = data.map?.name || "Unknown";
        const scoreCT = data.map?.team_ct?.score || 0;
        const scoreT = data.map?.team_t?.score || 0;

        const message = `Map: ${mapName}\nCT: ${scoreCT} - T: ${scoreT}`;

        // Отправляем сообщение в Telegram
        await sendTelegramMessage(message);

        console.log(`Сообщение отправлено: ${message}`);
        res.status(200).send("Data processed");
    } catch (error) {
        console.error("Ошибка обработки данных:", error.message);
        res.status(500).send("Error processing data");
    }
}

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Задаем переменные через Vercel
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message,
    };

    try {
        await axios.post(url, payload);
        console.log("Сообщение успешно отправлено в Telegram.");
    } catch (error) {
        console.error("Ошибка отправки сообщения в Telegram:", error.message);
    }
}
