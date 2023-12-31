//created a class to hold all the loaded models, it should have the function of loading the model and returning the model 
//when needed

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as THREE from 'three';

// import the marching cube test
import {bit_to_mesh} from './MarchingCubeTest.js';

var all_model_list = [];
const loader = new OBJLoader();
var model_path = "/models/";
var is_cube = false;




function load_all_models(is_genertive=false){
    // loop through all 0-255 numbers and load the model

    if (is_genertive){
        // fetch the json file

        for (var i = 0; i < 256; i++){
            //load_model(i);                
            load_model_generative(i);

        }

    }else{
 
        fetch('/obj_load_chart.json')
        .then(response => response.json())
        .then(data => {
            //console.log("load the model load list",data);
            for (var i = 0; i < 256; i++){
                load_model(i,data[i]); 
            }
        });
        //all_model_list.push(model);

    }
}



export function intToPaddedBinaryString(num) {
    // Ensure the number is within the 8-bit range.
    if (num < 0 || num > 255) {
        throw new Error('The input number must be in the 8-bit range (0-255).');
    }

    let binaryStr = num.toString(2); // Convert to binary string.
    
    // Pad with leading zeros until the length is 8 characters.
    while (binaryStr.length < 8) {
        binaryStr = '0' + binaryStr;
    }

    // Insert a space in the middle for readability.
    return binaryStr.slice(0, 4) + '_' + binaryStr.slice(4);
}



function load_model_generative(index){
    console.log("load generative model");

    if (index == 0 || index == 255){
            
            all_model_list[index] = new THREE.Object3D();

    }else{
        
        all_model_list[index] = new THREE.Object3D();
        //console.log("boolean array",intToBooleanArray(index));
        all_model_list[index] = bit_to_mesh(intToBooleanArray(index));
        //console.log("loaded"+index,all_model_list[index]);
    }
}

function intToBooleanArray(int) {
    if(int < 0 || int > 255) {
        throw 'Input should be in range 0 - 255';
    }
    let arr = [];
    for(let i = 7; i >= 0; i--) {
        arr.push(Boolean((int >> i) & 1));
    }
    return arr;
}




function load_model(index,the_obj){
// transfer index into  8 bit binary number, then add the 8 bit binary number in the string format, such as "0000 0001"

    //rerturn an empty 3d object  if the index is 0 or 255

        var the_string = model_path+intToPaddedBinaryString(index)+".obj";
        console.log("the object is",the_obj,"object index",index);
        //console.log(the_string);
        if (is_cube){


            new MTLLoader().setPath(model_path).load("cube.mtl", function(materials) {
                materials.preload();
    
                new OBJLoader().setMaterials( materials ).load("./models/cube.obj", function(obj) {
                    all_model_list[index]= obj;
                    console.log("loaded");
                });})

        }else{
            if (index == 0 || index == 255){
        
                all_model_list[index] = new THREE.Object3D();
            }else{


                var target_index;

                if (the_obj != null){
                    if (the_obj["is_unit"] == true){
                        target_index = the_obj["index"];
                }else{
                    target_index = the_obj["unit_index"];
                }
    
                }
                
                //console.log("current_index",index,"the target index is",target_index);




            new MTLLoader().setPath(model_path).load(intToPaddedBinaryString(target_index)+".mtl", function(materials) {
            materials.preload();

            new OBJLoader().setMaterials( materials ).load(model_path+intToPaddedBinaryString(target_index)+".obj", function(obj) {
                //console.log(obj);

                // loop through all the children and update the geomoetry
                for (var i = 0; i < obj.children.length; i++){

                    //apply rotation z 90 degree
                    if(the_obj["flip"]){
                        obj.children[i].geometry = obj.children[i].geometry.scale(-1, 1, 1);
                    }
                    obj.children[i].geometry.applyMatrix4(new THREE.Matrix4().makeRotationY( Math.PI / 2*the_obj["rotation"] ));
                }

                //console.log("the object is",the_obj,"object index",index);

                
                all_model_list[index]= obj;

                console.log("loaded");
            });

        });





        }
        }
}

export function get_model(index){
    //console.log(all_model_list);
    return all_model_list[index];
}

export function boolArrayToInt(boolArray) {
    // Ensure the array has exactly 8 elements.
    if (boolArray.length !== 8) {
        throw new Error('The input array must contain exactly 8 boolean values.');
    }

    // Convert array of booleans to array of binary digits.
    let binaryString = boolArray.map(b => b ? 1 : 0).join('');

    // Use parseInt() to convert the binary string to an integer.
    return parseInt(binaryString, 2);
    console.log(binaryString);
}

load_all_models(false);