const log = require('./file/func/log.js')
const express = require('express')
const app = express();
const port = process.env.PORT || 7860;

try{
    require('./config.js')
} catch {
    log.error('config.js not found!') 
    process.exit(1)
}

app.get('/', (req, res) => {
    res.send('Whatsapp BOT');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

require('./file/baileys/sazumiviki.js')