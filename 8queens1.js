//Programa que resuelve el problema de las ocho reinas
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


let reinas = resolver8Reinas();



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






//Devuelve una solucion al problema

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