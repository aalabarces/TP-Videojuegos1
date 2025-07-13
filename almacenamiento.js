class Almacenamiento extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.contenido = [];
        this.capacidad = 100; // Capacidad máxima del almacenamiento
        this.velocidadMaxima = 0; // Velocidad máxima del almacenamiento (no se mueve)
        this.accMax = 0; // Aceleración máxima del almacenamiento (no se mueve)

        this.cargarSprites();
    }

    agregarProducto(producto) {
        if (this.entra_(producto)) {
            this.contenido.push(producto);
            this.juego.supermercado.productos.push(producto);
        }
    }

    // para agregar y para retirar: se saca del almacenamiento ¡Y! del supermercado
    // el supermercado tiene un array con todos los productos para buscar más fácil
    // y cada producto sabe dónde está

    retirarProducto(producto) {
        let index = this.contenido.indexOf(p => p.tipo == producto.tipo);
        let indexSupermercado = this.juego.supermercado.productos.indexOf(producto)
        if (index != -1 && indexSupermercado != -1) {
            this.contenido.splice(index, 1);
            this.juego.supermercado.productos.splice(indexSupermercado, 1);
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


}

class Estanteria extends Almacenamiento {

    constructor(x, y, juego) {
        super(x, y, juego);

        this.tipo = "estanteria";
        this.container.name = "estanteria";

        this.precio = 100; // Precio de la estantería
    }
    async cargarSprites() {
        const texture = await PIXI.Assets.load('assets/estante.png');
        this.sprite = new PIXI.Sprite(texture);
        this.container.addChild(this.sprite);
        
        const anchoCelda = this.juego.grilla.anchoCelda;
        // Escala uniforme que hace que el ancho del sprite sea igual a la celda
        const escala = anchoCelda / texture.width;
        this.sprite.scale.set(escala);
        
        // Alinear correctamente dentro de la celda
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.anchor.set(0, 0);
        
        this.yaCargoElSprite = true;
    }

    refrigerada() {
        return false;
    }
}

class Heladera extends Almacenamiento {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.tipo = "heladera";
        this.container.name = "heladera";

        this.cargarSprites("assets/heladera.png")

        this.precio = 200; // Precio de la heladera
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
        this.tipo = "almacen";
    }

    async cargarSprites() {
        //cargo el json
        let texture = await PIXI.Assets.load("assets/estante.png");

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(1);
        this.sprite.x = 0
        this.sprite.y = 0
        this.sprite.anchor.set(0, 0)
        this.yaCargoElSprite = true;
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
        this.cargarSprites("assets/carrito.png")
        this.tipo = "carrito";
    }

    refrigerada() {
        return false;
    }
}