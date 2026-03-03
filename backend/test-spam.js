fetch("http://localhost:5000/api/contact", { 
    method: "POST", 
    headers: { 
        "Content-Type": "application/json",
        "User-Agent": "curl/7.88.1"
    }, 
    body: JSON.stringify({ name: "Spammer", email: "s@s.com", subject: "spam", message: "spam" }) 
})
.then(r => r.json().then(j => console.log('Status:', r.status, 'Response:', j)))
.catch(e => console.error(e));
