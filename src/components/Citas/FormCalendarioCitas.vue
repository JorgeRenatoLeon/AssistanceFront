<template>
    <div class="formagendarcita contenedor">
        <div class="top-titulo ">
            <div style="width:50%;"><ul class="legend">
                <li><span class="realizado"></span> Registrado </li>
                <li><span class="ocupado"></span> Pendiente </li>
                <li><span class="proximo"></span> Próximo </li>
                <li><span class="disponible"></span> Disponible </li>
            </ul></div>
            <div style="text-align:right;">
                <input @click="modificarDisp" type="button" class="btn btn-info" value="Modificar Disponibilidad" id="modDisp">
                <!--<button type="button" id="modificarDisp" class="btn btn-info" @click="modificarDisp">Modificar Disponibilidad</button>
                <button type="button" id="actualizarDisp" class="btn btn-info" style="display:none;" @click="modificarDisp">Actualizar Disponibilidades</button>-->
            </div>
        </div>
        <div style="text-align:left;" v-show="bloque!=null">
            <Fullcalendar ref="fullCalendar"
                          :plugins ="calendarPlugins"
                          defaultView ="timeGridWeek"
                          :locales="locales"
                          locale="es"
                          :header ="{
                              left: 'title',
                              center: '',
                              right: 'prev today next'
                          }"
                          :slotDuration= this.bloque
                          :businessHours="businessHours"
                          :columnHeaderFormat="columnFormat"
                          :titleFormat="titleFormat"
                          hiddenDays= [0]
                          @select="handleSelect"
                          minTime="08:00:00"
                          maxTime="22:00:00"
                          :allDaySlot="false"
                          :events ="EVENTS"
                          @eventClick="handleClick"
                          :customButtons="customButtons"
                          :eventOverlap="false"
                          :displayEventTime="false"
                          />
            <modals-container/>
        
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

import Fullcalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import momentPlugin from '@fullcalendar/moment'
import moment from 'moment'
import Swal from 'sweetalert2'

import esLocale from '@fullcalendar/core/locales/es'
import axios from 'axios'
//import Vue from 'vue'
import{mapGetters} from 'vuex'
import EventModal from './../EventModal'

