class Protagonista extends Persona {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.container.name = "protagonista";

        this.container.tint = 0xc915ee;
        this.velocidadMaxima = 3;
        this.accMax = 0.33;
        this.valorFriccion = 0.95;

        this.cargarSpritesAnimados()
    }

    update() {
        if (this.muerta) return;

        this.moverseSegunTeclado();

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

    async cargarSpritesAnimados() {
        //cargo el json
        let texture = await PIXI.Assets.load("idle.png");

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(2);
        // this.sprite.x = 50
        // this.sprite.y = 50
        this.sprite.anchor.set(0.5, 1)
    }
}