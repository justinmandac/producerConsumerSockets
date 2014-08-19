/*
	CLIENT REPLIES WITH THE FOLLOWING MESSAGES:
		1-$ID-$DATA
			or
		0-$ID <- NO DATA YET

	@args
		socket_address
		verbosity switch
*/

var net  = require('net');
var url  = require('url');
var SOCK_ADD = process.argv[2];
var verb = process.argv[3]; //verbosity switch
var ID   = null;
var HOST = null;
var PORT = null;
var TRANSMIT_INTERVAL = 1000; //
var socket;
var TRANSMIT_DATA  = '12345678';
var intervalObject = null;
var isInit = false;

var _tmp  = url.parse(SOCK_ADD,false);
HOST = _tmp.hostname;
PORT = _tmp.port;

socket = new net.Socket();
socket.setKeepAlive(true,10); //10ms heartbeat

//connect to server
verb == '-v' ? console.log('Connecting to server at %j : %j', HOST, PORT): '';


socket.on('error',function(e){
	switch(e.code){
		case 'ECONNREFUSED':
			console.log('[ERROR] Cannot contact server. Check your network.');
			break;
	}
});

socket.on('data', function(data){
	console.log(data.toString());
});

function dataTransmitCallback(data,conn){

	console.log('Writing data [%j] to [%j]',TRANSMIT_DATA, conn.remoteAddress);
	socket.write(TRANSMIT_DATA);

}

var intervalObject  = setInterval(dataTransmitCallback, 1000, [TRANSMIT_DATA, socket]);
