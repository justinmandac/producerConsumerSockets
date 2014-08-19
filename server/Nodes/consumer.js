/*
	CLIENT REPLIES WITH THE FOLLOWING MESSAGES:
		1-$ID-$DATA
			or
		0-$ID <- NO DATA YET
*/

var net  = require('net');
var url  = require('url');
var ID       = process.argv[2];
//var SOCK_ADD = process.argv[3];
var verb = process.argv[4]; //verbosity switch
var HOST = null;
var PORT = null;
var socket;

//verb == '-v' ? console.log('>Parsing socket address') : '';
console.log('Parsing socket address');

//var _tmp  = url.parse(SOCK_ADD,false);
//HOST = _tmp.hostname;
//PORT = _tmp.port;
//var SOCK_ADD = '10.100.192.12:3000';
socket = new net.Socket();
socket.setKeepAlive(true,10); //10ms heartbeat

//connect to server
//verb == '-v' ? console.log('Connecting to server at %j : %j', HOST, PORT): '';
socket.connect('3000','10.100.192.12',function(e){
	try{
		console.log('Connection successful @ %j', socket.remoteAddress);
	}
	catch(e){
		console.log(e.code);
	}

});

socket.on('error',function(e){
	switch(e.code){
		case 'ECONNREFUSED':
			console.log('[ERROR] Cannot contact server. Check your network.');
			break;
	}
});

socket.on('data', function(reply){
	var header = reply.toString().split('-');
	var data   = null;
	var src_ID = null;
	switch(header[0]){
		case '0':
			console.log('No data available');
			break;
		case'1':
			src_ID = header[1];
			data = header[2];
			console.log('Received data from server[%j] containing [%j]', src_ID, data);
	}
});