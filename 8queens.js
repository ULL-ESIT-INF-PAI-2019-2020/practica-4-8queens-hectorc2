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

process.stdin.setEncoding('utf-8');

const start = new Date();
let startEditable = start;

let soluciones = resolver8Reinas();

mostrar (soluciones[0]);
soluciones.shift();

seguirONo (soluciones);


//Crea un event listener que comprueba si es necesario seguir mostrando soluciones mientras queden y si lo es, las muestra junto a los tiempos de calculo y desde el inicio del programa

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

//Devuelve un vector con todas las soluciones al problema y el tiempo que ha llevado calcular cada una (en ms)

function resolver8Reinas (reinas2 = [], colocadas = 0, nueva, devolver = []){
  let reinas = [];
  for (elemento = 0; elemento < reinas2.length; elemento++){
    reinas.push(reinas2 [elemento]);
  }
  
  if (nueva != null){
    reinas.push (nueva);
  } else {
    devolver.tiempo = [];
  }
  if (colocadas == 8){
    devolver.push (reinas);
    devolver.tiempo.push (new Date() - startEditable);
    startEditable = new Date();
    return devolver;
  }
  
  let eleccion = 0;
  let actual = anadirReina (reinas, eleccion);
  while (actual != null){
    devolver = resolver8Reinas (reinas, colocadas + 1, actual, devolver);
    eleccion++;
    actual = anadirReina (reinas, eleccion);
  }
  
  return devolver;
}





//Añade una reina en la posicion numero eleccion en la que no amenace a las demas en el array (reinas) y que no este sobre la misma linea que cualesquiera otras dos y devuelve true si se ha podido

function anadirReina (reinas, eleccion){
  
  //Busca una posicion que no coincida vertical u horizontalmente con ninguna otra reina y luego comprueba la otra restriccion mediante pisaLinea
  
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