/** 
 * @author alu0101017839
 * @file Programa que resuelve el problema de las ocho reinas con la restriccion extra de que no se pueden alinear tres en la misma recta
 * @copyright Mio
 * @since Fecha de subida
 * */

/** 
 * Guarda un par de coordenadas (x, y)
 * */

class coordenada {

    /** 
     * @param {number} posX_ - Posicion en x (horizontal)
     * @param {number} posY_ - Posicion en y (vertical)
     * */
  
    constructor (posX_, posY_){
      this.posX = posX_;
      this.posY = posY_;
    }
  };
  
  /** 
   * Almacena una recta y = pendiente*x + altura
   * */
  
  class recta {
  
    /**
     * @param {number} pendiente_ - Pendiente
     * @param {number} altura_ - Altura (y) a no ser que la pendiente sea infinita, que sería desviacion lateral (x)
     * */
  
    constructor (pendiente_, altura_){
      this.pendiente = pendiente_;
      this.altura = altura_;
    }
  };
  
  if (process.argv.length < 3){
    console.log("Error introduce solamente el lado del tablero.");
    process.exit();
  }
  let ladoTablero = process.argv[2] - 0;
  if (ladoTablero < 8){
    console.log("Error el lado del tablero debe ser superior a 7.");
    process.exit();
  }
  
  process.stdin.setEncoding('utf-8');
  
  const start = new Date();
  let startEditable = start;
  
  let soluciones = resolverNReinas();
  
  mostrar (soluciones[0]);
  soluciones.shift();
  
  seguirONo (soluciones);
  
  
  
  /**
   * Crea un event listener que comprueba si es necesario seguir mostrando soluciones mientras queden y si lo es, las muestra junto a los tiempos de calculo y desde el inicio del programa
   * */
  
  function seguirONo (){
    console.log(" Tiempo invertido en el calculo:", Math.floor((soluciones.tiempo [0])/500) / 2,"segundos (" + soluciones.tiempo [0], "ms)\n Tiempo transcurrido desde el inicio: ", Math.floor((new Date() - start)/500) / 2, "\n ¿Mostrar la siguiente solución?\n (s/n)");
    soluciones.tiempo.shift();
    process.stdin.on('data', function (data) {
      if ((data === 's\n')||(data === 'S\n')){
        mostrar (soluciones[0]);
        soluciones.shift();
        console.log(" Tiempo invertido en el calculo:", Math.floor((soluciones.tiempo [0])/500) / 2,"segundos (" + soluciones.tiempo [0], "ms)\n Tiempo transcurrido desde el inicio:", Math.floor((new Date() - start)/500) / 2, "segundos.");
        soluciones.tiempo.shift();
        if (soluciones.length == 0){
          console.log (" Ya no quedan soluciones.\n");
          process.exit();
        }
        console.log("\n ¿Mostrar la siguiente solución?");
      } else if ((data === 'n\n')||(data === 'N\n')){
        process.exit();
      } else {
        console.log(" (s/n)");
      }
    });
  }
  
  /**
   * Muestra el tablero con las reinas en 'reinas'
   * @constructor
   * @param {array} reinas - Almacena reinas (sus posiciones)
   * */
  
  function mostrar (reinas) {
    let print = "\n   ";
    for (let casilla = 1; casilla <= ladoTablero; casilla++)
      print += (casilla + " ");
    console.log (print);
    print = "   ";
    let posHoriz = 0;
    for (casilla = 0; casilla < ladoTablero*ladoTablero; casilla++){
      if (posHoriz == ladoTablero){
        print += (ladoTablero - ((casilla / ladoTablero) - 1)) + "\n   ";
        posHoriz = 0;
      }
      posHoriz++;
      
      let hayReina = false;
      for (actual = 0; actual < reinas.length; actual++){
        if (((casilla % ladoTablero) == reinas[actual].posX) && (((casilla / ladoTablero) - ((casilla / ladoTablero)%1)) == reinas[actual].posY)){
          hayReina = true;
          break;
        }
      }
        
      if (hayReina){
        print += "Q ";
      } else {
        print += ". ";
      }
    }
    console.log (print + "1\n");
  }
  
  /**
   * Calcula las soluciones al problema y guarda el tiempo de procesamiento
   * @constructor
   * @param {array} reinas2 - Vector que simplemente se copia a 'reinas' para poder editarlo sin problemas. Almacena las reinas colocadas (sus posiciones)
   * @param {number} colocadas - Numero de reinas colocadas (en el vector 'reinas')
   * @param {coordenada} nueva - Reina calculada en la anterior iteración. Se inserta en el vector 'reinas'.
   * @param {array} devolver - Almacena las solucioness encontradas y su tiempo de calculo en .tiempo en la misma posicion.
   * */
  
  function resolverNReinas (reinas2 = [], colocadas = 0, nueva, devolver = []){
    let reinas = [];
    for (elemento = 0; elemento < reinas2.length; elemento++){
      reinas.push(reinas2 [elemento]);
    }
    
    if (nueva != null){
      reinas.push (nueva);
    } else {
      devolver.tiempo = [];
    }
    if (colocadas == ladoTablero){
      devolver.push (reinas);
      devolver.tiempo.push (new Date() - startEditable);
      startEditable = new Date();
      return devolver;
    }
    
    let eleccion = 0;
    let actual = anadirReina (reinas, eleccion);
    while (actual != null){
      devolver = resolverNReinas (reinas, colocadas + 1, actual, devolver);
      eleccion++;
      actual = anadirReina (reinas, eleccion);
    }
    
    return devolver;
  }
  
  /**
   * Añade una reina que no amenace a las demas en el array 'reinas' y que no este sobre la misma linea que cualesquiera otras dos
   * @constructor
   * @param {array} reinas - Vector que almacena las reinas colocadas (sus posiciones)
   * @param {number} eleccion - Numero de entre las posibilidades encontradas para colocar la reina
   * @returns {coordenada} - Posicion que cumple las condiciones encontrada o null
   * */
  
  function anadirReina (reinas, eleccion){
    
    /**
     * Busca una posicion que no coincida diagonal, vertical u horizontalmente con ninguna otra reina y luego comprueba la otra restriccion mediante pisaLinea
     * @returns {coordenada} La posicion o null
     * */
    
    function nuevaPosicion (){
      let posibilidadActual = 0;
      let posY = (reinas.length == 0) ? 0 : reinas [reinas.length - 1].posY + 1;
      
      for (posX = 0; posX < ladoTablero; posX++){
        let sitioLibre = true;
        for (reinaActual = 0; reinaActual < reinas.length; reinaActual++){
          if (posX == reinas[reinaActual].posX){
            sitioLibre = false;
            break;
          }
          let posXorigenActual = posX - reinas[reinaActual].posX;
          let posYorigenActual = posY - reinas[reinaActual].posY;
          if ((posXorigenActual == posYorigenActual)||(posXorigenActual == -posYorigenActual)){
            sitioLibre = false;
            break;
          }
        }
        
        if (sitioLibre){
          let posTemp = new coordenada (posX, posY);
          if (!pisaLinea (posTemp)){
            if (posibilidadActual == eleccion){
              return (posTemp);
            }
            posibilidadActual++;
          }
        }
      }
      return null;
    }
    
    /**
     * Comprueba si el punto esta en la misma linea que cualesquiera dos reinas
     * @constructor
     * @param {coordenada} punto - Punto (posicion de posible reina)
     * @returns {boolean} true o false
     * */
    
    function pisaLinea (punto){
      for (reinaPuntoInicial = 0; reinaPuntoInicial < (reinas.length - 1); reinaPuntoInicial++){
        for (reinaPuntoFinal = reinaPuntoInicial + 1; reinaPuntoFinal < reinas.length; reinaPuntoFinal++){
          if (estaEnLaRecta (punto, rectaDosPuntos (reinas[reinaPuntoInicial], reinas[reinaPuntoFinal]))){
            return true;
          }
        }
      }
      return false;
    }
    
    let posTemp = nuevaPosicion ();
    if (posTemp){
      return (posTemp);
    } else {
      return null;
    }
  }
  
  /**
   * Comprueba si el punto esta en la recta
   * @constructor
   * @param {coordenada} punto - El punto
   * @param {recta} linea - La linea
   * @returns {boolean} true o false
   * */
  
  function estaEnLaRecta (punto, linea){
    if (linea.pendiente == Infinity){
      return (linea.altura == punto.posX);
    } else {
      return (punto.posY == ((linea.pendiente * punto.posX) + linea.altura));
    }
  }
  
  /**
   * Calcula la recta generada por dos puntos
   * @constructor
   * @param {coordenada} punto1 - El punto
   * @param {coordenada} punto2 - El otro punto
   * @returns {recta} La linea que generan
   * */
  
  function rectaDosPuntos (punto1, punto2){
    if (punto1.posX < punto2.posX){
      menorEnX = punto1;
      mayorEnX = punto2;
    } else if (punto1.posX > punto2.posX){
      menorEnX = punto2;
      mayorEnX = punto1;
    } else if (punto1.posY == punto2.posY){
      return null;
    } else {
      return new recta (1/0, punto1.posX);
    }
    let pendiente = (mayorEnX.posY - menorEnX.posY) / (mayorEnX.posX - menorEnX.posX);
    
    return (new recta (pendiente, (punto1.posY - (pendiente * punto1.posX))));
  }