const BdsdClient = require('./index');

let myClient = BdsdClient();
myClient.on('value', data => {
  console.log('broadcasted value', data);
});

myClient.on('connect', _ => {
  console.log('connected meow!');
  myClient.readValue(204);
  myClient
    .getValue(204)
    .then(console.log)
    .catch(console.log);
});

