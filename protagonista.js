class Protagonista extends Persona {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.tipo = "protagonista";
        this.container.name = "protagonista";

        this.adentro = true;

        // this.container.tint = 0xc915ee;
        this.velocidadMaxima = 5;
        this.accMax = 0.13;
        this.valorFriccion = 0.95;

        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 10;
    }

    render() {
        if (!this.yaCargoElSprite) return;
        super.render();
        // this.cambiarVelocidadDelSpriteSegunVelocidadLineal();
        this.cambiarDeSpriteSegunVelocidad();
    }

    update() {
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
            // this.velX = 0;
        }
    }

    async cargarSprites() {
        //cargo el json
        let json = await PIXI.Assets.load("./assets/boca/boca-sheet2.json");

        let animacionesIninterrumpibles = [
            "birra",
            "agarrar",
            "pagar",
            "jump",
        ]

        let animacionesLoopeables = [
            'walk',
            'pucho'
        ]

        //recorro todas las animaciones q tiene
        for (let animacion of Object.keys(json.animations)) {
            //cada animacion ahora esta en la variable animacion:
            //en el objeto spritesAnimados, creo q una propiedad/valor nuevo, con el nombre de la animacion, y le meto una nueva instancia de PIXI.animatedSprite
            this.spritesAnimados[animacion] = new PIXI.AnimatedSprite(
                json.animations[animacion]
            );

            this.spritesAnimados[animacion].nombre = animacion;

            // this.spriteSeleccionado[animacion].antialias ???
            this.spritesAnimados[animacion].animationSpeed = 0.1; // velocidad de la animacion para cada una definirla en algun lado
            console.log("animacion", animacion);
            //q loopee
            // IF ESTA ES CAMINAR LOOP TRUE
            //  ELSE ONCOMPLETE
            this.spritesAnimados[animacion].loop = animacionesLoopeables.includes(animacion)
            //y le damos play
            this.spritesAnimados[animacion].play();
            //si es una animacion ininterrumpible, le ponemos la propiedad ininterruptible
            this.spritesAnimados[animacion].ininterruptible = animacionesIninterrumpibles.includes(animacion)

            //lo metemos en el container de esta entidad/persona
            this.container.addChild(this.spritesAnimados[animacion]);

            //el punto de anclaje abajo al medio (donde el chabon toca el piso, pq este punto lo usamos para ver quien esta adelante y quien esta atras)
            this.spritesAnimados[animacion].anchor.set(0.5, 1);
            //el frame inicial q sea random
            this.spritesAnimados[animacion].currentFrame = Math.floor(
                this.spritesAnimados[animacion].totalFrames * Math.random()
            );
        }

        // this.cambiarDeSpriteSegunVelocidad();
        this.cambiarSpriteAnimado("pucho");
        this.yaCargoElSprite = true;
    }
    // cambiarSpriteAnimado(key, cambiarSpriteAnimado(otraanimacion)) {
    cambiarSpriteAnimado(key) {
        console.log("cambiando sprite a:", key);
        this.spriteSeleccionado = key;
        //extraemos las keys del objeto spritesAnimados
        const keys = Object.keys(this.spritesAnimados);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.spritesAnimados[key].visible = false;
        }

        this.sprite = this.spritesAnimados[key];
        this.sprite.visible = true;
        this.sprite.currentFrame = 0;
        this.sprite.play();

        this.reproduciendoAnimacionIninterrumpible = this.sprite.ininterruptible || false;

        // this.sprite.onComplete = callback || (() => {
        //     console.log("Animación completada:", key);
        //     console.log("Reproduciendo animación ininterrumpible:", this.reproduciendoAnimacionIninterrumpible);
        //     this.reproduciendoAnimacionIninterrumpible = false;
        // });
    }

    cambiarDeSpriteSegunVelocidad() {
        if (this.reproduciendoAnimacionIninterrumpible) return;
        // si la velocidad lineal es mayor a 0, cambiamos el sprite a caminar
        if (this.calcularVelocidadLineal() > 0) {
            if (this.sprite.nombre !== "walk") {
                this.cambiarSpriteAnimado("walk");
            }
        } else {
            if (this.sprite.nombre !== "pucho")
                this.cambiarSpriteAnimado("pucho");
        }
    }
    cambiarVelocidadDelSpriteSegunVelocidadLineal() {
        this.sprite.animationSpeed = this.calcularVelocidadLineal() * 0.13;
    }

    crearPersonalidad() {
        // sobreescribe la función random de Persona
        this.nombre = "Protagonista";
        this.apellido = "Que en algún momento tendrá un nombre customizable";
        this.email = "varNombre[0] + varApellido + '@ejemplo.com'";
        this.genero = "input";
        this.titulo = "El único e incomparable";
        this.trabajo = "Dueño del minisuper";
        this.frase = "<select>";
        this.imagen = "<img src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fdisco-elysium-archive.fandom.com%2Fwiki%2FHarrier_Du_Bois&psig=AOvVaw2gJ1qgNKKMAEN-LxE_PWUf&ust=1750712086483000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICrxe_0hY4DFQAAAAAdAAAAABAE' alt='Protagonista'>";
        this.velocidadMaxima = 5; //velocidad random entre 1 y 5
        this.plata = this.juego.PLATA_INICIAL; //plata random entre 1 y 1000
        this.paciencia = 100; //paciencia random entre 1 y 100
        this.tentacion = 1; //tentacion random entre 1 y 100
        this.autocontrol = 100; //autocontrol random entre 1 y 100

    }

    // versiones ligeramente distintas de irA y encontrarCaminoA
    // para que el protagonista cambie de camino si hacés click de nuevo

    irA(x, y) {
        // console.log("Ir a", x, y);
        // Buscar el camino usando A*
        const camino = this.encontrarCaminoA(x, y);
        if (camino.length === 0) { debugger }
        // console.log("Camino encontrado:", camino);
        if (camino.length === 0) return;

        camino.forEach((celda, index) => { celda.clickeada = true; celda.render(this.juego.grilla.borde); });
        // Guardar el camino y avanzar paso a paso en update()
        this.caminoActual = camino;
        this.pasoActual = 0;
    }
    encontrarCaminoA(destinoX, destinoY) {
        // implementación del algoritmo A*
        const grilla = this.juego.grilla;
        const inicio = grilla.obtenerCeldaEnPosicion(Math.floor(this.x), Math.floor(this.y));
        const fin = grilla.obtenerCeldaEnPosicion(Math.floor(destinoX), Math.floor(destinoY));
        // console.log("Inicio:", inicio, "Fin:", fin);
        if (!inicio || !fin) return [];
        const openSet = [inicio];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(inicio, 0);
        fScore.set(inicio, this.juego.calcularDistancia(inicio, fin));

        while (openSet.length > 0) {
            // console.log("openSet:", openSet);
            // Ordenar por menor fScore
            openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
            const actual = openSet.shift();
            const hash = (celda) => `x_${celda.x}_y_${celda.y}`;
            // console.log("Actual:", actual.x, actual.y, "fScore:", fScore.get(actual));

            if (actual === fin) {
                // Reconstruir el camino
                let camino = [actual];
                let currHash = hash(actual);
                while (cameFrom.has(currHash)) {
                    const prevHash = cameFrom.get(currHash);
                    if (prevHash === hash(inicio)) break; // ¡Cortá cuando llegues al inicio!
                    const prevCelda = this.juego.grilla.obtenerCeldaPorHash(prevHash);
                    camino.unshift(prevCelda);
                    currHash = prevHash;
                }
                camino.unshift(inicio);
                // console.log("Camino encontrado:", camino);
                return camino;
            }

            for (const vecino of actual.obtenerCeldasVecinas()) {
                // console.log("actual", actual, "gScore:", gScore.get(actual));
                if (!vecino || !vecino.soyTransitable()) { console.warn("no es transitable"); continue };

                const tentative_gScore = (gScore.get(actual) ?? Infinity) + 1;
                // console.log(gScore, tentative_gScore)
                if (tentative_gScore < (gScore.get(vecino) || Infinity)) {
                    cameFrom.set(hash(vecino), hash(actual));
                    // console.log("Vecino:", vecino.x, vecino.y, "Hash:", hash(vecino), "Actual:", actual);
                    gScore.set(vecino, tentative_gScore);
                    fScore.set(vecino, tentative_gScore + this.juego.calcularDistancia(vecino, fin));

                    if (!openSet.includes(vecino)) {
                        openSet.push(vecino);
                    }
                }
            }
        }

        // No se encontró camino
        return [];
    }
}



/*
finite state machine de animaciones:

*/