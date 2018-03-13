const BdsdClient = require('../index');

// BdsdClient function accepts socket filename as an argument.
// If no argument provided then it will try to connect to following file:
// process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock'. Usually it is /var/run/1000/bdsd.sock.
let myClient = BdsdClient();

// Listener for connected event.
// Triggers when client connects and receive 'bus connected' notification
myClient.on('connect', _ => {
  myClient
    .setProgrammingMode(1)
    .then(console.log)
    .catch(console.log);
  setTimeout(_ =>  {
    myClient
      .setProgrammingMode(0)
      .then(console.log)
      .catch(console.log);
  }, 3000);
});
