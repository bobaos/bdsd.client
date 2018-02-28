const net = require('net');
const FrameParser = require('./FrameHelpers/Parser');
const {composeFrame} = require('./FrameHelpers/compose');
const EE = require('events').EventEmitter;

const Client = function (socketFile) {
  let self = new EE();
  self._requests = [];
  let SOCKETFILE = process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock';
  if (typeof socketFile === 'string') {
    SOCKETFILE = socketFile;
  }
  const socket = net.createConnection(SOCKETFILE);
  socket.on('connect', _ => {
    const frameParser = new FrameParser();
    frameParser.on('data', data => {
      //console.log('got data from socket', data.toString());
      try {
        const dataObject = JSON.parse(data.toString());
        const method = dataObject.method;
        const payload = dataObject.payload;
        switch (method) {
          case 'notify':
            switch (payload) {
              case 'bus connected':
                self.emit('connect');
                break;
              case 'bus disconnected':
                self.emit('disconnect');
                break;
              default:
                break;
            }
            break;
          case 'cast value':
            self.emit('value', payload);
            break;
          default:
            if (Object.prototype.hasOwnProperty.call(dataObject, 'response_id')) {
              // find resolve, reject cb by response_id
              const findByResponseId = t => t.request_id === dataObject.response_id;
              let requestIndex = self._requests.findIndex(findByResponseId);
              if (requestIndex >= 0) {
                // check success true/false then resolve/reject
                console.log('Response: ```' + data + '```.');
                if (dataObject.success) {
                  self._requests[requestIndex].resolve(payload);
                } else {
                  self._requests[requestIndex].reject(dataObject.error);
                }
                // delete request from list
                self._requests.splice(requestIndex, 1);
              }
            }
            break;
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.pipe(frameParser);
  });
  // now Client API
  self.getDatapoints = function () {
    return new Promise((resolve, reject) => {
      // TODO: check id field undefined -> reject
      const request_id = Math.round(Math.random()*Date.now());
      const method = 'get datapoints';
      const data = {
        request_id: request_id,
        method: method,
      };
      self._sendDataFrame(JSON.stringify(data));
      self._requests.push({request_id: request_id, resolve: resolve, reject: reject});
    });
  };
  self.getDescription = function (id) {
    return new Promise((resolve, reject) => {
      // TODO: check id field undefined -> reject
      const request_id = Math.round(Math.random()*Date.now());
      const method = 'get description';
      const payload = {id: id};
      const data = {
        request_id: request_id,
        method: method,
        payload: payload
      };
      self._sendDataFrame(JSON.stringify(data));
      self._requests.push({request_id: request_id, resolve: resolve, reject: reject});
    });
  };
  self.getValue = function (id) {
    return new Promise((resolve, reject) => {
      // TODO: check id field undefined -> reject
      const request_id = Math.round(Math.random()*Date.now());
      const method = 'get value';
      const payload = {id: id};
      const data = {
        request_id: request_id,
        method: method,
        payload: payload
      };
      self._sendDataFrame(JSON.stringify(data));
      self._requests.push({request_id: request_id, resolve: resolve, reject: reject});
    });
  };
  self.setValue = function (id, value) {
    return new Promise((resolve, reject) => {
      // TODO: check id field undefined -> reject
      // TODO: check value field, reject if undefined
      const request_id = Math.round(Math.random()*Date.now());
      const method = 'set value';
      const payload = {id: id, value: value};
      const data = {
        request_id: request_id,
        method: method,
        payload: payload
      };
      self._sendDataFrame(JSON.stringify(data));
      self._requests.push({request_id: request_id, resolve: resolve, reject: reject});
    });
  };
  self.readValue = function (id) {
    return new Promise((resolve, reject) => {
      // TODO: check id field undefined -> reject
      const request_id = Math.round(Math.random()*Date.now());
      const method = 'read value';
      const payload = {id: id};
      const data = {
        request_id: request_id,
        method: method,
        payload: payload
      };
      self._sendDataFrame(JSON.stringify(data));
      self._requests.push({request_id: request_id, resolve: resolve, reject: reject});
    });
  };
  self._sendDataFrame = function (data) {
    console.log('Request: ```' + data + '```');
    const frame = composeFrame(data);
    return socket.write(frame);
  };
  // TODO: implement request-response Promise API
  // TODO: implement events like 'notify', 'cast value'
  // TODO: functions getDatapointValue, setDatapointValue

  return self;
};


module.exports = Client;
