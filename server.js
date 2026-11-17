const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 2000;
const DB_FILE = path.join(__dirname, 'last_message.txt');

app.use(cors());
app.use(express.json());

// Загружаем последнее сообщение с диска при старте
let lastMessage = '';
if (fs.existsSync(DB_FILE)) {
  lastMessage = fs.readFileSync(DB_FILE, 'utf8');
} else {
  fs.writeFileSync(DB_FILE, '', 'utf8');
}

// Получить последнее сообщение
app.get('/message', (req, res) => {
  res.json({ message: lastMessage });
});

// Сохранить новое сообщение (макс. 16 символов)
app.post('/message', (req, res) => {
  const rawText = req.body.text;

  if (typeof rawText !== 'string') {
    return res.status(400).json({ error: 'Нужна строка' });
  }

  lastMessage = rawText.slice(0, 16);
  fs.writeFileSync(DB_FILE, lastMessage, 'utf8');

  res.json({ success: true, message: lastMessage });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
