<template>
    <div style="text-align:left;">
        <div style="width:100%; border-bottom:1px solid #bababa; height:1px;padding-top:15px; margin-bottom:15px;"></div>
        <div style="text-align:center">
        <figure v-if="tutor.imagen!='' && tutor.imagen!=null" id="floated" class="image-logo" style="margin-left: 0px;">
                <img v-if="tutor.imagen[0]!='u'" :src="tutor.imagen" height="110px" width="110px"/>
				<img v-else  :src="'https://tutoriaback.inf.pucp.edu.pe/'+tutor.imagen" height="110px" width="110px" />		
		</figure>
        <figure v-if="tutor.imagen=='' || tutor.imagen==null" id="floated" class="image-logo" style="margin-left: 0px;">	
                <b-avatar size="7rem" ></b-avatar>		
		</figure>
        </div>
        <div class="descripcion-tutor">
            <div class="font-weight-bolder">{{tutor.nombre + " " + tutor.apellidos}}</div>
            <div class="font-weight-bolder">Código: {{tutor.codigo}}</div>
            <div class="font-weight-bolder">Temas: </div>
            <div>
                <label>{{mensaje}}</label>
            </div>
            <div style="text-align: right; margin-top: 0px;" id="botones" >
                <button type="button" v-if="verDispo"
                class="btn btn-info" v-on:click="verDisponibilidad()">Ver disponibilidad</button>
                <!--button type="button"
                class="btn btn-info">Ver Perfil</button> 
                <button type="button"
                class="btn btn-info btn-enviar-msg">Enviar Mensaje</button-->
                <button type="button" style="align: right" v-if="tutor.solicitado"
                class="btn btn-info" v-on:click="solicitarTutor()">Solicitar Tutor</button> 
            </div>
        </div>
        <div style="width:100%; border-bottom:1px solid #bababa; height:1px;padding-top:15px; margin-bottom:15px;"></div>
        <modals-container/>                 
    </div>
    
</template>

<script>
//import Swal from 'sweetalert2'
//import axios from 'axios'

import EventModal from './../ModalSolicitud.vue'
export default {
    props: {
        text: String,
        tutor: Object,
        tipoTutoria: Array,
        tipoTutoriaAsignado: Array
        
    },
    data(){
        return{
            habilitado:"",
            mensaje:"",
            tutoriaSolicitar:[],
            verDispo: false,
        }
    },
    created(){
        this.obtenerTipoTutoriaAceptado();

    },
    methods:{
        obtenerTipoTutoriaAceptado(){
            for(let i=0; i<this.tutor.tipoTutoriasPrograma.length; i++){
                var iguales=false;
                if(this.tutor.tipoTutoriasPrograma[i].tutor_fijo=="0"){
                    //Tutorías variables del tutor
                    this.verDispo=true;
                    if(this.mensaje!="") this.mensaje=this.mensaje+", ";
                    this.mensaje=this.mensaje+this.tutor.tipoTutoriasPrograma[i].nombre;

                }else if(this.tutor.tipoTutoriasPrograma[i].tutor_fijo=="1" && this.tutor.tipoTutoriasPrograma[i].tutor_asignado=='0'){
                    //Tutorías fijas y solicitadas del tutor 
                    for(var j=0; j<this.tipoTutoriaAsignado.length; j++){
                        if(this.tutor.tipoTutoriasPrograma[i].id_tipo_tutoria==this.tipoTutoriaAsignado[j].id_tipo_tutoria){
                            iguales=true;
                            break;
                        }
                    }
                    if(!iguales){
                        //Si el alumno no tiene esta tutoría como asignada
                        this.tutor.tipoTutoriasPrograma.splice(i,1);i--;
                    }else{
                        //Si el alumno tiene esta tutoría como asignada
                        this.tutoriaSolicitar.push(this.tutor.tipoTutoriasPrograma[i]);
                        if(this.mensaje!="") this.mensaje=this.mensaje+", ";
                        this.mensaje=this.mensaje+this.tutor.tipoTutoriasPrograma[i].nombre;
                    }
                }
            }
        },
        verDisponibilidad(){
            var tutorS=new Object();
            tutorS.usuario=new Object();
            tutorS.usuario=this.tutor;
            tutorS.id_usuario=this.tutor.id_usuario;
            this.$store.state.tutorDisponibilidad=tutorS;
            this.$router.push('/agendarcita');
        },
        solicitarTutor(){
            this.$modal.show(EventModal,{
                tutorSel: this.tutor,
                tipoTutoria: this.tutoriaSolicitar,

            });
        }
    }
}

</script>

<style lang="scss" scoped>

@import '../../assets/styles/material.css';
@import '../../assets/styles/main.css';

.vm--modal {
    border-radius: 25px !important;
    margin: 30px;
    height: 260px !important;
}
.descripcion-tutor {
    margin-left: 170px;
}
#floated{
    float: left;
    width: 150px;
    margin-top:15px;
    text-align:center;
}
#botones {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
}
.btn-enviar-msg { 
    margin-left:540px;
    background-color: white;
    color: black;
    border: 2px solid #17a2b8;
}
.btn:focus {
    outline:none;
    box-shadow: none;
    border: 2.3px solid transparent;
}
select:focus {
    outline:none;
    box-shadow: none;
}
img {
  border-radius: 50%;
}
</style>