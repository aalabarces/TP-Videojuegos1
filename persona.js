class Persona extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.spritesAnimados = {};

        this.compras = []; //array de objetos de compras

        this.crearContainer();
        this.cargarSpritesAnimados();
        this.crearPersonalidad();
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
            });
        // this.prioridad = objetoRandom();
        // this.listaDeCompras = crearListaDeCompras(); //array de objetos de compras
        // this.listaDeCompras.forEach((compra) => {
        //     compra.cantidad = Math.floor(Math.random() * 5) + 1; //cantidad random entre 1 y 5
        // });
        // this.plata = Math.floor(Math.random() * 1000) + 1; //plata random entre 1 y 1000
    }

    showInfo() {
        super.showInfo();
        const dc = this.juego.debugContainer    //DebugContainer
        dc.innerHTML += `<div class="separador"></div>`
        dc.innerHTML += `<div>Nombre: ${this.titulo} ${this.nombre} ${this.apellido}</div>`
        dc.innerHTML += `<div>Email: ${this.email}</div>`
        dc.innerHTML += `<div>Genero: ${this.genero}</div>`
        dc.innerHTML += `<div>Trabajo: ${this.trabajo}</div>`
        dc.innerHTML += `<div>Frase: ${this.frase}</div>`
        dc.innerHTML += `<img src="${this.imagen}"/>`

    }
}