const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'

app.get('/', (request, response) => {
  response.send('It\'s a secret to everyone.')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
