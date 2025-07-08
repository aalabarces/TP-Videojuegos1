class UI {
    constructor(juego) {
        this.juego = juego;
        // Crear un contenedor para la UI
        this.container = new PIXI.Container();
        this.container.name = "ui";
        this.container.zIndex = 1000;
        this.juego.containerPrincipal.addChild(this.container);

        // Referencias a elementos UI
        this.menuInicio = null;
        this.menuPrincipal = null;
        this.menuGestor = null;
        this.botonesUI = null;

        // Crear todos los elementos UI
        this.crearTodosLosElementos();

        // Mostrar solo el menú de inicio al principio
        this.mostrarMenuInicio();
    }

    crearTodosLosElementos() {
        this.crearMenuInicio();
        this.crearBotonesUI();
        this.crearMenuPrincipal();
        this.crearMenuGestor();
    }

    update() {
        // Actualizar estadísticas en tiempo real si el menú gestor está visible
        if (this.menuGestor && this.menuGestor.visible) {
            this.actualizarEstadisticas();
        }
    }

    crearMenuInicio() {
        this.menuInicio = new PIXI.Container();
        this.menuInicio.name = "menu_inicio";
        this.menuInicio.zIndex = 1000;
        this.menuInicio.visible = false;
        this.container.addChild(this.menuInicio);

        // Fondo semi-transparente
        const fondoMenu = new PIXI.Graphics();
        fondoMenu.beginFill(0x000000, 0.5);
        fondoMenu.drawRect(0, 0, this.juego.ancho, this.juego.alto);
        fondoMenu.endFill();
        fondoMenu.interactive = true;
        fondoMenu.on('pointerdown', (event) => {
            event.stopPropagation();
        });
        this.menuInicio.addChild(fondoMenu);

        // Título
        const titulo = new PIXI.Text("Bienvenido al Supermercado", { fontSize: 36, fill: 0x000000 });
        titulo.anchor.set(0.5);
        titulo.x = this.juego.ancho / 2;
        titulo.y = this.juego.alto / 2 - 50;
        this.menuInicio.addChild(titulo);

        // Botón empezar
        const botonEmpezar = new PIXI.Text("Empezar", { fontSize: 24, fill: 0x000000 });
        botonEmpezar.interactive = true;
        botonEmpezar.buttonMode = true;
        botonEmpezar.anchor.set(0.5);
        botonEmpezar.x = this.juego.ancho / 2;
        botonEmpezar.y = this.juego.alto / 2 + 20;

        botonEmpezar.on('pointerdown', (event) => {
            event.stopPropagation();
            this.ocultarMenuInicio();
            this.mostrarBotonesUI();
            this.juego.empezar();
        });

        this.menuInicio.addChild(botonEmpezar);
    }

    crearBotonesUI() {
        this.botonesUI = new PIXI.Container();
        this.botonesUI.name = "botones_ui";
        this.botonesUI.visible = false;
        this.container.addChild(this.botonesUI);

        const botonMenu = this.crearBoton(20, 20, 120, 40, 'MENÚ', 0x3498db);
        const botonGestor = this.crearBoton(20, 80, 120, 40, 'GESTOR', 0x27ae60);

        botonMenu.on('pointerdown', (event) => {
            event.stopPropagation();
            this.mostrarMenuPrincipal();
        });
        botonGestor.on('pointerdown', (event) => {
            event.stopPropagation();
            this.mostrarMenuGestor();
        });

        this.botonesUI.addChild(botonMenu, botonGestor);
    }

    crearMenuPrincipal() {
        this.menuPrincipal = new PIXI.Container();
        this.menuPrincipal.name = "menu_principal";
        this.menuPrincipal.visible = false;
        this.container.addChild(this.menuPrincipal);

        // Overlay de fondo
        const overlay = this.crearOverlay();
        overlay.on('pointerdown', (event) => {
            event.stopPropagation();
            this.cerrarTodosLosMenus();
        });
        this.menuPrincipal.addChild(overlay);

        // Fondo del menú
        const { fondoMenu, menuX, menuY, menuAncho } = this.crearFondoModal();
        this.menuPrincipal.addChild(fondoMenu);

        // Título
        const titulo = this.crearTituloModal('MENÚ PRINCIPAL', menuX, menuY);
        this.menuPrincipal.addChild(titulo);

        // Contenido
        const contenido = this.crearContenidoModal(
            'Bienvenido al menú principal.\n\nAquí puedes encontrar:\n• Nuevo Juego\n• Cargar Partida\n• Configuración\n• Créditos',
            menuX, menuY, menuAncho
        );
        this.menuPrincipal.addChild(contenido);

        // Botón cerrar
        const botonCerrar = this.crearBotonCerrarModal(menuX, menuY, menuAncho, () => this.cerrarTodosLosMenus());
        this.menuPrincipal.addChild(botonCerrar);
    }

    crearMenuGestor() {
        this.menuGestor = new PIXI.Container();
        this.menuGestor.name = "menu_gestor";
        this.menuGestor.visible = false;
        this.container.addChild(this.menuGestor);

        // Overlay de fondo
        const overlay = this.crearOverlay();
        overlay.on('pointerdown', (event) => {
            event.stopPropagation();
            this.cerrarTodosLosMenus();
        });
        this.menuGestor.addChild(overlay);

        // Fondo del menú (más grande para incluir la sección de compras)
        const { fondoMenu, menuX, menuY } = this.crearFondoModal(600, 500);
        this.menuGestor.addChild(fondoMenu);

        // Título
        const titulo = this.crearTituloModal('GESTOR', menuX, menuY);
        this.menuGestor.addChild(titulo);

        // Sección de Estadísticas
        const tituloStats = new PIXI.Text('ESTADÍSTICAS', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        tituloStats.x = menuX + 20;
        tituloStats.y = menuY + 60;
        this.menuGestor.addChild(tituloStats);

        // Crear elementos de estadísticas
        this.crearEstadisticasGestor(menuX, menuY);

        // Sección de Compras
        const tituloCompras = new PIXI.Text('COMPRAR PRODUCTOS', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        tituloCompras.x = menuX + 20;
        tituloCompras.y = menuY + 200;
        this.menuGestor.addChild(tituloCompras);

        // Crear elementos de compras
        this.crearSeccionCompras(menuX, menuY);

        // Sección de Construcción
        const tituloConst = new PIXI.Text('CONSTRUCCIÓN', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        tituloConst.x = menuX + 20;
        tituloConst.y = menuY + 320;
        this.menuGestor.addChild(tituloConst);

        // Crear botones de construcción
        this.crearBotonesColocacion(menuX, menuY);

        // Botón cerrar
        const botonCerrar = this.crearBotonCerrarModal(menuX, menuY, 600, () => this.cerrarTodosLosMenus());
        this.menuGestor.addChild(botonCerrar);
    }

    crearEstadisticasGestor(menuX, menuY) {
        // Dinero
        this.textoDinero = new PIXI.Text('Dinero: $0', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e
        });
        this.textoDinero.x = menuX + 30;
        this.textoDinero.y = menuY + 90;
        this.menuGestor.addChild(this.textoDinero);

        // Clientes
        this.textoClientes = new PIXI.Text('Clientes activos: 0', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e
        });
        this.textoClientes.x = menuX + 30;
        this.textoClientes.y = menuY + 120;
        this.menuGestor.addChild(this.textoClientes);

        // Empleados (placeholder)
        this.textoEmpleados = new PIXI.Text('Empleados: N/A', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e
        });
        this.textoEmpleados.x = menuX + 30;
        this.textoEmpleados.y = menuY + 150;
        this.menuGestor.addChild(this.textoEmpleados);

        // Tiempo (placeholder)
        this.textoTiempo = new PIXI.Text('Tiempo: N/A', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e
        });
        this.textoTiempo.x = menuX + 30;
        this.textoTiempo.y = menuY + 180;
        this.menuGestor.addChild(this.textoTiempo);
    }

    crearBotonesColocacion(menuX, menuY) {
        // Botón para colocar cajas
        const botonCaja = this.crearBoton(menuX + 30, menuY + 350, 120, 35, 'Colocar Caja', 0x3498db);
        botonCaja.on('pointerdown', (event) => {
            event.stopPropagation();
            this.cerrarTodosLosMenus();
            try {
                this.juego.iniciarColocacionEntidad(Caja);
            } catch (error) {
                console.error('Error al colocar caja:', error);
            }
        });
        this.menuGestor.addChild(botonCaja);

        // Botón para colocar estanterías
        const botonEstanteria = this.crearBoton(menuX + 170, menuY + 350, 150, 35, 'Colocar Estantería', 0x27ae60);
        botonEstanteria.on('pointerdown', (event) => {
            event.stopPropagation();
            this.cerrarTodosLosMenus();
            try {
                this.juego.iniciarColocacionEntidad(Estanteria);
            } catch (error) {
                console.error('Error al colocar estantería:', error);
            }
        });
        this.menuGestor.addChild(botonEstanteria);

        // Botón para cancelar colocación
        const botonCancelar = this.crearBoton(menuX + 340, menuY + 350, 120, 35, 'Cancelar', 0xe74c3c);
        botonCancelar.on('pointerdown', (event) => {
            event.stopPropagation();
            try {
                this.juego.cancelarColocacion();
            } catch (error) {
                console.error('Error al cancelar colocación:', error);
            }
        });
        this.menuGestor.addChild(botonCancelar);
    }

    crearSeccionCompras(menuX, menuY) {
        // Crear el select de productos
        this.crearSelectProductos(menuX, menuY);

        // Crear input de cantidad (representado como botones +/-)
        this.crearControlCantidad(menuX, menuY);

        // Crear botón de comprar
        this.crearBotonComprar(menuX, menuY);
    }

    crearSelectProductos(menuX, menuY) {
        // Texto label
        const labelProducto = new PIXI.Text('Producto:', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x34495e
        });
        labelProducto.x = menuX + 30;
        labelProducto.y = menuY + 230;
        this.menuGestor.addChild(labelProducto);

        // Crear contenedor para simular un select
        this.contenedorSelect = new PIXI.Container();
        this.contenedorSelect.x = menuX + 30;
        this.contenedorSelect.y = menuY + 255;
        this.menuGestor.addChild(this.contenedorSelect);

        // Productos disponibles de la variable global
        this.productosDisponibles = Object.keys(productos);
        this.productoSeleccionado = this.productosDisponibles[0]; // Primer producto por defecto

        // Crear el "select" como botón que muestra opciones
        this.botonSelect = this.crearBoton(0, 0, 150, 30, this.productoSeleccionado, 0x95a5a6);
        this.botonSelect.on('pointerdown', (event) => {
            event.stopPropagation();
            this.toggleSelectProductos();
        });
        this.contenedorSelect.addChild(this.botonSelect);

        // Crear lista desplegable (inicialmente oculta)
        this.listaProductos = new PIXI.Container();
        this.listaProductos.x = 0;
        this.listaProductos.y = 35;
        this.listaProductos.visible = false;
        this.contenedorSelect.addChild(this.listaProductos);

        // Crear opciones de productos
        this.productosDisponibles.forEach((producto, index) => {
            const opcion = this.crearBoton(0, index * 32, 150, 30, producto, 0xbdc3c7);
            opcion.on('pointerdown', (event) => {
                event.stopPropagation();
                this.seleccionarProducto(producto);
            });
            this.listaProductos.addChild(opcion);
        });
    }

    crearControlCantidad(menuX, menuY) {
        // Label cantidad
        const labelCantidad = new PIXI.Text('Cantidad:', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x34495e
        });
        labelCantidad.x = menuX + 200;
        labelCantidad.y = menuY + 230;
        this.menuGestor.addChild(labelCantidad);

        // Valor de cantidad
        this.cantidadProducto = 1;
        this.textoCantidad = new PIXI.Text(this.cantidadProducto.toString(), {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        this.textoCantidad.anchor.set(0.5);
        this.textoCantidad.x = menuX + 250;
        this.textoCantidad.y = menuY + 270;
        this.menuGestor.addChild(this.textoCantidad);

        // Botón menos
        const botonMenos = this.crearBoton(menuX + 200, menuY + 255, 30, 30, '-', 0xe74c3c);
        botonMenos.on('pointerdown', (event) => {
            event.stopPropagation();
            if (this.cantidadProducto > 1) {
                this.cantidadProducto--;
                this.textoCantidad.text = this.cantidadProducto.toString();
            }
        });
        this.menuGestor.addChild(botonMenos);

        // Botón más
        const botonMas = this.crearBoton(menuX + 270, menuY + 255, 30, 30, '+', 0x27ae60);
        botonMas.on('pointerdown', (event) => {
            event.stopPropagation();
            this.cantidadProducto++;
            this.textoCantidad.text = this.cantidadProducto.toString();
        });
        this.menuGestor.addChild(botonMas);
    }

    crearBotonComprar(menuX, menuY) {
        const botonComprar = this.crearBoton(menuX + 320, menuY + 255, 120, 30, 'Comprar', 0xf39c12);
        botonComprar.on('pointerdown', (event) => {
            event.stopPropagation();
            this.comprarProductoSeleccionado();
        });
        this.menuGestor.addChild(botonComprar);
    }

    toggleSelectProductos() {
        this.listaProductos.visible = !this.listaProductos.visible;
    }

    seleccionarProducto(producto) {
        this.productoSeleccionado = producto;
        // Actualizar texto del botón select
        this.botonSelect.children[2].text = producto; // El texto es el tercer child (fondo, borde, texto)
        this.listaProductos.visible = false;
    }

    comprarProductoSeleccionado() {
        if (!this.juego.supermercado) {
            console.error('Supermercado no inicializado');
            return;
        }

        const exito = this.juego.supermercado.comprarProducto(this.productoSeleccionado, this.cantidadProducto);

        if (exito) {
            // Mostrar mensaje de éxito
            console.log(`¡Compra exitosa! ${this.cantidadProducto} ${this.productoSeleccionado}(s) agregado(s) al almacén.`);
        } else {
            // Mostrar mensaje de error
            console.log('No se pudo completar la compra. Verifica que tengas suficiente dinero.');
        }
    }

    actualizarEstadisticas() {
        if (!this.juego.supermercado) return;

        // Actualizar dinero
        const dinero = this.juego.supermercado.dinero || 0;
        this.textoDinero.text = `Dinero: $${dinero}`;

        // Actualizar clientes activos
        const clientesActivos = this.juego.personas.filter(p => p.activo).length;
        this.textoClientes.text = `Clientes activos: ${clientesActivos}`;
    }

    // Métodos helper para crear elementos
    crearBoton(x, y, ancho, alto, texto, color = 0x3498db) {
        const button = new PIXI.Container();

        const fondo = new PIXI.Graphics();
        fondo.beginFill(color);
        fondo.drawRoundedRect(0, 0, ancho, alto, 8);
        fondo.endFill();

        const borde = new PIXI.Graphics();
        borde.lineStyle(2, 0x2980b9);
        borde.drawRoundedRect(0, 0, ancho, alto, 8);

        const textoBoton = new PIXI.Text(texto, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bold'
        });

        textoBoton.x = ancho / 2 - textoBoton.width / 2;
        textoBoton.y = alto / 2 - textoBoton.height / 2;

        button.addChild(fondo, borde, textoBoton);
        button.x = x;
        button.y = y;
        button.interactive = true;
        button.buttonMode = true;

        return button;
    }

    crearOverlay() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, this.juego.ancho, this.juego.alto);
        overlay.endFill();
        overlay.interactive = true;

        // Agregar un listener adicional para prevenir propagación en cualquier evento
        overlay.on('pointerdown', (event) => {
            event.stopPropagation();
        });

        return overlay;
    }

    crearFondoModal(ancho = 400, alto = 300) {
        const menuAncho = ancho;
        const menuAlto = alto;
        const menuX = (this.juego.ancho - menuAncho) / 2;
        const menuY = (this.juego.alto - menuAlto) / 2;

        const fondoMenu = new PIXI.Graphics();
        fondoMenu.beginFill(0xffffff);
        fondoMenu.lineStyle(3, 0x34495e);
        fondoMenu.drawRoundedRect(menuX, menuY, menuAncho, menuAlto, 12);
        fondoMenu.endFill();

        // Hacer el fondo interactivo para prevenir propagación de eventos
        fondoMenu.interactive = true;
        fondoMenu.on('pointerdown', (event) => {
            event.stopPropagation();
        });

        return { fondoMenu, menuX, menuY, menuAncho, menuAlto };
    }

    crearTituloModal(titulo, menuX, menuY) {
        const tituloText = new PIXI.Text(titulo, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        tituloText.x = menuX + 20;
        tituloText.y = menuY + 20;
        return tituloText;
    }

    crearContenidoModal(contenido, menuX, menuY, menuAncho) {
        const contenidoText = new PIXI.Text(contenido, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e,
            wordWrap: true,
            wordWrapWidth: menuAncho - 40
        });
        contenidoText.x = menuX + 20;
        contenidoText.y = menuY + 70;
        return contenidoText;
    }

    crearBotonCerrarModal(menuX, menuY, menuAncho, onClose) {
        const botonCierre = new PIXI.Graphics();
        botonCierre.beginFill(0xe74c3c);
        botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
        botonCierre.endFill();

        const textoCierre = new PIXI.Text('✕', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: 'bold'
        });
        textoCierre.x = menuX + menuAncho - 42;
        textoCierre.y = menuY + 16;

        botonCierre.interactive = true;
        botonCierre.buttonMode = true;
        botonCierre.addChild(textoCierre);
        botonCierre.on('pointerdown', (event) => {
            event.stopPropagation();
            onClose();
        });

        return botonCierre;
    }

    // Métodos para mostrar/ocultar elementos
    mostrarMenuInicio() {
        this.menuInicio.visible = true;
        this.ocultarBotonesUI();
        this.ocultarMenuPrincipal();
        this.ocultarMenuGestor();
    }

    ocultarMenuInicio() {
        this.menuInicio.visible = false;
    }

    mostrarBotonesUI() {
        this.botonesUI.visible = true;
    }

    ocultarBotonesUI() {
        this.botonesUI.visible = false;
    }

    mostrarMenuPrincipal() {
        this.menuPrincipal.visible = true;
    }

    ocultarMenuPrincipal() {
        this.menuPrincipal.visible = false;
    }

    mostrarMenuGestor() {
        this.menuGestor.visible = true;
        this.actualizarEstadisticas(); // Actualizar al mostrar
    }

    ocultarMenuGestor() {
        this.menuGestor.visible = false;
    }

    cerrarTodosLosMenus() {
        this.ocultarMenuPrincipal();
        this.ocultarMenuGestor();
    }
}
