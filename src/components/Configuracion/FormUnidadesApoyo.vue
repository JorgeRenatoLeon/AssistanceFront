<template>
  <div class="FormUnidadesApoyo contenedor">
    <div style="text-align: left" 
      v-if="$store.state.permisosUsuario!=null && ($store.state.permisosUsuario.includes('Usuarios') || $store.state.permisosUsuario.includes('Datos Facultad') || $store.state.permisosUsuario.includes('Datos Programa'))">  
      <div class="row">
        <div class="form-inline col-12 col-md-2 col-lg-1">
          <h5 style="margin-top:10%;margin-bottom:5%">Buscar: </h5>
        </div>
        <div class="form-inline col-12 col-md-2">
          <input class="form-control" style="margin-top:3%" v-model="nombre" placeholder="Buscar">
        </div>
        <div class="form-inline col-12 col-md-2" v-if="this.$store.state.permisosUsuario.includes('Usuarios')">
          <select v-on:change="FacultadSel"  class="form-control"
            v-model="facuSeleccionadoInd">  <!--aqui guardo-->
            <option selected :value="null">Selecciona una facultad</option>
            <option v-for="(prog, i) in facultades"  :key="i" :value="prog.id_programa"> 
              {{ prog.nombre }} 
            </option>
          </select>
        </div>
        <div class="form-inline col-12 col-md-2" v-if="this.$store.state.permisosUsuario.includes('Usuarios')">
          <select v-on:change="ProgramaSel"  class="form-control"
            v-model="progSeleccionadoInd">  <!--aqui guardo-->
            <option selected :value="null">Selecciona un programa</option>
            <option v-for="(prog, i) in programas"  :key="i" :value="prog.id_programa"> 
              {{ prog.nombre }} 
            </option>
          </select>
        </div>
        <div class="form-inline col-12 col-md-2 offset-md-1 offset-lg-3" v-if="this.$store.state.permisosUsuario.includes('Usuarios')">
          <button  type="button" style="border-radius: 10px" @click="nuevo()" class="btn btn-info">Añadir</button>
        </div>
        <div class="form-inline col-12 col-md-2 offset-md-3 offset-lg-7" v-else>
          <button  type="button" style="border-radius: 10px" @click="nuevo()" class="btn btn-info">Añadir</button>
        </div>
      </div>
      
      <div style="overflow: auto;width:100%;margin-top:2%">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contacto</th>
              <th scope="col">Correo Contacto</th>
              <th scope="col">Facultad / Programa</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody v-if="$store.state.permisosUsuario.includes('Usuarios')">
            <tr v-for="(item, index) in unidadesFiltrados" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.nombre}}</td>
              <td>{{item.nombre_contacto}}</td>
              <td>{{item.correo_contacto}}</td>
              <td>
                <div v-for="(prog,index) in item.programas" :key="index">
                    <a v-if="prog.nombre!='Administrador'" style="font-weight:normal">{{prog.nombre}}</a>
                    <a v-else style="font-weight:normal">General</a>
                </div>
              </td>
              <td  style="text-align:left">
                <button v-on:click="Editar(item.id_unidad_apoyo,false)" class="btn link" style="margin-left:-19px;
									padding-top: 0px;
									padding-bottom: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								"><b-icon icon="pencil" style="color:#0097A7"/></button>
                <button v-on:click="Eliminar(item)" class="btn link" style="
									padding-top: 0px;
									padding-bottom: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								"><b-icon icon="dash-circle-fill" style="color:#757575"/></button>
              </td>
            </tr>
          </tbody>
          <tbody v-if="$store.state.permisosUsuario.includes('Datos Facultad')">
            <tr v-for="(item, index) in unidadesFiltrados" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.nombre}}</td>
              <td>{{item.nombre_contacto}}</td>
              <td>{{item.correo_contacto}}</td>
              <td>
                <div v-for="(prog,index) in item.programas" :key="index">
                    <a v-if="prog.nombre!='Administrador'" style="font-weight:normal">{{prog.nombre}}</a>
                    <a v-else style="font-weight:normal">General</a>
                </div>
              </td>
              <td  style="text-align:left">
                <div v-if="item.programas[0].nombre!='Administrador'">
                  <button v-on:click="Editar(item.id_unidad_apoyo,false)" class="btn link" style="margin-left:-19px;
									padding-top: 0px;
									padding-bottom: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								"><b-icon icon="pencil" style="color:#0097A7"/></button>
                  <button v-on:click="Eliminar(item)" class="btn link" style="
									padding-top: 0px;
									padding-bottom: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								"><b-icon icon="dash-circle-fill" style="color:#757575"/></button>
                </div>
                <div v-else style="cursor: pointer;" v-on:click="Editar(item.id_unidad_apoyo,true)">
                  Solo Visualización
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-if="$store.state.permisosUsuario.includes('Datos Programa')">
            <tr v-for="(item, index) in unidadesFiltrados" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.nombre}}</td>
              <td>{{item.nombre_contacto}}</td>
              <td>{{item.correo_contacto}}</td>
              <td v-if="$store.state.permisosUsuario.includes('Datos Programa')">
                <div v-if="item.programas[0].nombre!='Administrador'">
                  <div v-for="(prog,index) in item.programas" :key="index">
                    <a v-if="prog.nombre!='Administrador'" style="font-weight:normal">{{prog.nombre}}</a>
                    <a v-else style="font-weight:normal">General</a>
                  </div>
                </div>
                <div v-else>
                  <a style="font-weight:normal">General</a>
                </div>
              </td>
              <td  style="text-align:left;cursor: pointer;">
                  <div v-if="(item.programas[0].nombre!='Administrador' && item.programas[0].nombre!=$store.state.programaActual.facultad.nombre && item.programas.length==1)||(item.programas[0].nombre!='Administrador' && item.programas[0].nombre!=$store.state.programaActual.facultad.nombre && item.programas.length==1)">
                    <button   v-if="item.programas[0].nombre!='Administrador' && item.programas[0].nombre!=$store.state.programaActual.facultad.nombre && item.programas.length==1" v-on:click="Editar(item.id_unidad_apoyo,false)" class="btn link" style="margin-left:-19px;
                      padding-top: 0px;
                      padding-bottom: 0px;
                      margin-top: 0px;
                      margin-bottom: 0px;
                    "><b-icon icon="pencil" style="color:#0097A7"/></button>
                    <button v-if="item.programas[0].nombre!='Administrador' && item.programas[0].nombre!=$store.state.programaActual.facultad.nombre && item.programas.length==1" v-on:click="Eliminar(item)" class="btn link" style="
                      padding-top: 0px;
                      padding-bottom: 0px;
                      margin-top: 0px;
                      margin-bottom: 0px;
                    "><b-icon icon="dash-circle-fill" style="color:#757575"/></button>
                  </div>
                  <div v-else v-on:click="Editar(item.id_unidad_apoyo,true)">
                    Solo Visualización
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="unidadesFiltrados==null || unidadesFiltrados.length==0" class="row" style="width:100%">
        <div class="col-12" style="margin-top:1%;margin-bottom:5%;text-align:center;font-size:150%">
          Ningún Registro de Unidades de Apoyo
        </div>
      </div>
    </div>

    <div v-else class="row" style="width:100%">
        <div class="col-12" style="margin-top:1%;margin-bottom:5%;text-align:center;font-size:150%">
            Su tipo de usuario no soporta esta funcionalidad comuníquese con Soporte
        </div>
    </div>

    <b-modal ref="my-modal" style="margin-left:20%;" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc hideHeaderClose>
      <div style="font-size:20px;padding-top:25px;color:#0097A7;text-align:center;height:150px" class="text-center">
        <b-spinner style="width: 3rem; height: 3rem;"/>
        <br >Cargando... 
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  data(){
    return{
      unidades:[],
      progSeleccionadoInd:null,
      progSeleccionado:null,
      facuSeleccionadoInd:null,
      facuSeleccionado:null,
      programas:null,
      facultades:null,
    }
  },
  mounted(){
    if(this.$store.state.usuario==null) this.$router.push('/login')
    this.showModal()
    this.listarUnidades();
    this.listarProgramas();
    this.listarFacultades();
    this.nombre="";
    this.filtroProg = null
    this.filtroFacu = null
  },
  computed:{
    nombre:{
      get(){
        return this.$store.state.filtro.query;
      },
      set(val){
        this.$store.commit('SET_QUERY',val);
      }
    },
    filtroProg:{
      get(){
        return this.$store.state.filtro.programa;
      },
      set(val){
        this.$store.commit('SET_Prog',val);
      }
    },
    filtroFacu:{
      get(){
        return this.$store.state.filtro.facultad;
      },
      set(val){
        this.$store.commit('SET_Facu',val);
      }
    },
    ...mapGetters({
      unidadesFiltrados: 'filtrarUnidades'
    })
  },
  methods:{
    listarProgramas(){
      this.axios.post('/programa/listarTodo')
        .then(response=>{
          this.programas = response.data
        })
        .catch(e=>{
          console.log(e)
        })
    },
    listarFacultades(){
      this.axios.post('/programa/facultadesProg')
        .then(response=>{
          this.facultades = response.data
        })
        .catch(e=>{
          console.log(e)
        })
    },
    ProgramaSel(){
      if(this.progSeleccionadoInd == null){
        this.filtroProg = null;
      }
      else{
        this.programas.forEach(element => {
          if(element.id_programa == this.progSeleccionadoInd){
            this.progSeleccionado = element;
            this.filtroProg = element;
          }
        });
      }
    },
    FacultadSel(){
      if(this.facuSeleccionadoInd == null){
        this.filtroFacu = null;
        this.listarProgramas();
      }
      else{
        this.facultades.forEach(element => {
          if(element.id_programa == this.facuSeleccionadoInd){
            this.facuSeleccionado = element;
            this.filtroFacu = element;
          }
        });
        let aux = []
        this.programas.forEach(element => {
          if(element.id_facultad == this.facuSeleccionado.id_facultad) aux.push(element);
        });
        this.programas = aux
      }
    },
    async listarUnidades() {
      if(this.$store.state.permisosUsuario==null){
        await this.axios.post('/usuarios/permisos',{
                usuario: this.$store.state.usuario,
                programa: this.$store.state.programaActual.nombre
              })
              .then(response=>{
                this.$store.state.permisosUsuario = response.data
              })
      }
      if (this.$store.state.permisosUsuario.includes('Usuarios')) {
        this.showModal()
        this.axios.post('/unidadesApoyo/unidadesAdmin')
          .then(res =>{
            this.$store.state.unidades = res.data
            this.unidades = res.data
            this.hideModal()
          })
          .catch(e => {
            console.log(e.response);
            this.hideModal()
          })
      } 
      else if(this.$store.state.permisosUsuario.includes('Datos Facultad')){
        this.showModal()
        let obj = { id_facultad: this.$store.state.programaActual.id_facultad}
        this.axios.post('/unidadesApoyo/unidadesFacultad',obj)
          .then(res =>{
            this.$store.state.unidades = res.data
            this.unidades = res.data
            this.hideModal()
          })
          .catch(e => {
            console.log(e.response);
            this.hideModal()
          })
      }
      else{
        this.showModal()
        let obj = {
          id_programa: this.$store.state.programaActual.id_programa,
          id_facultad: this.$store.state.programaActual.id_facultad
        }
        this.axios.post('/unidadesApoyo/unidadesPrograma',obj)
          .then(res =>{
            this.$store.state.unidades = res.data
            this.unidades = res.data
            this.hideModal()
          })
          .catch(e => {
            console.log(e.response);
            this.hideModal()
          })
      }
    },
    Editar(id,Visualización){
      this.$store.state.visualizacion = Visualización;  
      this.$router.push('/unidad/'+id);
    },
    nuevo(){
      this.$router.push('/unidad');
    },
    Eliminar(item){
      Swal.fire({
        title: '¿Desea eliminar '+item.nombre+'?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0097A7',
        cancelButtonColor: '#757575',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if (result.value) {
          this.showModal();
          let obj = {
            tipoUsuario: this.$store.state.tipoActual.nombre,
            id_facultad: this.$store.state.programaActual.id_facultad,
            id_programa: this.$store.state.programaActual.id_programa  
          }
          this.axios.post('/unidadesApoyo/eliminar/'+item.id_unidad_apoyo,obj)
            .then(response=>{
              response
              let index = this.$store.state.unidades.indexOf(
                function(element){
                  return element.id_unidad_apoyo === item.id_unidad_apoyo;
                })
              this.$store.state.unidades.splice(index, 1);
              this.hideModal();
              Swal.fire({
                text:"Eliminación Exitosa",
                icon:"success",
                confirmButtonText: 'OK',
                confirmButtonColor:'#0097A7',
                showConfirmButton: true,
              })
            })
            .catch(e=>{
              console.log(e)
              this.hideModal();
            });

        }
      })
      
    },
    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
  }
}
</script>

<style scoped>
.title-container{
    margin-top: 30px;
    margin-bottom: 30px;
}
.form-control {
    border-radius: 1.25rem;  
    border: 0.5px solid #757575;
    margin-bottom: 10px;
    width: 100%;
}
.top-titulo {
    display: flex;
    justify-content: space-between;
}
.btn:focus {outline: none;box-shadow: none;border:2.3px solid transparent;}
select:focus {outline: none;box-shadow: none;}
input:focus {outline: none;box-shadow: none;}

</style>
