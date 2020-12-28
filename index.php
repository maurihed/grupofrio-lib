<?php
$menu = [
  [
    'tipo' => 'link',
    'nombre' => 'Concentrado',
    'url' => 'http://187.237.145.198/HLApp/GrupoFrio/views/reportes/concentrado.php',
    'icon' => 'http://187.237.145.198/HLApp/img/menuReportes/conc1.svg',
    'iconHovered' => 'http://187.237.145.198/HLApp/img/menuReportes/conc2.svg',
    'permiso' => 'concentrado'
  ],
  [
    'tipo' => 'dropdown',
    'nombre' => 'Frecuencias',
    'icon' => 'http://187.237.145.198/HLApp/img/menuReportes/conc1.svg',
    'iconHovered' => 'http://187.237.145.198/HLApp/img/menuReportes/conc2.svg',
    'permiso' => 'frecuencia',
    'children' => [
      [
        'nombre' => 'Frecuencia',
        'url' => 'http://187.237.145.198/HLApp/views/reportesVenta/#frecuencias',
        'permiso' => 'frecuencia.frecuencia',
      ],
      [
        'nombre' => 'Frecuencia Oxxo',
        'url' => 'http://187.237.145.198/HLApp/views/reportesVenta/#frecuenciasOxxo',
        'permiso' => 'frecuencia.oxxo',
      ],
      [
        'nombre' => 'Frecuencia vendedores',
        'url' => 'http://187.237.145.198/HLApp/GrupoFrio/views/reportes/frecuencias/unidades.php',
        'permiso' => 'frecuencia.vendedores',
      ]
    ]
  ]
];

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PHP with VUE</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="http://187.237.145.198/HLApp/fonts/Axiforma/Axiforma%20Bold.otf">
  <link rel="stylesheet" href="http://187.237.145.198/HLApp/fonts/Axiforma/Axiforma%20Bold.otf">
  <link rel="stylesheet" href="./dist/main.css">