export default {
    name: 'formCalendarioCitas',
    components: {Fullcalendar},
    data () {
        return {
            estaOcupado: false,
            aux: null,
            calendarPlugins: [
                DayGridPlugin,
                TimeGridPlugin,
                InteractionPlugin,
                ListPlugin,
                momentPlugin
            ],
            columnFormat: 'ddd D/M',
            titleFormat: 'MMMM YYYY',
            calendar: null,
            locales: [esLocale],
            dispSemanalVistaAl: null,
            businessHours: {
                daysOfWeek: [ 1, 2, 3, 4, 5, 6],
                startTime: '08:00', 
                endTime: '22:00', 
            },
            customButtons: {
                    prev: {
                        text: 'custom prev !',
                        click: () => {
                            let calendar = this.$refs.fullCalendar.getApi();
                            calendar.prev();
                            this.getReminders();
                        }
                    },
                    next: {
                        text: 'custom next!',
                        click: () => {
                            let calendar = this.$refs.fullCalendar.getApi();
                            calendar.next();
                            this.getReminders();
                        }
                    },
                    today: {
                        text: 'Hoy',
                        click: () => {
                            let calendar = this.$refs.fullCalendar.getApi();
                            calendar.today();
                            this.getReminders();
                        }
                    },
            },
            isTutor: true,
            nombre: '',
            response: null,
            esDisponible: null,
            listaFechas: []
        }

    },
    computed: {
        ...mapGetters(["EVENTS"])
    },
    methods: {
        
        getTipoTutorias() {
            const params = {
                idTutor: this.$store.state.usuario.id_usuario,
                id_programa: this.$store.state.programaActual.id_programa,
            }
            axios.post('usuarios/tutoriaTutor', params)
            .then((response) => {
                
                this.aux= response.data
            }).catch(e => {
                console.log(e.response);
            });
        },
        getSlotsNumber(start,end) {
            var startF = moment(start, 'YYYY-MM-DD hh:mm a');
            var endF = moment(end, 'YYYY-MM-DD hh:mm a');
            var result = [];
            var current = moment(startF);
            while (current < endF) {
                result.push(current.format('YYYY-MM-DD HH:mm'));
                current.add(this.$store.state.programaActual.hora_bloque, 'minutes');
            }
            return result;
        },
        handleSelect (arg) {
            var today = new Date()
            var startDate = new Date(arg.start)
            var slots=this.getSlotsNumber(arg.start,arg.end)
            if(startDate>today) {
                Swal.fire({
                    title: 'Nueva Disponibilidad',
                    input: 'select',
                    text: 'De ' + moment(arg.start).format('HH:mm')+ ' a ' +moment(arg.end).format('HH:mm'),
                    inputOptions: {
                        '1': 'Una vez',
                        '2': 'Diaria',
                        '3': 'Semanal'
                    },
                    inputPlaceholder: 'Seleccione Frecuencia',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',                  
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
                }).then((result) => {
                    switch(result.value) {
                        //UNICA VEZ
                        case "1":
                            this.disponibilidadUnaVez(slots);
                            break;

                        //FRECUENCIA DIARIA
                        case "2":
                            this.disponibilidadDiaria(slots, startDate);
                            break;
                        
                        //FRECUENCIA SEMANAL
                        case "3":
                            this.disponibilidadSemanal(slots, startDate);
                            break;
                    }
                    this.hideModal();
                    this.esDisponible = null;
                    this.listaFechas = [];
                })
            }else {
                Swal.fire({
                    text: "No puede agregar disponibilidad en una fecha pasada",
                    icon:"error",
                    confirmButtonText: 'Ok',
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
                });
            }
            
        },
        async disponibilidadSemanal(slots, startDate) {
            try {
                Swal.fire({
                    text: 'Ingrese número de semanas',
                    input: 'number',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'#0097A7',
                    preConfirm: (veces) => {
                        veces = parseInt(veces, 10)
                        return veces                                  
                    },
                }).then(async (result) => {
                    this.showModal();
                    //agregar fechas
                    for(const slot in slots) {
                        console.log(slot, startDate);
                        await this.agregarFechasMensual(startDate, result.value);
                        
                        startDate = moment(startDate).add(this.$store.state.programaActual.hora_bloque, 'm').toDate();
                        startDate.setDate(startDate.getDate()-7*(result.value-1)); 
                    }
                    //verificar disponibilidad
                    for (const fecha of this.listaFechas) {
                        await this.consultarDisponibilidad(fecha);
                        if(this.esDisponible.data[0] != 'l'){
                            this.hideModal();
                            Swal.fire({
                                title:"Horario reservado en otro programa",
                                text: `La hora ${this.esDisponible.data[0][0].hora_inicio} tiene conflicto`,
                                icon:"error",
                                confirmButtonText: 'OK',
                                confirmButtonColor:'#0097A7',
                                showConfirmButton: true,
                            })
                            return;
                        }
                    }
                    this.insertaryconfirmar(this.listaFechas);
                });
            }
            catch (error) {
                console.log(error);
            }
        },
        agregarFechasMensual(dateIni,cantidadSem) {
            var self = this;
            var s;
            return new Promise((resolve, reject) => {
                let i = 0;
                while (i<cantidadSem) {
                    if(i==0) {
                        s = new Date( dateIni.setDate(dateIni.getDate()))
                        self.listaFechas.push(s)
                    }else {
                        s = new Date( dateIni.setDate(dateIni.getDate()+7))
                        self.listaFechas.push(s)
                    }
                    i++; 
                }
                resolve(true), 
                error => reject(error);
            });
        },
        agregarFechasDiaria(slots, startDate) {
            var d;
            var monday;
            var self = this;
            var listaFechas=[];
            return new Promise((resolve, reject) => {
                for(const slot in slots) {
                    let i = 0;
                    console.log(slot);
                    monday = getMonday(startDate);

                    while (i<5) {
                        if(i==0) {
                            d = new Date( monday.setDate(monday.getDate()))
                            listaFechas.push(d)
                        }else {
                            d = new Date( monday.setDate(monday.getDate()+1))
                            listaFechas.push(d)
                        }
                        i++; 
                    }
                    startDate = moment(startDate).add(self.$store.state.programaActual.hora_bloque, 'm').toDate();
                }
                resolve(listaFechas), 
                error => reject(error);
            });
        },
        async disponibilidadDiaria(slots, startDate) {
            try {
                this.showModal();
                //obtener fechas de la semana
                this.listaFechas = await this.agregarFechasDiaria(slots, startDate);
                //verificar disponibilidad  
                this.insertarFechasDiarias(this.listaFechas);

            }
            catch (error) {
                console.log(error);
            }
        },
        async insertarFechasDiarias(fechas) {
            for (const fecha of fechas) {
                await this.consultarDisponibilidad(fecha);
                if(this.esDisponible.data[0] != 'l'){
                    this.hideModal();
                    let date = moment(this.esDisponible.data[0][0].fecha).format('DD/MM/YYYY')
                    Swal.fire({
                        title:"Horario reservado en otro programa",
                        text: `La hora ${this.esDisponible.data[0][0].hora_inicio} del día ${date} tiene conflicto`,
                        icon:"error",
                        confirmButtonText: 'OK',
                        confirmButtonColor:'#0097A7',
                        showConfirmButton: true,
                    })
                    return;
                }
            }
            this.insertaryconfirmar(fechas);
        },
        async insertaryconfirmar(fechas) {
            for(const fecha of fechas) {
                await this.insertarDisponibilidad(fecha);
            }
            Swal.fire({
                text:"Se registró una nueva disponibilidad",
                icon:"success",
                confirmButtonText: 'Continuar',
                confirmButtonColor:'#0097A7',
                showConfirmButton: true,
            }).then((result) => {
                this.hideModal();
                if(result)
                    this.getReminders();
            })  
        },
        async disponibilidadUnaVez(slots) {
            try {
                //consultar disponibilidad
                this.showModal();
                for (const slot of slots) {
                    await this.consultarDisponibilidad(slot);
                    if(this.esDisponible.data[0] != 'l'){
                        this.hideModal();
                        Swal.fire({
                            title:"Horario reservado en otro programa",
                            text: `La hora ${this.esDisponible.data[0][0].hora_inicio} tiene conflicto`,
                            icon:"error",
                            confirmButtonText: 'OK',
                            confirmButtonColor:'#0097A7',
                            showConfirmButton: true,
                        })
                        return;
                    }
                }
                for(const slot of slots) {
                    await this.insertarDisponibilidad(slot);
                }
                Swal.fire({
                    text:"Se registró una nueva disponibilidad",
                    icon:"success",
                    confirmButtonText: 'Continuar',
                    confirmButtonColor:'#0097A7',
                    showConfirmButton: true,
                }).then((result) => {
                    this.hideModal();
                    if(result)
                        this.getReminders();
                })
            }
            catch (error) {
                console.log(error);
            }
        },
        insertarDisponibilidad(slot) {
            let self = this;
            return new Promise ((resolve, reject) => {
                axios.post('disponibilidades/insertar',{
                    id_usuario:self.$store.state.usuario.id_usuario,
                    id_programa: self.$store.state.programaActual.id_programa,
                    fecha:moment(slot).format("YYYY-MM-DD"),
                    usuario_creacion: self.$store.state.usuario.id_usuario,
                    usuario_actualizacion: self.$store.state.usuario.id_usuario,
                    tipo_disponibilidad: 'fij',
                    hora_inicio:moment(slot).format('HH:mm:ss'),
                    hora_fin: addTimes(moment(slot).format('HH:mm:ss'), self.bloque)
                }).then(function(){ 
                    resolve(true);
                }, error => reject(error));
            });
        },
        consultarDisponibilidad(slot) {
            let self = this;
            return new Promise ((resolve, reject) => {
                axios.post('disponibilidades/consultarDisp',{
                    idUsuario: self.$store.state.usuario.id_usuario,
                    fecha: moment(slot).format("YYYY-MM-DD"),
                    horaInicio: moment(slot).format('HH:mm:ss')
                }).then(function(response){
                    self.esDisponible = response; 
                    resolve(true);
                }, error => reject(error));
            });
        },
        msgOcupado (date) {
            Swal.fire({
                text:"El día " + date.toLocaleDateString('es', { weekday: 'long' }) + " " + date.getDate() +" ya se encuentra ocupado",
                icon:"error",
                confirmButtonText: 'OK',
                confirmButtonColor:'#0097A7',
                showConfirmButton: true,
            })
        },
        modificarDisp () {

            //this.calendar = this.$refs.fullCalendar.getApi()
            var elem = document.getElementById("modDisp");
            if (this.calendar.getOption('selectable')) {
                location.reload();
                /*let calendar = this.$refs.fullCalendar.getApi();
                calendar.setOption('selectable','false')
                elem.value = "Modificar Disponibilidad"
                elem.style.backgroundColor ="#17a2b8"
                console.log('calendarApi: ',calendar.getOption('selectable'))*/
            }
            else { 
                let calendar = this.$refs.fullCalendar.getApi();
                calendar.setOption('selectable','true')
                elem.value = "Terminar";
                elem.style.backgroundColor ="gray"
            } 
            
            // console.log(this.calendar);
        },
        handleClick (arg) {
            if(arg.event.backgroundColor!='#B2EBF2') {
                this.$modal.show(EventModal,{
                    text: "This is from the component",
                    event: arg.event,
                    isTutor: true,
                    nombre_usuario: arg.event.title
                });
            } else if(arg.event.backgroundColor=='#B2EBF2' && this.calendar.getOption('selectable')) {
                //borrar disponibilidad
                this.deleteEvent(arg)
            } else if(arg.event.backgroundColor=='#B2EBF2') { 
                this.$store.state.citaDatos={
                        props:arg.event.extendedProps,
						id_disponibilidad:arg.event.id,
                        fechaIni:arg.event.start,
                        fechaFin:arg.event.end,
                        id_tutor: this.$store.state.usuario.id_usuario,
                        tttutorSel: this.aux,
                        isGray:false,
                        alumnos:arg.event.allow,
                        pantalla:'calendario'///////////agregar allow 

                };             				
                // console.log('citaDatos: ',this.$store.state.citaDatos)
                this.$router.push('/registrarCita/registrarCitaAgendada');

            } else {
                return false
            }       
        },
        deleteEvent(arg) {
            Swal.fire({
                text:'¿Estás seguro que desea eliminar la disponibilidad?',
                icon:"warning",
                confirmButtonText: 'Si',
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonColor:'#0097A7',
                showConfirmButton: true,
            }).then((result) => {
                if(result.value) {
                    
                    axios.post('disponibilidades/eliminar/' + arg.event.id)
                    .then((response) => {
                        if(response) {
                            this.$store.commit("DELETE_EVENT", arg.event) 
                            Swal.fire({
                                text:"La disponibilidad ha sido eliminada",
                                icon:"success",
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor:'#0097A7',
                                showConfirmButton: true,
                            });
                        }
                    }).catch(e => {
                        console.log(e.response);
                    });
                }     
            })
        },
        getReminders: function() {
                this.calendar = this.$refs.fullCalendar.getApi();
                this.$store.state.events = [];
                this.showModal()
                axios.post('disponibilidades/dispSemanalVistaTu',{idUsuario:this.$store.state.usuario.id_usuario,idPrograma:this.$store.state.programaActual.id_programa,fechaIni:this.calendar.view.activeStart,fechaFin:this.calendar.view.activeEnd })
                .then((response) => {
                    var rd = response.data[0];
                    var rd2 = response.data[1];
                    var rd3 = response.data[2];
                    var rd4 = response.data[3];
                    var today = new Date()
                    for(var i in response.data[0]) {
                        var start_hour = rd[i].hora_inicio;
                        var date = rd[i].fecha + " " + rd[i].hora_inicio
                        var date1 = new Date(date)
                            //SI ESTA OCUPADO
                            
                            if(rd2[i]=='o') {
                                //SI ES UNA CITA INDIVIDUAL
                                if(response.data[3][i].length == 1) {
                                    //SI YA SE REGISTRO RESULTADO DE LA CITA
                                    // console.log('alumno:',rd4[i][0].nombre,'asiste:',rd4[i][0].pivot.asistencia)
                                    //if(rd4[i][0].pivot.asistencia!='noa' && rd4[i][0].pivot.asistencia!='pen' ) {
                                    if( rd4[i][0].pivot.asistencia!='pen' ) {
                                        this.$store.commit("ADD_EVENT", {
                                            allow: rd[i].alumno,
                                            id: rd[i].id_disponibilidad,
                                            title: rd4[i][0].nombre + ' ' + rd4[i][0].apellidos,
                                            description: rd3[i].nombre,
                                            alumno: rd4[i][0],
                                            start: rd[i].fecha + " " + rd[i].hora_inicio,
                                            fecha: rd[i].fecha,
                                            horaIni: rd[i].hora_inicio, 
                                            end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                            tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                            color: '#009892',
                                            usuario_creacion: rd[i].usuario_creacion,
                                            id_usuario_tutor: rd[i].id_usuario,
                                            usuario_actualizacion: rd[i].usuario_actualizacion,
                                            motivo: rd3[i].nombre
                                        })   
                                    }
                                    else {
                                        if(date1>today) {
                                            this.$store.commit("ADD_EVENT", {
                                                allow: rd[i].alumno,
                                                id: rd[i].id_disponibilidad,
                                                title: rd4[i][0].nombre + ' ' + rd4[i][0].apellidos,
                                                description: rd3[i].nombre,
                                                alumno: rd4[i][0],
                                                start: rd[i].fecha + " " + rd[i].hora_inicio,
                                                fecha: rd[i].fecha,
                                                horaIni: rd[i].hora_inicio, 
                                                end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                                tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                                color: '#FFC107',
                                                usuario_creacion: rd[i].usuario_creacion,
                                                id_usuario_tutor: rd[i].id_usuario,
                                                usuario_actualizacion: rd[i].usuario_actualizacion,
                                                motivo: rd3[i].nombre
                                            })
                                        } else {
                                            this.$store.commit("ADD_EVENT", {
                                                allow: rd[i].alumno,
                                                id: rd[i].id_disponibilidad,
                                                title: rd4[i][0].nombre + ' ' + rd4[i][0].apellidos,
                                                description: rd3[i].nombre,
                                                alumno: rd4[i][0],
                                                start: rd[i].fecha + " " + rd[i].hora_inicio,
                                                fecha: rd[i].fecha,
                                                horaIni: rd[i].hora_inicio, 
                                                end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                                tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                                color: '#ff6961',
                                                usuario_creacion: rd[i].usuario_creacion,
                                                id_usuario_tutor: rd[i].id_usuario,
                                                usuario_actualizacion: rd[i].usuario_actualizacion,
                                                motivo: rd3[i].nombre
                                            })
                                        }
                                    }
                                }
                                //SI ES UNA CITA GRUPAL
                                else  {                               
                                    if( rd4[i][0].pivot.asistencia!='pen') {
                                        this.$store.commit("ADD_EVENT", {
                                            allow: rd[i].alumno,
                                            id: rd[i].id_disponibilidad,
                                            title: 'Cita Grupal',
                                            description: rd3[i].nombre,
                                            alumno: rd4[i][0],
                                            start: rd[i].fecha + " " + rd[i].hora_inicio,
                                            fecha: rd[i].fecha,
                                            horaIni: rd[i].hora_inicio, 
                                            end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                            tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                            color: '#009892',
                                            usuario_creacion: rd[i].usuario_creacion,
                                            id_usuario_tutor: rd[i].id_usuario,
                                            usuario_actualizacion: rd[i].usuario_actualizacion,
                                            motivo: rd3[i].nombre
                                        })   
                                    }
                                    else {
                                        if(date1>today) {
                                            this.$store.commit("ADD_EVENT", {
                                                allow: rd[i].alumno,
                                                id: rd[i].id_disponibilidad,
                                                title: 'Cita Grupal',
                                                description: rd3[i].nombre,
                                                alumno: rd4[i][0],
                                                start: rd[i].fecha + " " + rd[i].hora_inicio,
                                                fecha: rd[i].fecha,
                                                horaIni: rd[i].hora_inicio, 
                                                end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                                tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                                color: '#FFC107',
                                                usuario_creacion: rd[i].usuario_creacion,
                                                id_usuario_tutor: rd[i].id_usuario,
                                                usuario_actualizacion: rd[i].usuario_actualizacion,
                                                motivo: rd3[i].nombre
                                            })

                                        }
                                        else {
                                            this.$store.commit("ADD_EVENT", {
                                                allow: rd[i].alumno,
                                                id: rd[i].id_disponibilidad,
                                                title: 'Cita Grupal',
                                                description: rd3[i].nombre,
                                                alumno: rd4[i][0],
                                                start: rd[i].fecha + " " + rd[i].hora_inicio,
                                                fecha: rd[i].fecha,
                                                horaIni: rd[i].hora_inicio, 
                                                end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                                tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                                color: '#ff6961',
                                                usuario_creacion: rd[i].usuario_creacion,
                                                id_usuario_tutor: rd[i].id_usuario,
                                                usuario_actualizacion: rd[i].usuario_actualizacion,
                                                motivo: rd3[i].nombre
                                            })

                                        }
                                    }
                                                                        
                                }
                                                        
                            } 
                            
                            else {
                                if(date1>today) {
                                    this.$store.commit("ADD_EVENT", {
                                        id: rd[i].id_disponibilidad,
                                        title: 'Disponible',
                                        description:'',
                                        start: rd[i].fecha + " " + rd[i].hora_inicio,
                                        end: rd[i].fecha + " " + addTimes(start_hour, this.bloque),
                                        tipo_disponibilidad: rd[i].tipo_disponibilidad,
                                        color: '#B2EBF2',
                                        editable:false,
                                        usuario_creacion: rd[i].usuario_creacion,
                                        id_usuario_tutor: rd[i].id_usuario,
                                        usuario_actualizacion: rd[i].usuario_actualizacion
                                    });
                                }
                            }
                    }
                    this.hideModal()
                }).catch(e => {
                    console.log(e.response);
                    this.hideModal()
                });
                //this.calendar.render();
            },
            
            showModal() {
            this.$refs['my-modal'].show()
            },
            hideModal() {
            this.$refs['my-modal'].hide()
            },
    },
    watch: {    
        eventFilter() {
        this.$refs.calendar.fireMethod("rerenderEvents");
        }
    },
    mounted() {
        this.showModal();
        this.getReminders();
    },
    created() {
        try {
            const duration = this.$store.state.programaActual.hora_bloque;
            this.bloque = "00:"+ duration + ":00";
            this.getTipoTutorias();
            this.esDisponible = "ffa";
            if(this.$store.state.usuario==null) this.$router.push('/login');
        }
        catch (e){
            console.log(e);
        }
        
        //this.calendar = this.$refs.fullCalendar.getApi();
        //idUsuario: this.$store.state.usuario.id_usuario
        //this.calendar.render();
        
    }
    
}
function FatalError(){ Error.apply(this, arguments); this.name = "FatalError"; }
FatalError.prototype = Object.create(Error.prototype);


