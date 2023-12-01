// create a class for the marching cube hub

class CubeHub {
    constructor(input_bits_list,march_vertex,cube_hub,vertex_index,construction_layer_level,scene_object){
        this.bits_list = input_bits_list;
        this.cube_hub = cube_hub;
        this.mesh_model = null;
        this.scene_object=scene_object;
        this.march_vertex = march_vertex;
        this.construction_layer_level=construction_layer_level;
        this.vertex_index=vertex_index;
        this.load_model();
    }

    // load from the cube hub
    load_model(){
        this.mesh_model = this.cube_hub.get_preloaded_model(this.bits_list);

        // need to be changed very soon
        var material = new THREE.MeshPhongMaterial({ color: 0xa9d4ff ,wireframe:false,transparent:true,opacity:0.3,side:THREE.DoubleSide});

        this.mesh_model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
                // vertices=child.vertices;
                const vertices = child.geometry.attributes.position.array;
                // console.log("vertices count",vertices.length);
                // 输出每个顶点的坐标
                for (let i = 0; i < vertices.length; i += 3) {
                    this.doubleLerp(vertices,position,i,ConstructLayer);
                }
            }
            });

        this.scene_object.add(this.mesh_model);
    }

    update_cube(bits_list,construction_layer_level){
        this.bits_list=bits_list;
        this.construction_layer_level=construction_layer_level;
        this.load_model();

    }



            doubleLerp(vertex_list,position,idx){
                const x = vertex_list[idx];
                const y = vertex_list[idx + 1];
                const z = vertex_list[idx + 2];
            
                var interpolatedAB = new THREE.Vector3();
                var interpolatedCD = new THREE.Vector3();
                // console.log(`Vertex ${i / 3}: x=${x}, y=${y}, z=${z}`);
            
                interpolatedAB.lerpVectors(position[0], position[3], (x+0.5));
            
                interpolatedCD.lerpVectors(position[1], position[2], (x+0.5));
            
                const finalLerp=new THREE.Vector3();
                finalLerp.lerpVectors(interpolatedAB,interpolatedCD,(z+0.5));
            
                        
                vertex_list[idx]=finalLerp.x;
                vertex_list[idx+1]=(y+finalLerp.y+0.5+ConstructLayer);
                vertex_list[idx+2]=finalLerp.z;
            }

}