Title
========================================================================================
Sample APIS - using graph data structure and BFS (Breadth First Seach) algorithm

Description
========================================================================================
This application contains some sample APIS to create graph data structure and taversal through it using BFS (Breadth First Seach).

	Prerequisite : Understanding of graph data structure and BFS


Here are details of APIs.

APIs
========================================================================================
1) /host:

	This API adds new host.
	Request Header : 
	{
		"Content-type"" : "application/json"
	}
	Request Body:
	{"hostName":"A"}
	
2) /hosts:

	This API returns list of all hots in array format.

3) /link :

	This API adds new link.
	Request Header : 
	{
		"Content-type"" : "application/json"
	}
	Request Body:
	
	{"srcHost" : "A", "destHost" : "B","description" : "ftp"}

4) /links :

	This API returns list of all links in array of objects format. Object has following properties: srcHost, destHost, description

5) /path/:srcHost/to/:destHost
	

	This API returns the shortest path between srcHost and destHost. Response contains object with following properties:
	1) dataArr : Array containing all the hosts from srcHost to destHost in sequence. If no path exists between srcHost and destHost, this array is empty.
	2) overview : String containing route (destHost <--connectionMethod-- ...hosts ... --srcHost). If no path exists between srcHost and destHost, this string contains a suitable message.
	Here is sample response:
	
	a) if path exists:
	{
		"hasError": false,
		"data": {
			"dataArr": [
				"A",
				"D",
				"G",
				"I",
				"J",
				"L",
				"N",
				"R"
			],
	
			"overview": "R<--ftp--N<--rsync--L<--ftp--J<--ftp--I<--ftp--G<--ftp--D<--ftp--A"
	
		}
	}
	
	b) if path doesn't exist:
	
	{
		"hasError": false,
		"data": {
			"dataArr": [],
			"overview": "No Path exists between F and S"
		}
	}
	
Steps to get Started 
========================================================================================
1) Download this repo.

2) cd into this folder on your system terminal.

3) Run command "npm install"

4) Run command "node server.js"

5) Server starts on port 3000 by defulat. To use any of above api, append it to "http://localhost:3000".  e.g. "http://localhost:3000/host".
 
6) Use any REST client to verify implementation. Please pass parameters as mentioned above.




Other Features
========================================================================================

1) Standard boilerplate for a nodejs server

2) Unified logging 

3) Cron job to remove log file content everyday

