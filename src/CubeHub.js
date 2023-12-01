// create a class for the marching cube hub

export class CubeHub {
    constructor(layer_num,AllMarchVertexList,AllMarchCubeList,scene_object,debug_object){
        this.AllMarchVertexList = AllMarchVertexList;
        this.AllMarchCubeList = AllMarchCubeList;

        this.scene_object = scene_object;
        this.debug_object = debug_object;
        this.layer_num = layer_num;
    }

    on_trigger_new_entry(idx){
        var the_current_layer = this.find_the_first(idx);
        //console.log("the current layer is",the_current_layer);
        var CenterVert=this.AllMarchVertexList[the_current_layer][idx];

        console.log("All March Ver",this.AllMarchVertexList[0][idx],this.AllMarchVertexList[1][idx],this.AllMarchVertexList[2][idx]);

        console.log("center vert",CenterVert);


        for(let i=0;i<CenterVert.subquadid_list.length;i++){
             var vertid=CenterVert.subquadid_list[i];
            // console.log("construction layer",the_current_layer);
            // console.log("marching cube length",this.AllMarchCubeList[the_current_layer].length);
            var the_cube=this.AllMarchCubeList[the_current_layer][vertid];
            the_cube.on_triggered();
        }
        this.load_all_models();

    }

    load_all_models(){
        // loop through all the AllMarchCubeList and load the model
        for (let i = 0; i < this.layer_num-1; i++) {
            for (let j = 0; j < this.AllMarchCubeList[i].length; j++) {
                this.AllMarchCubeList[i][j].load_model();
            }
        }
        
    }


    find_the_first(VertexSelection){
        var ConstructLayer=0;
        //console.log(this.AllMarchVertexList);
        //AllMarchVertexList[0][VertexSelection].IsActive=true;
        if(this.AllMarchVertexList[0][VertexSelection].IsActive==false){
            //说明这地方还没建东西
            ConstructLayer=0;
            console.log("first_level_stuff");
            //this.AllMarchVertexList[0][VertexSelection].IsActive=true;
            return ConstructLayer;
        }
        else{    
            console.log("next_level_stuff");
            //iterate all the layers to find the first layer that is not constructed
            for(let i=1;i<this.layer_num-1;i++){
                console.log("report the real situation",this.AllMarchVertexList[i][VertexSelection].IsActive)
                if(this.AllMarchVertexList[i][VertexSelection].IsActive==true&&
                this.AllMarchVertexList[i+1][VertexSelection].IsActive==false){
                    this.AllMarchVertexList[i][VertexSelection].IsActive=true;
                    ConstructLayer=i;
                    break;
                }
            }
        }
        return ConstructLayer;
    }

}