
function obtenerColorTextoDesdeRGBA(colorStr) {
    // Esta expresi�n regular captura los 3 primeros grupos de n�meros ignorando los espacios y el Alpha
    const coincidencias = colorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    
    if (!coincidencias) {
        return '#000000'; // Color de seguridad por si el string viene corrupto
    }

    // Convertimos las capturas a n�meros enteros
    const r = parseInt(coincidencias[1], 10);
    const g = parseInt(coincidencias[2], 10);
    const b = parseInt(coincidencias[3], 10);

    // Aplicamos la f�rmula YIQ
    const luminosidad = (r * 299 + g * 587 + b * 114) / 1000;

    // Si la puntuaci�n es alta (borde claro) -> texto negro. Si es baja (borde oscuro) -> texto blanco.
    return luminosidad >= 128 ? '#000000' : '#FFFFFF';
}

// =========================================================================
// ESTILO 1: PARA EL GRUPO DE ESTADO DE CONSERVACI�N
// =========================================================================
function estiloGrupoConservacion(feature, resolution) {
    var valueNUM = feature.get('ENA_N1_00') || '';
        var valueLETRA = feature.get("ENA_L1_00") || '';
    var estado = feature.get('ESTADOS_CONS_Estado_Conservacion');
    var numero = valueNUM + valueLETRA;
/*    if (valueNUM == null) { 
       valueNUM = ""; 
    }
    if (valueLETRA == null) { 
       valueLETRA = ""; 
    }    */
    // Asignamos un color de reborde seg�n el estado de conservaci�n
    var colorBorde = "rgba(0,0,0,1.000)"; // Por defecto negro
    if (estado === 'Bueno')   colorBorde = "rgba(44, 160, 44,1.000)";  
    if (estado === 'Regular') colorBorde = "rgba(255, 127, 0,1.000)";  
    if (estado === 'Malo')    colorBorde = "rgba(227, 26, 28,1.000)";  
    if (estado === 'Ruina')   colorBorde = "rgba(152, 78, 163,1.000)"; 

    // Calculamos el color del interior (blanco o negro) seg�n la claridad del borde
    var colorInterior = obtenerColorTextoDesdeRGBA(colorBorde); 

    return [new ol.style.Style({
        text: new ol.style.Text({
            text: String(numero),
            font: "bold 13px sans-serif",
            fill: new ol.style.Fill({ color: colorInterior }),
            stroke: new ol.style.Stroke({ color: colorBorde, width: 3 })
        })
    })];
}

// =========================================================================
// ESTILO 2: PARA EL GRUPO DE TIPO DE NUMERACI�N
// =========================================================================
function estiloGrupoTipo(feature, resolution) {
    var valueNUM = feature.get('ENA_N1_00') || '';
    var valueLETRA = feature.get("ENA_L1_00") || '';
    var valueCODVIA = feature.get('ENA_CV_00');
    var numero = valueNUM + valueLETRA;

    // Aquí usamos otra paleta de colores completamente distinta para el reborde

    var colorBorde = obtenerColorPorVia(valueCODVIA);
    var colorInterior = obtenerColorTextoDesdeRGBA(colorBorde);

    return [new ol.style.Style({
        text: new ol.style.Text({
            text: String(numero),
            font: "bold 13px sans-serif",
            fill: new ol.style.Fill({ color: colorInterior }),
            stroke: new ol.style.Stroke({ color: colorBorde, width: 3 })
        })
    })];
}



