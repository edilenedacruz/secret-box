const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Secret Box';
app.locals.secrets = {
  wowowow: 'I am a banana'
};

app.get('/', (request, response) => {
  response.send(app.locals.title);
})

app.get('/api/secrets', (request, response) => {
  const secrets = app.locals.secrets

  response.json({ secrets })
});

app.get('/api/secrets/:id', (request, response) => {
  const id = request.params.id
  const message = app.locals.secrets[id]

  if(!message){ return response.sendStatus(404) }

  response.json({ id, message });
});

app.post('/api/secrets', (request, response) => {
  const message = request.body.message
  // const id = md5(message)

  if(!message) {
    return response.status(422).send({
      error: 'No message property provided'
    });
  } else {
    const id = md5(message)
    app.locals.secrets[id] = message
    response.status(201).json({ id, message })
  }
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  });
}


module.exports = app;
