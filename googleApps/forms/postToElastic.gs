function sendResponse(e) {
    var responseDict = response2dictionary(e.response)
    enrichResponse(responseDict);
    var jsonString = JSON.stringify(responseDict);
    post(jsonString);
}

function response2dictionary(response) {
  var responseObject = {};
  responseObject['timestamp'] = response.getTimestamp();
  for each (var item in response.getItemResponses()){responseObject[item.getItem().getTitle()] = item.getResponse();}
  return responseObject;
}

function enrichResponse(responseDict) {
  responseDict['location']=getLocation(responseDict['Adresse'])
}


function response2JSON(response){
  Logger.log(response)
  var responseObject = {};
  var itemResponses = response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var formResponse = itemResponses[i];
    responseObject[formResponse.getItem().getTitle()] = formResponse.getResponse();
   }
  
  Logger.log("Lager json-objekt:");
  Logger.log(JSON.stringify(responseObject));
  return JSON.stringify(responseObject);
}

function post(jsonString) {
 var URL = ''
 var INDEX = 'test_google_forms'
 var TYPE = 'tst_type'
 var CREDENTIALS = '' 
 return postToElastic(jsonString,URL,INDEX,TYPE,CREDENTIALS)
}

function postToElastic(jsonString,url,index,type,credentials) {
 var options = {
   'method' : 'post',
   'contentType': 'application/json',
   'payload' : jsonString,
   'headers' : {'Authorization': 'Basic ' + Utilities.base64Encode(credentials)}
 };
 return UrlFetchApp.fetch('https://'+url+'/'+index+'/'+type, options);
}

function testPostToElastic() {
  var jsonString = '{"hsad":"blasdfk"}';
  var response = post(jsonString);
  Logger.log(response);
}

function getLocation(adressString) {
    var location = Maps.newGeocoder().geocode(adressString);
    if (location.status != 'OK') {return null};
    
    n = location.results.length;
    coordinates = {lat:0, lon: 0}
    for each (result in location.results) {
      coordinates['lat'] = result.geometry.location['lat']/n
      coordinates['lon'] = result.geometry.location['lng']/n
    }
    
    return coordinates
}

function testGetLocation() {
  Logger.log(getLocation('Skøyenveien 71, 0375 Oslo'))
}
