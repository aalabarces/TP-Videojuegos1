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


        this.compras = ['carne']; //array de objetos de lista de compras
        // this.llenarListaDeCompras();
        this.carrito = []; //array de objetos que el cliente tiene en su carrito
        this.yaPague = false;
        this.plata = 0;

        this.objetivo = null; // el producto que quiere comprar
        this.pasillosTransitados = 0;

    }

    llenarListaDeCompras() {
        let cantidadDeCompras = Math.floor(Math.random() * 5) + 1; // entre 1 y 5 compras
        for (let i = 0; i < cantidadDeCompras; i++) {
            let producto = this.juego.grilla.obtenerProductoAlAzar();
            if (producto) {
                this.compras.push(producto);
            }
        }
    }

    finiteStateMachine() {
        if (this.yaPague || this.enojo > this.paciencia) {
            this.estado = Cliente.STATES.saliendo;
        }
        else {
            if (this.compras.length > 0) {
                if (this.estoyAlLadoDelProductoQueQuiero()) {
                    this.estado = Cliente.STATES.agarrando;
                }
                else {
                    this.estado = Cliente.STATES.comprando;
                }
            } else {
                this.estado = Cliente.STATES.pagando;
            }
        }
    }


    // entra, busca todos, va al mas cerca
    // objetos conocidos: ya sabe dónde están algunas cosas

    // guardar por qué celdas pasó, que busque la celda más cercana por la que no y vaya hasta que no haya celdas o ya tenga todas las cosas

    comprando() {
        // si no hay objetivo, buscá el primero de la lista. si hay, ir
        if (!this.objetivo) { this.objetivo = this.buscarProducto(this.compras[0]) }
        else {
            this.irA(this.objetivo.x, this.objetivo.y);
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
        this.agregarProducto(this.objetivo);
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
        this.carrito.push(producto);
    }

    quitarProducto(producto) {
        let index = this.compras.indexOf(p => p.tipo == producto.tipo);
        if (index != -1) {
            this.compras.splice(index, 1);
        }
    }

    buscarProducto(producto) {
        // console.log(this.juego.grilla.obtenerCeldaEnPosicion(this.x, this.y))
        const productoCerca = this.celda.buscarProducto(producto);
        if (productoCerca) {
            return this.objetivo;
        }
        else {
            // si no está en la celdas vecinas, no lo busca más. cómo hacer que "deambule"?
            if (this.celda.siguienteCeldaEnElCamino()) {
                this.irA(this.celda.siguienteCeldaEnElCamino().x, this.celda.siguienteCeldaEnElCamino().y);
            }
            else {
                this.enojo += this.MULTIPLICADOR_DE_ENOJO;
                this.quitarProducto(this.compras[0]); //sacar de la lista
            }
        }
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
        // devuelve si la distancia al producto que quiero es menor a DISTANCIA_DE_ACCION
        // console.log("Producto buscado:", producto);
        if (this.objetivo) {
            let distancia = this.juego.calcularDistancia(producto, this);
            return distancia < this.DISTANCIA_DE_ACCION;
        }
        return false;
    }

    estoyAlLadoDeLaCaja() {
        if (this.juego.caja) {  // tendría que ser this.juego.supermercado.caja?
            let distancia = this.juego.calcularDistancia(this.juego.caja, this);
            return distancia < this.DISTANCIA_DE_ACCION;
        }
        return false;
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