</head>
<body>
<div class="topBar">
    <span class="topBar__text"><span class="topBar__text--highlight">Hielos</span> Laurita</span>
  </div>
  <nav class="desktop-nav z-depth-0 white">
    <div class="logo-menu">
      <div class="mobile-menu">
        <a href="#" data-target="slide-out" class="sidenav-trigger" id="menu"><i class="material-icons">menu</i></a>
      </div>
      <a id="logo" href="/HLApp/views/index.php" class="brand-logo"><img src="http://187.237.145.198/HLApp/img/logoLaurita.png" alt="Logo"></a>
    </div>
    <div class="menu-items">
      <div class="nav-wrapper">
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a href="/HLApp/views/evalMaquinas">MAQUINAS</a><div class="alert parpadeo" id="alertMaquinas">19</div></li>
          <li><a href="/HLApp/views/puestos/evaluaciones.php/">EVALUAR PUESTO</a><div class="alert" id="alertPuesto">0</div></li>
          <li><a href="/HLApp/views/contestarE.php">CONTESTAR ENCUESTA</a><div class="alert" id="alertEncuesta">0</div></li>
          <li><a href="/HLApp/views/evalOtros.php">REALIZAR EVALUACION</a><div class="alert" id="alertEvaluacion">1</div></li>
          <li><a class="dropdown-trigger" id="userName" href="#!" data-target="dropdownUsuario">YAMIL ESTEBAN HIGAREDA<i class="material-icons right">arrow_drop_down</i></a>
            <ul id="dropdownUsuario" class="dropdown-content">
              <li><a href="javascript:cerrarSesion()">CERRAR SESION</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <ul id="slide-out" class="sidenav">
    <div class="top-menu">
      <a id="back-top-menu" role="button" onclick="M.Sidenav.getInstance(document.getElementById('slide-out')).close()">&lt;</a>
      <span class="title-top-menu">Hielos <span>Laurita</span></span>
    </div>
    <div class="body-menu">
      <li>
        <ul class="collapsible" data-collapsible="accordion">
          <li>
            <div class="collapsible-header sidebar-menu-lvl-1">Recursos Humanos<i class="material-icons right">arrow_drop_down</i></div>
            <div class="collapsible-body p-0">
              <ul>
                <li>
                    <ul class="collapsible" data-collapsible="accordion">
                      <li>
                        <div class="collapsible-header sidebar-menu-lvl-2">Encuestas<i class="material-icons right">arrow_drop_down</i></div>
                        <div class="collapsible-body" style="display: none;">
                          <ul>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/crearE/" class="linkCollapse">Crear</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/resultadosE.php" class="linkCollapse">Resultados</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/cancelarE.php" class="linkCollapse">Cancelar</a></li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                </li>
                <li>
                    <ul class="collapsible" data-collapsible="accordion">
                      <li>
                        <div class="collapsible-header sidebar-menu-lvl-2">Evaluaciones<i class="material-icons right">arrow_drop_down</i></div>
                        <div class="collapsible-body" style="display: none;">
                          <ul>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/asignarEvaluacion.php" class="linkCollapse">Asignar</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/resultadosEvalO.php" class="linkCollapse">Resultados</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/crudCualidades.php" class="linkCollapse">Cualidades</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/cancelarE.php" class="linkCollapse">Cancelar</a></li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                </li>
                <li>
                    <ul class="collapsible" data-collapsible="accordion">
                      <li class="">
                        <div class="collapsible-header sidebar-menu-lvl-2">Recompensas<i class="material-icons right">arrow_drop_down</i></div>
                        <div class="collapsible-body" style="display: none;">
                          <ul>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/altaRecompensa.php" class="linkCollapse">Gestión</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/recompensas.php" class="linkCollapse">Dar Recompensas</a></li>
                            <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/recompensas/" class="linkCollapse">Recompensas cobradas</a></li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                </li>
                <li class="sidebar-menu-lvl-3"><a href="/HLApp/views/promociones.php" class="linkCollapse">Mensajes al cliente</a></li>
              </ul>
            </div>
          </li>
          </ul>
      </li>
      <li class="sidebar-menu-lvl-0"><a href="/HLApp/views/reportes/" disabled="">Reportes</a></li>
    </div>
  </ul>

  <div class="infoBar">
    <div class="infoBar__title">
      <h4 id="tituloVentana">Bienvenido</h4>
    </div>
    <div class="infoBar__degradado">
      <h5 id="infoBar__sucursal">SUC07</h5>
    </div>
  </div>
  <aside class="menu open">
      <ul>
        <?php foreach($menu as $item): ?>
          <?php if($item['tipo'] == 'dropdown'):?>
            <li>
              <div class="menu-item">
                <div class="menu-item-icon">
                  <img src="<?=$item['icon']?>" alt="<?=$item['nombre']?>">
                  <img class="img-active" src="<?=$item['iconHovered']?>" alt="<?=$item['nombre']?>">
                </div>
                <div class="menu-item-name">
                  <ul class="collapsible noMargin" data-collapsible="accordion">
                    <li>
                      <div class="collapsible-header"><?=$item['nombre']?> <i class="large material-icons">arrow_drop_down</i></div>
                      <div class="collapsible-body">
                          <ul>
                            <?php foreach($item['children'] as $child): ?>
                              <li class="aside-li"><a href="<?=$child['url']?>"><?=$child['nombre']?></a></li>
                            <?php endforeach;?>
                          </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          <?php else: ?>
            <li>
              <a href="#" class="menu-item">
                <div class="menu-item-icon">
                  <img src="<?=$item['icon']?>" alt="<?=$item['nombre']?>">
                  <img class="img-active" src="<?=$item['iconHovered']?>" alt="<?=$item['nombre']?>">
                </div>
                <div class="menu-item-name">
                  <span><?=$item['nombre']?></span>
                </div>
              </a>
            </li>
          <?php endif;?>
        <?php endforeach;?>
      </ul>
      <ul class="menu-footer">
          <li class="aside-li"><a role="button" onclick="reporteMenu('close')">Cerrar menu</a></li>
      </ul>
      <button class="btn-side-menu" onclick="reporteMenu()">Mostrar menu</button>
    </aside>
    <div class="bodyReporte menuReportesOpened" id="app">
    <div class="container">
      <br>
      <div class="row">
        <pre>
          <?php var_dump($menu); ?>
        </pre>
      </div>
    </div>
  </div>
  <script src="./dist/bundle.js"></script>
</body>
</html>