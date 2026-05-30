const http = require('http');

// Test hearing form submission
const hearingData = JSON.stringify({
    Case_No: 1001,
    Date: '2026-05-06',
    Time: '15:30'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/addHearing',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': hearingData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`POST /addHearing Status: ${res.statusCode}`);
    console.log(`POST /addHearing Response: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`POST /addHearing Body: ${data}`);
        
        // Test GET /hearings to verify the new hearing was added
        const getReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/hearings',
            method: 'GET'
        }, (getRes) => {
            console.log(`GET /hearings Status: ${getRes.statusCode}`);
            
            let getData = '';
            getRes.on('data', (chunk) => {
                getData += chunk;
            });
            
            getRes.on('end', () => {
                const hearings = JSON.parse(getData);
                const newHearing = hearings.find(h => h.Date.includes('2026-05-06'));
                if (newHearing) {
                    console.log("✅ New hearing found in database:", newHearing);
                } else {
                    console.log("❌ New hearing not found");
                }
                console.log("Hearing form test complete!");
                process.exit(0);
            });
        });
        
        getReq.on('error', (err) => {
            console.error('GET /hearings Error:', err.message);
            process.exit(1);
        });
        
        getReq.end();
    });
});

req.on('error', (err) => {
    console.error('POST /addHearing Error:', err.message);
    process.exit(1);
});

req.write(hearingData);
req.end();
