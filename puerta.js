class Puerta extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.celda = juego.grilla.obtenerCeldaEnPosicion(x, y);
        this.container.name = "puerta";
        this.container.tint = 0x00ff00; // Verde
        this.container.width = 20;
        this.container.height = 20;
    }

    update() {
        this.celda.entidadesAca.forEach(element => {
            // Si el elemento es un cliente y está en la puerta, aplicar aceleración
            // Si el cliente está saliendo, lo empujamos hacia afuera
            // Si el cliente no está saliendo, lo empujamos hacia adentro
            if (element.container && element.container.name === "cliente" && element.estado === Cliente.STATES.saliendo) {
                element.aplicarAceleracion(0, -this.juego.CONSTANTE_DE_ACELERACION);
                element.adentro = false;
            }
            else if (element.container && element.container.name === "cliente" && element.estado != Cliente.STATES.saliendo) {
                element.aplicarAceleracion(0, this.juego.CONSTANTE_DE_ACELERACION);
                element.adentro = true;
            }

        });
    }
}