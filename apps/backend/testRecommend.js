const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjYyNzlmN2QxYWI0YWI3YjVkMWI5NyIsImlhdCI6MTc3NzczOTY3OSwiZXhwIjoxNzc4MzQ0NDc5fQ.l7ntK6uKlvv1ugY6dE5AxI2yYMZomjxQLkYycNx8DuY';
fetch('http://localhost:5000/api/recommend', { 
  method: 'POST', 
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + token 
  }, 
  body: JSON.stringify({
    userProfileId: '69f627bdbdc944dc0913292f'
  })
}).then(r=>r.json()).then(d=>console.log(JSON.stringify({
  success: d.success,
  count: d.data?.length,
  firstRecommendationName: d.data?.[0]?.name,
  firstRecommendationScore: d.data?.[0]?.relevanceScore
}, null, 2)));
