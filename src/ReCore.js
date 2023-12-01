import * as THREE from 'three';
import {HexCoordList} from './HexCubeCoord.js';
import {Merge,TriangleList} from './Triangle.js';
import {DrawSubQuad,MapSubQuad4UI,Smooth,Map,CreateMarchCube } from "./SubQuad.js";
import {CreateMarchVertex } from "./Vertex.js";

// TODO migrate the logic into the ReCore class

export class ReCore {

    constructor(number_of_extension,layers_num,scene) {
        this.number_of_extension = number_of_extension;
        this.layers_num = layers_num;
        this.scene = scene;
        this.state = "idle";
    }

    init() {
        // initalized the lists

        this.qua_list=[];
        this.AllSquadList=[];
        this.AllVertexList=[];
        this.AllMarchVertexList=[];
        this.AllMarchCubeList=[];
        this.VertexSelection=-1;
        this.coordList=HexCoordList(this.number_of_extension);
        

        this.layers_init();
        this.plane_init();
        this.hex_ring_init();
        this.findNeibour();
        this.smooth_hex_vertexes_positions();
        this.ready_marching_cube();
    }

    layers_init(){
        this.triangle_object = new THREE.Object3D();
        this.FindNeighborResult = new THREE.Object3D();
        this.mesh_hold_object = new THREE.Object3D();
        this.smooth_object = new THREE.Object3D();
        this.highlight_object = new THREE.Object3D();


        this.scene.add(this.triangle_object);
        this.scene.add(this.FindNeighborResult);
        this.scene.add(this.mesh_hold_object);
        this.scene.add(this.smooth_object);
        this.scene.add(this.highlight_object);

    }

