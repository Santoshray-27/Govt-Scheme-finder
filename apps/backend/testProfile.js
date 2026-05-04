const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjYyNzlmN2QxYWI0YWI3YjVkMWI5NyIsImlhdCI6MTc3NzczOTY3OSwiZXhwIjoxNzc4MzQ0NDc5fQ.l7ntK6uKlvv1ugY6dE5AxI2yYMZomjxQLkYycNx8DuY';
fetch('http://localhost:5000/api/profile', { 
  method: 'POST', 
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + token 
  }, 
  body: JSON.stringify({
    "profileName": "Test Farmer",
    "demographics": { "age": 35, "gender": "MALE", "maritalStatus": "MARRIED" },
    "location": { "state": "Maharashtra", "district": "Pune", "rural": true },
    "economic": {
      "annualIncome": 150000,
      "occupation": "Farmer",
      "employmentStatus": "SELF_EMPLOYED",
      "assets": { "landOwnership": true, "landSize": 2, "houseOwnership": true }
    },
    "social": { "category": "OBC", "minority": false, "disability": false, "bplStatus": false },
    "family": { "familySize": 4, "dependents": 2, "childrenUnder18": 2 }
  })
}).then(r=>r.json()).then(console.log);
