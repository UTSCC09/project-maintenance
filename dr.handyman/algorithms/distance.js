/*jshint esversion: 9 */

/**
 * 
 * Reference in general:
 * Haversine formula: https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
 *                    https://en.wikipedia.org/wiki/Haversine_formula
 * 
 */

var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    // 1 is lat, 0 is long
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2[1] - p1[1]);
    var dLong = rad(p2[0] - p1[0]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1[1])) * Math.cos(rad(p2[1])) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function coordinateCheck (coordinates)
{
    return coordinates != null && coordinates != undefined && coordinates.length == 2
    && typeof coordinates[0] === "number" && typeof coordinates[1] === "number";
}

function addDistances (inputList, coordinates)
{
    if (coordinateCheck(coordinates)){
            inputList.forEach((elem) => {
                elem["distance"] = getDistance(coordinates, elem.location.coordinates) / 1000;
            })
            
        }
    else{
        inputList.forEach((elem) => {
            elem["distance"] = null;
        })
    }
    return inputList;
}

module.exports = {
    coordinateCheck,
    addDistances,
    getDistance,
};