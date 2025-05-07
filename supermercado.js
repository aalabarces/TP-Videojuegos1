class Supermercado {
    constructor(juego) {
        this.juego = juego;
        this.empleados = [];
        this.estanterias = [];
        this.heladeras = [];
        this.cajas = [];
        this.productos = [];

    }

    update() {
        this.empleados.forEach(empleado => empleado.update());
        this.estanterias.forEach(estanteria => estanteria.update());
        this.heladeras.forEach(heladera => heladera.update());
        this.cajas.forEach(caja => caja.update());
        this.productos.forEach(producto => producto.update());
    }

    render() {
        this.empleados.forEach(empleado => empleado.render());
        this.estanterias.forEach(estanteria => estanteria.render());
        this.heladeras.forEach(heladera => heladera.render());
        this.cajas.forEach(caja => caja.render());
        this.productos.forEach(producto => producto.render());
    }

    agregarEmpleado(empleado) {
        this.empleados.push(empleado);
    }
    agregarEstanteria(estanteria) {
        this.estanterias.push(estanteria);
    }
    agregarHeladera(heladera) {
        this.heladeras.push(heladera);
    }
    agregarCaja(caja) {
        this.cajas.push(caja);
    }

}