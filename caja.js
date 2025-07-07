class Caja extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.tipo = "caja";
        this.container.name = "caja";
        this.fila = [];

        this.cargarSprites();
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
            const cliente = this.fila.shift();
            let empleado = this.empleadoAca();
            let venta = new Venta(this.juego, cliente, empleado, this);
            this.juego.supermercado.cobrar(venta);
        }
    }

    tengoEmpleado() {
        return this.empleadoAca() != undefined;
    }

    empleadoAca() {
        return this.juego.supermercado.empleados.find(empleado => empleado.puesto === this);
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