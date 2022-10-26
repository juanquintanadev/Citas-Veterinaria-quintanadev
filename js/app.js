// seleccionamos todos los inputs que va a ingresar el usuario

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// creamos una variable booleana para ver si estamos en modo edicion o no
let edicion;

// campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// CLASES
class Citas {
    constructor() {
        this.citas = [];
    };

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    };

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    };

    editarCita(citaActualizada) {
        // .map trae el arreglo modificado si al recorrer el arreglo citas en cada cita verificamos si su id es igual al de las cita actualizada, si es igual, modificamos todo el objeto, sino le asignamos el mismo valor que ya tenia
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    };
};

class UI {
    mostrarAlerta(mensaje, tipo) {
        // creamos un div donde colocamos el mensaje
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('alert', 'text-center', 'd-block', 'col-12');

        // en el caso de que sea tipo error agregamos una clase mas danger o succes
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        };

        // ahora es el mensaje de error
        divMensaje.textContent = mensaje;

        // lo vamos a agregar al DOM siendo con insertBefore colocar un hijo del que seleccionamos
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // quitar la alerta despues de 5 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    };

    // dato importante, tambien podemos aplicar detructuring desde los parametros para extraer del objeto el arreglo
    mostrarCitas({citas}) {

        // limpiamos el contenedor de citas antes de agregar asi no se duplican
        this.limpiarHtml();


        // empezamos a recorrer el arreglo
        citas.forEach(cita => {
            // destructuring para acortar el codigo
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            const divCita = document.createElement('DIV');
            divCita.classList.add('cita', 'p-3');
            // agregamos un atributo personalizado a este div asi lo podemos ubicar para modificar o eliminar
            divCita.dataset.id = id;

            // creamos los elementos del div scripting
            const parrafoMascota = document.createElement('H2');
            parrafoMascota.classList.add('card-title', 'font-weight-bolder');
            parrafoMascota.textContent = mascota;

            // ahora el propietario con span y utilizamos inner html
            const parrafoPropietario = document.createElement('P');
            parrafoPropietario.innerHTML = `<span class="font-weight-bold">Propietario: </span>${propietario}`;

            const parrafoTelefono = document.createElement('P');
            parrafoTelefono.innerHTML = `<span class="font-weight-bold">Telefono: </span>${telefono}`;

            const parrafoFecha = document.createElement('P');
            parrafoFecha.innerHTML = `<span class="font-weight-bold">Fecha: </span>${fecha}`;

            const parrafoHora = document.createElement('P');
            parrafoHora.innerHTML = `<span class="font-weight-bold">Hora: </span>${hora}`;

            const parrafoSintomas = document.createElement('P');
            parrafoSintomas.innerHTML = `<span class="font-weight-bold">Sintomas: </span>${sintomas}`;

            // creamos un boton para eliminar la cita
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'mr-2');
            btnBorrar.innerHTML = 'Elmininar Cita <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
            
            // le asignamos una funcion al boton con el id
            btnBorrar.onclick = () => elimiarCita(id);

            // creamos el boton de editar
            const btnEditar = document.createElement('BUTTON');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

            // le asignamos una funcion con la cita completa para colocarla en el formulario
            btnEditar.onclick = () => cargarCita(cita);

            // agregamos al elemento div contenedor de toda la cita
            divCita.appendChild(parrafoMascota);
            divCita.appendChild(parrafoPropietario);
            divCita.appendChild(parrafoTelefono);
            divCita.appendChild(parrafoFecha);
            divCita.appendChild(parrafoHora);
            divCita.appendChild(parrafoSintomas);
            divCita.appendChild(btnBorrar);
            divCita.appendChild(btnEditar);

            // ahora lo agregamos al html utilizando el contenedor de citas ya seleccionado anteriormente
            contenedorCitas.appendChild(divCita);
        });
    };

    // clasico metodo para limpiar el html asi no duplica resultados antes de agregarlos
    limpiarHtml() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        };
    };
};

// INSTANCIAMOS DE FORMA GLOBAL
const administrarCitas = new Citas();
const ui = new UI();


// creamos un objeto para ir llenando los datos ingresados con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
};

// eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita); // cuando damos en el boton de submit agregamos una nueva cita
}

// agregamos datos al objeto de citas
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
};

// valida y agrega una nueva cita a la clase de Citas
function nuevaCita(e) {
    e.preventDefault();

    // destructuring al objeto principal para obtener las variables
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // validamos que todos esten con contenido
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        // console.log('todos son obligatorios');
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    };

    if(edicion) {
        edicion = false;
        
        ui.mostrarAlerta('Editado Correctamente');

        // pasar el objeto de la cita a modo edicion
        administrarCitas.editarCita({...citaObj});

        // regresamos el nombre una vez editado y guardado el cambio al boton principal
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

    } else {
        // vamos a darle un id a la cita
        citaObj.id = Date.now();

        // aca pasamos la validacion y creamos la nueva cita mandandole una COPIA a la clase para que la guarde y no se repita la referencia del objeto global
        // console.log(citaObj);
        administrarCitas.agregarCita({...citaObj});

        ui.mostrarAlerta('Cita creada correctamente');
    };

    // reiniciamos el objeto ya que queda con la informacion almacenada en memoria
    // una vez pasadas todas la validaciones y agregada la cita
    reinicarObjeto();

    // reseteamos el formulario
    formulario.reset();

    // una vez ya almacenada la cita en el arreglo principal de la clase Citas lo agregamos al html
    ui.mostrarCitas(administrarCitas);
};

function reinicarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
};

function elimiarCita(id) {

    // eliminar cita
    administrarCitas.eliminarCita(id);

    // muestre un mensaje de eliminado correctamente
    ui.mostrarAlerta('Cita eliminada exitosamente');

    // resfrescar lo que muestra en el html
    ui.mostrarCitas(administrarCitas);
};

// cargamos los datos y el modo edicion
function cargarCita(cita) {

    // destructuring al objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // llenamos los inputs que vamos a editar
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenamos el objeto porque esta vacio luego de agregar una cita
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    edicion = true;
};