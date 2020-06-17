import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Principal/ViewHome.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Principal/About.vue')
  },
  {
    path: '/institucion',
    name: 'Institucion',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Configuracion/ViewInstitucion.vue')
  },
  {
  path: '/facultad',
  name: 'Facultad',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/Configuracion/ViewFacultad.vue')
  },
  {
    path: '/crearFacultad/:id?',
    name: 'CrearFacultad',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Configuracion/ViewCrearFacultad.vue')
    },
  {
    path: '/programa',
    name: 'Programa',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Configuracion/ViewPrograma.vue')
    },
    {
      path: '/unidadesApoyo',
      name: 'Unidades de Apoyo',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/Configuracion/ViewUnidadesApoyo.vue')
    },
    {
      path: '/unidad/:id?',
      name: 'Unidad de Apoyo',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "ViewUsuario" */ '../views/Configuracion/ViewUnidadApoyo.vue')
    },
    {
      path: '/perfil/:id?',
      name: 'Perfil',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "ViewUsuario" */ '../views/Citas/ViewPerfil.vue')
    },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Principal/ViewLogin.vue')
  }, 
  {
    path: '/tiposdeTutoria/:id',
    name: 'TiposTutoria',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewTiposTutorias" */ '../views/Gestion Programa/ViewTiposTutoria.vue')
  }, 
  {
    path: '/Usuario/:id',
    name: 'GestionarUsuario',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewUsuario" */ '../views/Gestion Programa/ViewUsuario.vue')
  },
  {
    path: '/userNuevo',
    name: 'Usuario Nuevo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewUsuario" */ '../views/Principal/ViewUsuarioNuevo.vue')
  },
  {
    path: '/tiposUsuario',
    name: 'Tipos de Usuario',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewUsuario" */ '../views/Configuracion/ViewRoles.vue')
  },
  {
    path: '/permisos/:id?',
    name: 'Permisos',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewPermisos" */ '../views/Configuracion/ViewPermisos.vue')
  },
  {
    path: '/seleccion',
    name: 'Seleccion Programas',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewSeleccionPrograma" */ '../views/Principal/ViewSeleccionPrograma.vue')
  },
  { path: "/404",
    name: 'Error 404',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "View404" */ '../views/Principal/View404.vue')
  },
  { path: "/sesiontutoria",
    name: 'Sesion de Tutoria',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewSesionTutoria" */ '../views/Citas/ViewSesionTutoria.vue')
  },
  {
    path: '/ListaUsuarios',
    name: 'Listar Usuarios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewListarUsuarios" */ '../views/Gestion Programa/ViewListarUsuarios.vue')
  },
  {
    path: '/ListaTiposTutorias',
    name: 'ListaTiposTutorias',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewListarTiposTutoria" */ '../views/Gestion Programa/ViewListarTiposTutoria.vue')
  },
  {
    path: '/AListaUsuarios',
    name: 'AListar Usuarios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewListarUsuariosAdmin" */ '../views/Configuracion/ViewListarUsuariosAdmin.vue')
  },
  {
    path: '/AUsuario/:id',
    name: 'AGestionarUsuario',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewUsuarioAdmin" */ '../views/Configuracion/ViewUsuarioAdmin.vue')
  },
  {
    path: '/coordinadores',
    name: 'Coordinadores',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewCoordinadores" */ '../views/Configuracion/ViewCoordinadores.vue')
  },
  {
    path: '/coordinador/:id?',
    name: 'Coordinador',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewCoordinador" */ '../views/Configuracion/ViewCoordinador.vue')
  },
  {
    path: '/solicitudes',
    name: 'Solicitudes',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewSolicitudes" */ '../views/Gestion Programa/ViewSolicitudes.vue')
  },
  {
    path: '/tutoresDisponibles',
    name: 'TutoresDisponibles',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewTutoresDisponibles" */ '../views/Gestion Periodo/ViewTutoresDisponibles.vue')
  },
  {
    path: '/agregarNotas',
    name: 'Agregar Notas',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewAgregarNotas" */ '../views/Gestion Programa/ViewAgregarNotas.vue')
  },
  {
    path: '/agendarcita',
    name: 'Citas',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewAgendarCita" */ '../views/ViewAgendarCita.vue')
  },  
  {
    path: '/asignartutor',
    name: 'Asignar Tutor',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ViewAsignarTutor" */ '../views/Gestion Periodo/ViewAsignarTutor.vue')
  }, 
  {
    path: '/calendariocitas',
    name: 'Calendario',
    props: true,
    component: () => import(/* webpackChunkName: "ViewCalendarioCitas" */ '../views/Citas/ViewCalendarioCitas.vue'),
  }, 
  {
    path: '/calendariocitas/cita-agendada',
    name: 'Cita Agendada',
    component: () => import(/* webpackChunkName: "ViewCitaAgendada" */ '../views/Citas/ViewCitaAgendada.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
