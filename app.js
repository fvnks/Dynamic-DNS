const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public')); // Serve static files (index.html)

app.get('/update-ip', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch

    const zoneId = '2e9e4663f6b3e29d70e61a172b58d31d';
    const dnsRecordName = 'host.fedestore.cl';
    const cloudflareApiToken = '7rcGo4ktp1YzS4jpoNRyYk6V7t0-DVAg3af6pHRR';

    // Get the external IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const externalIp = ipData.ip;

    // Get the DNS record ID
    const getRecordsUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${dnsRecordName}`;
    const getRecordsResponse = await fetch(getRecordsUrl, {
      headers: {
        'Authorization': `Bearer ${cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const getRecordsData = await getRecordsResponse.json();
    const dnsRecordId = getRecordsData.result[0]?.id;
    console.log('DNS record ID:', dnsRecordId, getRecordsData);

    if (!dnsRecordId) {
      console.error('DNS record not found.');
      res.status(500).send('DNS record not found!');
      return;
    }

    // Update the DNS record
    const updateRecordUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dnsRecordId}`;
    const updateRecordResponse = await fetch(updateRecordUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'A',
        name: dnsRecordName,
        content: externalIp,
        ttl: 120,
        proxied: true,
      }),
    });

    const updateRecordData = await updateRecordResponse.json();

    if (updateRecordResponse.ok) {
      console.log('DNS record updated successfully!');
      res.send('DNS record updated successfully!');
    } else {
      const errorText = await updateRecordResponse.text();
      console.error('Failed to update DNS record:', errorText);
      res.status(500).send(`Failed to update DNS record: ${errorText}`);
    }
  } catch (error) {
    console.error('Error updating IP:', error);
    res.status(500).send('Error updating IP address.');
  }
});

app.listen(port, () => {
    console.log(`Dynamic DNS app listening at http://localhost:${port}`);
});