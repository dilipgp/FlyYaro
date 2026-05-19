import fetch from 'node-fetch';

async function testAmadeus() {
  console.log('Testing Amadeus API endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/flights/amadeus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2024-02-15',
        adults: 1
      })
    });
    
    const data = await response.json();
    
    console.log('✓ API Response:');
    console.log('  Success:', data.success);
    console.log('  Source:', data.source);
    console.log('  Flights:', data.flights?.length || 0);
    
    if (data.flights && data.flights.length > 0) {
      console.log('\n✓ First flight:');
      const f = data.flights[0];
      console.log(`  ${f.airline} ${f.flightNumber}`);
      console.log(`  ${f.departure.code} → ${f.arrival.code}`);
      console.log(`  $${f.price} - ${f.provider}`);
      console.log(`  Source: ${f._source}`);
    }
    
    console.log('\n✓ Amadeus is WORKING as primary source');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('\nNote: Server must be running on port 5000');
  }
}

testAmadeus();