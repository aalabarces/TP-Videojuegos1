class Protagonista extends Persona {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.container.name = "protagonista";

        // this.container.tint = 0xc915ee;
        this.velocidadMaxima = 3;
        this.accMax = 0.33;
        this.valorFriccion = 0.95;

        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 10;
    }

    render() {
        if (!this.yaCargoElSprite) return;
        super.render();
        // this.cambiarVelocidadDelSpriteSegunVelocidadLineal();
        // this.cambiarDeSpriteSegunVelocidad();
    }

    destinoAlAzar() { }


    update() {
        if (this.muerta) return;

        super.update();

        this.limitarPosicion();
    }

    moverseSegunTeclado() {
        let accX = 0;
        let accY = 0;

        // Detectar teclas presionadas
        if (this.juego.teclado.w) accY = -1;
        if (this.juego.teclado.s) accY = 1;
        if (this.juego.teclado.a) accX = -1;
        if (this.juego.teclado.d) accX = 1;

        if (accX !== 0 && accY !== 0) {
            // Si nos movemos en diagonal, normalizar el vector
            accX *= 0.707;
            accY *= 0.707;
        }

        this.aplicarAceleracion(accX, accY);
    }

    limitarPosicion() {
        if (!this.juego.fondo) return;
        if (this.x > this.juego.fondo.width) {
            this.x = this.juego.fondo.width;
            this.velX = 0;
        }
    }

    async cargarSprites() {
        //cargo el json
        let json = await PIXI.Assets.load("./assets/boca/boca-sheet2.json");

        //recorro todas las animaciones q tiene
        for (let animacion of Object.keys(json.animations)) {
            //cada animacion ahora esta en la variable animacion:
            //en el objeto spritesAnimados, creo q una propiedad/valor nuevo, con el nombre de la animacion, y le meto una nueva instancia de PIXI.animatedSprite
            this.spritesAnimados[animacion] = new PIXI.AnimatedSprite(
                json.animations[animacion]
            );

            this.spritesAnimados[animacion].scale.set(10);
            this.spritesAnimados[animacion].animationSpeed = 0.1;

            //q loopee
            this.spritesAnimados[animacion].loop = true;
            //y le damos play
            this.spritesAnimados[animacion].play();
            //lo metemos en el container de esta entidad/persona
            this.container.addChild(this.spritesAnimados[animacion]);

            //el punto de anclaje abajo al medio (donde el chabon toca el piso, pq este punto lo usamos para ver quien esta adelante y quien esta atras)
            this.spritesAnimados[animacion].anchor.set(0.5, 1);
            //el frame inicial q sea random
            this.spritesAnimados[animacion].currentFrame = Math.floor(
                this.spritesAnimados[animacion].totalFrames * Math.random()
            );
        }

        // this.spritesAnimados["walk"].loop = true;

        // this.cambiarDeSpriteSegunVelocidad();
        this.cambiarSpriteAnimado("pucho");
        this.yaCargoElSprite = true;
    }

    cambiarSpriteAnimado(key) {
        this.spriteSeleccionado = key;
        //extraemos las keys del objeto spritesAnimados
        const keys = Object.keys(this.spritesAnimados);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.spritesAnimados[key].visible = false;
        }

        this.sprite = this.spritesAnimados[key];
        this.sprite.visible = true;
    }

    cambiarDeSpriteSegunVelocidad() {
        if (this.calcularVelocidadLineal() > 0) {
            this.cambiarSpriteAnimado("walk");
        } else {
            this.cambiarSpriteAnimado("pucho");
        }
    }
    cambiarVelocidadDelSpriteSegunVelocidadLineal() {
        this.sprite.animationSpeed = this.calcularVelocidadLineal() * 0.13;
    }
}