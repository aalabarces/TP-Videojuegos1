class Producto extends Entidad {
    constructor(juego, almacenamiento, tipo) {
        super(almacenamiento.x, almacenamiento.y, juego);

        this.nombre = "Producto";
        this.tipo = tipo || listaProductos[Math.floor(Math.random() * listaProductos.length)];
        console.log("Creando producto", this.tipo);
        this.precio = productos[this.tipo].precio * this.juego.supermercado.aumento[this.tipo] || 1;
        this.peso = productos[this.tipo].peso;
        this.vencimiento = productos[this.tipo].vencimiento; // dias
        this.refrigeracion = productos[this.tipo].refrigeracion;
        this.prioridad = productos[this.tipo].prioridad;
        this.fabricacion;

        this.dondeEstoy = null; // almacenamiento donde estoy
        this.ponerEnAlmacenamiento(almacenamiento);

        this.CONSTANTE_DE_ESCALADO = 0.05
        // this.spritesAnimados = {};
        // this.cargarSprites();
    }

    ponerEnAlmacenamiento(almacenamiento) {
        if (almacenamiento && almacenamiento.entra_(this)) {
            almacenamiento.agregarProducto(this);
            this.dondeEstoy = almacenamiento;
        }
        else {
            console.warn("No se pudo poner el producto en el almacenamiento", this.tipo, almacenamiento);
            // cuando haya una forma de poner productos, no debiera dejarte crear un producto que no entre
        }
    }

    crearContainer() {
        return null; // no se usa, pero es necesario para que funcione el constructor de Entidad
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    async cargarSprites() {
        let texture = await PIXI.Assets.load(productos[this.tipo].sprite);
        // console.log(productos[this.tipo].sprite, texture);
        this.sprite = new PIXI.Sprite(texture);
        this.container.addChild(this.sprite);
        this.sprite.scale.set(1 * this.CONSTANTE_DE_ESCALADO);
        this.sprite.anchor.set(0.5, 1);
        this.yaCargoElSprite = true;
    }

}

// variables globales de stats base
const listaProductos = [
    "pan",
    "leche",
    "carne",
    "verdura",
    "agua",
    "huevos"
];
let productos = {
    "pan": {
        precio: 50,
        peso: 0.5,
        vencimiento: 5, // dias
        refrigeracion: false,
        prioridad: 1,
        sprite: "assets/pan.png"
    },
    "leche": {
        precio: 100,
        peso: 1,
        vencimiento: 7, // dias
        refrigeracion: true,
        prioridad: 2,
        sprite: "assets/leche.png"
    },
    "carne": {
        precio: 200,
        peso: 2,
        vencimiento: 5, // dias
        refrigeracion: true,
        prioridad: 5,
        sprite: "assets/carne.png"
    },
    "verdura": {
        precio: 30,
        peso: 0.3,
        vencimiento: 5, // dias
        refrigeracion: false,
        prioridad: 5,
        sprite: "assets/verdura.png"
    },
    "agua": {
        precio: 20,
        peso: 1,
        vencimiento: 0, // dias
        refrigeracion: false,
        prioridad: 4,
        sprite: "assets/agua.png"
    },
    "huevos": {
        precio: 80,
        peso: 0.2,
        vencimiento: 0, // dias
        refrigeracion: false,
        prioridad: 1,
        sprite: "assets/huevo.png"
    },
};