const express = require('express')

const app = express()

function sum(n){
  return n + 1;
}

app.get('/',function(req,res){
  const q = req.query.n 
  const ans = sum(q)
  res.send('Your sum is ' + ans)
})

app.listen(3000)