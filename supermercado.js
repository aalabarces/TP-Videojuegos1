class Supermercado {
    constructor(juego) {
        this.juego = juego;
        this.empleados = [];
        this.estanterias = [];
        this.heladeras = [];
        this.cajas = [];
        this.clientes = [];
        this.productos = [];
        this.aumento = {}; // aumento de precio por producto

        this.dinero = 1000; // Dinero inicial para poder comprar productos
        this.ventas = [];

        // Crear almacén del supermercado
        this.almacen = new Almacen(-1, -1, juego); // Posición fuera del mapa visible

        this.sprites = {};
        this.cargarSprites();
        this.crearSupermercado();
    }

    hayProducto(producto) {
        if (typeof producto === 'string') {
            return this.productos.find(p => p.tipo === producto);
        }
        return this.productos.find(p => p.tipo === producto.tipo);
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

    async cargarSprites() {
        let pared = await PIXI.Assets.load("assets/pared.png");
        this.sprites['pared'] = new PIXI.Sprite(pared);
        // let pared2 = await PIXI.Assets.load("assets/pared2.png");
        // this.sprites['pared2'] = new PIXI.Sprite(pared2);
        // let piso = await PIXI.Assets.load("assets/piso.png");
        // this.sprites['piso'] = new PIXI.Sprite(piso);
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

    quitarProductoDeEstante(producto) {
        let alamacenamiento = producto.dondeEstoy;
        if (alamacenamiento) {
            alamacenamiento.retirarProducto(producto);
            this.productos = this.productos.filter(p => p !== producto); // eliminar el producto de la lista de productos del supermercado
        }
    }

    cobrar(venta) {
        if (!venta) return;
        let cantidad = venta.productos.length;  // la duracion de la animacion es igual a la cantidad de productos
        // venta.caja.reproducirAnimacion('cobrar', cantidad);
        venta.empleado.reproducirAnimacion('cobrar', cantidad);
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

    finDelMapa() {
        // Devuelve la celda donde termina el mapa, que es la puerta de salida
        let celda = this.juego.grilla.obtenerCeldaPorHash("x_0_y_15");
        return { x: celda.x - 10, y: celda.y }; // Ajustamos para que sea la celda antes de la puerta
    }

    comprarProducto(tipoProducto, cantidad = 1) {
        if (!productos[tipoProducto]) {
            console.error(`Producto ${tipoProducto} no existe`);
            return false;
        }

        const infoProducto = productos[tipoProducto];
        const costoTotal = infoProducto.precio * cantidad;

        if (this.dinero < costoTotal) {
            console.log(`No hay suficiente dinero. Necesitas $${costoTotal}, tienes $${this.dinero}`);
            return false;
        }

        // Descontar dinero
        this.dinero -= costoTotal;

        // Crear y agregar productos al almacén
        for (let i = 0; i < cantidad; i++) {
            const nuevoProducto = new Producto(tipoProducto, this.juego);
            this.almacen.agregarProducto(nuevoProducto);
        }

        console.log(`Comprado ${cantidad} ${tipoProducto}(s) por $${costoTotal}. Dinero restante: $${this.dinero}`);
        return true;
    }
}

/*
puerta:
x3,y:14 // x4,y:14

caja:
x5,y13

flechas:
arriba:
x3,y:13 // x4,y:13
derecha:
x3,y:8 // x4,y:8
abajo:
x6,y8 // x7,y8

estanterías:
horizontal:
x3,y:7 // x6,y:7
vertical:
x2,y:9 // x5,y:9 // x8,y:9

*/