// function disableAlert () {
//     document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-content > select > option:nth-child(3)").disabled = "true"
//     document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-content > select > option:nth-child(4)").disabled = "true"                                  
// }
function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function addTimes (startTime, endTime) {
  var times = [ 0, 0, 0 ]
  var max = times.length

  var a = (startTime || '').split(':')
  var b = (endTime || '').split(':')

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
  }

  // store time values
  for (var j = 0; j < max; j++) {
    times[j] = a[j] + b[j]
  }

  var hours = times[0]
  var minutes = times[1]
  var seconds = times[2]

  if (seconds >= 60) {
    var m = (seconds / 60) << 0
    minutes += m
    seconds -= 60 * m
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0
    hours += h
    minutes -= 60 * h
  }

  return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
}

</script>

<style lang='scss'>
    @import './../../assets/styles/main.css';
    @import '~@fullcalendar/core/main.css';
    @import '~@fullcalendar/daygrid/main.css';
    @import '~@fullcalendar/timegrid/main.css';

    .top-titulo {
        display: flex;
        justify-content: space-between;
    }
    .fc-header-toolbar {
        margin-top: 10px;
    }
    .fc-button {
        background-color: #17a2b8;
        border-color: #17a2b8;
    }
    .fc-button-primary:not(:disabled).fc-button-active {
        background-color: #757575;
        border-color: #757575;
    }
    .fc-button:hover {
        background:#00BCD4;border-color: #00BCD4;
    }
    .fc-button:focus {
        background:#00BCD4 !important;
        border-color: #00BCD4 !important;
        outline:none !important;
        box-shadow: none !important;
        border: 2.3px solid transparent !important;
    }
    .fc-view-container {
        font-family: "Brandon Bold" !important;
    }
    .fc-event { 
        background-color: #B2EBF2;
        border-color: #B2EBF2;
        cursor: pointer;
    }
    .vm--modal {
        border-radius: 25px;
        margin: 30px;
        height: 280px !important;
    }
    @media screen and (max-width: 759px) {
        .form-control { 
            left: -100px;
        }
    }
    @media screen and (max-width: 1024px) {
        .form-control { 
            left: 0px;
        }
    }
    .fc-time-grid .fc-slats td {
        height: 2.5em;
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
    input:focus {
        outline:none;
        box-shadow: none;
    }
    .swal2-input {
        outline:none;
        box-shadow: none;
        border-radius: 1.25rem !important;  
        border: 0.5px solid #757575 !important;
    }
    .swal2-select {
        border-radius: 1.25rem !important;  
        border: 0.5px solid #757575 !important;
    }

</style>