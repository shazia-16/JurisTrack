const http = require('http');

// Test function to make HTTP requests
function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

// Test the API endpoints
async function testAPIs() {
    try {
        console.log('Testing /api/dashboard endpoint...');
        const dashboardResult = await makeRequest('/api/dashboard');
        console.log('Status:', dashboardResult.status);
        console.log('Data:', JSON.stringify(dashboardResult.data, null, 2));

        console.log('\nTesting /api/recent-cases endpoint...');
        const recentCasesResult = await makeRequest('/api/recent-cases');
        console.log('Status:', recentCasesResult.status);
        console.log('Data:', JSON.stringify(recentCasesResult.data, null, 2));

        console.log('\nTesting /api/upcoming-hearings endpoint...');
        const upcomingHearingsResult = await makeRequest('/api/upcoming-hearings');
        console.log('Status:', upcomingHearingsResult.status);
        console.log('Data:', JSON.stringify(upcomingHearingsResult.data, null, 2));

    } catch (error) {
        console.error('Error testing APIs:', error.message);
    }
}

testAPIs();
