/*
    This file contains all functions that implements file delivery API. 

*/

var fileDelivery = {},
	hosts = [], // Array containing list of all hosts
  links = [], // Array containing list of all links
	graph = {}, //link relations are mainained using Adjacency list type implementation in JS object
  Queue = require("./utility").Queue; // Implementation of queue data structure 
  
/*

  Request Parameters:
    1) srcHost : starting point of path 
    2) destHost : endpoint of path
  Response Parameters:
    1) resultObj : It has two properties, whose dtails can be found in /path/:srcHost/to/:destHost api description.
  Description: 
    This method finds shortest path between srcHost and destHost if exists.

*/

function findPath(srcHost, destHost){
  var pathTracker = {}, // To keep track of visited hosts
      isFound = false,  // Flag containing result 
      queue, // instance of Queue class
      current, // to store temorary value
      tempDestHost, // to store temporary destination host
      immidiateNodes, // to store immidiate hosts of a host
      i, l, 
      resultObj ={
          dataArr : [],
          overview : ""
      };
  
  hosts.forEach(function(host){
    pathTracker[host] = {};
    pathTracker[host].value = host;
    pathTracker[host].isVisited = false;
    pathTracker[host].previousHost = null;
    pathTracker[host].description = null;
  });
  
  pathTracker[srcHost].isVisited = true;
  
  queue = new Queue();
  queue.enqueue(srcHost);
  
  // Using BFS (Breadth First Search) algorithm for traversal. Loop terminates before comletion of traversal if destHost is found
  while(!queue.isEmpty() && !isFound){
    current = queue.dequeue();

    if(!Array.isArray(graph[current])){
      continue;
    }
          
    immidiateNodes = graph[current];
    l = immidiateNodes.length;
    for(i = 0; i< l ; i++){
      
        tempDestHost = pathTracker[immidiateNodes[i].destHost]; 
        
        // Maintaining visited state
        if(!tempDestHost.isVisited ){
            tempDestHost.isVisited = true;
            tempDestHost.previousHost = current;
            tempDestHost.description = immidiateNodes[i].description;
            if(tempDestHost.value === destHost){
              isFound = true;
              break;
            }
            queue.enqueue(tempDestHost.value);
        }            
        
    }
  }
  
  if(isFound){
    current = destHost;
    while(pathTracker[current].previousHost){
      resultObj.dataArr.unshift(current);
      resultObj.overview += current+"<--"+pathTracker[current].description+"--";
      current = pathTracker[current].previousHost;
    }
    resultObj.dataArr.unshift(current);
    resultObj.overview += current;
  }else{
      resultObj.overview = "No Path exists between "+srcHost+" and "+destHost;
  }
  
  return resultObj;
}

function addHost(req, res){

  var hostName = req.body.hostName.toUpperCase(),
      responseObj = {
        hasError: false
      };
  
  if(!hostName){
	  responseObj.hasError = true;
	  responseObj.errMsg = "Invalid input";
    res.json(responseObj);
    return;      
  }
  
  if(hosts.indexOf(hostName) === -1){
	  hosts.push(hostName);
	  responseObj.data = "Host added scucessfully";
	  res.json(responseObj);
  }else{
	  responseObj.hasError = true;
	  responseObj.errMsg = "Host already exists";
	  res.json(responseObj);
  }
}

function getHosts(req, res){
  var responseObj = {
        hasError: false
      };
	responseObj.data =  hosts;
	res.json(responseObj);
  res.status(200);  
}

function addLink(req, res){
  var srcHost = req.body.srcHost.toUpperCase(),
      destHost = req.body.destHost.toUpperCase(),
      description = req.body.description,
      responseObj = {
        hasError: false
      },
      linkObj = {};
      
   if(!srcHost || !destHost || !description){
     responseObj.hasError = true;
	   responseObj.errMsg = "Invalid input";
     res.json(responseObj);
     return;
   }
   
   linkObj.srcHost = srcHost;
   linkObj.destHost = destHost;
   linkObj.description = description;   
   links.push(linkObj);
   
   if(!graph[srcHost]){
     graph[srcHost] = [];
   }
   
  graph[srcHost].push({destHost: destHost, description: description});
  
   responseObj.data = "Link added scucessfully";
	 res.json(responseObj);  
      
}

function getLinks(req, res){
  var responseObj = {
        hasError: false
      };
	responseObj.data =  links;
	res.json(responseObj);
  
}

function getPath(req, res){
  var srcHost = req.params.srcHost.toUpperCase(),
      destHost = req.params.destHost.toUpperCase(),
      responseObj = {
        hasError: false
      },
      result;
   
   if(!srcHost || !destHost){
     responseObj.hasError = true;
	   responseObj.errMsg = "Invalid input";
     res.json(responseObj);
     return;
   }
      
  result = findPath(srcHost, destHost);
  responseObj.data = result;
  res.json(responseObj);   
   
}

fileDelivery.addHost = addHost;
fileDelivery.getHosts = getHosts;
fileDelivery.addLink = addLink;
fileDelivery.getLinks = getLinks;
fileDelivery.getPath = getPath;

module.exports = fileDelivery;