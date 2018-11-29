var App = {
    htmlElements: {
        board: document.querySelector('.minesweeper-container'),
    },
    estado: {
        nivel: 10
    },
    init: function(){
        console.log('Initializing App')
        App.initBoardDrawing();
        
        App.plantBombs();
    },
    initBoardDrawing: function() {
        console.log('Init BoardDrawing Board');

        var nivel = App.estado.nivel;

        var divEmp = document.createElement('div'), text = document.createTextNode('');
        divEmp.appendChild(text);
        divEmp.className += 'empty-block';
        //App.htmlElements.board.appendChild(div);


        var divExp = document.createElement('div'), text = document.createTextNode('');
        divExp.appendChild(text);
        divExp.className += 'explore-block';
        //App.htmlElements.board.appendChild(div);

        // Crea un elemento <table> y un elemento <tbody>
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");

        // Crea las celdas
        for (var y = 0; y < nivel; y++) {
            // Crea las hileras de la tabla
            var hilera = document.createElement("tr");

            for (var x = 0; x < nivel; x++) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                celda = document.createElement("td");
                //var textoCelda = document.createTextNode("["+i+","+j+ "]");
                //celda.appendChild(textoCelda);
                celda.id = ""+ x +":"+y+ "";

                var cln = divExp.cloneNode(true);
                celda.appendChild(cln);

                hilera.appendChild(celda);
            }

            // agrega la hilera al final de la tabla (al final del elemento tblbody)
            tblBody.appendChild(hilera);
        }

        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        // appends <table> into <body>
        App.htmlElements.board.appendChild(tabla);
        // modifica el atributo "border" de la tabla y lo fija a "2";
        tabla.setAttribute("border", "2");



    },

    plantBombs: function() {

        var nivel = App.estado.nivel;

        var divBom = document.createElement('div'), text = document.createTextNode('');
        divBom.appendChild(text);
        //divBom.setAttribute("data-block-type","B");
        divBom.className += 'bomb-block';

        for (var i = 1; i <= nivel; i++) {

            var randomX = Math.floor(10 * Math.random());
            var randomY = Math.floor(10 * Math.random());

            console.log('Plantando Bomba (' + i + ') en: ' + randomX + ":" + randomY);

            var celda = document.getElementById(randomX + ":" + randomY);

            if(celda.classList.contains("bomb-block") == false){
                var cln = divBom.cloneNode(true);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
            }else{
                i--;
            }

            //alert('Cargar Sensores para :' + randomX + ':' + randomY + '?');

            App.putSensors(randomX, randomY, i);
        }

    },

    putSensors: function(posX, posY, i){

        var nivel = App.estado.nivel;

        //Marcar Sensores alrededor de la Bomba
        //1 2 3
        //4 * 5
        //6 7 8
        var sensor = '';
        var celda = null;

        var divSen = document.createElement('div'), text = document.createTextNode('');
        divSen.className += 'explore-block';

        //Sensor en 1
        if((posX - 1 >= 0) && (posY - 1 >= 0)){ //Validar Límites del Tablero
            
            sensor = (posX - 1) + ":" + (posY - 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor en 2
        if(posY - 1 >= 0){ //Validar Límites del Tablero
            
            sensor = (posX) + ":" + (posY - 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 3
        if((posX + 1 < nivel) && (posY - 1 >= 0)){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY - 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        //Marcar Sensores alrededor de la Bomba
        //1 2 3
        //4 * 5
        //6 7 8

        celda = null;
        //Sensor 4
        if(posX - 1 >= 0){ //Validar Límites del Tablero
            
            sensor = (posX - 1) + ":" + (posY);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 5
        if(posX + 1 < nivel){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 6
        if((posX - 1 >= 0) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            
            sensor = (posX - 1) + ":" + (posY + 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        //Marcar Sensores alrededor de la Bomba
        //1 2 3
        //4 * 5
        //6 7 8

        celda = null;
        //Sensor 7
        if(posY + 1 < nivel){ //Validar Límites del Tablero
            
            sensor = (posX) + ":" + (posY + 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log('Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 8
        if((posX + 1 < nivel) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY + 1);
            console.log('(' + i + ') Plantando Sensor en: ' + sensor);

            celda = document.getElementById(sensor);

            if(celda.classList.contains("bomb-block") === false){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('1');
                }else{
                    senText = document.createTextNode(parseInt(prevText) + 1);
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                console.log(celda.classList.contains("bomb-block") + ' Sensor Plantado en: ' + sensor);

            }else{
                console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
        }

    }
}

console.log('1');
App.init();