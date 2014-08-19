var data = 0;

function intervalHandler(data){

	console.log(data);
}
var intervalObject = setInterval(intervalHandler, 100, data);