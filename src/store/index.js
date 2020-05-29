import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    usuario:null, // Objeto Usuario Actual (this.$store.state.usuario)
    programas:[],
    programaActual:null, // Objeto Programa Actual (this.$store.state.programa)
    cantProg:null,
    tipoActual:null, // Objeto Tipo de Usuario Actual (this.$store.state.tipoActual)
    facultades:null, 
    facultadEscogida:null,
    coordinadores:null,
    coordinadoresL:null,
    permisos:null,
    roles:null, //Filtrar Tipos de Usuario
    solicitudes:null, //Filtrar Permisos
    unidades:null, //Filtrar Unidades de Apoyo
    tipostutorias:null,
    usuarios:null,
    usuariosA:null,
    rutas:[],
    usuarioEscogido:null,
    navLinks: [
      {
        text: 'Institucion',
		path: '/institucion',
		icon: 'ion-ios-globe'
      },
      {
        text: 'Facultad',
		path: '/facultad',
		icon: 'ion-ios-business'
      },
      {
        text: 'Programa',
		path: '/programa',
		icon: 'ion-ios-school'
      },
      {
        text: 'Coordinador',
		path: '/coordinadores',
		icon: 'ion-ios-person'
      },
      {
        text: 'Unidades de Apoyo',
		path: '/unidadesApoyo',
		icon: 'ion-ios-medkit'
      },
      {
        text: 'Tipos de Tutoria',
		path: '/ListaTiposTutorias',
		icon: 'ion-ios-book'
      },
       {
        text: 'Gestionar Usuario',
		path: '/ListaUsuarios',
		icon: 'ion-ios-people'
      },
      {
       text: 'Tipos de Usuario',
       path: '/tiposUsuario',
       icon: 'ion-ios-people'
     },
     {
      text: 'Sesión de Tutoría',
      path: '/sesiontutoria',
      icon: 'ion-ios-school'
    },
    {
    text: 'Gestionar Usuarios Admin',
    path: '/AListaUsuarios',
    icon: 'ion-ios-people'
    },
    {
    text: 'Solicitudes',
    path: '/solicitudes',
    icon: 'ion-ios-book'
      },
    ],
    filtro:{
      query: '',
    }
  },
  mutations: {
    SET_QUERY (state,query){
      state.filtro.query = query;
    },
  },
  actions: {
  },
  modules: {
  },
  getters:{
    filtrarProgramas(state){
      if(state.filtro.query.length > 0){
        let programas = state.programas.filter(programa => programa.programa.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return programas;
      }
      return state.programas;
    },
    filtrarRoles(state){
      if(state.filtro.query.length > 0){
        let roles = state.roles.filter(rol => rol.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return roles;
      }
      return state.roles;
    },
    filtrarFacultades(state){
      if(state.filtro.query.length > 0){
        let facultades = state.facultades.filter(facultad => facultad.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return facultades;
      }
      return state.facultades;
    },
    filtrarCoordinadores(state){
      if(state.filtro.query.length > 0){
        let coordinadores = state.coordinadores.filter(coordinador => coordinador.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return coordinadores;
      }
      return state.coordinadores;
    },
    filtrarTipoTutorias(state){
      if(state.filtro.query.length > 0){
        let tipostutorias = state.tipostutorias.filter(tt => tt.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return tipostutorias;
      }
      return state.tipostutorias;
    },
    filtrarUsuarios(state){
      if(state.filtro.query.length > 0){
        if(isNaN(state.filtro.query)){
          let usuarios = state.usuarios.filter(usu => usu.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()));
          return usuarios;
         
        }
        let usuariocod = state.usuarios.filter(usu => usu.codigo.toLowerCase().includes(state.filtro.query.toLowerCase()));
        return usuariocod;
       
      }
      return state.usuarios;


    },
    filtrarUsuariosAdmin(state){
      if(state.filtro.query.length > 0){
        let usuariosA = state.usuariosA.filter(usu => usu.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return usuariosA;
      }
      return state.usuariosA; //cambie de usuarios a usuariosA cuado ya estaba duplicado el form

    },
    filtrarCoordinadoresL(state){
      if(state.filtro.query.length > 0){
        let coordinadoresL = state.coordinadoresL.filter(coordinador => coordinador.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return coordinadoresL;
      }
      return state.coordinadoresL;
    },
    filtrarUsuariosCod(state){
      if(state.filtro.query.length > 0){
        let usuarios = state.usuarios.filter(usu => usu.codigo.toLowerCase().includes(state.filtro.query.toLowerCase()))
        
        return usuarios;
      }
      return state.usuarios;

    },
    filtrarSolicitudes(state){
      if(state.filtro.query.length > 0){
        let solicitudes = state.solicitudes.filter(sol => (sol.usuarioSolicitante.nombre+" "+sol.usuarioSolicitante.apellidos).toLowerCase().includes(state.filtro.query.toLowerCase()))
        return solicitudes;
      }
      return state.solicitudes;

    },
    filtrarUnidades(state){
      if(state.filtro.query.length > 0){
        let unidades = state.unidades.filter(unidad => unidad.nombre.toLowerCase().includes(state.filtro.query.toLowerCase()))
        return unidades;
      }
      return state.unidades;

    },


  }
})
