const url = 'https://api.drugcity.a8a8.top/';


var map_data = [];
// create a new object to hold the map grid
const map_object = new THREE.Object3D();
scene.add(map_object);
var the_map;

display_folder.add(map_object, 'visible').name('map_object');
var grid_unit_size = 1;

map_object.visible = false;

function get_map(){

// create ajax call to get the data from the server
 axios.get(url+"map").then(function(response) {

    // get the data from the response
    const data = response.data;
    map_data = data;
    the_map = map_data;

    var map_2d =map_data.map;

    // loop through the 2d array and create a 2d grid map
    for (let i = 0; i < map_2d.length; i++) {
        for (let j = 0; j < map_2d[i].length; j++) {
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(grid_unit_size, grid_unit_size, grid_unit_size),
                new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: map_2d[i][j] == 1 ? 0x0000ff : 0xff0000
                })
            );
            cube.position.set((i-map_data.city_width*0.5+0.5)*grid_unit_size, 0, (j-map_data.city_height*0.5+0.5)*grid_unit_size);
            map_object.add(cube);
        }
    }


    console.log(data);

});

}


const talk_to_server = {
    talk_to_server: function() {
        restart_gpt();
    }
};

button_folder.add(talk_to_server, 'talk_to_server').name('talk_to_server');

// create ajax call to get the data from the server through a get method,with a get parameter "prompt" value "ok"
function get_new_city(input_prompt){

    const params = {
        prompt: input_prompt+",please reply restrictedly using json"
      };
      // Here, 'param1' is the name of the parameter expected by the API. Replace it and its value as needed.
      
      axios.get(url+"city", {params})
      .then(function (response) {
        // The request was successful, you can process the response here.
        console.log(response.data);
        var the_result = response.data;


        // check is the response.data is a string or a json object
        if (typeof the_result == "string"){
            console.log("parse the string");
            the_result = JSON.parse(the_result);
            the_map.map = the_result.rebuild[0].layout;
            console.log(the_map.map);
            document.getElementById("status").innerHTML="Standby"

        }else{
            the_map.map = the_result.rebuild[0].layout;
            console.log(the_map.map);
            document.getElementById("status").innerHTML="standby"
            document.getElementById("answer").innerHTML=the_result.rebuild[0].description;
            
            hit_the_object_in_center();

        }


      })
      .catch(function (error) {
        // The request failed, handle the error here
        console.log(error);
      });

}

function restart_gpt(){
    axios.get(url+"prompt_history/reset")
    .then(function (response) {
      // The request was successful, you can process the response here.
      console.log(response.data);
    })
    .catch(function (error) {
      // The request failed, handle the error here
      console.log(error);
    });
}


// get the entire map
get_map();

// restart the chatgpt prompt
restart_gpt();
