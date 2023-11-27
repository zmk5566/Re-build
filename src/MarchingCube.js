var gridLimit = 100;
var boxSize = 50;
//create an array of a 2d map with size (5,5)
var points = [];
var surface = {};

var boxPositions = [];
var boxIndex = 0;

const cubeVertices = [
  [boxSize/2, boxSize/2, boxSize/2],
  [-boxSize/2, boxSize/2, boxSize/2],
  
  [-boxSize/2, boxSize/2, -boxSize/2],
  [boxSize/2, boxSize/2, -boxSize/2],

  [boxSize/2, -boxSize/2, boxSize/2],
  [-boxSize/2, -boxSize/2, boxSize/2],

  [-boxSize/2, -boxSize/2, -boxSize/2],
  [boxSize/2, -boxSize/2, -boxSize/2],
]

const cubeEdges = [

  [boxSize/2, 0, 0],
  [0, 0, boxSize/2],
  [-boxSize/2, 0, 0],
  [0, 0, -boxSize/2],

  [boxSize/2, 0, 0],
  [0, 0, boxSize/2],
  [-boxSize/2, 0, 0],
  [0, 0, -boxSize/2],
  

  [0, boxSize/2, 0],
  [0, boxSize/2, 0],
  [0, boxSize/2, 0],
  [0, boxSize/2, 0]

]


// create a 2d map in the format of a 2d array,with the size (8,8)


var surfaceLimit = 1;

var currentBox = [];
var vertexCoords = [];
var edgeVals = [];
var pointsConnect = [];
var planes = {};


function marching(){
    currentBox = boxPositions[boxIndex];
    
    vertexCoords = cubeVertices.map(item => {
      return [ item[0]+currentBox[0], item[1]+currentBox[1], item[2]+currentBox[2] ]
    });
  
    edgeCoords = cubeEdges.map((item, index) => {
      if(index < 8){
        return item.map((item_, index_) => {
          return vertexCoords[index][index_] - item_;
        })
      }else{
        return item.map((item_, index_) => {
          return vertexCoords[index % 8][index_] - item_;
        })
      }
    })
  
    edgeVals = vertexCoords.map(item => {
      return surface[`${item[0]}, ${item[1]}, ${item[2]}`];
    })
    edgeVals.reverse()
  
    //print(edgeVals);
  
    pointsConnect = traingulationTable[ parseInt(edgeVals.join(''), 2) ].map((number) => {
      return edgeCoords[number];
    });
  
    planes[boxIndex] = pointsConnect;
  }
  
  function surfaces(){
  
    for (const key in planes) {
      if (Object.hasOwnProperty.call(planes, key)) {
        const element = planes[key];
  
        for(var i=0; i<element.length; i+=3){
  
          fill(237, 34, 93);
          stroke(0);
          beginShape();
          vertex(element[i][0], element[i][1], element[i][2]);
          vertex(element[i+1][0], element[i+1][1], element[i+1][2]);
          vertex(element[i+2][0], element[i+2][1], element[i+2][2]);
          endShape();
  
        }
      }
    }
  }
  

  function updateEverything() {

    points = [];
    boxPositions = [];
    surface = {};
    boxIndex = 0;
    currentBox = [];
    vertexCoords = [];
    edgeVals = [];
    pointsConnect = [];
    planes = {};
  
  
        // Generate box movement, points and assign surface level value
        for(var a = gridLimit; a >= -gridLimit; a = a-boxSize){
          for(var b = gridLimit; b >= -gridLimit; b = b-boxSize){
            for(var c = gridLimit; c >= -gridLimit; c = c-boxSize){
  
              points.push([a, b, c])
              
  
              if(c != -gridLimit && b != -gridLimit && a != -gridLimit){
                boxPositions.push([a-(boxSize/2), b-(boxSize/2), c-(boxSize/2)]);
              }
            }
          }
        }
  
        // iterate through all points 
        for (let item of points){
          //print(item);
          //print(surface[`${item[0]}, ${item[1]}, ${item[2]}`]);
          var a = item[0];
          var b = item[1];
          var c = item[2];
  
  
          var tempIndx_x = map(a, -gridLimit, gridLimit, 0, the_map.length-1);
          var tempIndx_y = map(c, -gridLimit, gridLimit, 0, the_map.length-1);
  
  
          if (the_map[tempIndx_x][tempIndx_y] != 0){
            var threashold = boxSize;
            if ((b - threashold) < map(the_map[tempIndx_x][tempIndx_y],0,5,-gridLimit,gridLimit)){
              surface[`${a}, ${b}, ${c}`] = 1;
  
            }else{
              surface[`${a}, ${b}, ${c}`] = 0;
            }
          }else{
            surface[`${a}, ${b}, ${c}`] = 0;
          }
      
  
        }
    
        var t = Object.values(surface)
        var max = Math.max(t)
  
  }
  