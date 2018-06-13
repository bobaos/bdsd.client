const BdsdClient = require('../index');

// BdsdClient function accepts socket filename as an argument.
// If no argument provided then it will try to connect to following file:
// process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock'. Usually it is /var/run/1000/bdsd.sock.
let myClient = BdsdClient();


// Register listener for broadcasted values
myClient.on('value', data => {
  console.log('broadcasted value', data);
});

// Listener for connected event.
// Triggers when client connects and receive 'bus connected' notification
myClient.on('connect', _ => {
  console.log('client connected');
  myClient
    .setValues([
      {id: 999, value: 'hello, friend'},
      {id: 999, value: 'hello, drug'}
    ])
    .then(console.log)
    .catch(console.log);
  // get list of all datapoints
  // myClient
  //   .getDatapoints()
  //   .then(console.log)
  //   .catch(console.log);
  //
  // // get description for one dp
  // myClient
  //   .getDescription(1)
  //   .then(console.log)
  //   .catch(console.log);
  //
  // // get datapoint value
  myClient
    .getStoredValue(1)
    .then(console.log)
    .catch(console.log);
  //
  // // set datapoint value and send to bus
  // myClient
  //   .setValue(1, true)
  //   .then(console.log)
  //   .catch(console.log);

  // now set interval to test multiple script instances
  // setInterval(_ => {
  //   myClient
  //     .getValue(1)
  //     .then(payload => {
  //       let value = payload.value;
  //       return myClient.setValue(1, !value);
  //     })
  //     .then(payload => {
  //       console.log('set value of dp 1 success', payload);
  //     })
  //     .catch(e => {
  //       console.log('err', e);
  //     })
  // }, 10000)
});

// error handling
myClient.on('error', err =>  {
  console.log(err.message);
});