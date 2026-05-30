const http = require('http');

// Test POST /addCase
const testCaseData = JSON.stringify({
    Case_No: 'TEST-001',
    Type: 'Test Case',
    Date_Filed: '2026-05-05'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/addCase',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': testCaseData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`POST /addCase Status: ${res.statusCode}`);
    console.log(`POST /addCase Response: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`POST /addCase Body: ${data}`);
        
        // Test GET /cases
        const getReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/cases',
            method: 'GET'
        }, (getRes) => {
            console.log(`GET /cases Status: ${getRes.statusCode}`);
            
            let getData = '';
            getRes.on('data', (chunk) => {
                getData += chunk;
            });
            
            getRes.on('end', () => {
                console.log(`GET /cases Body: ${getData}`);
                process.exit(0);
            });
        });
        
        getReq.on('error', (err) => {
            console.error('GET /cases Error:', err.message);
            process.exit(1);
        });
        
        getReq.end();
    });
});

req.on('error', (err) => {
    console.error('POST /addCase Error:', err.message);
    process.exit(1);
});

req.write(testCaseData);
req.end();
