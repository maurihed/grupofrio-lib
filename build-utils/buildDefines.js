module.exports = ({ mode }, defines) => {
  const BASE_URL = "http://187.237.145.198/HLApp/API_RUTAS";
  const defaultDefines = {
    BASE_URL: JSON.stringify(BASE_URL),
    ASPECTOS_LIMPIEZA_URL: JSON.stringify(`${BASE_URL}/bitacora/aspectosLimpieza.php`),
    ASPECTOS_EVAL_LIMPIEZA_URL: JSON.stringify(`${BASE_URL}/bitacora/evalAspectosLimpieza.php`),
    EVAL_BITACORA_MERMA: JSON.stringify(`${BASE_URL}/bitacora/evalMerma.php`),
    EVAL_VARIABLE_COMISION_PROD: JSON.stringify(`${BASE_URL}/comisiones_produccion/variables.php`),
    CONFIGURACION_TURNO: JSON.stringify(`${BASE_URL}/configuracion/turno.php`),
    CONFIGURACION_VARIABLES_VENDEDORES: JSON.stringify(`${BASE_URL}/configuracion/variablesVendedores.php`),
    FALLAS_PRODUCCION: JSON.stringify(`${BASE_URL}/produccion/fallas.php`),
    TANQUE_PRODUCCION: JSON.stringify(`${BASE_URL}/produccion/tanques.php`),
    REPORTES_ARQUEO: JSON.stringify(`${BASE_URL}/reportes/arqueo.php`),
    REPORTES_FRECUENCIA_UNIDADES: JSON.stringify(`${BASE_URL}/reportes/frecuencias/unidades.php`),
    REPORTES_FRECUENCIA_SUCURSALES: JSON.stringify(`${BASE_URL}/reportes/frecuencias/sucursales.php`),
    REPORTES_CONCENTRADO: JSON.stringify(`${BASE_URL}/reportes/concentrado.php`),
    TABLERO_DIRECTIVOS: JSON.stringify(`${BASE_URL}/reportes/directivos/index.php`),
    CRUD_KPI: JSON.stringify(`${BASE_URL}/reportes/crudPuntos.php`),
    CONFIGURACION_TURNO_VARIABLES: JSON.stringify(`${BASE_URL}/configuracion/turnoVariableComision.php`),
    RUTAS_API_URL: JSON.stringify(`${BASE_URL}/rutas/index.php`),
    RUTAS_FRECUENCIAS_API_URL: JSON.stringify(`${BASE_URL}/rutas/frecuencias.php`),
  };
  
  return {
    env: Object.assign({}, defaultDefines, defines),
  };
};
