function agregarEventoCambioFacultad() {
    const selectFacultad = document.getElementById('id_facultad_fk');
    selectFacultad.addEventListener('change', function() {
        const idFacultad = this.value;
        if (idFacultad) {
            obtenerCarrerasPorFacultad(idFacultad);
        } else {
            llenarSelect('id_carrera_fk', 'Seleccionar Carrera', [], '', '');
        }
    });
}
