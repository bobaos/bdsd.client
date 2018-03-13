# bdsd - bobaos datapoint sdk daemon client

Coming soon.

## Usage

In terminal:
```bash
npm install --save bdsd.client
```

In js file:

```js
const BdsdClient = require('bdsd.client');

// BdsdClient function accepts socket filename as an argument. 
// If no argument provided then it will try to connect to following file:
// process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock'. Usually it is /run/user/1000/bdsd.sock.
let myClient = BdsdClient();


// Register listener for broadcasted values
myClient.on('value', data => {
  console.log('broadcasted value', data);
});


// Listener for connected event. 
// Triggers when client connects and receive 'bus connected' notification
myClient.on('connect', _ => {
  console.log('client connected');
  
  // get list of all datapoints
  myClient
    .getDatapoints()
    .then(console.log)
    .catch(console.log);
  
  // get description for one dp
  myClient
    .getDescription(1)
    .then(console.log)
    .catch(console.log);
  
  // get datapoint value
  myClient
    .getValue(1)
    .then(console.log)
    .catch(console.log);
  
  // send read request to bus
  myClient
    .readValue(1)
    .then(console.log)
    .catch(console.log);
  
  // set datapoint value and send to bus
  myClient
    .setValue(1, true)
    .then(console.log)
    .catch(console.log);
 
  // set programming mode to 1
  myClient
  .setProgrammingMode(1)
  .then(console.log)
  .catch(console.log);
});
```
