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

        // Sistema de colocación
        this.colocacionEnProgreso = null;

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

        await this.traerDataPersonas();
        // await this.precargarTexturas();
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
        this.ponerCaja();
        this.poner_Personas(15);
        this.ponerEstante();
        this.ponerProductos(20);
        this.crearBotonesUI(); // Crear botones de UI
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
        if (!this.supermercado) return;
        let anchoCelda = this.grilla.anchoCelda;
        let estante = new Estanteria(2 * anchoCelda, 9 * anchoCelda, this);
        this.containerPrincipal.addChild(estante.container);
        this.supermercado.estanterias.push(estante);
    }

    ponerProductos(cantidad) {
        if (!this.supermercado) return;
        for (let i = 0; i < cantidad; i++) {
            let producto = new Producto(this, this.supermercado.estanterias[0]);
            // se instancia en el almacenamiento mismo
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

        // saca al protagonista de la caja si estaba en una (y después lo pone de vuelta si hizo click en una)
        this.supermercado.cajas.forEach(caja => { if (caja.empleado == this.protagonista) caja.empleado = null; });

        // this.grilla.obtenerCeldaEnPosicion(evento.x, evento.y).clickeada = true;
        this.grilla.obtenerCeldaEnPosicion(evento.x, evento.y).render(this.grilla.borde);
        const ent = this.entidadesAca(evento.x, evento.y);
        ent.forEach(entidad => {
            entidad.serClickeado();
        });

        // después caso según dónde clickeó
        this.protagonista.objetivo = { x: evento.x, y: evento.y };
        this.protagonista.irA(this.protagonista.objetivo.x, this.protagonista.objetivo.y);
        //guardar el objeto sobre el que se hizo click para accionar cuando llegue
    }

    actuarSegunTeclasPresionadas() {
        //d -> mostrar / ocultar debug
        if (this.teclado["d"]) {
            this.debug = !this.debug;
            this.debugContainer.classList.toggle('hide')
        }

        if (this.teclado['b'] && !(this.protagonista.calcularVelocidadLineal() > 0)) {
            this.protagonista.cambiarSpriteAnimado('birra');
        }
        if (this.teclado['j'] && !(this.protagonista.calcularVelocidadLineal() > 0)) {
            this.protagonista.cambiarSpriteAnimado('jump');
        }
        // if (this.teclado['p']) {
        //     this.protagonista.cambiarSpriteAnimado('pucho');
        // }
        // if (this.teclado['w']) {
        //     this.protagonista.cambiarSpriteAnimado('walk');
        // }

    }

    crearUI() {
        // Crear un contenedor para la UI
        const ui = new PIXI.Container();
        ui.name = "ui";
        ui.zIndex = 1000;
        this.containerPrincipal.addChild(ui);
        this.ui = ui;

        this.crearBoxDeDatos();
        this.crearBotonesUI();
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

    crearBotonesUI() {
        // Crear botón para colocar cajas
        const botonCaja = document.createElement('button');
        botonCaja.textContent = 'Colocar Caja';
        botonCaja.style.position = 'absolute';
        botonCaja.style.top = '10px';
        botonCaja.style.left = '10px';
        botonCaja.style.zIndex = '1000';
        botonCaja.onclick = () => this.iniciarColocacionEntidad(Caja);
        document.body.appendChild(botonCaja);

        // Crear botón para colocar estanterías
        const botonEstanteria = document.createElement('button');
        botonEstanteria.textContent = 'Colocar Estantería';
        botonEstanteria.style.position = 'absolute';
        botonEstanteria.style.top = '10px';
        botonEstanteria.style.left = '120px';
        botonEstanteria.style.zIndex = '1000';
        botonEstanteria.onclick = () => this.iniciarColocacionEntidad(Estanteria);
        document.body.appendChild(botonEstanteria);

        // Crear botón para cancelar colocación
        const botonCancelar = document.createElement('button');
        botonCancelar.textContent = 'Cancelar (ESC)';
        botonCancelar.style.position = 'absolute';
        botonCancelar.style.top = '10px';
        botonCancelar.style.left = '250px';
        botonCancelar.style.zIndex = '1000';
        botonCancelar.onclick = () => this.cancelarColocacion();
        document.body.appendChild(botonCancelar);
    }

    calcularDistancia(punto1, punto2) {
        const dx = punto2.x - punto1.x;
        const dy = punto2.y - punto1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    mostrarDebug(data) {
        console.log("Mostrando debug:", data);
    }

    traerDataPersonas() {
        // carga en this.personasData los datos de personas desde un JSON
        return new Promise((resolve) => {
            fetch("./MOCK_DATA.json")
                .then((response) => response.json())
                .then((data) => {
                    this.personasData = data;
                    console.log("Datos de personas cargados:", this.personasData);
                    resolve(this.personasData);
                })
        })
    }

    // precargarTexturas() {
    //     return new Promise((resolve) => {
    //         const texturas = [
    //             'assets/caja.png',
    //             'assets/estante.png',
    //             etc...
    //         ];

    //         PIXI.Assets.add(texturas);
    //         PIXI.Assets.load(texturas).then(() => {
    //             console.log("Texturas precargadas");
    //             resolve(true);
    //         });
    //     })
    // }

    // Sistema de colocación de entidades
    iniciarColocacionEntidad(TipoEntidad) {
        // Si ya hay una colocación en progreso, cancelarla
        if (this.colocacionEnProgreso) {
            this.cancelarColocacion();
        }

        this.colocacionEnProgreso = {
            TipoEntidad: TipoEntidad,
            spriteFantasma: null,
            containerFantasma: null,
            tamaño: this.obtenerTamañoEntidad(TipoEntidad),
            esAjustableAGrilla: this.esAjustableAGrilla(TipoEntidad)
        };

        // Crear sprite fantasma
        this.crearSpriteFantasma(TipoEntidad);
        
        // Agregar listeners
        this.activarListenersColocacion();
    }

    obtenerTamañoEntidad(TipoEntidad) {
        // Determinar el tamaño de la entidad en celdas
        if (TipoEntidad === Caja) {
            return { ancho: 1, alto: 1 };
        } else if (TipoEntidad === Estanteria || TipoEntidad === Almacenamiento) {
            return { ancho: 2, alto: 1 };
        }
        return { ancho: 1, alto: 1 }; // Default
    }

    esAjustableAGrilla(TipoEntidad) {
        // Determinar si la entidad debe ajustarse a la grilla
        return TipoEntidad === Caja || TipoEntidad === Estanteria || TipoEntidad === Almacenamiento;
    }

    async crearSpriteFantasma(TipoEntidad) {
        // Crear una instancia temporal para obtener la textura
        const instanciaTemp = new TipoEntidad(0, 0, this);
        
        // Esperar a que cargue el sprite
        while (!instanciaTemp.yaCargoElSprite) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Crear container fantasma
        this.colocacionEnProgreso.containerFantasma = new PIXI.Container();
        this.colocacionEnProgreso.spriteFantasma = new PIXI.Sprite(instanciaTemp.sprite.texture);
        
        // Configurar sprite fantasma
        this.colocacionEnProgreso.spriteFantasma.alpha = 0.5;
        this.colocacionEnProgreso.spriteFantasma.tint = 0x00ff00; // Verde translúcido
        this.colocacionEnProgreso.spriteFantasma.anchor.set(0, 0);
        this.colocacionEnProgreso.spriteFantasma.scale.set(instanciaTemp.sprite.scale.x, instanciaTemp.sprite.scale.y);
        
        // Añadir al container fantasma
        this.colocacionEnProgreso.containerFantasma.addChild(this.colocacionEnProgreso.spriteFantasma);
        this.colocacionEnProgreso.containerFantasma.zIndex = 10000; // Arriba de todo
        
        // Añadir al stage
        this.containerPrincipal.addChild(this.colocacionEnProgreso.containerFantasma);
        
        // Limpiar instancia temporal
        instanciaTemp.container.destroy();
    }

    activarListenersColocacion() {
        // Guardar referencias a los listeners originales
        this.listenerMouseMoveOriginal = window.onmousemove;
        this.listenerMouseDownOriginal = window.onmousedown;
        
        // Asignar nuevos listeners
        window.onmousemove = (evento) => this.actualizarPosicionFantasma(evento);
        window.onmousedown = (evento) => this.colocarEntidad(evento);
        
        // También escuchar tecla ESC para cancelar
        this.listenerKeyDownOriginal = window.onkeydown;
        window.onkeydown = (evento) => {
            if (evento.key === 'Escape') {
                this.cancelarColocacion();
            } else if (this.listenerKeyDownOriginal) {
                this.listenerKeyDownOriginal(evento);
            }
        };
    }

    actualizarPosicionFantasma(evento) {
        if (!this.colocacionEnProgreso || !this.colocacionEnProgreso.containerFantasma) return;
        
        let x = evento.clientX;
        let y = evento.clientY;
        
        // Ajustar a grilla si es necesario
        if (this.colocacionEnProgreso.esAjustableAGrilla) {
            const posicionGrilla = this.ajustarAGrilla(x, y, this.colocacionEnProgreso.tamaño);
            x = posicionGrilla.x;
            y = posicionGrilla.y;
            
            // Cambiar color según si la posición es válida
            if (this.esPosicionValida(posicionGrilla.x, posicionGrilla.y, this.colocacionEnProgreso.tamaño)) {
                this.colocacionEnProgreso.spriteFantasma.tint = 0x00ff00; // Verde = válido
            } else {
                this.colocacionEnProgreso.spriteFantasma.tint = 0xff0000; // Rojo = inválido
            }
        }
        
        this.colocacionEnProgreso.containerFantasma.x = x;
        this.colocacionEnProgreso.containerFantasma.y = y;
        
        // Llamar al listener original si existe
        if (this.listenerMouseMoveOriginal) {
            this.listenerMouseMoveOriginal(evento);
        }
    }

    ajustarAGrilla(x, y, tamaño) {
        const celdaX = Math.floor(x / this.grilla.anchoCelda);
        const celdaY = Math.floor(y / this.grilla.anchoCelda);
        
        return {
            x: celdaX * this.grilla.anchoCelda,
            y: celdaY * this.grilla.anchoCelda,
            celdaX: celdaX,
            celdaY: celdaY
        };
    }

    esPosicionValida(x, y, tamaño) {
        const celdaX = Math.floor(x / this.grilla.anchoCelda);
        const celdaY = Math.floor(y / this.grilla.anchoCelda);
        
        // Verificar que todas las celdas que ocupará estén libres y sean transitables
        for (let i = 0; i < tamaño.ancho; i++) {
            for (let j = 0; j < tamaño.alto; j++) {
                const celda = this.grilla.obtenerCeldaEnPosicion(
                    (celdaX + i) * this.grilla.anchoCelda,
                    (celdaY + j) * this.grilla.anchoCelda
                );
                
                if (!celda || !celda.soyTransitable() || celda.entidadesAca.length > 0) {
                    return false;
                }
            }
        }
        
        return true;
    }

    colocarEntidad(evento) {
        if (!this.colocacionEnProgreso) return;
        
        let x = evento.clientX;
        let y = evento.clientY;
        
        // Ajustar a grilla si es necesario
        if (this.colocacionEnProgreso.esAjustableAGrilla) {
            const posicionGrilla = this.ajustarAGrilla(x, y, this.colocacionEnProgreso.tamaño);
            
            if (!this.esPosicionValida(posicionGrilla.x, posicionGrilla.y, this.colocacionEnProgreso.tamaño)) {
                console.warn("Posición inválida para colocar la entidad");
                return; // No colocar si la posición no es válida
            }
            
            x = posicionGrilla.x;
            y = posicionGrilla.y;
        }
        
        // Crear la entidad real
        const nuevaEntidad = new this.colocacionEnProgreso.TipoEntidad(x, y, this);
        this.containerPrincipal.addChild(nuevaEntidad.container);
        
        // Agregar a los arrays correspondientes del supermercado
        this.agregarEntidadAlSupermercado(nuevaEntidad);
        
        console.log(`Entidad ${this.colocacionEnProgreso.TipoEntidad.name} colocada en (${x}, ${y})`);
        
        // Limpiar
        this.cancelarColocacion();
    }

    agregarEntidadAlSupermercado(entidad) {
        if (!this.supermercado) return;
        
        if (entidad instanceof Caja) {
            this.supermercado.cajas.push(entidad);
        } else if (entidad instanceof Estanteria || entidad instanceof Almacenamiento) {
            this.supermercado.estanterias.push(entidad);
        }
        // Agregar más tipos según sea necesario
    }

    cancelarColocacion() {
        if (!this.colocacionEnProgreso) return;
        
        // Remover sprite fantasma
        if (this.colocacionEnProgreso.containerFantasma) {
            this.containerPrincipal.removeChild(this.colocacionEnProgreso.containerFantasma);
            this.colocacionEnProgreso.containerFantasma.destroy();
        }
        
        // Restaurar listeners originales
        window.onmousemove = this.listenerMouseMoveOriginal;
        window.onmousedown = this.listenerMouseDownOriginal;
        window.onkeydown = this.listenerKeyDownOriginal;
        
        // Limpiar estado
        this.colocacionEnProgreso = null;
        
        console.log("Colocación cancelada");
    }
}