function obtenerColorPorVia(valueCODVIA) {
    // Diccionario de colores (más rápido y limpio que un switch gigante)
    const mapaColores = {

'10': 'rgba(220,78,113,0.494)',
'100': 'rgba(201,23,103,0.494)',
'102': 'rgba(124,71,222,0.494)',
'105': 'rgba(30,125,240,0.494)',
'11': 'rgba(221,123,98,0.494)',
'111': 'rgba(237,115,219,0.494)',
'112': 'rgba(209,132,120,0.494)',
'16': 'rgba(227,212,114,0.494)',
'17': 'rgba(179,236,87,0.494)',
'170': 'rgba(203,140,46,0.494)',
'171': 'rgba(37,204,223,0.494)',
'172': 'rgba(97,216,64,0.494)',
'176': 'rgba(141,219,110,0.494)',
'177': 'rgba(162,215,113,0.494)',
'178': 'rgba(171,232,97,0.494)',
'179': 'rgba(112,234,238,0.494)',
'18': 'rgba(208,35,23,0.494)',
'180': 'rgba(31,213,52,0.494)',
'19': 'rgba(230,119,238,0.494)',
'2': 'rgba(212,94,51,0.494)',
'20': 'rgba(227,184,98,0.494)',
'22': 'rgba(228,19,155,0.494)',
'24': 'rgba(47,205,84,0.494)',
'26': 'rgba(240,96,115,0.494)',
'27': 'rgba(119,37,235,0.494)',
'3': 'rgba(99,178,202,0.494)',
'30': 'rgba(233,69,69,0.494)',
'33': 'rgba(184,134,238,0.494)',
'34': 'rgba(240,229,77,0.494)',
'35': 'rgba(142,109,225,0.494)',
'36': 'rgba(237,184,38,0.494)',
'37': 'rgba(205,77,177,0.494)',
'38': 'rgba(46,200,54,0.494)',
'39': 'rgba(193,17,220,0.494)',
'4': 'rgba(224,81,164,0.494)',
'41': 'rgba(231,186,134,0.494)',
'43': 'rgba(204,176,62,0.494)',
'44': 'rgba(214,87,23,0.494)',
'45': 'rgba(156,50,227,0.494)',
'46': 'rgba(215,239,37,0.494)',
'47': 'rgba(149,124,238,0.494)',
'48': 'rgba(116,204,100,0.494)',
'49': 'rgba(144,173,237,0.494)',
'5': 'rgba(134,228,212,0.494)',
'50': 'rgba(227,132,227,0.494)',
'5002': 'rgba(19,29,213,0.494)',
'5004': 'rgba(46,213,77,0.494)',
'5005': 'rgba(124,223,174,0.494)',
'5006': 'rgba(33,141,218,0.494)',
'5007': 'rgba(213,107,14,0.494)',
'52': 'rgba(128,202,121,0.494)',
'53': 'rgba(106,168,204,0.494)',
'54': 'rgba(110,208,185,0.494)',
'55': 'rgba(37,56,200,0.494)',
'56': 'rgba(214,24,37,0.494)',
'57': 'rgba(110,213,141,0.494)',
'58': 'rgba(215,23,199,0.494)',
'59': 'rgba(117,204,172,0.494)',
'6': 'rgba(53,238,49,0.494)',
'60': 'rgba(181,216,77,0.494)',
'61': 'rgba(22,119,210,0.494)',
'62': 'rgba(181,70,209,0.494)',
'64': 'rgba(214,223,43,0.494)',
'66': 'rgba(202,35,99,0.494)',
'67': 'rgba(135,210,82,0.494)',
'68': 'rgba(99,218,167,0.494)',
'70': 'rgba(108,203,57,0.494)',
'71': 'rgba(93,146,231,0.494)',
'72': 'rgba(97,235,157,0.494)',
'73': 'rgba(113,224,154,0.494)',
'74': 'rgba(44,213,196,0.494)',
'76': 'rgba(191,140,233,0.494)',
'77': 'rgba(201,15,148,0.494)',
'79': 'rgba(228,110,171,0.494)',
'8': 'rgba(61,102,224,0.494)',
'81': 'rgba(210,133,82,0.494)',
'82': 'rgba(89,76,235,0.494)',
'83': 'rgba(101,205,226,0.494)',
'85': 'rgba(183,113,208,0.494)',
'86': 'rgba(29,60,202,0.494)',
'87': 'rgba(76,74,217,0.494)',
'88': 'rgba(72,223,218,0.494)',
'89': 'rgba(204,87,111,0.494)',
'9': 'rgba(238,238,122,0.494)',
'91': 'rgba(190,219,127,0.494)',
'93': 'rgba(92,190,232,0.494)',
'96': 'rgba(213,123,151,0.494)',
'97': 'rgba(170,95,208,0.494)',
'98': 'rgba(203,238,48,0.494)',
'99': 'rgba(104,236,196,0.494)',


'114': 'rgba(168,41,203,1.0)',
'115': 'rgba(218,161,55,1.0)',
'116': 'rgba(113,234,234,1.0)',
'117': 'rgba(205,145,93,1.0)',
'119': 'rgba(235,112,100,1.0)',
'120': 'rgba(141,239,71,1.0)',
'121': 'rgba(205,57,24,1.0)',
'122': 'rgba(215,71,100,1.0)',
'123': 'rgba(67,63,200,1.0)',
'124': 'rgba(74,218,206,1.0)',
'125': 'rgba(105,132,211,1.0)',
'126': 'rgba(223,106,139,1.0)',
'127': 'rgba(117,186,202,1.0)',
'128': 'rgba(83,184,224,1.0)',
'129': 'rgba(204,47,136,1.0)',
'130': 'rgba(75,209,12,1.0)',
'131': 'rgba(204,126,30,1.0)',
'132': 'rgba(186,221,106,1.0)',
'133': 'rgba(129,106,211,1.0)',
'134': 'rgba(237,137,79,1.0)',
'135': 'rgba(187,100,200,1.0)',
'138': 'rgba(225,35,178,1.0)',
'139': 'rgba(208,54,198,1.0)',
'140': 'rgba(22,201,135,1.0)',
'141': 'rgba(134,29,239,1.0)',
'142': 'rgba(235,141,185,1.0)',
'143': 'rgba(163,209,114,1.0)',
'144': 'rgba(41,52,205,1.0)',
'146': 'rgba(115,204,112,1.0)',
'147': 'rgba(226,228,113,1.0)',
'149': 'rgba(95,169,233,1.0)',
'150': 'rgba(228,200,116,1.0)',
'151': 'rgba(49,222,78,1.0)',
'152': 'rgba(116,167,234,1.0)',
'153': 'rgba(58,217,37,1.0)',
'154': 'rgba(203,122,206,1.0)',
'155': 'rgba(168,210,106,1.0)',
'156': 'rgba(187,207,114,1.0)',
'157': 'rgba(231,137,217,1.0)',
'158': 'rgba(204,181,63,1.0)',
'159': 'rgba(96,184,239,1.0)',
'161': 'rgba(111,68,203,1.0)',
'162': 'rgba(206,198,88,1.0)',
'163': 'rgba(208,129,98,1.0)',
'165': 'rgba(192,208,67,1.0)',
'166': 'rgba(114,203,120,1.0)',
'168': 'rgba(228,79,136,1.0)',
'23': 'rgba(39,190,207,1.0)',
'25': 'rgba(112,219,160,1.0)',
'5002': 'rgba(237,140,205,1.0)',
'5004': 'rgba(49,202,87,1.0)',
'5009': 'rgba(104,213,162,1.0)',
'5011': 'rgba(120,227,158,1.0)',
'5012': 'rgba(73,221,194,1.0)',
'5013': 'rgba(158,240,136,1.0)',
'5014': 'rgba(236,105,105,1.0)',
'5016': 'rgba(13,226,166,1.0)',
'5017': 'rgba(77,99,224,1.0)',
'5018': 'rgba(184,106,220,1.0)',
'5020': 'rgba(138,128,211,1.0)',
'5021': 'rgba(31,93,207,1.0)',
'5022': 'rgba(200,100,110,1.0)',
'5023': 'rgba(163,53,236,1.0)'


    };

    // Forzamos conversión a String para asegurar coincidencia exacta de la propiedad
    const clave = String(valueCODVIA);

    // Retorna el color del mapa. Si no se encuentra, aplica el default (negro)
    return mapaColores[clave] || 'rgba(255,255,255,1.000)';
}




