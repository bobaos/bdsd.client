const BdsdClient = require('./index');

let myClient = BdsdClient();
myClient.on('value', data => {
  console.log('broadcasted valeu', data);
});

const a = function () {

};
myClient.on('connect', _ => {
  console.log('connected meow!');
  myClient
    .setValue(31, 257)
    .then(a)
    .catch(a);
});

