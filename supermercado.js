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

        this.sprites = {};
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

    crearSupermercado() {
        let x = 5; // ESQUINA TOP LEFT
        let y = 5; // ESQUINA TOP LEFT
        let ancho = this.juego.ancho - 10; // MARGEN DE 5 PIXELES
        let alto = this.juego.alto - 10; // MARGEN DE 5 PIXELES
        for (let i = x + 1; i < ancho; i++) {   // desde esquina superior izquierda hasta esquina superior derecha
            const celda = this.juego.grilla.obtenerCeldaEnPosicion(i, y);
            // celda.sprite = this.sprites['pared_top'];
            celda.sprite = this.sprites['pared'];
        }
        for (let i = x + 1; i < ancho; i++) {   // desde esquina inferior izquierda hasta esquina inferior derecha
            const celda = this.juego.grilla.obtenerCeldaEnPosicion(i, alto);
            // celda.sprite = this.sprites['pared_bottom'];
            celda.sprite = this.sprites['pared'];
        }
        for (let i = y + 1; i < alto; i++) {   // desde esquina superior izquierda hasta esquina inferior izquierda
            const celda = this.juego.grilla.obtenerCeldaEnPosicion(x, i);
            // celda.sprite = this.sprites['pared_left'];
            celda.sprite = this.sprites['pared'];
        }
        for (let i = y + 1; i < alto; i++) {   // desde esquina superior derecha hasta esquina inferior derecha
            const celda = this.juego.grilla.obtenerCeldaEnPosicion(ancho, i);
            // celda.sprite = this.sprites['pared_right'];
            celda.sprite = this.sprites['pared'];
        }
        // PONER PUERTA
        const puerta = this.juego.grilla.obtenerCeldaEnPosicion(x + 2, y);
        puerta.sprite = this.sprites['puerta'];
    }
}