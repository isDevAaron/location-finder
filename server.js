const express = require('express');
const path = require('path');
const requestIp = require('request-ip');
const { google } = require('googleapis');
const app = express();
const PORT = process.env.PORT || 3000;

// Google Sheets setup
const SPREADSHEET_ID = '1S_sZmUfFt16xpHXcpimsjeNS3y7SUW2YNPox1x-9QiM';
const credentials = require('./credentials.json');
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

app.use(express.static('public'));
app.use(express.json());

async function logToSheet({ ip, userAgent, referrer, device, timestamp }) {
    const values = [
        [timestamp, ip, userAgent, referrer, JSON.stringify(device)]
    ];
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:E1',
        valueInputOption: 'USER_ENTERED',
        resource: { values }
    });
}

app.post('/log', async (req, res) => {
    const ip = requestIp.getClientIp(req);
    const userAgent = req.body.userAgent || req.headers['user-agent'];
    const referrer = req.body.referrer || req.headers['referer'] || '';
    const device = req.body.device || {};
    const timestamp = new Date().toISOString();

    try {
        await logToSheet({ ip, userAgent, referrer, device, timestamp });
        res.json({ status: 'logged to google sheet' });
    } catch (err) {
        console.error('Google Sheets error:', err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});