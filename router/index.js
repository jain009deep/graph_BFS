/*
	Define all application routes here
*/


var router,
	app;


app = require("../app");

function defineRoutes(router){
	/*
		This API adds new host.
		Request Header : 
		{
			"Content-type"" : "Application/json"
		}
		Request Body:
		{
			hostName : "A"
		}
	*/
	router.post('/host', app.fileDelivery.addHost);
	
	/*
		This API returns list of all hots in array format.
	*/
	router.get('/hosts', app.fileDelivery.getHosts);
	/*
		This API adds new link.
		Request Header : 
		{
			"Content-type"" : "Application/json"
		}
		Request Body:
		{
			srcHost : "A",
			destHost : "B",
			description : "ftp"
		}
	*/
	router.post('/link', app.fileDelivery.addLink);
	
	/*
		This API returns list of all links in array of objects format. Object has following properties: srcHost, destHost, description
	*/
	
	router.get('/links', app.fileDelivery.getLinks);
	
	/*
		This API returns the shortest path between srcHost and destHost. Response contains object with following properties:
		1) dataArr : Array containing all the hosts from srcHost to destHost in sequence. If no path exists between srcHost and destHost, this array is empty.
		2) overview : String containing route (destHost <--connectionMethod-- ...hosts ... --srcHost). If no path exists between srcHost and destHost, this string contains a suitable message.

	*/
	router.get('/path/:srcHost/to/:destHost', app.fileDelivery.getPath);
}

router ={};
router.defineRoutes = defineRoutes;

module.exports = router;