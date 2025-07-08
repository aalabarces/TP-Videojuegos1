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
        this.panelEstadisticas = null;

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
        this.crearPanelEstadisticas();
    }

    update() {
        // Actualizar estadísticas en tiempo real
        this.actualizarEstadisticas();
    }

    //LO QUE ESTABA DE ANTES:

    crearBoxDeDatos() {
        // Crear un box con datos para la UI
        const box = new PIXI.Graphics();
        box.beginFill(0x000000, 0.5);
        box.drawRect(0, 0, 200, 100);
        box.endFill();
        box.x = this.juego.ancho - 210;
        box.y = this.juego.alto - 110;
        this.container.addChild(box);

        const texto = new PIXI.Text("Dinero:", { fontSize: 16, fill: 0xffffff });
        texto.x = this.juego.ancho - 200;
        texto.y = this.juego.alto - 100;
        this.container.addChild(texto);

        const dinero = new PIXI.Text("0", { fontSize: 16, fill: 0xffffff });
        dinero.x = this.juego.ancho - 200;
        dinero.y = this.juego.alto - 80;
        this.container.addChild(dinero);
        this.container.dinero = dinero;
    }

    crearMenuInicio() {
        // Crear un contenedor para el menú de inicio
        this.menuInicio = new PIXI.Container();
        this.menuInicio.name = "menu_inicio";
        this.menuInicio.zIndex = 1000;
        this.menuInicio.visible = false; // Oculto por defecto
        this.container.addChild(this.menuInicio);

        // Crear un fondo semi-transparente
        const fondoMenu = new PIXI.Graphics();
        fondoMenu.beginFill(0x000000, 0.5);
        fondoMenu.drawRect(0, 0, this.juego.ancho, this.juego.alto);
        fondoMenu.endFill();
        this.menuInicio.addChild(fondoMenu);

        // Crear un texto de bienvenida
        const titulo = new PIXI.Text("Bienvenido al Supermercado", { fontSize: 36, fill: 0xffffff });
        titulo.anchor.set(0.5);
        titulo.x = this.juego.ancho / 2;
        titulo.y = this.juego.alto / 2 - 50;
        this.menuInicio.addChild(titulo);

        // Crear un botón para empezar
        const botonEmpezar = new PIXI.Text("Empezar", { fontSize: 24, fill: 0xffffff });
        botonEmpezar.interactive = true;
        botonEmpezar.buttonMode = true;
        botonEmpezar.anchor.set(0.5);
        botonEmpezar.x = this.juego.ancho / 2;
        botonEmpezar.y = this.juego.alto / 2 + 20;

        botonEmpezar.on('pointerdown', () => {
            this.ocultarMenuInicio();
            this.mostrarBotonesUI();
            this.juego.empezar();
        });

        this.menuInicio.addChild(botonEmpezar);
    }


    // LO QUE SUBIÓ LUCHO

    // SISTEMA DE BOTONES

    // Función para crear el fondo de un botón
    crearFondoBoton(ancho, alto, color, isHovered = false) {
        const fondo = new PIXI.Graphics();
        const fillColor = isHovered ? 0x2980b9 : color;
        fondo.beginFill(fillColor);
        fondo.drawRoundedRect(0, 0, ancho, alto, 8);
        fondo.endFill();
        return fondo;
    }

    // Función para crear el borde de un botón
    crearBordeBoton(ancho, alto) {
        const borde = new PIXI.Graphics();
        borde.lineStyle(2, 0x2980b9);
        borde.drawRoundedRect(0, 0, ancho, alto, 8);
        return borde;
    }

    // Función para crear el texto de un botón
    crearTextoBoton(texto, ancho, alto) {
        const textoBoton = new PIXI.Text(texto, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bold'
        });

        textoBoton.x = ancho / 2 - textoBoton.width / 2;
        textoBoton.y = alto / 2 - textoBoton.height / 2;

        return textoBoton;
    }



    // Función principal para crear un botón
    crearBoton(x, y, ancho, alto, texto, color = 0x3498db) {
        const button = new PIXI.Container();

        // Crear componentes del botón
        const fondo = this.crearFondoBoton(ancho, alto, color);
        const borde = this.crearBordeBoton(ancho, alto);
        const textoBoton = this.crearTextoBoton(texto, ancho, alto);

        // Ensamblar botón
        button.addChild(fondo, borde, textoBoton);
        button.x = x;
        button.y = y;

        // Hacer el botón interactivo
        button.interactive = true;
        button.buttonMode = true;

        return button;
    }

    // Función para crear el overlay de fondo de la modal
    crearOverlayMenuDesplegable() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, this.juego.ancho, this.juego.alto);
        overlay.endFill();
        overlay.interactive = true;
        return overlay;
    }

    // Función para crear el fondo de la ventana modal
    crearFondoMenuDesplegable() {
        const menuAncho = 400;
        const menuAlto = 300;
        const menuX = (this.juego.ancho - menuAncho) / 2;
        const menuY = (this.juego.alto - menuAlto) / 2;

        const fondoMenu = new PIXI.Graphics();
        fondoMenu.beginFill(0xffffff);
        fondoMenu.lineStyle(3, 0x34495e);
        fondoMenu.drawRoundedRect(menuX, menuY, menuAncho, menuAlto, 12);
        fondoMenu.endFill();

        return { fondoMenu, menuX, menuY, menuAncho, menuAlto };
    }

    // Función para crear el título de la modal
    crearTituloMenuDesplegable(title, menuX, menuY) {
        const titleText = new PIXI.Text(title, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        titleText.x = menuX + 20;
        titleText.y = menuY + 20;
        return titleText;
    }

    // Función para crear el contenido de la modal
    crearContenidoMenuDesplegable(content, menuX, menuY, menuAncho) {
        const contentText = new PIXI.Text(content, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e,
            wordWrap: true,
            wordWrapWidth: menuAncho - 40
        });
        contentText.x = menuX + 20;
        contentText.y = menuY + 70;
        return contentText;
    }

    // Función para crear el botón de cerrar de la modal
    crearBotonCerrarMenuDesplegable(menuX, menuY, menuAncho, onClose) {
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

        // Efectos hover del botón cerrar
        botonCierre.on('pointerover', () => {
            botonCierre.clear();
            botonCierre.beginFill(0xc0392b);
            botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
            botonCierre.endFill();
            botonCierre.addChild(textoCierre);
        });

        botonCierre.on('pointerout', () => {
            botonCierre.clear();
            botonCierre.beginFill(0xe74c3c);
            botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
            botonCierre.endFill();
            botonCierre.addChild(textoCierre);
        });

        console.log(onClose)
        botonCierre.on('pointerdown', () => { onClose(); });

        return botonCierre;
    }

    // Función principal para crear ventana desplegable             
    crearDesplegable(titulo, contenido, alCerrar) {
        const menu = new PIXI.Container();

        // Crear componentes de la modal
        const overlay = this.crearOverlayMenuDesplegable();
        const { fondoMenu, menuX, menuY, menuAncho, menuAlto } = this.crearFondoMenuDesplegable();
        const titleText = this.crearTituloMenuDesplegable(titulo, menuX, menuY);
        const contentText = this.crearContenidoMenuDesplegable(contenido, menuX, menuY, menuAncho);
        const closeButton = this.crearBotonCerrarMenuDesplegable(menuX, menuY, menuAncho, alCerrar);

        // Cerrar al hacer click en el overlay
        overlay.on('pointerdown', alCerrar);

        // Ensamblar menu
        menu.addChild(overlay, fondoMenu, titleText, contentText, closeButton);

        return menu;
    }

    cerrarDesplegable() {
        if (this.menuActual) {
            this.container.removeChild(this.menuActual);
            this.menuActual = null;
        }
    }

    // Función para mostrar modal de menú
    mostrarMenuDesplegable() {
        this.cerrarDesplegable();
        this.menuActual = this.crearDesplegable(
            'MENÚ PRINCIPAL',
            'Bienvenido al menú principal.\n\nAquí puedes encontrar:\n• Nuevo Juego\n• Cargar Partida\n• Configuración\n• Créditos\n\nSelecciona una opción para continuar.',
            () => this.cerrarDesplegable()
        );
        this.container.addChild(this.menuActual);
    }

    // Función para mostrar modal de opciones
    mostrarOpcionesDesplegable() {
        this.cerrarDesplegable();
        this.menuActual = this.crearDesplegable(
            'GESTOR',
            'Cantidad de Chorros',
            () => this.cerrarDesplegable()
        );
        this.container.addChild(this.menuActual);
    }

    // Función para crear los botones principales
    crearBotonesUI() {
        this.botonesUI = new PIXI.Container();
        this.botonesUI.name = "botones_ui";
        this.botonesUI.visible = false; // Oculto por defecto
        this.container.addChild(this.botonesUI);

        const boton1 = this.crearBoton(20, 20, 120, 40, 'MENÚ', 0x3498db);
        const boton2 = this.crearBoton(20, 80, 120, 40, 'GESTOR', 0x27ae60);

        // Asignar eventos
        boton1.on('pointerdown', () => this.mostrarMenuPrincipal());
        boton2.on('pointerdown', () => this.mostrarMenuGestor());

        // Agregar al container de botones UI
        this.botonesUI.addChild(boton1, boton2);

        // Guardar referencias
        this.botonMenu = boton1;
        this.botonGestor = boton2;
    }

    // Métodos helper para crear modales
    crearOverlay() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, this.juego.ancho, this.juego.alto);
        overlay.endFill();
        overlay.interactive = true;
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

        botonCierre.on('pointerdown', onClose);

        return botonCierre;
    }

    // Métodos para mostrar/ocultar elementos
    createPanelBackground(ancho, alto) {
        const fondo = new PIXI.Graphics();
        fondo.beginFill(0x2c3e50, 0.9); // Fondo semi-transparente
        fondo.lineStyle(2, 0x34495e);
        fondo.drawRoundedRect(0, 0, ancho, alto, 8);
        fondo.endFill();
        return fondo;
    }


    crearFilaEstadisticas(nombre, valor, y, ancho) {
        const container = new PIXI.Container();


        const labelText = new PIXI.Text(nombre + ':', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xecf0f1,
            fontWeight: 'bold'
        });
        labelText.x = 10;
        labelText.y = y;

        // Texto del valor
        const valueText = new PIXI.Text(valor, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff
        });
        valueText.x = ancho - valueText.width - 10;
        valueText.y = y;

        container.addChild(labelText, valueText);
        container.valueText = valueText; // Guardar referencia para actualizaciones
        container.width = ancho;

        return container;
    }

    // Función para formatear el tiempo en MM:SS
    formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }

    // Función para formatear dinero
    formatearDinero(cantidad) {
        return `${cantidad.toLocaleString()}`;
    }

    // Función principal para crear el panel de estadísticas
    crearPanelEstadisticas() {
        const panelWidth = 180;
        const panelHeight = 120;

        this.panelEstadisticas = new PIXI.Container();

        // Fondo del panel
        const bg = this.createPanelBackground(panelWidth, panelHeight);
        this.panelEstadisticas.addChild(bg);

        // Título del panel
        const titulo = new PIXI.Text('ESTADO', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xf1c40f,
            fontWeight: 'bold',
            align: 'center'
        });
        titulo.x = panelWidth / 2 - titulo.width / 2;
        titulo.y = 8;
        this.panelEstadisticas.addChild(titulo);

        // Crear filas de estadísticas
        this.filaDinero = this.createStatRow('Dinero', this.formatearDinero(this.estadisticas.dinero), 35, panelWidth);
        this.filaClientes = this.createStatRow('Clientes', this.estadisticas.clientes.toString(), 55, panelWidth);
        this.filaEmpleados = this.createStatRow('Empleados', this.estadisticas.empleados.toString(), 75, panelWidth);
        this.filaTiempo = this.createStatRow('Tiempo', this.formatearTiempo(this.estadisticas.tiempo), 95, panelWidth);

        // Agregar filas al panel
        this.panelEstadisticas.addChild(this.filaDinero);
        this.panelEstadisticas.addChild(this.filaClientes);
        this.panelEstadisticas.addChild(this.filaEmpleados);
        this.panelEstadisticas.addChild(this.filaTiempo);

        // Posicionar el panel
        this.posicionarPanelEstadisticas();

        // Agregar al container UI
        this.container.addChild(this.panelEstadisticas);
    }

    // Función para posicionar el panel en la esquina superior derecha
    posicionarPanelEstadisticas() {
        if (!this.panelEstadisticas) return;
        this.panelEstadisticas.x = this.juego.ancho - 200; // 20px desde el borde derecho
        this.panelEstadisticas.y = 20;
    }

    // Función para actualizar el tiempo del juego
    actualizarTiempo() {
        // Incrementar tiempo cada 60 frames (aproximadamente 1 segundo a 60fps)
        if (this.contadorDeFrame % 60 === 0) {
            this.estadisticas.tiempo++;
        }
    }

    // Función para actualizar las estadísticas en pantalla
    actualizarPanelEstadisticas() {
        if (!this.panelEstadisticas) return;

        // Actualizar texto de dinero
        this.filaDinero.valueText.text = this.formatearDinero(this.estadisticas.dinero);
        this.filaDinero.valueText.x = 180 - this.filaDinero.valueText.width - 10;

        // Actualizar texto de clientes
        this.filaClientes.valueText.text = this.estadisticas.clientes.toString();
        this.filaClientes.valueText.x = 180 - this.filaClientes.valueText.width - 10;

        // Actualizar texto de empleados
        this.filaEmpleados.valueText.text = this.estadisticas.empleados.toString();
        this.filaEmpleados.valueText.x = 180 - this.filaEmpleados.valueText.width - 10;

        // Actualizar texto de tiempo
        this.filaTiempo.valueText.text = this.formatearTiempo(this.estadisticas.tiempo);
        this.filaTiempo.valueText.x = 180 - this.filaTiempo.valueText.width - 10;
    }

    // Métodos para modificar estadísticas (puedes llamar estos desde tu juego)
    agregarDinero(cantidad) {
        this.estadisticas.dinero += cantidad;
    }

    restarDinero(cantidad) {
        this.estadisticas.dinero = Math.max(0, this.estadisticas.dinero - cantidad);
    }

    cambiarClientes(cantidad) {
        this.estadisticas.clientes = Math.max(0, cantidad);
    }

    cambiarEmpleados(cantidad) {
        this.estadisticas.empleados = Math.max(0, cantidad);
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

    crearMenuPrincipal() {
        this.menuPrincipal = new PIXI.Container();
        this.menuPrincipal.name = "menu_principal";
        this.menuPrincipal.visible = false;
        this.container.addChild(this.menuPrincipal);

        // Overlay de fondo
        const overlay = this.crearOverlay();
        overlay.on('pointerdown', () => this.cerrarTodosLosMenus());
        this.menuPrincipal.addChild(overlay);

        // Fondo del menú
        const { fondoMenu, menuX, menuY, menuAncho, menuAlto } = this.crearFondoModal();
        this.menuPrincipal.addChild(fondoMenu);

        // Título
        const titulo = this.crearTituloModal('MENÚ PRINCIPAL', menuX, menuY);
        this.menuPrincipal.addChild(titulo);

        // Contenido
        const contenido = this.crearContenidoModal(
            'Bienvenido al menú principal.\n\nAquí puedes encontrar:\n• Nuevo Juego\n• Cargar Partida\n• Configuración\n• Créditos\n\nSelecciona una opción para continuar.',
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
        overlay.on('pointerdown', () => this.cerrarTodosLosMenus());
        this.menuGestor.addChild(overlay);

        // Fondo del menú (más grande para las estadísticas y botones)
        const { fondoMenu, menuX, menuY, menuAncho, menuAlto } = this.crearFondoModal(500, 400);
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

        // Sección de Construcción
        const tituloConst = new PIXI.Text('CONSTRUCCIÓN', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        tituloConst.x = menuX + 20;
        tituloConst.y = menuY + 200;
        this.menuGestor.addChild(tituloConst);

        // Crear botones de construcción
        this.crearBotonesColocacion(menuX, menuY);

        // Botón cerrar
        const botonCerrar = this.crearBotonCerrarModal(menuX, menuY, menuAncho, () => this.cerrarTodosLosMenus());
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
        const botonCaja = this.crearBoton(menuX + 30, menuY + 230, 120, 35, 'Colocar Caja', 0x3498db);
        botonCaja.on('pointerdown', () => {
            this.cerrarTodosLosMenus();
            this.juego.iniciarColocacionEntidad(Caja);
        });
        this.menuGestor.addChild(botonCaja);

        // Botón para colocar estanterías
        const botonEstanteria = this.crearBoton(menuX + 170, menuY + 230, 150, 35, 'Colocar Estantería', 0x27ae60);
        botonEstanteria.on('pointerdown', () => {
            this.cerrarTodosLosMenus();
            this.juego.iniciarColocacionEntidad(Estanteria);
        });
        this.menuGestor.addChild(botonEstanteria);

        // Botón para cancelar colocación
        const botonCancelar = this.crearBoton(menuX + 340, menuY + 230, 120, 35, 'Cancelar', 0xe74c3c);
        botonCancelar.on('pointerdown', () => {
            this.juego.cancelarColocacion();
        });
        this.menuGestor.addChild(botonCancelar);
    }

    actualizarEstadisticas() {
        if (!this.juego.supermercado) return;

        // Actualizar dinero
        const dinero = this.juego.supermercado.dinero || 0;
        this.textoDinero.text = `Dinero: $${dinero}`;

        // Actualizar clientes activos
        const clientesActivos = this.juego.personas.filter(p => p.activo).length;
        this.textoClientes.text = `Clientes activos: ${clientesActivos}`;

        // Empleados y tiempo aún no implementados
        // this.textoEmpleados.text = `Empleados: ${empleados}`;
        // this.textoTiempo.text = `Tiempo: ${tiempo}`;
    }
}