module.exports = ({ mode }, defines) => {
  const BASE_URL = "http://187.237.145.198/HLApp/API_RUTAS";
  const defaultDefines = {
    BASE_URL: JSON.stringify(BASE_URL),
    ASPECTOS_LIMPIEZA_URL: JSON.stringify(`${BASE_URL}/bitacora/aspectosLimpieza.php`),
    ASPECTOS_EVAL_LIMPIEZA_URL: JSON.stringify(`${BASE_URL}/bitacora/evalAspectosLimpieza.php`),
    EVAL_BITACORA_MERMA: JSON.stringify(`${BASE_URL}/bitacora/evalMerma.php`),
  };
  
  return {
    env: Object.assign({}, defaultDefines, defines),
  };
};