var size = 0;
var placement = 'point';

var style_EibCcl_Numeracion_Catastro_3 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var valueCODVIA = feature.get("ENA_CV_00");
    var valueSGVIA = feature.get("EibCcl_Callejero_eibTipVia");
    var valueNOMVIA = feature.get("EibCcl_Callejero_eibNomVia");
    var nombreNUCLEO = String(valueCODVIA + " - " + valueSGVIA + " / " + valueNOMVIA)
    var valueNUM = feature.get("ENA_N1_00");
    var valueLETRA = feature.get("ENA_L1_00");
    var valueTIPO = feature.get("EN1_TIPO");
    var valueESTCONS = feature.get("ESTADOS_CONS_Estado_Conservacion");
    if (valueNUM == null) { 
       valueNUM = ""; 
    }
    if (valueLETRA == null) { 
       valueLETRA = ""; 
    }
/*    var labelFont = "bold 13px sans-serif";
    var labelFill = "#000000";
    var circleFill = "#4fc3f7";
    var bufferColor = "#aaaaaa";
    if (valueTIPO == "00_N1") {
    	circleFill = "#0d47a1";
    }
    if (valueESTCONS == "Bueno") {
    	bufferColor = "#2ca02c";
    	labelFill = "#ffffff"
    }
    if (valueESTCONS == "Regular") {
    bufferColor = "#ff7f00";
    labelFill = "#ffffff"
    }
    if (valueESTCONS == "Malo") {
    	bufferColor = "#e31a1c";
    	labelFill = "#ffffff"
    }
    if (valueESTCONS == "Ruina") {
    	bufferColor = "#984ea3";
    	labelFill = "#ffffff"
    }
*/
    
    var bufferWidth = 7;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'point';
    if ("" !== null) {
        labelText = String(valueNUM + valueLETRA);
    }
    var radioCirculo = 12;
    
   
    
