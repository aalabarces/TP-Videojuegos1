class Entidad {
    constructor(x, y, juego) {
        this.juego = juego;
        this.id = Math.floor(Math.random() * 9999999);
        this.x = x;
        this.y = y;
        this.objetivo = null;

        this.activo = true;

        this.velX = 0;
        this.velY = 0;

        this.accX = 0;
        this.accY = 0;

        this.ultimoVector = null;

        this.velocidadMaxima = 6;
        this.accMax = 0.1;

        this.valorFriccion = 0.93;

        this.spritesAnimados = {};
        this.CONSTANTE_DE_ESCALADO = 1;
        this.DISTANCIA_DE_ACCION = 5;

        this.celda = null;
        this.crearContainer();
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.on("pointerdown", (e) => {
            console.log("click en", this);
            // this.showInfo();
            this.juego.seleccionado = this;
            this.juego.mostrarDebug(this.miData());
        });
        this.container.x = this.x;
        this.container.y = this.y;

        this.juego.containerPrincipal.addChild(this.container);
    }

    update() {
        if (!this.juego.supermercado) return;
        if (!this.activo) { return }
        // Si hay un camino, seguirlo
        if (this.celda && this.caminoActual && this.celda == this.caminoActual[this.caminoActual.length - 1]) {
            this.objetivo = null;
            this.caminoActual = null;
        }
        else this.avanzarPorCamino();

        this.calcularVelocidad();
        this.actualizarMiPosicionEnLaGrilla();
    }

    render() {
        if (!this.yaCargoElSprite) return;
        this.container.x = this.x;
        this.container.y = this.y;

        if (this.velX < 0) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
        }

        this.container.zIndex = Math.floor(this.y);
    }


    aplicarAceleracion(x, y) {
        this.accX += x;
        this.accY += y;
    }

    calcularVelocidad() {
        this.limitarAceleracion();

        this.velX += this.accX;
        this.velY += this.accY;

        this.velX *= this.valorFriccion;
        this.velY *= this.valorFriccion;

        if (Math.abs(this.velX) < 0.01) { this.velX = 0; }
        if (Math.abs(this.velY) < 0.01) { this.velY = 0; }

        if (this.velX > this.velocidadMaxima) { this.velX = this.velocidadMaxima; }
        if (this.velY > this.velocidadMaxima) { this.velY = this.velocidadMaxima; }

        if (this.velX < -this.velocidadMaxima) { this.velX = -this.velocidadMaxima; }
        if (this.velY < -this.velocidadMaxima) { this.velY = -this.velocidadMaxima; }

        this.x += Math.floor(this.velX);
        this.y += Math.floor(this.velY);

        if (this.x < 0) { this.x = 0; }
        if (this.y < 0) { this.y = 0; }
        if (this.x > this.juego.ancho) { this.x = this.juego.ancho; }
        if (this.y > this.juego.alto) { this.y = this.juego.alto; }

        // Resetear aceleración
        this.accX = 0;
        this.accY = 0;
    }

    calcularVelocidadLineal() {
        return Math.sqrt(this.velX ** 2 + this.velY ** 2);
    }

    limitarAceleracion() {
        let aceleracionLineal = Math.sqrt(this.accX ** 2 + this.accY ** 2);
        if (aceleracionLineal > this.accMax) {
            // Normalizamos el vector de aceleración
            const factor = this.accMax / aceleracionLineal;

            // Aplicamos el factor para limitar la aceleración
            this.accX *= factor;
            this.accY *= factor;
        }
    }

    irA(x, y) {
        console.log("Ir a", x, y);
        if (this.caminoActual && this.caminoActual.length > 0) { return; }
        // Buscar el camino usando A*
        const camino = this.encontrarCaminoA(x, y);
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
        if (this.juego.grilla.obtenerCeldaEnPosicion(this.objetivo.x, this.objetivo.y) == fin && this.caminoActual) { return this.caminoActual }

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
                    // debugger;
                }
                camino.unshift(inicio);
                // console.log("Camino encontrado:", camino);
                return camino;
            }

            for (const vecino of actual.obtenerCeldasVecinas()) {
                // console.log("actual", actual, "gScore:", gScore.get(actual));
                if (!vecino || !vecino.soyTransitable()) continue;

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

    avanzarPorCamino() {
        if (this.caminoActual && this.pasoActual < this.caminoActual.length) {
            // debugger;
            // console.log("Siguiendo camino, paso actual:", this.pasoActual);
            const celdaDestino = this.caminoActual[this.pasoActual];

            if (!celdaDestino.soyTransitable()) {
                console.warn("Celda no transitable, reiniciando camino");
                this.irA(this.objetivo.x, this.objetivo.y);
            }
            else {
                const dx = celdaDestino.centro.x - this.x;
                const dy = celdaDestino.centro.y - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                console.log("Distancia al destino:", distancia, celdaDestino.centro.x, celdaDestino.centro.y);
                if (distancia < this.juego.grilla.anchoCelda / 2) {
                    this.pasoActual++;
                    if (this.pasoActual >= this.caminoActual.length) {
                        this.caminoActual = null; // Camino completado
                        this.pasoActual = 0; // Reiniciar paso actual
                        const dx = this.objetivo.x - this.x;
                        const dy = this.objetivo.y - this.y;
                        const distancia = Math.sqrt(dx * dx + dy * dy);
                        this.aplicarAceleracion(dx / distancia, dy / distancia);
                        this.objetivo = null; // Limpiar objetivo
                    }
                    // console.log("Avanzando al siguiente paso del camino:", this.pasoActual);
                } else {
                    this.aplicarAceleracion(dx / distancia, dy / distancia);
                    // console.log("Acelerando hacia el destino:", celdaDestino.x, celdaDestino.y);
                }
            }
        }
    }

    tieneDestino() {
        return this.destinoX !== null && this.destinoY !== null;
    }

    serClickeado() {
        this.juego.seleccionado = this;
    }

    showInfo() {
        //appendear mi data en el debugContainer
        console.log("Soy una entidad con id:", this.id);
        const dc = this.juego.debugContainer    //DebugContainer
        dc.innerHTML = ''
        dc.innerHTML += `<div>id: ${this.id}</div>`
        dc.innerHTML += `<div>x: ${this.x}</div>`
        dc.innerHTML += `<div>y: ${this.y}</div>`
        dc.innerHTML += `<div>velX: ${this.velX}</div>`
        dc.innerHTML += `<div>velY: ${this.velY}</div>`
        dc.innerHTML += `<div>accX: ${this.accX}</div>`
        dc.innerHTML += `<div>accY: ${this.accY}</div>`
        dc.innerHTML += `<div>activo: ${this.activo}</div>`
        dc.innerHTML += `<div>velocidadMaxima: ${this.velocidadMaxima}</div>`
        dc.innerHTML += `<div>accMax: ${this.accMax}</div>`
    }

    miData() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            container: this.container,
            velX: this.velX,
            velY: this.velY,
            accX: this.accX,
            accY: this.accY,
            activo: this.activo,
            velocidadMaxima: this.velocidadMaxima,
            accMax: this.accMax
        };
    }

    actualizarMiPosicionEnLaGrilla() {
        const celdaActual = this.juego.grilla.obtenerCeldaEnPosicion(
            Math.floor(this.x),
            Math.floor(this.y)
        );
        if (this.celda && celdaActual && celdaActual != this.celda) {
            this.celda.sacarEntidad(this);
            celdaActual.ponerEntidad(this);
            this.celda = celdaActual;
        } else if (!this.celda && celdaActual) {
            this.celda = celdaActual;
            this.celda.ponerEntidad(this);
        }
    }
}