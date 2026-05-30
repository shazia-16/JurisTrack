const http = require('http');

// Test DELETE endpoints
console.log("Testing DELETE endpoints...");

// Test delete a case (using case 2002 which we created earlier)
const deleteCaseReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/deleteCase/2002',
    method: 'DELETE'
}, (res) => {
    console.log(`DELETE /deleteCase/2002 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`DELETE /deleteCase/2002 Body: ${data}`);
        
        // Test delete a judge (using judge 999 which we created earlier)
        const deleteJudgeReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/deleteJudge/999',
            method: 'DELETE'
        }, (res) => {
            console.log(`DELETE /deleteJudge/999 Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`DELETE /deleteJudge/999 Body: ${data}`);
                
                // Test delete a hearing (using hearing 9018 which we created earlier)
                const deleteHearingReq = http.request({
                    hostname: 'localhost',
                    port: 3000,
                    path: '/deleteHearing/9018',
                    method: 'DELETE'
                }, (res) => {
                    console.log(`DELETE /deleteHearing/9018 Status: ${res.statusCode}`);
                    
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        console.log(`DELETE /deleteHearing/9018 Body: ${data}`);
                        console.log("Delete endpoint tests complete!");
                        process.exit(0);
                    });
                });
                
                deleteHearingReq.on('error', (err) => {
                    console.error('DELETE /deleteHearing Error:', err.message);
                    process.exit(1);
                });
                
                deleteHearingReq.end();
            });
        });
        
        deleteJudgeReq.on('error', (err) => {
            console.error('DELETE /deleteJudge Error:', err.message);
            process.exit(1);
        });
        
        deleteJudgeReq.end();
    });
});

deleteCaseReq.on('error', (err) => {
    console.error('DELETE /deleteCase Error:', err.message);
    process.exit(1);
});

deleteCaseReq.end();
