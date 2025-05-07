class Almacenamiento extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.contenido = [];
        this.capacidad = 100; // Capacidad máxima del almacenamiento
        this.velocidadMaxima = 0; // Velocidad máxima del almacenamiento (no se mueve)
        this.accMax = 0; // Aceleración máxima del almacenamiento (no se mueve)

        this.cargarSpritesAnimados(null);
    }

    agregarProducto(producto) {
        if (entra_(producto)) {
            this.contenido.push(producto);
        }
    }

    retirarProducto(producto) {
        let index = this.contenido.indexOf(p => p.tipo == producto.tipo);
        if (index != -1) {
            this.contenido.splice(index, 1);
        }
    }

    hayProducto(tipo) {
        return this.contenido.some(producto => producto.tipo == tipo);
    }


    pesoDelContenido() {
        let total = 0
        this.contenido.forEach(producto => {
            total += producto.peso;
        });
        return total;
    }

    entra_(producto) {
        return this.pesoDelContenido() + producto.peso <= this.capacidad;
    }

    estaLleno() {
        return this.pesoDelContenido() == this.capacidad;
    }

    async cargarSpritesAnimados(sprite) {
        //cargo el json
        let texture = await PIXI.Assets.load(sprite);

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(2);
        this.sprite.x = 100
        this.sprite.y = 100
        this.sprite.anchor.set(0.5, 1)
    }
}

class Estanteria extends Almacenamiento {

    constructor(x, y, juego) {
        super(x, y, juego);

        this.cargarSpritesAnimados("estanteria.png")

    }

    refrigerada() {
        return false;
    }
}

class Heladera extends Almacenamiento {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.cargarSpritesAnimados("heladera.png")

    }

    refrigerada() {
        return true;
    }
}

class Almacen extends Almacenamiento {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.capacidad = 500; // Capacidad máxima del almacenamiento
        this.capacidadFrio = 500; // Capacidad máxima del almacenamiento en frío
        this.contenidoFrio = [];
    }

    refrigerada() {
        return this.capacidadFrio > 0;
    }
}

class Carrito extends Almacenamiento {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.capacidad = 50; // Capacidad máxima del almacenamiento
        this.velocidadMaxima = 3; // Velocidad máxima del carrito
        this.accMax = 0.1; // Aceleración máxima del carrito
        this.cargarSpritesAnimados("carrito.png")
    }

    refrigerada() {
        return false;
    }
}