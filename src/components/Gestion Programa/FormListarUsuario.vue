<template>
  <div class="FormListarUsuario contenedor"  >
    <!-- para que lo vea bien un coordinador -->

    <div >  
         
      <div class="row" style="width:100%">
        <div class="form-inline col-12 col-md-2 "  style="padding-left:10px">
          <h5 style="margin-top:5%;margin-bottom:5%">Nombres o Código: </h5>
        </div>
        <div class="form-inline col-12 col-md-2"  style="padding:0px">
          <input maxlength="100" class="form-control" v-model="criterio" @keyup.enter="buscarUsuario" placeholder="Buscar" style="width:100%">
        </div>
        <div class="form-inline col-12 col-md-4 col-xlg-2" style="padding:0px">
          <select v-model="tiposUsuariosselect" class="col sm-6 offset-md-1 form-control" style="cursor:pointer;margin-left:5px" @change=" buscarUsuario"  >
              <option value="no" disabled    >Selecciona un tipo de usuario</option>
              <option   v-for="(tipoU,index) in tiposUsuarios" :value="tipoU.id_tipo_usuario" v-bind:key="index" style="cursor:pointer;" >
              {{ tipoU.nombre}}
              </option>
            </select>
        </div>

        
        <div class="form-inline col-12 col-md-2 offset-xlg-4 offset-md-2">
          <button  type="button" style="border-radius: 10px" @click="nuevo()" class="btn btn-info">Añadir Nuevo</button>
        </div>

      </div>

      <div style="overflow: auto;margin-top:2%">
        <table responsive class="table" style="text-align:left" >
          <thead>
            <tr>
              <th scope="col" style="width:100px">Código</th>
              <th scope="col" style="width:150px">Nombre</th>
              <th scope="col" style="width:200px">Apellidos</th>
              <th scope="col">Correo</th>
              <th scope="col">Estado</th>
              <th scope="col">Tipo de Usuario</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in usuarios"  :key="index">
              <td v-if="item.codigo!=undefined">{{item.codigo}}</td>
              <td v-else>Pendiente</td>
              <!-- <td v-if="item!=undefined">{{item.nombre}} {{item.apellidos}}</td> -->
              <td v-if="item!=undefined">{{item.nombre}}</td> 
              <td v-if="item!=undefined"> {{item.apellidos}}</td> 
              <td v-if="item!=undefined">{{item.correo}}</td>  
              <td >
                  <b-icon v-if="item.estado == 'act'" icon="check" style="color:green;width:35px; height:35px;padding:0px"/>
                  <b-icon v-else icon="x" style="color:#757575;width:35px; height:35px;padding:0px"/>
                  </td>
              <td>{{item.tipo_usuario[0].nombre}}</td>
              <td>
                <router-link :to="{name: 'GestionarUsuario', params: {id: item.id_usuario}}"> 
                     <b-icon icon="pencil" style="color:#0097A7;margin-right:20px;width:20px; height:20px;" v-on:click="llenarUsuarioEscogido(item)"></b-icon>
                </router-link>              
                <b-icon icon="dash-circle-fill" style="color:#757575;width:20px; height:20px;cursor:pointer"  v-on:click="eliminarUsuario(item,index)"></b-icon>
                  
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <nav aria-label="Page navigation example">
				<ul class="pagination justify-content-center">
					<li class="page-item" v-if="paginate.current_page > 1">
						<a class="page-link" href="#" tabindex="-1" @click.prevent="changePage(paginate.current_page - 1)" style="color:rgb(0, 152, 146)">
							<span>Anterior</span>
						</a>
					</li>
					<li class="page-item" v-for="page in pagesNumber" :key="page">
							<a class="page-link" href="#" @click.prevent="changePage(page)" style="color:rgb(0, 152, 146)">
								<span class="sr-only">(current_page)</span>
								{{ page }}
						</a>
					</li>
					<li class="page-item" v-if="paginate.current_page < paginate.last_page">
						<a class="page-link" href="#" @click.prevent="changePage(paginate.current_page + 1)" 
            style="color:rgb(0, 152, 146)">
							<span>Siguiente</span>
						</a>
					</li>
				</ul>
			</nav>
      <!-- MODAL CARGANDO  -->
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
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  data(){
    return{
      keeps:[],
			paginate:{
				'total': 0,
				'current_page': 0,
				'per_page': 0,
				'last_page': 0,
				'from': 0,
				'to': 0
			},
			offset: 3,
      usuarios:[],
      //id_tipoXUsuario:[],
      cantU:null,
      tipoXUsuario:[],
      miUsuario:this.$store.state.usuario, //Para sacar el id del programa
      criterio:"",
      state:{
        usuarioEscogido:null,},
      banderaVacio:false,
      tiposUsuarios:"",
      tiposUsuariosselect:null,
      esOtroTipoUsuario:false,
    }
  },
 
  computed:{
        isActived: function(){
          return this.paginate.current_page;
        },
        pagesNumber: function(){
          if(!this.paginate.to){
            return [];
          }
          var from = this.paginate.current_page - 2;
          if(from<1){//debe ser un numero positivo
            from=1;
          }
          var to=from+(3 * 3);//TO DO
          if(to >= this.paginate.last_page){
            to=this.paginate.last_page;
          }
          //calculo de la numeracion exacta
          var pagesArray=[];
          while(from<=to){
            pagesArray.push(from);
            from++;
          }
          return pagesArray;
        },
        nombre:{
          get(){
              return this.$store.state.filtro.query;
          },
          set(val){
              this.$store.commit('SET_QUERY',val);
          }
        },
        ...mapGetters({
          usuariosFiltrados: 'filtrarUsuarios'
        }),
        // codigo:{
        //   get(){
        //       return this.$store.state.filtro.query;
        //   },
        //   set(val){
        //       this.$store.commit('SET_QUERY',val);
        //   }
        // },
        // ...mapGetters({
        //   usuariosFiltrados2: 'filtrarUsuariosCod'
        // })
  },
  mounted(){
    
    
    
    if(this.$store.state.usuario==null) this.$router.push('/login');
    
    this.criterio="";
    this.banderaVacio=false;
    this.listarUsuarios(); 
    this.listarTUsuarios();
    this.tiposUsuariosselect=0;
    //this.usuarios = this.$store.state.usuarios; //
  },
  methods:{
		changePage: function(page){
			this.paginate.current_page=page;
			this.buscarUsuario(page);//trae un nuevo listadp
      event.preventDefault();
      
		},
    //4 es el id del programa de admin
    //1 es el id tipo usuario de admin
    //2 es el id de usuairo admin
    
    listarUsuarios(page) {
      this.showModal();
 
      var url='/programa/usuarioPrograma/'+this.$store.state.programaActual.id_programa+'?page='+page;
        

      axios.post(url) //Por ahora dsp será x program
      .then(res =>{
        
        //ordenado por estado
        let par=res.data.tasks.data; 
        // this.$store.state.usuarios=par.sort((a, b) => { return  a.nombre.localeCompare(b.nombre);});
        //this.$store.state.usuarios=par.sort((a, b) => { return a.nombre.localeCompare(b.nombre);});
        this.usuarios=par.sort((a, b) => { return  a.nombre.localeCompare(b.nombre);});
        this.paginate=res.data.paginate;
        this.OtroTipoUsuario();
        this.hideModal();
                  
      })
      .catch(e => {
        console.log('catch listar',e.response);
            this.hideModal();
        //Swal de problema
          Swal.fire({
                  text:"Estamos teniendo problemas al listar los usuarios. Vuelve a intentar en unos minutos.",
                  icon:"warning",
                  confirmButtonText: 'Sí',
                  confirmButtonColor:'#0097A7',
                  showConfirmButton: true,
          });

      })
      
     
     
      
       
    },
    buscarUsuario(page){
      // this.showModal();
      let paramsB;

      paramsB={
        criterio:this.criterio,
        tipo_usuario:this.tiposUsuariosselect,
      }
     
      console.log('Buscar Usuario 1page: ',page);
        if (page==undefined){
            page=1
      }
      console.log('Buscar Usuario 2page: ',page);
      var url='/programa/usuarioPrograma/'+this.$store.state.programaActual.id_programa+'?page='+page;
      
       if(this.$store.state.permisosUsuario.includes('Usuarios Programa')){ //Para coordinador   
       
        axios.post(url,paramsB) //Por ahora dsp será x program
        .then(res =>{  
          //ordenado por estado
          
           if(res.data==""){
            //  this.hideModal();
             //No encontró al usuario
             if(this.tiposUsuariosselect==0)
                Swal.fire({
                    text:"No se ha encontrado ningún usuario "+this.criterio+". Intente nuevamente",
                    icon:"warning",
                    confirmButtonText: 'Sí',
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
                });
              else{
                let nomTU= this.tiposUsuarios.find( tipo_usuario =>  tipo_usuario.id_tipo_usuario==this.tiposUsuariosselect )
                Swal.fire({
                    text:"No se ha encontrado ningún usuario "+this.criterio+" con el tipo de usuario "+ nomTU.nombre +". Intente nuevamente",
                    icon:"warning",
                    confirmButtonText: 'Sí',
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
                });
              }
           }
           else{
              let par=res.data.tasks.data;
              //this.$store.state.usuarios=par.sort((a, b) => { return a.estado.localeCompare(b.estado) && a.nombre.localeCompare(b.nombre);});   
              
              this.usuarios=par.sort((a, b) => { return a.nombre.localeCompare(b.nombre);});   
              this.paginate=res.data.paginate;
                this.OtroTipoUsuario();
              // this.hideModal();
          }
                   
        })
        .catch(e => {
          console.log('catc buscar',e);
            // this.hideModal();
          //Swal de problema
           Swal.fire({
                    text:"Estamos teniendo problemas al buscar los usuarios. Vuelve a intentar en unos minutos.",
                    icon:"warning",
                    confirmButtonText: 'Sí',
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
           });

        })
      }
      else{
          //Mensaje informativo de que esta pantalla no es para admin
        //  this.hideModal();
      }


    
    },
    eliminarUsuario(item,index){
      Swal.fire({
            text:'¿Desea eliminar?',
            icon:'warning',
            confirmButtonText: 'Eliminar',
             confirmButtonColor:'#0097A7',
            cancelButtonText: 'Cancelar',
            cancelButtonColor:'C4C4C4',
            showCancelButton: true,
            showConfirmButton: true,
            //html:' <div >Hello</div>',

        }).then((result) => {

            if (result.value) {            
              let param = {
                id_usuario:item.id_usuario,
                tipo_usuario:item.id_tipo_usuario,
                id_programa:item.id_programa,
              }
              //aqui iriía el eliminar
              //ESte eliminar no debería estar.Debería ser un eliminar del programa
              axios.post('/usuarios/eliUsuarioPrograma',param)
              .then(res =>{    
                 
                  if(res.data.status=='sucess'){
                    this.usuarios.splice(index, 1); //
                    Swal.fire({
                      icon:'success',
                      text:'El usuario ha sido eliminado',
                      confirmButtonText:'Confirmo' ,
                      confirmButtonColor:'#0097A7'
                      }  )

                  }
                })
                .catch(e => {
                  console.log('catch eli',e);
                   Swal.fire({
                      icon:'error',
                      text:'Estamos teniendo problemas para eliminar al usuario. Intente nuevamente',
                      confirmButtonText:'Confirmo' ,
                      confirmButtonColor:'#0097A7'
                      
                  })
                })

            } else if (              result.dismiss === Swal.DismissReason.cancel     ) {
              Swal.fire({
                text:'Se ha cancelado la eliminación',
                confirmButtonColor:'#0097A7',}
              )
            }
          })
    
   }, // eliminart
   llenarUsuarioEscogido(item){
      this.$store.state.usuarioEscogido=item;     
      this.usuarioEscogido=item;
   },

    nuevo(){
      this.$router.push('/Usuario/0');
    },
    listarTUsuarios() {
      this.showModal();
       if(this.$store.state.permisosUsuario.includes('Datos Facultad')){
        let obj = { id_facultad: this.$store.state.programaActual.id_facultad}
        this.axios.post('/tipoUsuarios/tiposFacultad',obj)
          .then(res=>{
               //Ordenadito
           let par=res.data;
        
           this.tiposUsuarios=par.sort((a, b) => { return a.nombre.localeCompare(b.nombre);});
           //agregar Todos
             var tUsuario=new Object;
             tUsuario.nombre="Todos";
             tUsuario.id_tipo_usuario=0;
             this.tiposUsuarios.push(tUsuario); 
              this.hideModal();
            
          })
          .catch(e=>{
            console.log(e);
               this.hideModal();
            
          });
       }
         
      var page=undefined;
      console.log('Tipo Usuario page: ',page);
   
      if (page==undefined){
            page=1
      }
       console.log('Tipo Usuario2 page: ',page);




      if(this.$store.state.permisosUsuario.includes('Usuarios Programa')){
        let obj = {
          id_programa: this.$store.state.programaActual.id_programa,
          id_facultad: this.$store.state.programaActual.id_facultad
        }
        this.axios.post('/tipoUsuarios/tiposPrograma',obj)
          .then(res=>{
                //Ordenadito
           let par=res.data;
     
           this.tiposUsuarios=par.sort((a, b) => { return a.nombre.localeCompare(b.nombre);});
           //agregar Todos
             var tUsuario=new Object;
             tUsuario.nombre="Todos Tipos de Usuarios";
             tUsuario.id_tipo_usuario=0;
             this.tiposUsuarios.push(tUsuario); 
            
          })
          .catch(e=>{
            console.log(e);
           
          });
      }


    },
    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
    OtroTipoUsuario(){
      
    }


  }
}
</script>


<style scoped>
.formUsuario { 
  font-size: 20px;
}

  body{
    background-image: null;
    background-color: #B2EBF2;
  }
  .form-control {
    border-radius: 1.25rem;  
    border: 1px solid #757575;
    margin-bottom: 1px;
    /* flex: 1; */
    /* width: 100%; */
    
}
.btn-derecha{
   margin-top: 5px;
}  

.btn:focus {outline: none;box-shadow: none;border:2.3px solid transparent;}
select:focus {outline: none;box-shadow: none;}
input:focus {outline: none;box-shadow: none;}

</style>
