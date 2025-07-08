class Caja extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.tipo = "caja";
        this.container.name = "caja";
        this.fila = [];
        this.atendiendo = false; // indica si hay un cliente siendo atendido
        this.empleado = null; // empleado asignado a esta caja

        this.cargarSprites();
    }

    serClickeado() {
        console.log("Caja clickeada");
        super.serClickeado();
        this.empleado = this.juego.protagonista;
    }

    async cargarSprites() {
        //cargo el json
        let texture = await PIXI.Assets.load('assets/caja.png');

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(1);
        this.sprite.x = 0
        this.sprite.y = 0
        this.sprite.anchor.set(0, 0)
        this.yaCargoElSprite = true;
    }

    atenderCliente() {
        if (this.fila.length > 0 && this.tengoEmpleado()) {
            console.log("Atendiendo cliente en caja");
            const cliente = this.fila.shift();
            console.log(cliente)
            // let venta = new Venta(this.juego, cliente, empleado, this);
            // this.juego.supermercado.cobrar(venta);
            cliente.pagar();
        }
    }

    tengoEmpleado() {
        return this.empleado != undefined && this.juego.calcularDistancia(this, this.empleado) < this.juego.grilla.anchoCelda;
        // return true;
    }

    update() {
        super.update();
        if (this.atendiendo) {
            // Si estamos atendiendo, no hacemos nada más
            return;
        }
        if (this.fila.length > 0 && this.tengoEmpleado()) {
            this.atendiendo = true;
            this.atenderCliente();
        }
    }
}

class Venta {
    constructor(juego, cliente, empleado, caja) {
        this.juego = juego;
        this.productos = [];
        this.cliente = cliente;
        this.empleado = empleado;
        this.caja = caja;
        this.total = this.calcularTotal(); // se calcula una vez el total, porque después puede cambiar el precio de los productos
    }

    agregarProducto(producto) {
        this.productos.push(producto);
    }

    calcularTotal() {
        let total = 0;
        for (let i = 0; i < this.productos.length; i++) {
            total += this.productos[i].precio;
        }
        return total;
    }
}