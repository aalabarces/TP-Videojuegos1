class Producto extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.precio;
        this.peso;
        this.vencimiento;
        this.refrigeracion;

        this.spritesAnimados = {};
        this.crearContainer();
        this.cargarSpritesAnimados();
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    async cargarSpritesAnimados() {
        //cargo el json
        let texture = await PIXI.Assets.load("idle.png");

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(2);
        this.sprite.x = 100
        this.sprite.y = 100
        this.sprite.anchor.set(0.5, 1)
    }
}