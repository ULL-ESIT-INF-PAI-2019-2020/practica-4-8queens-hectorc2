//Programa que resuelve el problema de las ocho reinas con la restriccion extra de que no se pueden alinear tres en la misma recta
//Hecho por alu0101017839

//Clase para guardar un par (x, y)

class coordenada {
  constructor (posX_, posY_){
    this.posX = posX_;
    this.posY = posY_;
  }
};

//Clase que almacena una recta mediante su pendiente y altura (y) en el origen, pero si la pendiente es infinita deja de ser altura (y) y pasa a ser desviacion lateral (x)

class recta {
  constructor (pendiente_, altura_){
    this.pendiente = pendiente_;
    this.altura = altura_;
  }
};




resolver8Reinas();




//Muestra el tablero con las reinas almacenadas en 'reinas'

function mostrar (reinas) {
  console.log ("\n   a b c d e f g h");
  let print = "   ";
  let posHoriz = 0;
  for (casilla = 0; casilla < 64; casilla++){
    if (posHoriz == 8){
      print += (8 - ((casilla / 8) - 1)) + "\n   ";
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
  console.log (print + "1\n");
}

//Imprime soluciones al problema mientras se le indique o hasta mostrarlas todas

function resolver8Reinas (reinas2 = [], colocadas = 0, nueva){
  let reinas = [];
  for (elemento = 0; elemento < reinas2.length; elemento++)
    reinas.push(reinas2 [elemento]);
  
  if (nueva != null)
    reinas.push (nueva);
  if (colocadas == 8){
    mostrar (reinas);
    
    return /*Si segun teclado ha de seguir: null; y si no, un valor (true¿).*/null;
  }
  
  let eleccion = 0;
  let actual = anadirReina (reinas, eleccion);
  let resultado = null;
  while ((resultado == null)&&(actual != null)){
    resultado = resolver8Reinas (reinas, colocadas + 1, actual);
    eleccion++;
    actual = anadirReina (reinas, eleccion);
  }
  
  if ((reinas == [])&&(resultado == null))
    console.log ("\nYa no quedan mas soluciones.\n");
  return resultado;
}





//Añade una reina en la posicion numero eleccion en la que no amenace a las demas en el array (reinas) y que no este sobre la misma linea que cualesquiera otras dos y devuelve true si se ha podido

function anadirReina (reinas, eleccion){
  
  //Busca una posicion que no coincida vertical u horizontalmente con ninguna otra reina y si masDeUna es verdadero entonces tambien comprueba la otra restriccion mediante pisaLinea
  
  function nuevaPosicion (){
    let masDeUna = (reinas.length > 1);
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
  
  //Comprueba si el punto esta en la misma linea que cualesquiera dos reinas
  
  function pisaLinea (punto){
    for (reinaPuntoInicial = 0; reinaPuntoInicial < (reinas.length - 1); reinaPuntoInicial++){
      for (reinaPuntoFinal = (reinaPuntoInicial + 1); reinaPuntoFinal < reinas.length; reinaPuntoFinal++){
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

//Comprueba si el punto esta sobre la linea

function estaEnLaRecta (punto, linea){
  if (linea.pendiente == Infinity){
    return (linea.altura == punto.posX);
  } else {
    return (punto.posY == ((linea.pendiente * punto.posX) + linea.altura));
  }
}

//Devuelve la recta generada por dos puntos

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