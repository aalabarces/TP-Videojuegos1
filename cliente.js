class Cliente extends Persona {
    static STATES = {
        comprando: "comprando",
        pagando: "pagando",
        saliendo: "saliendo",
        buscando: "buscando",
        agarrando: "agarrando",
        tentado: "tentado"
    };

    constructor(x, y, juego) {
        super(x, y, juego);

        this.container.name = "cliente";
        this.container.tint = 0x00ff00;
        this.velocidadMaxima = 1;
        this.accMax = 0.33;
        this.valorFriccion = 0.95;

        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 10;

        this.MULTIPLICADOR_DE_AUTOCONTROL = 1.5;
        this.MULTIPLICADOR_DE_ENOJO = 1;
        //tendrían que escalar según cantidad de veces que pasó (enojarse, tentarse)


        this.compras = ['carne']; //array de objetos de compras
        // this.llenarListaDeCompras();
        this.yaPague = false;
        this.plata = 0; // dinero que tiene el cliente




    }

    llenarListaDeCompras() {
        let cantidadDeCompras = Math.floor(Math.random() * 5) + 1; // entre 1 y 5 compras
        for (let i = 0; i < cantidadDeCompras; i++) {
            let producto = this.juego.grilla.obtenerProductoAlAzar();
            if (producto) {
                this.compras.push(producto);
            }
        }
        this.estado = Cliente.STATES.buscando;
    }

    finiteStateMachine() {
        if (this.yaPague || this.enojo > this.paciencia) {
            this.estado = Cliente.STATES.saliendo;
        }
        else {
            if (this.compras.length > 0) {
                this.estado = Cliente.STATES.comprando;
            } else {
                this.estado = Cliente.STATES.pagando;
            }
        }
    }

    comprando() {
        if (this.estoyAlLadoDelProductoQueQuiero()) {
            this.estado = Cliente.STATES.agarrando;
        }
        else {
            this.estado = Cliente.STATES.buscando;
        }
    }

    buscando() {
        // console.log("Buscando producto:", this.compras[0]);
        // if (this.veoAlgoQueMeTienta() && this.tentacion > this.autocontrol * this.MULTIPLICADOR_DE_AUTOCONTROL) {
        //     this.estado = Cliente.STATES.tentado;
        // }
        /*else*/ if (this.hayProducto(this.compras[0])) {
            this.estado = Cliente.STATES.comprando;
        }
        else {
            this.enojo += MULTIPLICADOR_DE_ENOJO;
            this.quitarProducto(this.compras[0]); //sacar de la lista
        }
    }

    pagando() {
        if (this.estoyAlLadoDeLaCaja()) {
            this.pagar();
        }
        else {
            this.irACaja();
        }
    }

    agarrando() {
        this.agregarProducto(this.buscarProducto(this.compras[0]));
        this.quitarProducto(this.compras[0]);
    }

    actuarSegunEstado() {
        // console.log("Estado actual:", this.estado);
        switch (this.estado) {
            case Cliente.STATES.comprando:
                this.comprando();
                break;
            case Cliente.STATES.pagando:
                this.pagando();
                break;
            case Cliente.STATES.saliendo:
                this.saliendo();
                break;
            case Cliente.STATES.buscando:
                this.buscando();
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


    agregarProducto(producto) {
        this.compras.push(producto);
    }

    quitarProducto(producto) {
        let index = this.compras.indexOf(p => p.tipo == producto.tipo);
        if (index != -1) {
            this.compras.splice(index, 1);
        }
    }

    buscarProducto(producto) {
        // console.log(this.juego.grilla.obtenerCeldaEnPosicion(this.x, this.y))
        return this.juego.grilla.obtenerCeldaEnPosicion(this.x, this.y).buscarProducto(producto);
    }

    hayProducto(producto) {
        return this.buscarProducto(producto) != undefined;
    }

    update() {
        if (this.muerta) return;

        super.update();
        this.finiteStateMachine();
        this.actuarSegunEstado();
    }

    render() {
        if (!this.yaCargoElSprite) return;
        super.render();
    }

    estoyAlLadoDelProductoQueQuiero() {
        let producto = this.buscarProducto(this.compras[0]);
        // console.log("Producto buscado:", producto);
        if (producto) {
            let distancia = this.juego.calcularDistancia(producto.x, producto.y);
            return distancia < 5;
        }
        return false;
    }

    estoyAlLadoDeLaCaja() {
        if (this.juego.caja) {
            let distancia = this.juego.calcularDistancia(this.juego.caja.x, this.juego.caja.y);
            return distancia < 5;
        }
        return false;
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