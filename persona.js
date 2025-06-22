class Persona extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 2;

        this.crearContainer();
        this.crearPersonalidad();
        this.cargarSprites();
    }

    update() {
        super.update();
        // if (!this.destinoX && Math.random() < 0.1 && this.juego.contadorDeFrame % 60 == 0) {
        //     this.destinoAlAzar();
        // }
    }

    render() {
        if (!this.yaCargoElSprite) return;
        super.render();
    }
    async cargarSprites() {
        //cargo el json
        let texture = await PIXI.Assets.load("assets/Conejo.png");

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(2);
        this.sprite.x = 100
        this.sprite.y = 100
        this.sprite.anchor.set(0.5, 1)
        this.yaCargoElSprite = true;
    }

    // async cargarSpritesAnimados() {
    //     //cargo el json
    //     let sprite = this.queSprite(this.genero);
    //     let json = await PIXI.Assets.load("./animaciones/texture.json");

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

    queSprite(genero) {
        if (genero == "M") {
            return "civil";
        }
        else return "taylor";
    }

    crearPersonalidad() {
        fetch("./MOCK_DATA.json")
            .then((response) => response.json())
            .then((data) => {
                const i = Math.floor(Math.random() * data.length);
                this.nombre = data[i].first_name;
                this.apellido = data[i].last_name;
                this.email = data[i].email;
                this.genero = data[i].gender;
                this.titulo = data[i].title;
                this.trabajo = data[i].job;
                this.frase = data[i].catchphrase;
                this.imagen = data[i].avatar;
                this.velocidadMaxima = Math.floor(Math.random() * 5) + 1; //velocidad random entre 1 y 5
            });

        //todos estos podrían tener un multiplicador/divisor por nivel. mientras más avanzado, menos pacientes, más autocontrolados
        this.plata = Math.floor(Math.random() * 1000) + 1; //plata random entre 1 y 1000
        this.paciencia = Math.floor(Math.random() * 100) + 1; //paciencia random entre 1 y 100
        // this.tentacion = Math.floor(Math.random() * 100) + 1; //tentacion random entre 1 y 100
        // this.autocontrol = Math.floor(Math.random() * 100) + 1; //autocontrol random entre 1 y 100

    }

    destinoAlAzar() {
        this.destinoX = Math.floor(Math.random() * this.juego.ancho);
        this.destinoY = Math.floor(Math.random() * this.juego.alto);
    }

    miData() {
        return {
            ...super.miData(),
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            genero: this.genero,
            titulo: this.titulo,
            trabajo: this.trabajo,
            frase: this.frase,
            imagen: this.imagen,
            plata: this.plata,
            paciencia: this.paciencia,
            sprite: this.sprite,
        }
    }
}