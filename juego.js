class Juego {
    constructor() {
        this.app = new PIXI.Application();
        this.contadorDeFrame = 0;
        this.ancho = window.innerWidth;
        this.alto = window.innerHeight;

        this.mouse = { x: 0, y: 0 };

        this.teclado = {};

        this.debug = false;
        this.debugContainer = document.getElementById('debug');
        this.seleccionado;

        this.gravedad = { x: 0, y: 3 };

        this.personas = [];

        this.app
            .init({ width: this.ancho, height: this.alto, background: "#ffffff" })
            .then(() => {
                this.pixiListo();
            });
    }

    pixiListo() {
        console.log("pixi listo");

        document.body.appendChild(this.app.canvas);

        this.ponerEventListeners();

        window.__PIXI_APP__ = this.app;

        this.containerPrincipal = new PIXI.Container();
        this.containerPrincipal.name = "el container principal";
        this.app.stage.addChild(this.containerPrincipal);

        this.ponerFondo();

        this.app.stage.sortableChildren = true;
    }

    empezar() {
        this.ponerProtagonista();
        this.poner_Personas(5);
        this.app.ticker.add(() => this.gameLoop());
    }

    gameLoop() {
        this.contadorDeFrame++;
        this.moverCamara();
        this.actuarSegunTeclasPresionadas();
        for (let persona of this.personas) {
            persona.update();
        }
        this.protagonista.update();

        if (this.debug && this.seleccionado && this.contadorDeFrame % 60 == 0) {
            //borrar todo y crearlo de nuevo cada 60 frames no funciona, borra la foto cada vez
            this.seleccionado.showInfo();
        }

        for (let persona of this.personas) {
            persona.render();
        }
        this.protagonista.render();
    }

    async ponerFondo() {
        // Cargar la textura
        let textura = await PIXI.Assets.load("bg.png");

        // Crear el TilingSprite con la textura y dimensiones
        // this.fondo = new PIXI.TilingSprite(textura, this.ancho, this.alto);
        this.fondo = new PIXI.Sprite(textura);
        this.fondo.width = this.ancho;
        this.fondo.height = this.alto;

        // Añadir al escenario
        this.containerPrincipal.addChild(this.fondo);

        this.empezar();
    }

    ponerEventListeners() {
        window.onmousemove = (evento) => {
            this.cuandoSeMueveElMouse(evento);
        };

        window.onmousedown = (evento) => {
            this.cuandoHaceClick(evento);
        }

        window.onkeydown = (eventoTeclado) => {
            let letraApretada = eventoTeclado.key.toLowerCase();
            this.teclado[letraApretada] = true;
        };

        window.onkeyup = (eventoTeclado) => {
            let letraApretada = eventoTeclado.key.toLowerCase();
            delete this.teclado[letraApretada];
        };
    }

    cuandoSeMueveElMouse(evento) {
        this.mouse.x = evento.x;
        this.mouse.y = evento.y;
    }

    moverCamara() {
        if (!this.fondo) return;
        if (!this.protagonista) return;
        if (!this.containerPrincipal) return;
        // this.containerPrincipal.x = this.protagonista.x;
        // this.containerPrincipal.y = this.protagonista.y;

        const cuanto = 0.033333;

        const valorFinalX = -this.protagonista.x + this.ancho / 2;
        const valorFinalY = -this.protagonista.y + this.alto / 2;

        this.containerPrincipal.x -=
            (this.containerPrincipal.x - valorFinalX) * cuanto;
        this.containerPrincipal.y -=
            (this.containerPrincipal.y - valorFinalY) * cuanto;

        if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
        if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;

        //limite derecho
        if (this.containerPrincipal.x < -this.fondo.width + this.ancho) {
            this.containerPrincipal.x = -this.fondo.width + this.ancho;
        }

        if (this.containerPrincipal.y < -this.fondo.height + this.alto) {
            this.containerPrincipal.y = -this.fondo.height + this.alto;
        }
    }

    ponerProtagonista() {
        this.protagonista = new Protagonista(500, 500, this);
        this.containerPrincipal.addChild(this.protagonista.container);
    }

    poner_Personas(cuantas) {
        if (!this.fondo) return;
        for (let i = 0; i < cuantas; i++) {
            let x = Math.random() * this.fondo.width;
            let y = Math.random() * this.fondo.height;
            let persona = new Persona(x, y, this);
            this.containerPrincipal.addChild(persona.container);
            this.personas.push(persona);
        }
    }

    cuandoHaceClick(evento) {
        // caso según qué click!!
        let objetoAca = this.objetoAca(evento.x, evento.y);
        console.log(objetoAca);
        // después caso según dónde clickeó
        this.protagonista.destinoX = evento.x;
        this.protagonista.destinoY = evento.y;
        //guardar el objeto sobre el que se hizo click para accionar cuando llegue
    }

    objetoAca(x, y) {
        const boundary = new PIXI.EventBoundary(this.app.stage);
        return boundary.hitTest(x, y);
    }

    actuarSegunTeclasPresionadas() {
        //d -> mostrar / ocultar debug
        if (this.teclado["d"]) {
            this.debug = !this.debug;
            this.debugContainer.classList.toggle('hide')
        }

        if (this.teclado['b']) {
            this.protagonista.cambiarSpriteAnimado('birra');
        }
        if (this.teclado['j']) {
            this.protagonista.cambiarSpriteAnimado('jump');
        }
        if (this.teclado['p']) {
            this.protagonista.cambiarSpriteAnimado('pucho');
        }
        if (this.teclado['w']) {
            this.protagonista.cambiarSpriteAnimado('walk');
        }

    }
}