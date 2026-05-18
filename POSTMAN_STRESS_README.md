Postman collection + Stress test instructions

Files:
- postman_collection.json (root)

How to use Postman collection
1. Import postman_collection.json into Postman (File -> Import).
2. Set variable {{baseUrl}} to http://localhost:8080/api
3. Use Register -> Login to obtain token. Copy token value to collection/environment variable {{token}}.
4. Run requests: Get Quizzes, Get Quiz by Id, Submit Quiz, Get History.

Basic stress tests (use carefully on local dev only)

1) Simple curl loop (Windows PowerShell):
# spam submit 10 times
for ($i=0; $i -lt 10; $i++) { 
  Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/quizzes/1/submit" -Headers @{ Authorization = "Bearer $env:TOKEN"; 'Content-Type'='application/json' } -Body '{"answers": {"1":0}}' ;
}

2) Using ApacheBench (ab) (if installed):
ab -n 100 -c 10 -p submit.json -T application/json "http://localhost:8080/api/quizzes/1/submit"
Where submit.json is a file containing the JSON body.

3) Node.js quick script (recommend if you have node installed):
const fetch = require('node-fetch');
(async ()=>{
  const url = 'http://localhost:8080/api/quizzes/1/submit';
  const headers = { 'Content-Type':'application/json', 'Authorization':'Bearer YOUR_TOKEN' };
  const body = JSON.stringify({ answers: { '1': 0 } });
  const promises = [];
  for (let i=0;i<50;i++) promises.push(fetch(url,{method:'POST',headers,body}));
  const res = await Promise.all(promises);
  console.log('done', res.map(r=>r.status));
})();

What to monitor
- DB growth: duplicate quiz_attempts
- API latency and 5xx errors
- Frontend behavior (double submits)

Safety
- Run only against local/dev environments.
- Stop tests if the server CPU/memory grows unexpectedly.

Notes
- The repository has been patched to validate quiz creation and to block submitting quizzes with zero questions. Commit not applied automatically: run the git commit command locally if needed.
