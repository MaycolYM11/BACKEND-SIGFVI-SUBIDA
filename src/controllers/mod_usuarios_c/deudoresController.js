const db = require('../../models/sigfviDBModelo').promise();

const consultaDeudor= async (req,res)=>{
    try {
        const query=`select cd.ID_Deudor_PK as id,cd.Primer_Nombre,cd.Segundo_Nombre,cd.Primer_Apellido,cd.Segundo_Apellido,
        cd.Direccion_Deudor,cd.Telefono_Deudor,e.Nombre_Estado as estado,cd.ID_Estado_FK,scd.Total_Saldo_Deuda as saldo
        from Cuenta_Deudor cd
        inner join Saldo_Cuenta_Deudor scd
        on cd.ID_Deudor_PK = scd.ID_Deudor_FK
        inner join Estado e
        on cd.ID_Estado_FK=e.ID_Estado_PK
        ORDER BY cd.ID_Deudor_PK ASC;`;

        const [result] = await db.query(query);
        res.json(result)
    } catch (error) {
        console.error(`no se hixo la consulta ${error}`);
        res.json(`no se hixo la consulta ${error}`);
    }
}

const buscarDeudorPersonalizado = async (req, res) => {
    try {
        const { nombre, apellido, id } = req.body; // Recibe los parámetros de búsqueda desde el cuerpo de la solicitud

        let query = `SELECT 
                        cd.ID_Deudor_PK as id,
                        cd.Primer_Nombre,
                        cd.Segundo_Nombre,
                        cd.Primer_Apellido,
                        cd.Segundo_Apellido,
                        cd.Direccion_Deudor,
                        cd.Telefono_Deudor,
                        e.Nombre_Estado as estado,
                        cd.ID_Estado_FK,
                        scd.Total_Saldo_Deuda as saldo
                    FROM 
                        Cuenta_Deudor cd
                    INNER JOIN 
                        Saldo_Cuenta_Deudor scd ON cd.ID_Deudor_PK = scd.ID_Deudor_FK
                    INNER JOIN 
                        Estado e ON cd.ID_Estado_FK = e.ID_Estado_PK
                    WHERE 
                        (cd.Primer_Nombre LIKE ? OR
                        cd.Segundo_Nombre LIKE ? OR
                        cd.Primer_Apellido LIKE ? OR
                        cd.Segundo_Apellido LIKE ? OR
                        cd.ID_Deudor_PK = ?)
                    ORDER BY 
                        cd.ID_Deudor_PK ASC;`;

        const [result] = await db.query(query, [`%${nombre}%`, `%${nombre}%`, `%${apellido}%`, `%${apellido}%`, id]);
        res.json(result);
    } catch (error) {
        console.error(`No se pudo realizar la consulta: ${error}`);
        res.status(500).json({ message: 'Error al realizar la consulta' });
    }
}


const crearDeudor = async(req,res)=>{
    const {id,name1,name2,lastname1,lastname2,address,tel,saldo} = req.body;

    try {
        const crate = [`insert into Cuenta_Deudor values(?,?,?,?,?,?,?,1);`,
        `insert into Saldo_Cuenta_Deudor(ID_Deudor_FK,Fecha_Cancelacion_Pedido,Total_Saldo_Deuda) values(?,'2024-02-29',?);`];

        await db.query(crate[0],[id,name1,name2,lastname1,lastname2,address,tel]);
        await db.query(crate[1],[id,saldo]);

        res.json({message: 'Datos ingresados correctamente'})

    } catch (error) {
        res.json({message: "No se pudieron ingresar los datos",error})
        console.error("No se pudieron ingresar los datos",error);
    }
}

const updateDeudor = async(req,res)=>{
    const {id} = req.params;
    const {name1,name2,lastname1,lastname2,address,tel} = req.body;

    try {
        const update = `UPDATE Cuenta_Deudor SET Primer_Nombre=?,Segundo_Nombre=?,Primer_Apellido=?,Segundo_Apellido=?,Direccion_Deudor=?,Telefono_Deudor=? WHERE ID_Deudor_PK = ?;`
        await db.query(update,[name1,name2,lastname1,lastname2,address,tel,id]);

        res.json({message: "actualizacion hecha"});
    } catch (error) {
        console.error("Datos no actualizados",error);
        res.json({message:"Datos no actualizados",error});
    }
}

const cambioSaldoDeudor = async(req,res)=>{
    const {id}= req.params;
    const {saldo} = req.body;

    try {
        const suma = `UPDATE Saldo_Cuenta_Deudor SET Total_Saldo_Deuda=? WHERE ID_Deudor_FK = ?;`;
        await db.query(suma,[saldo,id]);
        res.json({message: "adicion exitosa"});
    } catch (error) {
        console.error('no se pudo sumar ',error);
        res.json('no se pudo sumar ',error)
    }
}

const cambioEstado = async(req,res)=>{
    const {id} = req.params;
    const {state} = req.body;

    try {
        const estado = `update Cuenta_Deudor set ID_Estado_FK = ? where ID_Deudor_PK = ?;`;
        await db.query(estado,[state,id]);
        console.log('Se cambio con exito el estado del Deudor con id: ', id);
        res.json({message: "Estado cambiado"})
    } catch (error) {
        console.error('Edtado no cambiado',error);
        res.json('Edtado no cambiado',error);
    }
}

const desactivarDeudorID = async(req,res)=>{
    const {id} = req.params;
    const {state} = req.body;
    const {ID_Estado_FK} = 0;

    try {
        const estado = `update Cuenta_Deudor set ID_Estado_FK = ? where ID_Deudor_PK = ?;`;
        await db.query(estado,[ID_Estado_FK,`${id}`]);
        console.log('Se cambio con exito el estado del Deudor con id: ', id);
        res.json({message: "Estado cambiado"})
    } catch (error) {
        console.error('Edtado no cambiado',error);
        res.json('Edtado no cambiado',error);
    }
}

const deleteDeudor = async(req,res)=>{
    const {id} = req.params;

    try {
        const borrar = [`delete from Saldo_Cuenta_Deudor where ID_Deudor_FK = ?;`,
        `delete from Cuenta_Deudor where ID_Deudor_PK = ?;`];
        await db.query(borrar[0],[id]);
        await db.query(borrar[1],[id]);
        res.json({message:"datps eliminados"})
    } catch (error) {
        console.error("no se pudo eliminar datos ",error);
        res.json({message:"no se pudo eliminar datos ",error});
    }
}

const verificarIDDeudorExistente = async (req, res) => {
    try {
        const { idDeudor } = req.body;
        const query = 'SELECT ID_Deudor_PK FROM Cuenta_Deudor WHERE ID_Deudor_PK = ? LIMIT 1';
        const [rows] = await db.query(query, [idDeudor]);

        if (rows.length > 0) {
            return res.status(200).json({ exists: true, message: 'El ID del usuario ya existe.' });
        }
        return res.status(200).json({ exists: false, message: 'El ID del usuario estÃ¡ disponible.' });
    } catch (error) {
        console.error('Error al verificar el ID del usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


module.exports = {
    consultaDeudor,
    buscarDeudorPersonalizado,
    crearDeudor,
    updateDeudor,
    deleteDeudor,
    cambioSaldoDeudor,
    desactivarDeudorID,
    cambioEstado,
    verificarIDDeudorExistente
}