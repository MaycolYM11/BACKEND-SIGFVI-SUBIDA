/*
    * Controlador del pago y validacion de la venta en el módulo de ventas.
*/
const db = require('../../../models/sigfviDBModelo').promise();

// ENDPOINT para Crear una nueva venta:
const createVenta = async (req, res) => {
    const { ID_Metodo_Pago_FK, IVA, SubTotal_Venta, Total_Pedido, ID_Saldo_PK, Fecha_Venta, Hora_Venta, ID_Estado_FK, ID_Numero_Identificacion_FK } = req.body;
    // const fechaVenta = new Date().toISOString().split('T')[0];
    // const horaVenta = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    try {
        console.log("--> Creando nueva venta...");
        const query = `
            INSERT INTO Venta (ID_Metodo_Pago_FK, IVA, SubTotal_Venta, Total_Pedido, ID_Saldo_PK, Fecha_Venta, Hora_Venta, ID_Estado_FK, ID_Numero_Identificacion_FK)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await db.query(query, [ID_Metodo_Pago_FK, IVA, SubTotal_Venta, Total_Pedido, ID_Saldo_PK, Fecha_Venta, Hora_Venta, ID_Estado_FK, ID_Numero_Identificacion_FK]);
        console.log("\n---> Venta creada exitosamente.");
        res.json({ message: "Venta creada exitosamente." });
    } catch (error) {
        console.error("\nNo se pudo crear la venta.", error);
        res.status(500).json({ error: "\nNo se pudo crear la venta." });
    }
};






// ENDPOINT para Crear un nuevo detalle de venta:
const createDetalleVenta = async (req, res) => {
    const { ID_Venta_FK, Cantidad_Producto, SubTotal_detalle, ID_Inventario_FK } = req.body;
    try {
        console.log("--> Creando nuevo detalle de venta...");
        const query = `
            INSERT INTO Detalle_Venta (ID_Venta_FK, Cantidad_Producto, SubTotal_detalle, ID_Inventario_FK)
            VALUES (?, ?, ?, ?)`;
        const result = await db.query(query, [ID_Venta_FK, Cantidad_Producto, SubTotal_detalle, ID_Inventario_FK]);
        console.log("\n---> Detalle de venta creado exitosamente.");
        res.json({ message: "Detalle de venta creado exitosamente." });
    } catch (error) {
        console.error("\nNo se pudo crear el detalle de venta.", error);
        res.status(500).json({ error: "\nNo se pudo crear el detalle de venta." });
    }
};

// Exportar los endpoints
module.exports = {
    createVenta,
    createDetalleVenta
};
