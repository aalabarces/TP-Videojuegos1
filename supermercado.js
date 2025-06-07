class Supermercado {
    constructor(juego) {
        this.juego = juego;
        this.empleados = [];
        this.estanterias = [];
        this.heladeras = [];
        this.cajas = [];
        this.productos = [];
        this.clientes = [];

        this.dinero = 0;
        this.ventas = [];
    }

    update() {
        this.empleados.forEach(empleado => empleado.update());
        this.estanterias.forEach(estanteria => estanteria.update());
        this.heladeras.forEach(heladera => heladera.update());
        this.cajas.forEach(caja => caja.update());
        this.productos.forEach(producto => producto.update());
        this.juego.ui.dinero.text = this.dinero;
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

    cobrar(venta) {
        if (!venta) return;
        for (let i = 0; i < venta.productos.length; i++) {
            const producto = venta.productos[i];
            const index = this.productos.indexOf(producto);
            if (index != -1) {
                this.productos.splice(index, 1);
            }
            venta.caja.reproducirAnimacion('cobrar');
            venta.empleado.reproducirAnimacion('cobrar');
        }
        this.dinero += venta.total;
        this.ventas.push(venta);
    }
    sumarPlata(x) {
        this.dinero += x;
    }
}