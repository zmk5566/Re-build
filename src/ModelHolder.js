//created a class to hold all the loaded models, it should have the function of loading the model and returning the model 
//when needed

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
var all_model_list = [];
const loader = new OBJLoader();
var model_path = "/models/";
var is_cube = true;




function load_all_models(){
    // loop through all 0-255 numbers and load the model
    for (let i = 0; i < 256; i++) {
        load_model(i);
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
    return binaryStr.slice(0, 4) + ' ' + binaryStr.slice(4);
}

function load_model(index){
// transfer index into  8 bit binary number, then add the 8 bit binary number in the string format, such as "0000 0001"

    //rerturn an empty 3d object  if the index is 0 or 255

        var the_string = model_path+intToPaddedBinaryString(index)+".obj";
        //console.log(the_string);
        if (is_cube){
            loader.load(model_path+"cube.obj", function(obj) {
                all_model_list[index]= obj;
            });
        }else{
            if (index == 0 || index == 255){
        
                all_model_list[index] = new THREE.Object3D();
            }else{
            loader.load(model_path+intToPaddedBinaryString(index)+".obj", function(obj) {
                all_model_list[index]= obj;
                //console.log("loaded");
            });
        }
        }
}

export function get_model(index){
    console.log(all_model_list);
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
}

load_all_models();