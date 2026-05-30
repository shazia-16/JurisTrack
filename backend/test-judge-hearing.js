const http = require('http');

// Test POST /addJudge
const judgeData = JSON.stringify({
    Judge_ID: 999,
    Name: 'Test Judge',
    Court: 'Test Court'
});

const judgeOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/addJudge',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': judgeData.length
    }
};

const judgeReq = http.request(judgeOptions, (res) => {
    console.log(`POST /addJudge Status: ${res.statusCode}`);
    console.log(`POST /addJudge Response: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`POST /addJudge Body: ${data}`);
        
        // Test GET /judges
        const getJudgeReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/judges',
            method: 'GET'
        }, (getRes) => {
            console.log(`GET /judges Status: ${getRes.statusCode}`);
            
            let getData = '';
            getRes.on('data', (chunk) => {
                getData += chunk;
            });
            
            getRes.on('end', () => {
                console.log(`GET /judges Body: ${getData.substring(0, 200)}...`);
                
                // Test POST /addHearing
                const hearingData = JSON.stringify({
                    Case_No: 2002,
                    Date: '2026-05-06',
                    Time: '14:30'
                });
                
                const hearingOptions = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/addHearing',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': hearingData.length
                    }
                };
                
                const hearingReq = http.request(hearingOptions, (res) => {
                    console.log(`POST /addHearing Status: ${res.statusCode}`);
                    
                    let hearingData = '';
                    res.on('data', (chunk) => {
                        hearingData += chunk;
                    });
                    
                    res.on('end', () => {
                        console.log(`POST /addHearing Body: ${hearingData}`);
                        
                        // Test GET /hearings
                        const getHearingReq = http.request({
                            hostname: 'localhost',
                            port: 3000,
                            path: '/hearings',
                            method: 'GET'
                        }, (getRes) => {
                            console.log(`GET /hearings Status: ${getRes.statusCode}`);
                            
                            let getHearingData = '';
                            getRes.on('data', (chunk) => {
                                getHearingData += chunk;
                            });
                            
                            getRes.on('end', () => {
                                console.log(`GET /hearings Body: ${getHearingData}`);
                                console.log("All tests complete!");
                                process.exit(0);
                            });
                        });
                        
                        getHearingReq.on('error', (err) => {
                            console.error('GET /hearings Error:', err.message);
                            process.exit(1);
                        });
                        
                        getHearingReq.end();
                    });
                });
                
                hearingReq.on('error', (err) => {
                    console.error('POST /addHearing Error:', err.message);
                    process.exit(1);
                });
                
                hearingReq.write(hearingData);
                hearingReq.end();
            });
        });
        
        getJudgeReq.on('error', (err) => {
            console.error('GET /judges Error:', err.message);
            process.exit(1);
        });
        
        getJudgeReq.end();
    });
});

judgeReq.on('error', (err) => {
    console.error('POST /addJudge Error:', err.message);
    process.exit(1);
});

judgeReq.write(judgeData);
judgeReq.end();
