const http = require('http');

// Test function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ 
            status: res.statusCode, 
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: responseData 
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test the new API endpoints
async function testNewAPIs() {
  console.log('🧪 Testing New API Structure...\n');

  try {
    // Test Cases API
    console.log('📋 Testing Cases API...');
    
    // GET all cases
    const casesResult = await makeRequest('GET', '/api/cases');
    console.log(`GET /api/cases - Status: ${casesResult.status}`);
    console.log('Response:', JSON.stringify(casesResult.data, null, 2));
    
    // POST new case
    const newCase = {
      title: 'Test Case from API',
      status: 'Active',
      court: 'Test Court',
      next_hearing_date: '2024-12-01'
    };
    
    const createCaseResult = await makeRequest('POST', '/api/cases', newCase);
    console.log(`POST /api/cases - Status: ${createCaseResult.status}`);
    console.log('Response:', JSON.stringify(createCaseResult.data, null, 2));

    // Test Hearings API
    console.log('\n👂 Testing Hearings API...');
    
    // GET all hearings
    const hearingsResult = await makeRequest('GET', '/api/hearings');
    console.log(`GET /api/hearings - Status: ${hearingsResult.status}`);
    console.log('Response:', JSON.stringify(hearingsResult.data, null, 2));
    
    // POST new hearing
    const newHearing = {
      type: 'Test Hearing',
      date: '2024-12-01',
      time: '10:00:00',
      courtroom: 'Courtroom 1',
      judge: 'Test Judge',
      case_id: 'CASE0001',
      status: 'Scheduled'
    };
    
    const createHearingResult = await makeRequest('POST', '/api/hearings', newHearing);
    console.log(`POST /api/hearings - Status: ${createHearingResult.status}`);
    console.log('Response:', JSON.stringify(createHearingResult.data, null, 2));

    // Test Clients API
    console.log('\n👥 Testing Clients API...');
    
    // GET all clients
    const clientsResult = await makeRequest('GET', '/api/clients');
    console.log(`GET /api/clients - Status: ${clientsResult.status}`);
    console.log('Response:', JSON.stringify(clientsResult.data, null, 2));
    
    // POST new client
    const newClient = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '555-1234',
      address: '123 Test St',
      type: 'Individual'
    };
    
    const createClientResult = await makeRequest('POST', '/api/clients', newClient);
    console.log(`POST /api/clients - Status: ${createClientResult.status}`);
    console.log('Response:', JSON.stringify(createClientResult.data, null, 2));

    // Test validation errors
    console.log('\n⚠️ Testing Validation...');
    
    // Test invalid case creation
    const invalidCase = {
      title: '',  // Invalid: empty title
      status: 'InvalidStatus',  // Invalid status
      court: ''
    };
    
    const invalidCaseResult = await makeRequest('POST', '/api/cases', invalidCase);
    console.log(`POST /api/cases (invalid) - Status: ${invalidCaseResult.status}`);
    console.log('Response:', JSON.stringify(invalidCaseResult.data, null, 2));

    console.log('\n✅ API Testing Complete!');

  } catch (error) {
    console.error('❌ API Testing Error:', error.message);
  }
}

testNewAPIs();
