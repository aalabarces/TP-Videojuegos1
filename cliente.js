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

        //array de objetos de lista de compras
        // this.compras = [{
        //     tipo: 'carne',
        //     cantidad: 1,
        //     cantidadEnCarrito: 0,
        //     hay: true,
        // }];  DEBUG
        this.compras = []
        this.llenarListaDeCompras(); // llena la lista de compras con productos aleatorios

        // this.llenarListaDeCompras();
        this.estado = Cliente.STATES.buscando; // estado del cliente

        this.carrito = []; //array de objetos que el cliente tiene en su carrito
        this.caja = this.juego.supermercado.cajas[0]; // caja a la que va el cliente, por defecto la primera
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
                    this.objetivo = this.buscarCaja(); // busca la caja más cercana
                    // this.caja = this.buscarCaja(); // guarda la caja
                    // console.log("Caja encontrada:", this.caja);
                    this.estado = Cliente.STATES.pagando;
                }
                else {
                    this.estado = Cliente.STATES.saliendo; // si no hay nada en el carrito, se va
                }
            }
        }
        // console.log("Estado del cliente:", this.estado);
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
        if (this.estoyAlLadoDelObjetivo() && this.elPrecioEsRazonable()) {
            // console.log("Estoy al lado del objetivo:", this.objetivo);
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
            // this.llegue = false;
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
            return null;
        }
    }

    pagando() {
        if (this.estoyEnlaFila()) { return }
        if (this.estoyAlLadoDelaCaja()) {
            this.entrarALaFilaDeLaCaja();
        }
        else {
            this.irA(this.caja.x, this.caja.y);
        }
    }

    estoyEnlaFila() {
        // devuelve si estoy en la fila de la caja
        if (this.caja && this.caja.fila) {
            return this.caja.fila.includes(this);
        }
        return false;
    }

    estoyAlLadoDelaCaja() {
        // devuelve si la distancia a la caja es menor a DISTANCIA_DE_ACCION
        if (this.caja) {
            let distancia = this.juego.calcularDistancia(this.caja, this);
            return distancia < this.juego.grilla.anchoCelda;    // con distancia de accion se ponían tontos en la fila.
            // la fila tendría que estar dentro del "espacio de la caja", y contar como estar al lado
        }
        return false;
    }

    agarrar() {
        if (!this.objetivo) { return; }
        this.carrito.push(this.objetivo);
        this.compras.find(compra => compra.tipo === this.objetivo.tipo).cantidadEnCarrito++;
        this.juego.supermercado.quitarProductoDeEstante(this.objetivo);

        this.objetivo = null;
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
        if (!this.activo) return; // si no está activo, no actualiza
        if (this.x == 0 && this.y == 0 && this.estado == Cliente.STATES.saliendo) {
            console.warn("Cliente está saliendo pero no se movió. No actualizando.");
            this.sacarDelUniverso();
            return;
        } // si está saliendo y no se movió, no actualiza
        // if (!this.reproduciendoAnimacionIninterrumpible) {
        this.finiteStateMachine();
        this.actuarSegunEstado();

        super.update();
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

    elPrecioEsRazonable() {
        if (!this.objetivo || !this.objetivo.precio) return false; // si no hay objetivo o no hay precio
        let precioBase = productos[this.objetivo.tipo].precio;
        let precioReal = this.objetivo.precio;
        return precioReal - precioBase < this.queCaroQueEstaTodoQueCosaEstePais * this.objetivo.prioridad;
    }

    buscarCaja() {
        if (this.caja) return this.caja; // si ya tengo una caja, voy ahí
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

    entrarALaFilaDeLaCaja() {
        if (this.caja.fila) {
            this.caja.fila.push(this);
            this.caja.irAPosicionEnLaFila(this);
        }
    }

    saliendo() {
        // if (this.adentro) { this.objetivo = this.juego.supermercado.puerta; }
        // else {
        //     this.objetivo = this.juego.supermercado.finDelMapa();
        // }
        const celda = this.juego.grilla.celdaFuera
        this.irA(celda.centro.x, celda.centro.y); // sale del mapa, se va a una posición fuera del mapa
        this.objetivo = { x: celda.centro.x, y: celda.centro.y }; // posición fuera del mapa
    }

    pagar() {
        let timeout = setTimeout(() => {
            this.caja.atendiendo = false;
            this.yaPague = true;
            clearTimeout(timeout);
        }, this.carrito.length * 1000 > 7500 ? 7500 : this.carrito.length * 1000); // simula el tiempo de pago
        // this.supermercado.cobrar(UNA VENTA) // cuando se implementen las ventas, acá hay que poner eso. creo que la venta tiene método pagar
        this.juego.supermercado.sumarPlata(this.totalAPagar());
    }

    totalAPagar() {
        // devuelve el total a pagar por el carrito
        let total = 0;
        for (let i = 0; i < this.carrito.length; i++) {
            total += this.carrito[i].precio;
        }
        return total;
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