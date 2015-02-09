var myModule = angular.module('player', []);
player.factory('count', function() {
  console.log("GDR: count factory invoked");
  var num = 0;
  return function() {
    console.log("GDR: count invoked");
    num++;
    console.lok
    return num; 
  };
});

WIBBLE