/*        var style = [ 
        new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            displacement: [offsetX, offsetY],
            stroke: new ol.style.Stroke({
            color: circleFill,
            width: 3.5
        })
        })
    }),
    new ol.style.Style({
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, bufferWidth)
    })];;
*/


/*
switch(String(valueCODVIA)) {

case '60': circleFill = 'rgba(255,96,17,1.0)'; break;
case '85': circleFill = 'rgba(221,237,127,1.0)'; break;
case '94': circleFill = 'rgba(136,111,225,1.0)'; break;
case '95': circleFill = 'rgba(203,199,80,1.0)'; break;
case '98': circleFill = 'rgba(109,230,48,1.0)'; break;
case '101': circleFill = 'rgba(135,211,55,1.0)'; break;
case '103': circleFill = 'rgba(236,178,79,1.0)'; break;
case '105': circleFill = 'rgba(215,62,41,1.0)'; break;
case '107': circleFill = 'rgba(224,25,171,1.0)'; break;
case '108': circleFill = 'rgba(71,153,200,1.0)'; break;
case '109': circleFill = 'rgba(182,114,207,1.0)'; break;
case '111': circleFill = 'rgba(77,123,239,1.0)'; break;
case '112': circleFill = 'rgba(205,171,35,1.0)'; break;
case '114': circleFill = 'rgba(102,213,79,1.0)'; break;
case '115': circleFill = 'rgba(18,200,18,1.0)'; break;
case '120': circleFill = 'rgba(102,202,227,1.0)'; break;
case '121': circleFill = 'rgba(18,116,228,1.0)'; break;
case '5002': circleFill = 'rgba(240,125,80,1.0)'; break;
case '5003': circleFill = 'rgba(231,121,24,1.0)'; break;
case '5004': circleFill = 'rgba(78,70,214,1.0)'; break;
case '5005': circleFill = 'rgba(237,122,225,1.0)'; break;
case '5006': circleFill = 'rgba(14,223,87,1.0)'; break;
case '5007': circleFill = 'rgba(33,220,161,1.0)'; break;
case '5008': circleFill = 'rgba(208,118,123,1.0)'; break;
case '5009': circleFill = 'rgba(129,141,233,1.0)'; break;
case '5010': circleFill = 'rgba(125,72,203,1.0)'; break;
case '5011': circleFill = 'rgba(216,81,135,1.0)'; break;
case '5016': circleFill = 'rgba(107,234,173,1.0)'; break;
case '5017': circleFill = 'rgba(134,18,222,1.0)'; break;
case '5018': circleFill = 'rgba(233,92,172,1.0)'; break;
case '5019': circleFill = 'rgba(156,215,28,1.0)'; break;
case '5020': circleFill = 'rgba(67,237,95,1.0)'; break;
case '5021': circleFill = 'rgba(212,44,227,1.0)'; break;
case '5022': circleFill = 'rgba(87,200,204,1.0)'; break;

    case '123': circleFill = 'rgba(179,48,240,1.000)'; break;
    case '24': circleFill = 'rgba(239,81,94,1.000)'; break;
    case '26': circleFill = 'rgba(168,237,31,1.000)'; break;
    case '49': circleFill = 'rgba(37,40,211,1.000)'; break;
    case '50': circleFill = 'rgba(61,204,166,1.000)'; break;
    case '5001': circleFill = 'rgba(127,200,54,1.000)'; break;
    case '5021': circleFill = 'rgba(93,234,222,1.000)'; break;
    case '51': circleFill = 'rgba(191,216,51,1.000)'; break;
    case '53': circleFill = 'rgba(38,226,145,1.000)'; break;
    case '55': circleFill = 'rgba(121,232,145,1.000)'; break;
    case '57': circleFill = 'rgba(219,29,143,1.000)'; break;
    case '58': circleFill = 'rgba(96,27,234,1.000)'; break;
    case '59': circleFill = 'rgba(110,175,229,1.000)'; break;
    case '60': circleFill = 'rgba(198,72,217,1.000)'; break;
    case '62': circleFill = 'rgba(133,119,202,1.000)'; break;
    case '64': circleFill = 'rgba(106,215,87,1.000)'; break;
    case '65': circleFill = 'rgba(232,68,197,1.000)'; break;
    case '67': circleFill = 'rgba(210,65,128,1.000)'; break;
    case '69': circleFill = 'rgba(201,109,75,1.000)'; break;
    case '7': circleFill = 'rgba(115,229,159,1.000)'; break;
    case '71': circleFill = 'rgba(202,84,71,1.000)'; break;
    case '76': circleFill = 'rgba(224,222,79,1.000)'; break;
    case '78': circleFill = 'rgba(25,152,202,1.000)'; break;
    case '79': circleFill = 'rgba(122,159,223,1.000)'; break;
    case '80': circleFill = 'rgba(236,200,58,1.000)'; break;
    case '83': circleFill = 'rgba(45,199,216,1.000)'; break;
    case '85': circleFill = 'rgba(212,23,70,1.000)'; break;
    case '86': circleFill = 'rgba(227,160,53,1.000)'; break;
    case '87': circleFill = 'rgba(231,129,228,1.000)'; break;
    case '88': circleFill = 'rgba(154,95,209,1.000)'; break;
    case '89': circleFill = 'rgba(51,234,57,1.000)'; break;
    case '90': circleFill = 'rgba(83,106,207,1.000)'; break;
    case '91': circleFill = 'rgba(88,233,20,1.000)'; break;
    default: circleFill = 'rgba(0,0,0,1.000)'; break;
}
*/


