

//created a class to hold all the loaded models, it should have the function of loading the model and returning the model 
//when needed
class ModelHolder{
    constructor(){
        this.models = {};
    }

    //this function loads the model and stores it in the models object
    loadModel(name, path){
        let model = new THREE.GLTFLoader();
        model.load(path, (gltf) => {
            this.models[name] = gltf.scene;
        });
    }

    //this function returns the model when needed
    getModel(name){
        return this.models[name].clone();
    }
}