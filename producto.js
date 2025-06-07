class Producto extends Entidad {
    constructor(x, y, juego, tipo) {
        super(x, y, juego);

        this.tipo = tipo || listaProductos[Math.floor(Math.random() * listaProductos.length)];
        this.precio = productos[tipo].precio;
        this.peso = productos[tipo].peso;
        this.vencimiento = productos[tipo].vencimiento; // dias
        this.refrigeracion = productos[tipo].refrigeracion;
        this.fabricacion;

        this.CONSTANTE_DE_ESCALADO = 0.05
        this.spritesAnimados = {};
        this.crearContainer();
        this.cargarSprites();
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    async cargarSprites() {
        let texture = await PIXI.Assets.load(productos[this.tipo].sprite);
        console.log(productos[this.tipo].sprite, texture);
        this.sprite = new PIXI.Sprite(texture);
        this.container.addChild(this.sprite);
        this.sprite.scale.set(1 * this.CONSTANTE_DE_ESCALADO);
        this.sprite.anchor.set(0.5, 1);
        this.yaCargoElSprite = true;
    }

}

const listaProductos = [
    "pan",
    "leche",
    "carne",
    "verdura",
    "agua",
    "huevos"
];
const productos = {
    "pan": {
        precio: 50,
        peso: 0.5,
        vencimiento: 3, // dias
        refrigeracion: false,
        sprite: "assets/pan.png"
    },
    "leche": {
        precio: 100,
        peso: 1,
        vencimiento: 7, // dias
        refrigeracion: true,
        sprite: "assets/leche.png"
    },
    "carne": {
        precio: 200,
        peso: 2,
        vencimiento: 5, // dias
        refrigeracion: true,
        sprite: "assets/carne.png"
    },
    "verdura": {
        precio: 30,
        peso: 0.3,
        vencimiento: 4, // dias
        refrigeracion: false,
        sprite: "assets/verdura.png"
    },
    "agua": {
        precio: 20,
        peso: 1,
        vencimiento: 10, // dias
        refrigeracion: false,
        sprite: "assets/agua.png"
    },
    "huevos": {
        precio: 80,
        peso: 0.2,
        vencimiento: 14, // dias
        refrigeracion: false,
        sprite: "assets/huevo.png"
    },
};