var style = [ 

/*
            // 1. EL C�RCULO
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radioCirculo,
                    displacement: [offsetX, offsetY], // Tu desplazamiento original del c�rculo
                    stroke: new ol.style.Stroke({
                        color: circleFill,
                        width: 3.5
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 0)' // Centro totalmente transparente para ver el texto
                    })
                })
            }),
*/
            
            // 2. EL TEXTO PERFECTAMENTE CENTRADO
            new ol.style.Style({
                text: new ol.style.Text({
                    text: labelText,
                    font: labelFont,
                    fill: new ol.style.Fill({
                        color: obtenerColorTextoDesdeRGBA(circleFill)
                    }),
                    stroke: new ol.style.Stroke({
                        color: circleFill,
                        width: bufferWidth
                    }),
                    
                    // =========================================================
                    // LAS 4 PROPIEDADES CLAVE PARA EL CENTRADO ABSOLUTO
                    // =========================================================
                    textAlign: 'center',     // Fuerza el centro horizontal del texto
                    textBaseline: 'middle',  // Fuerza el centro vertical del texto
                    offsetX: offsetX,        // Sigue al c�rculo en el eje X
                    offsetY: -offsetY,       // Sigue al c�rculo en el eje Y (OpenLayers invierte el signo Y en el texto respecto a displacement)
                    // =========================================================
                    
                    placement: placement
                })
            })
        ];
    

    return style;
};
