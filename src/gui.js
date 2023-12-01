
//import the gui
import * as dat from 'dat.gui';
// import stats 
import Stats from 'three/examples/jsm/libs/stats.module.js';



const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)


const gui = new dat.GUI();

//create a folder for the Display
const display_folder = gui.addFolder('Display');

//set the gui to the front

gui.domElement.style.zIndex = 10000;


// add gui buttons new folder
const button_folder = gui.addFolder('Buttons');

const button_ready = {
    ready: function() {
        // ready to construct the map
        state = "selection";
        findNeighbor();
        smooth_hex_vertexes_positions();
        covert2Dto3D();
    }
}

button_folder.add(button_ready, 'ready').name('Ready');

// add one button
const button = {
    findNeighbor: function() {
        findNeighbor();
    }
};

// add the button to the folder
button_folder.add(button, 'findNeighbor').name('Find Neighbor');

// add another button smooth

const button_smooth = {
    smooth: function() {
        smooth_hex_vertexes_positions();
    }
};

button_folder.add(button_smooth, 'smooth').name('Smooth');

// add 2d to 3d button
const button_2d_to_3d = {
    convert: function() {
        covert2Dto3D();
    }
};



button_folder.add(button_2d_to_3d, 'convert').name('2D to 3D');

button_folder.open();

// add gui check boxes for the display
// display_folder.add(SelectedVertex_object, 'visible').name('SelectedVertex_object');
// display_folder.add(MarchVertex_object, 'visible').name('MarchVertex_object');
// display_folder.add(mesh_hold_object, 'visible').name('mesh_hold_object');



const button_call_api = {
    call_api: function() {
        get_map();
    }
};

button_folder.add(button_call_api, 'call_api').name('call_api');

// fold the button folder
button_folder.close();

function hit_the_object(x,z){
    if (AllVertexList.length>0){
        // clear the highlight object
        highlight_object.children.forEach(function(object) {
            highlight_object.remove(object);
        });
        VertexSelection=GetNearestVertex(x,0,z,AllVertexList);

        if (VertexSelection != -1){
            the_hitted_logic(VertexSelection);
        }
    }
}
 

function hit_the_object_in_center(){

    //loop through the 2d map and perform a hit_the_object
    var map_2d =the_map.map;

    var grid_unit_size = 1;
    // loop through the 2d array and create a 2d grid map



    for (let i = 0; i < map_2d.length; i++) {
        for (let j = 0; j < map_2d[i].length; j++) {
            if (the_map.map[i][j]!=0){
                hit_the_object((i-map_data.city_width*0.5+0.5)*grid_unit_size,(j-map_data.city_height*0.5+0.5)*grid_unit_size);
            }
        }
    }


    
}

const button_hit_the_object = {
    hit_the_object: function() {
        hit_the_object_in_center();
    }
};

button_folder.add(button_hit_the_object, 'hit_the_object').name('hit_the_object');
