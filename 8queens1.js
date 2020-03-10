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


let reinas = resolver8Reinas();

mostrar (reinas);


/**
 * Muestra el tablero con las reinas en 'reinas'
 * @constructor
 * @param {array} reinas - Almacena reinas (sus posiciones)
 * */

function mostrar (reinas) {
  console.log ("\n   0 1 2 3 4 5 6 7");
  let print = "   ";
  let posHoriz = 0;
  for (casilla = 0; casilla < 64; casilla++){
    if (posHoriz == 8){
      print += ((casilla / 8) - 1) + "\n   ";
      posHoriz = 0;
    }
    posHoriz++;
    
    let hayReina = false;
    for (actual = 0; actual < reinas.length; actual++){
      if (((casilla % 8) == reinas[actual].posX) && (((casilla / 8) - ((casilla / 8)%1)) == reinas[actual].posY)){
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
  console.log (print + "7\n");
}


/**
 * Calcula una solucion al problema
 * @constructor
 * @param {array} reinas2 - Vector que simplemente se copia a 'reinas' para poder editarlo sin problemas. Almacena las reinas colocadas (sus posiciones)
 * @param {number} colocadas - Numero de reinas colocadas (en el vector 'reinas')
 * @param {coordenada} nueva - Reina calculada en la anterior iteración. Se inserta en el vector 'reinas'.
 * @returns {array} reinas (copia) cuando todas estan colocadas
 * */

function resolver8Reinas (reinas2 = [], colocadas = 0, nueva){
  let reinas = [];
  for (elemento = 0; elemento < reinas2.length; elemento++){
    reinas.push(reinas2 [elemento]);
  }
  
  if (nueva != null){
    reinas.push (nueva);
  }
  if (colocadas == 8){
    return reinas;
  }
  
  let eleccion = 0;
  let actual = anadirReina (reinas, eleccion);
  let resultado = null;
  while ((resultado == null)&&(actual != null)){
    resultado = resolver8Reinas (reinas, colocadas + 1, actual);
    eleccion++;
    actual = anadirReina (reinas, eleccion);
  }
  
  return (resultado);
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
   * Busca una posicion que no coincida diagonal, vertical u horizontalmente con ninguna otra reina.
   * @returns {coordenada} La posicion o null
   * */
  
  function nuevaPosicion (){
    let posibilidadActual = 0;
    let posY = (reinas.length == 0) ? 0 : reinas [reinas.length - 1].posY + 1;
    
    for (posX = 0; posX < 8; posX++){
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
        if (posibilidadActual == eleccion){
          return (posTemp);
        }
        posibilidadActual++;
      }
    }
    return null;
  }
  
  let posTemp = nuevaPosicion ();
  if (posTemp){
    return (posTemp);
  } else {
    return null;
  }
}