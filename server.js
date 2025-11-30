const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Настройка статики
app.use(express.static(path.join(__dirname, 'dist')));

// Тестовый API endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: "✅ Сервер работает!",
        data: {
            characters: ["Дилюк", "Кэ Цин", "Венти"],
            version: "4.0.0"
        }
    });
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Все остальные маршруты ведут на главную
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('✅ ТЕСТОВЫЙ СЕРВЕР ЗАПУЩЕН!');
    console.log('✅ Адрес: http://localhost:' + PORT);
    console.log('✅ API тест: http://localhost:' + PORT + '/api/test');
    console.log('=================================');
});