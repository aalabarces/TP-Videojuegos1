class Cliente extends Persona {
    static STATES = {
        llegando: "llegando",
        comprando: "comprando",
        pagando: "pagando",
        saliendo: "saliendo",
        buscando: "buscando",
        tentado: "tentado"
    };

    constructor(x, y, juego) {
        super(x, y, juego);

        this.tipo = "cliente";
        this.container.name = "cliente";
        this.container.tint = 0x00ff00;
        this.velocidadMaxima = 3;
        this.accMax = 0.33;
        this.valorFriccion = 0.95;

        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 10;

        this.MULTIPLICADOR_DE_AUTOCONTROL = 1.5;
        this.MULTIPLICADOR_DE_ENOJO = 1;
        //tendrían que escalar según cantidad de veces que pasó (enojarse, tentarse)

        // { 'tipo': 'carne', 'cantidad': 2, 'locaciones': [{x: 5, y:154}, {x:5, y:154}] }, {etc}
        this.compras = [{
            tipo: 'carne',
            cantidad: 1,
            cantidadEnCarrito: 0,
            hay: true,
        }]; //array de objetos de lista de compras
        // this.llenarListaDeCompras();
        this.estado = Cliente.STATES.buscando; // estado del cliente

        this.carrito = []; //array de objetos que el cliente tiene en su carrito
        this.yaPague = false;
        this.plata = 0;
        this.objetivo = null; // el producto que quiere comprar

        // this.verSiHayTodoLoQueNecesito();

        this.celdasTransitadas = [];
        this.adentro = true;
        this.reproduciendoAnimacionIninterrumpible = false;
    }

    llenarListaDeCompras() {
        let cantidadDeCompras = Math.floor(Math.random() * 5) + 1; // entre 1 y 5 compras
        for (let i = 0; i < cantidadDeCompras; i++) {
            let producto = listaProductos[Math.floor(Math.random() * listaProductos.length)];
            if (producto) {
                this.compras.push(this.generarCompra(producto));
            }
        }
    }

    generarCompra(producto) {
        // devuelve un objeto de compra con el producto y una cantidad aleatoria
        let cantidad = Math.floor(Math.random() * 3) + 1; // entre 1 y 3 unidades del producto
        return {
            tipo: producto,
            cantidad: cantidad,
            cantidadEnCarrito: 0,
            hay: true,
        };
    }


    finiteStateMachine() {
        // si no está adentro, y no está saliendo, entonces está llegando
        if (!this.adentro && this.estado != Cliente.STATES.saliendo) {
            this.estado = Cliente.STATES.llegando;
        }
        // si ya pagó o se enojó mucho, entonces está saliendo
        else if (this.yaPague || this.enojo > this.paciencia) {
            this.estado = Cliente.STATES.saliendo;
        }
        else {
            // si quedan cosas en la lista
            if (this.quedanCosasPorComprar()) {
                if (!this.objetivo) { this.estado = Cliente.STATES.buscando; }
                else { this.estado = Cliente.STATES.comprando; }
            } else {
                if (this.carrito.length > 0) { // si tiene algo que comprar
                    this.estado = Cliente.STATES.pagando;
                }
                else {
                    this.estado = Cliente.STATES.saliendo; // si no hay nada en el carrito, se va
                }
            }
        }
        console.log("Estado del cliente:", this.estado);
    }

    quedanCosasPorComprar() {
        // devuelve true si hay cosas en la lista de compras que no están en el carrito
        return this.compras.some(compra => compra.cantidadEnCarrito < compra.cantidad && compra.hay);
    }

    // verSiHayTodoLoQueNecesito() {
    //     // verifica si hay todo lo que necesito en el carrito y actualizo 
    //     for (let i = 0; i < this.compras.length; i++) {
    //         if (this.juego.supermercado.hayProducto(this.compras[i].tipo)) {
    //             for (let j = 0; j < this.compras[i].cantidad; j++) {
    //                 if (!this.compras[i].locaciones) { this.compras[i].locaciones = []; }
    //                 this.compras[i].locaciones.push(this.juego.supermercado.dondeEsta(this.compras[i].tipo));
    //             }
    //         }
    //     }
    // }

    // entra, busca todos, va al mas cerca
    // objetos conocidos: ya sabe dónde están algunas cosas

    // guardar por qué celdas pasó, que busque la celda más cercana por la que no y vaya hasta que no haya celdas o ya tenga todas las cosas

    comprando() {
        if (this.estoyAlLadoDelObjetivo()) {
            this.agarrar();
        }
        // si no hay objetivo, buscá el primero de la lista. si hay, ir
        else {
            this.irA(this.objetivo.x, this.objetivo.y);
        }
    }

    buscando() {
        if (!this.objetivo) {
            this.objetivo = this.queMeTocaComprar()
            this.llegue = false;
        }
    }

    queMeTocaComprar() {
        // devuelve el primer producto de la lista de compras que no tengo en el carrito
        let proximo = this.compras.find(compra => compra.cantidadEnCarrito < compra.cantidad && compra.hay);
        let donde = this.juego.supermercado.hayProducto(proximo.tipo);
        if (donde) {
            return donde;
        }
        else {
            proximo.hay = false;
        }
    }

    pagando() {
        if (this.objetivo.tipo != "caja") {
            this.objetivo = this.buscarCaja();
        }
        if (this.estoyAlLadoDelObjetivo()) {
            this.pagar();
        }
        else {
            this.irACaja();
        }
    }

    agarrar() {
        this.carrito.push(this.objetivo);
        this.compras.find(compra => compra.tipo === this.objetivo.tipo).cantidadEnCarrito++;
        this.compras.find(compra => compra.tipo === this.objetivo.tipo).locaciones.shift(); // saca la primera

        this.objetivo = null;
        // this.juego.supermercado.quitarProductoDeEstante(this.objetivo);
    }

    actuarSegunEstado() {
        // console.log("Estado actual:", this.estado);
        switch (this.estado) {
            case Cliente.STATES.llegando:
                this.entrar()
            case Cliente.STATES.buscando:
                this.buscando();
                break;
            case Cliente.STATES.comprando:
                this.comprando();
                break;
            case Cliente.STATES.pagando:
                this.pagando();
                break;
            case Cliente.STATES.saliendo:
                this.saliendo();
                break;
            case Cliente.STATES.agarrando:
                this.agarrando();
                break;
            // case Cliente.STATES.tentado:
            //     this.tentado();
            //     break;
            default:
                console.warn("Estado no reconocido:", this.estado);
                break;
        }
    }

    entrar() {
        this.objetivo = this.juego.supermercado.puerta;
    }

    quitarProducto(producto) {
        let index = this.compras.indexOf(p => p.tipo == producto.tipo);
        if (index != -1) {
            this.compras.splice(index, 1);
        }
    }

    buscarProducto(producto) {
        return this.juego.supermercado.dondeEsta(producto);
    }

    hayProducto(producto) {
        return this.buscarProducto(producto) != undefined;
    }

    update() {
        // if (!this.reproduciendoAnimacionIninterrumpible) {
        this.finiteStateMachine();
        this.actuarSegunEstado();

        super.update();
    }

    render() {
        if (!this.yaCargoElSprite) return;
        super.render();
    }

    estoyAlLadoDelObjetivo() {
        // devuelve si la distancia al producto que quiero es menor a DISTANCIA_DE_ACCION
        // console.log("Producto buscado:", producto);
        if (this.objetivo) {
            let distancia = this.juego.calcularDistancia(this.objetivo, this);
            return distancia < this.DISTANCIA_DE_ACCION;
        }
        return false;
    }

    buscarCaja() {
        let cajas = this.juego.supermercado.cajas;
        let elMasCercano = null;
        let distanciaMinima = Infinity;
        for (let i = 0; i < cajas.length; i++) {
            let caja = cajas[i];
            if (caja.fila.length == 0) {
                return caja; // si la caja está vacía, voy ahí
            }
            let distancia = this.juego.calcularDistancia(caja, this);
            if (distancia < distanciaMinima &&
                caja.fila.length <= (elMasCercano ? elMasCercano.fila.length * 1.5 : Infinity)) {
                distanciaMinima = distancia;
                elMasCercano = caja;
            }
        }
    }

    pagar() {
        if (this.objetivo.fila)
            this.objetivo.fila.push(this);
    }

    saliendo() {
        if (this.adentro) { this.objetivo = this.juego.supermercado.puerta; }
        else {
            this.objetivo = this.juego.supermercado.finDelMapa();
        }
    }

    miData() {
        return {
            ...super.miData(),
            estado: this.estado,
            compras: this.compras,
            carrito: this.carrito,
            yaPague: this.yaPague,
            plata: this.plata,
            objetivo: this.objetivo,
            paciencia: this.paciencia,
            enojo: this.enojo
        };
    }
}


/*

if enojo > paciencia { saliendo }
else {
    if hay cosas en la lista {
        comprando
    } else {
        if ya pague { saliendo }
            else { pagando }
        }
}

comprando {
    if estoy al lado { agarrando }
    else { buscando }
}

buscando {
    if veo algo que me tienta && tentacion > autocontrol { tentado }
    else if (hay lo que quiero) { yendo a producto }
        else { enojado; sacar de la lista }
}

pagando {
    if estoy al lado { pagar }
    else { yendo a caja }
}





*/