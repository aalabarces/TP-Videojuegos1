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
        this.protagonista = null;

        this.PLATA_INICIAL = 1000;

        this.CONSTANTE_DE_ACELERACION = 1; // cuanto te empujan las flechas y puerta

        this.app
            .init({ width: this.ancho, height: this.alto, background: "#ffffff" })
            .then(() => {
                this.pixiListo();
            });
    }

    async pixiListo() {
        console.log("pixi listo");

        document.body.appendChild(this.app.canvas);

        this.ponerEventListeners();

        window.__PIXI_APP__ = this.app;

        this.containerPrincipal = new PIXI.Container();
        this.containerPrincipal.name = "container_principal";
        this.app.stage.addChild(this.containerPrincipal);

        await this.crearGrilla().then(() => {
            this.supermercado = new Supermercado(this);

            this.app.stage.sortableChildren = true;

            // await this.ponerFondo();

            this.crearUI();
            this.empezar();
        })

    }

    crearGrilla() {
        return new Promise((resolve) => {
            this.grilla = new Grilla(this, 60);
            resolve(this.grilla);
        });
    }

    empezar() {
        console.log("empezando juego");
        this.ponerProtagonista();
        this.poner_Personas(1);
        this.ponerCaja();
        this.ponerEstante();
        this.ponerCarne();
        this.app.ticker.add(() => this.gameLoop());
    }

    gameLoop() {
        this.contadorDeFrame++;
        // this.moverCamara();
        this.actuarSegunTeclasPresionadas();
        for (let persona of this.personas) {
            persona.update();
        }
        for (let producto of this.supermercado.productos) {
            producto.update();
        }
        for (let almacen of this.supermercado.estanterias) {
            almacen.update();
        }
        for (let caja of this.supermercado.cajas) {
            caja.update();
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
        this.fondo.zIndex = -1000; // Asegurarse de que el fondo esté detrás de todo

        // Añadir al escenario
        this.containerPrincipal.addChild(this.fondo);
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
        // if (!this.fondo) return;
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
        // if (!this.fondo) return;
        for (let i = 0; i < cuantas; i++) {
            let x = Math.floor(Math.random() * this.ancho);
            let y = Math.floor(Math.random() * this.alto);
            let persona = new Cliente(x, y, this);
            this.containerPrincipal.addChild(persona.container);
            this.personas.push(persona);
        }
    }

    ponerCaja() {
        let anchoCelda = this.grilla.anchoCelda;
        let caja = new Caja(5 * anchoCelda, 13 * anchoCelda, this);
        this.containerPrincipal.addChild(caja.container);
        this.supermercado.cajas.push(caja);
    }

    ponerEstante() {
        let anchoCelda = this.grilla.anchoCelda;
        let estante = new Estanteria(2 * anchoCelda, 9 * anchoCelda, this);
        this.containerPrincipal.addChild(estante.container);
        this.supermercado.estanterias.push(estante);
    }

    ponerCarne() {
        for (let i = 0; i < 5; i++) {
            let carne = new Producto(50 * i + 70, 50 * i + 70, this, 'carne');
            this.containerPrincipal.addChild(carne.container);
            this.supermercado.productos.push(carne);
        }
    }

    entidadesAca(x, y) {
        let celda = this.grilla.obtenerCeldaEnPosicion(x, y);
        return celda.entidadesAca;
    }

    cuandoHaceClick(evento) {
        // caso según qué click!!
        console.log("Click en:", evento.x, evento.y);
        console.log(this.grilla.obtenerCeldaEnPosicion(evento.x, evento.y));
        this.grilla.obtenerCeldaEnPosicion(evento.x, evento.y).clickeada = true;
        this.grilla.obtenerCeldaEnPosicion(evento.x, evento.y).render(this.grilla.borde);
        const ent = this.entidadesAca(evento.x, evento.y);
        ent.forEach(entidad => entidad.serClickeado());
        // después caso según dónde clickeó
        this.protagonista.objetivo = { x: evento.x, y: evento.y };
        this.protagonista.irA(evento.x, evento.y);
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
        // Crear un contenedor para la UI
        const ui = new PIXI.Container();
        ui.name = "ui";
        ui.zIndex = 1000;
        this.containerPrincipal.addChild(ui);
        this.ui = ui;

        this.crearBoxDeDatos();
    }

    crearBoxDeDatos() {
        // Crear un box con datos para la UI
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

    mostrarDebug(data) {
        console.log("Mostrando debug:", data);
    }
}