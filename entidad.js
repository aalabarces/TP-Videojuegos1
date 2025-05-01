class Entidad {
    constructor(x, y, juego) {
        this.juego = juego;
        this.id = Math.floor(Math.random() * 9999999);
        this.x = x;
        this.y = y;
        this.destinoX = null;
        this.destinoY = null;

        this.activo = true;

        this.velX = 0;
        this.velY = 0;

        this.accX = 0;
        this.accY = 0;

        this.velocidadMaxima = 6;
        this.accMax = 0.1;

        this.valorFriccion = 0.93;

        this.spritesAnimados = {};
        this.crearContainer();
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.on("pointerdown", (e) => {
            console.log("click en", this);
            this.showInfo();
            this.juego.seleccionado = this;
        });

        this.juego.containerPrincipal.addChild(this.container);
    }

    update() {
        if (!this.activo) { return }

        if (this.tieneDestino()) {
            this.irA(this.destinoX, this.destinoY);
        }

        this.calcularVelocidad();
    }

    render() {
        if (!this.activo) { return }
        this.container.x = this.x;
        this.container.y = this.y;

        // if (this.velX < 0) {
        //     this.sprite.scale.x = -1;
        // } else {
        //     this.sprite.scale.x = 1;
        // }

        this.container.zIndex = Math.floor(this.y);
    }

    aplicarAceleracion(x, y) {
        this.accX += x;
        this.accY += y;
    }

    asignarVelocidad(x, y) {
        this.velX = x;
        this.velY = y;
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

        this.x += this.velX;
        this.y += this.velY;

        // Resetear aceleración
        this.accX = 0;
        this.accY = 0;
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
        //calcula la direccion y distancia al click
        const dx = x - this.x;
        const dy = y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        // si estamos cerca del objetivo detiene el movimiento
        if (distancia < this.velocidadMaxima) {
            this.x = x
            this.y = y
            this.destinoX = null
            this.destinoY = null
            this.velX = 0
        }
        else
            // ubica al pj hacia el objetivo
            this.aplicarAceleracion(dx / distancia, dy / distancia);
    }

    tieneDestino() {
        return this.destinoX !== null && this.destinoY !== null;
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
        dc.innerHTML += `<div>destinoX: ${this.destinoX}</div>`
        dc.innerHTML += `<div>destinoY: ${this.destinoY}</div>`
        dc.innerHTML += `<div>activo: ${this.activo}</div>`
        dc.innerHTML += `<div>velocidadMaxima: ${this.velocidadMaxima}</div>`
        dc.innerHTML += `<div>accMax: ${this.accMax}</div>`
    }
}