    plane_init(){
        this.planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                visible: false
            })
        );
        this.planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(this.planeMesh);
    }

    hex_ring_init(){

        this.center_list=[];
        this.vertex_list=[];
        this.mid_list=[];
        this.quad_list=[];
        this.isolated_triangle_list=[];
        //Step2:Draw Triangle
        var coordList=HexCoordList(this.number_of_extension);
        var triangle_list=TriangleList(coordList);//所有的三角形
        //console.log(triangle_list.length);
        // create a object to hold the triangle
        //创建三角形地图grid
        for(let i=0;i<triangle_list.length;i++){
            const points=[];
            const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            //console.log(triangle_list[i].vb[2]);
            points.push(new THREE.Vector3(triangle_list[i].va[0],triangle_list[i].va[1],triangle_list[i].va[2]));
            points.push(new THREE.Vector3(triangle_list[i].vb[0],triangle_list[i].vb[1],triangle_list[i].vb[2]));
            points.push(new THREE.Vector3(triangle_list[i].vc[0],triangle_list[i].vc[1],triangle_list[i].vc[2]));
            points.push(new THREE.Vector3(triangle_list[i].va[0],triangle_list[i].va[1],triangle_list[i].va[2]));
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            this.triangle_object.add( line );
        }
    }

    clearTheScene(){
        // clear the scene
        this.triangle_object.clear();
        this.FindNeighborResult.clear();
        this.mesh_hold_object.clear();
        this.smooth_object.clear();
    }

    findNeibour(){
        this.state = "finding_neibour";
            // 在这里编写按钮点击时要执行的 JavaScript 代码
        this.clearTheScene();
            //tri_list.forEach(element => {scene.remove(element);});
            //this.qua_list.forEach(element => {scene.remove(element);});
            var triangle_list=TriangleList(this.coordList);
            console.log("Number of Triangles before merge",triangle_list.length);
            Merge(triangle_list,this.quad_list,this.isolated_triangle_list);
            console.log("Number of Quads created",this.quad_list.length);
            console.log("Number of Triangles Left",this.isolated_triangle_list.length);
            //DrawTriangle(test[0],0x0000ff,scene,tri_list);//随机选取的三角形
            //console.log(triangle_list.length);
            if(this.isolated_triangle_list.length>0){
                //DrawSubQuad(this.isolated_triangle_list[0].squadlist[0],0xff0000,scene,tri_list);
                for(let j=0;j<this.isolated_triangle_list.length;j++){
                    //DrawTriangle(this.isolated_triangle_list[j],0xff0000,scene,tri_list);
                    DrawSubQuad(this.isolated_triangle_list[j].squadlist[0],0x000022,this.FindNeighborResult,this.qua_list,false);
                    DrawSubQuad(this.isolated_triangle_list[j].squadlist[1],0xff22ff,this.FindNeighborResult,this.qua_list,false);
                    DrawSubQuad(this.isolated_triangle_list[j].squadlist[2],0x0022ff,this.FindNeighborResult,this.qua_list,false);
                    
                    this.AllSquadList.push(this.isolated_triangle_list[j].squadlist[0]);
                    this.AllSquadList.push(this.isolated_triangle_list[j].squadlist[1]);
                    this.AllSquadList.push(this.isolated_triangle_list[j].squadlist[2]);
                }
            }
            
            //DrawQuad(this.quad_list[0],0x00ff00,scene,this.qua_list);
            if(this.quad_list.length>0){
                for(let j=0;j<this.quad_list.length;j++){
                    var color=0x00ff00+j*(0x0000ff)/this.quad_list.length;
                    //DrawQuad(this.quad_list[j],color,scene,this.qua_list);}
                    DrawSubQuad(this.quad_list[j].squadlist[0],0xffc0cb,this.FindNeighborResult,this.qua_list,false);
                    DrawSubQuad(this.quad_list[j].squadlist[1],0x71a5d0,this.FindNeighborResult,this.qua_list,false);
                    DrawSubQuad(this.quad_list[j].squadlist[2],0xe4b7ff,this.FindNeighborResult,this.qua_list,false);
                    DrawSubQuad(this.quad_list[j].squadlist[3],0xff9c70,this.FindNeighborResult,this.qua_list,false);
        
                    //add to squadlist
                    this.AllSquadList.push(this.quad_list[j].squadlist[0]);
                    this.AllSquadList.push(this.quad_list[j].squadlist[1]);
                    this.AllSquadList.push(this.quad_list[j].squadlist[2]);
                    this.AllSquadList.push(this.quad_list[j].squadlist[3]);
                }
            }
            //按照顶点分类网格
            MapSubQuad4UI(this.isolated_triangle_list,this.quad_list,this.vertex_list,this.mid_list,this.center_list);
            for(let i=0;i<this.vertex_list[4].subquadlist.length;i++){
                var CenterOfHex = new THREE.Mesh(
                            new THREE.BoxGeometry(0.1, 0.1, 0.1),
                            new THREE.MeshBasicMaterial({
                                wireframe: false,
                                color: 0xAABBFF
                            }));
                            CenterOfHex.position.set(this.vertex_list[4].x,this.vertex_list[4].y,this.vertex_list[4].z);
                            this.FindNeighborResult.add(CenterOfHex)
                console.log(this.vertex_list[4].subquadlist.length);
                DrawSubQuad(this.vertex_list[4].subquadlist[i],0xff0000,this.FindNeighborResult,this.qua_list);
            }
            //测试定点分类            //drawVertexByType(this.center_list,this.mid_list,this.vertex_list,AllVertexMesh);
            this.AllVertexList=this.center_list.concat(this.mid_list).concat(this.vertex_list);
            Map(this.AllVertexList,this.AllSquadList);
        
    }


    smooth_hex_vertexes_positions(){

        this.state = "smoothing";

        // scene clear everything except the plane
        this.clearTheScene();

        Smooth(this.AllVertexList,this.AllSquadList);
        console.log(this.AllVertexList.length);
        for(let i=0;i<this.AllSquadList.length;i++){
            DrawSubQuad(this.AllSquadList[i],0xffc0cb,this.smooth_object,this.qua_list,true);
        }

    }

    drawVertexbyIndex(idx,the_scene_object,color=0xffc0cb){

        var StartIdx=idx;
        //console.log(AllVertexList.length);
        var testVert=this.AllVertexList[StartIdx];
        //console.log(testVert.subquadid_list);
        for(let i=0;i<testVert.subquadid_list.length;i++){
            DrawSubQuad(AllSquadList[testVert.subquadid_list[i]],color,the_scene_object,this.qua_list,false);
        }
    
        return the_scene_object;
    }


    ready_marching_cube(){
        console.log("Marching cube ready state");
        this.state = "marching_cube";
        console.log(this.AllVertexList.length);
        CreateMarchVertex(this.AllVertexList,this.AllMarchVertexList,this.layers_num);
        CreateMarchCube(this.AllSquadList,this.AllMarchVertexList,this.AllMarchCubeList,this.layers_num-1);
    }

    GetNearestVertex(x,y,z,currentVertList){
        var distance=10000;
        var result;
        var idx;
        for(let i=0;i<currentVertList.length;i++){
            var temp=Math.pow((x-currentVertList[i].x),2)+Math.pow((y-currentVertList[i].y),2)+Math.pow((z-currentVertList[i].z),2);
            if(temp<distance){
                distance=temp;
                result=currentVertList[i];
                idx=i;
            }
        }
        // console.log("distance",distance);
        if (distance>0.8){
            idx = -1;
        }
        return result,idx;//这个顶点和他的id
    }

    drawVertexbyIndex(idx,the_scene_object,color=0xffc0cb){

        var StartIdx=idx;
        //console.log(AllVertexList.length);
        var testVert=this.AllVertexList[StartIdx];
        //console.log(testVert.subquadid_list);
        for(let i=0;i<testVert.subquadid_list.length;i++){
            DrawSubQuad(this.AllSquadList[testVert.subquadid_list[i]],color,the_scene_object,this.qua_list,false);
        }
    
        return the_scene_object;
    }


    mouse_interact_with_area(mousePosition,camera,raycaster){

        var selected_area=-1;
    
        raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
        var intersects = raycaster.intersectObject(this.planeMesh);//射线跟平面形成焦点
        if(intersects.length > 0) {//如果有焦点
            const intersect = intersects[0];
    
            var projected=new THREE.Vector3(0,0,0)
            projected.x=intersect.point.x;
            projected.y=0;
            projected.z=intersect.point.z;

            if (this.AllVertexList.length>0){
                // clear the highlight object
                this.highlight_object.clear();
                selected_area=this.GetNearestVertex(projected.x,0,projected.z,this.AllVertexList);
    
                if (selected_area != -1){                
                    // get a orange color
                    this.drawVertexbyIndex(selected_area,this.highlight_object,0xffff00);
                }
            }

    
        }

        
    
        return selected_area;
    }


    
    



}