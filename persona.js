class Persona extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.nombre = "Persona";
        this.spritesAnimados = {};
        this.crearContainer();
    }

    crearContainer() {
        super.crearContainer();
        this.container.interactive = true;
        this.container.on("pointerdown", (e) => {
            console.log("click en", this);
        });
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    // async cargarSpritesAnimados() {
    //     //cargo el json
    //     let json = await PIXI.Assets.load("texture.json");

    //     //recorro todas las animaciones q tiene
    //     for (let animacion of Object.keys(json.animations)) {
    //         //cada animacion ahora esta en la variable animacion:
    //         //en el objeto spritesAnimados, creo q una propiedad/valor nuevo, con el nombre de la animacion, y le meto una nueva instancia de PIXI.animatedSprite
    //         this.spritesAnimados[animacion] = new PIXI.AnimatedSprite(
    //             json.animations[animacion]
    //         );

    //         //q loopee
    //         this.spritesAnimados[animacion].loop = true;
    //         //y le damos play
    //         this.spritesAnimados[animacion].play();
    //         //lo metemos en el container de esta entidad/persona
    //         this.container.addChild(this.spritesAnimados[animacion]);

    //         //el punto de anclaje abajo al medio (donde el chabon toca el piso, pq este punto lo usamos para ver quien esta adelante y quien esta atras)
    //         this.spritesAnimados[animacion].anchor.set(0.5, 1);
    //         //el frame inicial q sea random
    //         this.spritesAnimados[animacion].currentFrame = Math.floor(
    //             this.spritesAnimados[animacion].totalFrames * Math.random()
    //         );
    //     }

    //     this.cambiarDeSpriteSegunVelocidad();

    //     this.yaCargoElSprite = true;
    // }
}