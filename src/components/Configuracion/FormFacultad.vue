<template>
	<div name="FormFacultad" class="contenedor">
		<div style="text-align: left;">

			<div class="row" style="width:100%">
				<div class="form-inline col-12 col-md-3 col-lg-1">
				<h5 style="margin-top:0%;margin-bottom:5%">Nombre: </h5>
				</div>
				<div class="form-inline col-12 col-md-4">
					<input class="form-control" style="margin-top:3%" v-on:keyup.enter="buscarFacultades(nomb)" v-model="nomb" placeholder="Ingrese nombre de la facultad">
				</div>
				<div class="form-inline col-12 col-md-2 offset-md-3 offset-lg-5">
					<button  type="button" style="border-radius: 10px" @click="nuevo()" class="btn btn-info">Añadir</button>
				</div>
			</div>
			
			<div style="overflow: auto;width:100%;">
				<table responsive class="table" style="text-align: left;margin-top:1.5%">
					<thead>
						<tr>
							<th scope="col" style="width:5%">Código</th>
							<th scope="col" style="width:25%">Nombre</th>
							<th scope="col" style="width:25%">Coordinador</th>
							<th scope="col" style="width:20%">Correo</th>
							<th scope="col" style="text-align: center">N° Programas</th>
							<th scope="col" style="text-align: center">Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,index) in facultades" :key="index">
							<td v-if="item!=undefined">{{item.codigo}}</td>
							<td v-if="item!=undefined">{{item.nombre}}</td>
							<td v-if="item.coordinador!=undefined && item.coordinador!=null">{{item.coordinador.nombre+" "+item.coordinador.apellidos}}</td>
							<td v-else>Sin coordinador</td>
							<td>{{item.correo}}</td>
							<td style="text-align: center">{{item.cantidad-1}}</td>
							<td style="text-align: center">
								<button class="btn link col-3" style="
									padding: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								" v-on:click="Editar(item)"><b-icon icon="pencil" style="color:#0097A7"></b-icon></button>
								<button class="btn link col-3" style="
									padding: 0px;
									margin-top: 0px;
									margin-bottom: 0px;
								" v-on:click="Eliminar(item, index)"><b-icon icon="dash-circle-fill" style="color:#757575"></b-icon></button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!--paginacion  v-bind:class="[ page == isActived ? 'active': '']"-->
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
						<a class="page-link" href="#" @click.prevent="changePage(paginate.current_page + 1)" style="color:rgb(0, 152, 146)">
							<span>Siguiente</span>
						</a>
					</li>
				</ul>
			</nav>
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
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
	data(){
		return{
			facultades:[],
			coordinadores:[],
			submitting: false,
			nomb: '',
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
		}
	},
	mounted(){
		if(this.$store.state.usuario==null) this.$router.push('/login');
		this.showModal();
		this.listarFacultades();
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
			var to=from+(2 * 2);//TO DO
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
		...mapGetters({  
			facultadesFiltradas: 'filtrarFacultades'
		})
	},
	methods:{
		changePage: function(page){
			this.paginate.current_page=page;
			this.showModal();
			this.listarFacultades(page);//trae un nuevo listadp
			event.preventDefault();
		},
		listarFacultades(page) {
			this.showModal()
			var url='/facultad/listFacuConCoordi?page='+page;
			axios
			.post(url)
				.then(res =>{
					this.facultades=res.data.tasks.data;
					this.$store.state.facultades = res.data.tasks.data;
					this.paginate=res.data.paginate;
					this.coordinadores=res.data.tasks;
					this.$store.state.coordinadores=res.data.tasks;
					for(var i=0; i<this.facultades.length; i++){
						this.facultades[i].coordinador=this.coordinadores[i][0];
					}
					this.hideModal()
				})
				.catch(e => {
					console.log(e.response);
					this.hideModal()
				})
		},
		buscarFacultades(page) {
			this.showModal()
			var url='/facultad/listFacuConCoordi?page='+page;
			const params = {
                nombre: this.nomb,
            };
			axios
			.post(url,params)
				.then(res =>{
					this.facultades=res.data.tasks.data;
					this.$store.state.facultades = res.data.tasks.data;
					this.paginate=res.data.paginate;
					this.coordinadores=res.data.tasks;
					this.$store.state.coordinadores=res.data.tasks;
					for(var i=0; i<this.facultades.length; i++){
						this.facultades[i].coordinador=this.coordinadores[i][0];
					}
					this.hideModal()
				})
				.catch(e => {
					console.log(e.response);
					this.hideModal()
				})
		},
		Editar(item){
			this.$store.state.facultadEscogida=item;
			this.$router.push('/crearFacultad/'+item.id_facultad);
		},
		nuevo(){
			this.$store.state.facultadEscogida=null;
			this.$router.push('/crearFacultad');
		},
		
		Eliminar(item, index){
			Swal.fire({
					text: '¿Desea eliminar '+item.nombre+'?',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#0097A7',
					cancelButtonColor: '#757575',
					confirmButtonText: 'Confirmar',
					cancelButtonText: 'Cancelar'
				}).then((result) => {
					if (result.value) {
						this.showModal()
						const params={
							id:item.id_facultad,
							usuario_actualizacion:this.$store.state.usuario.id_usuario
						};
						this.axios.post('/facultad/eliminar',params)
							.then(response=>{
								response
								this.$store.state.facultades.splice(index, 1);
								this.hideModal()
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
								this.hideModal()
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

.form-control {
	border-radius: 1.25rem;  
	border: 0.5px solid #757575;
	text-align-last: left;
	margin-bottom:1.3em;
	width: 100%;

}
.btn:focus {outline: none;box-shadow: none;border:2.3px solid transparent;}
select:focus {outline: none;box-shadow: none;}
input:focus {outline: none;box-shadow: none;}

</style>