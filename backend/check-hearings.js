const http = require('http');

// Get current hearings
const getReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/hearings',
    method: 'GET'
}, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        const hearings = JSON.parse(data);
        console.log(`Total hearings: ${hearings.length}`);
        console.log("Last 3 hearings:");
        hearings.slice(-3).forEach((h, i) => {
            console.log(`${i + 1}. Hearing_ID: ${h.Hearing_ID}, Case_No: ${h.Case_No}, Date: ${h.Date}, Time: ${h.Time}`);
        });
        process.exit(0);
    });
});

getReq.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});

getReq.end();
