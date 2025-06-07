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
        this.productos = [];
        this.almacenamientos = [];
        this.cajas = [];
        this.protagonista = null;

        this.grilla = new Grilla(this, 100);
        this.supermercado = new Supermercado(this);

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

        this.crearUI();
    }

    empezar() {
        this.ponerProtagonista();
        this.poner_Personas(5);
        this.ponerCaja();
        this.ponerEstante();
        this.ponerCarne();
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
        this.ui.dinero.text = this.supermercado.dinero;
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
            let persona = new Cliente(x, y, this);
            this.containerPrincipal.addChild(persona.container);
            this.personas.push(persona);
        }
    }

    ponerCaja() {
        let caja = new Caja(300, 300, this);
        this.containerPrincipal.addChild(caja.container);
        this.cajas.push(caja);
    }

    ponerEstante() {
        let estante = new Estanteria(200, 200, this);
        this.containerPrincipal.addChild(estante.container);
        this.almacenamientos.push(estante);
    }

    ponerCarne() {
        let carne = new Producto(100, 100, this, 'carne');
        this.containerPrincipal.addChild(carne.container);
        this.productos.push(carne);
    }

    entidadesAca(x, y) {
        let array = [];
        let celda = this.grilla.obtenerCeldaEnPosicion(x, y);
        for (let i = 0; i < celda.entidadesAca.length; i++) {
            if (celda.entidadesAca[i].x == x && celda.entidadesAca[i].y == y) {
                array.push(celda.entidadesAca[i])
            }
        }
        console.log("entidadesAca", array, celda);
        return array;
    }

    cuandoHaceClick(evento) {
        // caso según qué click!!
        const ent = this.entidadesAca(evento.x, evento.y);
        ent.forEach(entidad => entidad.serClickeado());
        // después caso según dónde clickeó
        this.protagonista.destinoX = evento.x;
        this.protagonista.destinoY = evento.y;
        //guardar el objeto sobre el que se hizo click para accionar cuando llegue
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

    crearUI() {
        const ui = new PIXI.Container();
        ui.name = "ui";
        ui.zIndex = 1000;
        this.app.stage.addChild(ui);
        this.ui = ui;

        this.crearBoxDeDatos();
    }

    crearBoxDeDatos() {
        const box = new PIXI.Graphics();
        box.beginFill(0x000000, 0.5);
        box.drawRect(0, 0, 200, 100);
        box.endFill();
        box.x = this.ancho - 210;
        box.y = this.alto - 110;
        this.ui.addChild(box);

        const texto = new PIXI.Text("Dinero:", { fontSize: 16, fill: 0xffffff });
        texto.x = this.ancho - 200;
        texto.y = this.alto - 100;
        this.ui.addChild(texto);

        const dinero = new PIXI.Text("0", { fontSize: 16, fill: 0xffffff });
        dinero.x = this.ancho - 200;
        dinero.y = this.alto - 80;
        this.ui.addChild(dinero);
        this.ui.dinero = dinero;
    }

    calcularDistancia(punto1, punto2) {
        const dx = punto2.x - punto1.x;
        const dy = punto2.y - punto1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}