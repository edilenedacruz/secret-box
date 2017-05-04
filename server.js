const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Secret Box';

app.locals.secrets = {
  wowowow: 'I am a banana'
};

app.get('/', (request, response) => {
  response.send(app.locals.title);
})

app.get('/api/secrets/:id', function(request, response){
  const id = request.params.id
  const message = app.locals.secrets[id]

  if(!message){ return response.sendStatus(404) }
  
  response.json({ id: id, message: message });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)

    // or
    //  console.log(app.locals.title + ' is running on ' + app.get(port))
  });
}


module.exports = app;
