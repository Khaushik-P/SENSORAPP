const https = require('https');
const url = require('url');

// Replace with your actual pre-signed URL that allows PUT requests.
// Ensure this URL is valid and has not expired.\
const presignedUrl="https://esp32-sensorapp.s3.ap-south-1.amazonaws.com/sensor-data.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MI2JVHO4FBXZHUX%2F20250325%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250325T071900Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=55fe42c6d519803b2dbd59097e45b606bd03ab4ab5519f590e9fe93de1af62aa";
function uploadSensorData() {
  // Simulate sensor data values
  const sensorData = {
    turbidity: (Math.random() * 10).toFixed(2), // Value between 0 and 10 NTU
    pH: (6 + Math.random() * 3).toFixed(2),       // Value between 6.0 and 9.0
    tds: (Math.random() * 1000).toFixed(2),       // Value between 0 and 1000 ppm
    timestamp: new Date().toISOString(),
  };

  // Print the sensor data to the terminal
  console.log("Uploading sensor data:", sensorData);

  const payload = JSON.stringify(sensorData);
  const parsedUrl = url.parse(presignedUrl);

  const options = {
    method: 'PUT',
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
  });

  req.on('error', (e) => {
    console.error('Error:', e);
  });

  req.write(payload);
  req.end();
}

// Upload sensor data every 10 seconds
setInterval(uploadSensorData, 10000);
