var App = {
    htmlElements: {
        board: document.querySelector('.minesweeper-container'),
        restartBtn: document.querySelector('.js-btn-restart'),
        exploreBtn: document.querySelector('.js-btn-explore'),
        markBtn: document.querySelector('.js-btn-mark'),
        markLbl: document.querySelector('.js-lbl-marks'),
        closedLbl: document.querySelector('.js-lbl-closed'),
        tituloPnl: document.querySelector('.js-app-titulo'),
        estadoPnl: document.querySelector('.js-app-estatus'),
        resultPnl: document.querySelector('.js-panel-result'),
        resultModalPnl: document.querySelector('.js-modal-panel-result'),
        segundosLbl: document.querySelector('.js-cron-segundos'),
        minutosLbl: document.querySelector('.js-cron-minutos'),
    },
    estado: {
        nivel: 10,
        appMode: 'prod',
        currentExploreBlock: '',
        currentEploreMode: 'manual', //manual: por click, auto: por propagación al explorar Empty Block 
        currentAction: 'explore', //explore, mark
        currentMarks: 0,
        currentClosed: 0,
        currentEstado: 'juega', //juega, gana, pierde 
        cronometro: null
    },
    init: function(){
        App.initHandlers();
        //console.log('Initializing App')

        App.initBoardDrawing();
        App.plantBombs();

        if(App.estado.appMode === 'demo'){
            App.htmlElements.estadoPnl.classList.add('visible');
            App.htmlElements.estadoPnl.classList.remove('invisible');
        }else{
            App.htmlElements.estadoPnl.classList.remove('visible');
            App.htmlElements.estadoPnl.classList.add('invisible');
        }

        App.initCronometro();
        
    },

    initCronometro: function(){

        var contador_s = 0;
        var contador_m = 0;
        var s = App.htmlElements.segundosLbl;
        var m = App.htmlElements.minutosLbl;
        
        App.estado.cronometro = setInterval(function(){
                if(contador_s == 60){
                    contador_s = 0;
                    contador_m++;
                    
                    m.innerHTML = contador_m;

                    if(contador_m == 60){
                        contador_m = 0;
                    }
                }
                s.innerHTML = contador_s;
                contador_s++;
            },1000);
            
    },

    stopCronometro: function(){
        clearInterval(App.estado.cronometro);
    },

    initBoardDrawing: function() {
        //console.log('Init BoardDrawing Board');

        var nivel = App.estado.nivel;

        App.htmlElements.tituloPnl.classList.add('app-title');

        var divEmp = document.createElement('div'), text = document.createTextNode('');
        divEmp.appendChild(text);
        divEmp.className += 'empty-block';
    

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
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open
                celda.setAttribute("data-block-type","E"); //E: Empty, B: Bomb, S: Sensor
                celda.addEventListener('click', App.handleExploreBlock);
                hilera.appendChild(celda);
            }

            // agrega la hilera al final de la tabla (al final del elemento tblbody)
            tblBody.appendChild(hilera);
        }

        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);

        // appends <table> into <body>
        App.htmlElements.board.appendChild(tabla);
        

        App.setEstadoMarks(nivel);
        App.htmlElements.markLbl.innerHTML = App.estado.currentMarks;
        App.setEstadoClosed((parseInt(nivel) * parseInt(nivel) - nivel) * -1);
    },

    plantBombs: function() {

        var nivel = App.estado.nivel;

        var divBom = document.createElement('div'), text = document.createTextNode('');
        divBom.appendChild(text);
        if(App.estado.appMode === 'demo'){
            divBom.className += 'bomb-explosion-block';
        }else{
            divBom.className += 'bomb-block';
        }

        for (var i = 1; i <= nivel; i++) {

            var randomX = Math.floor(10 * Math.random());
            var randomY = Math.floor(10 * Math.random());

            //console.log('Plantando Bomba (' + i + ') en: ' + randomX + ":" + randomY);

            var celda = document.getElementById(randomX + ":" + randomY);

            if(celda.getAttribute("data-block-type") !== 'B'){
                var cln = divBom.cloneNode(true);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","B");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open
                celda.addEventListener('click', App.handleExploreBlock);
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
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor en 2
        if(posY - 1 >= 0){ //Validar Límites del Tablero
            
            sensor = (posX) + ":" + (posY - 1);
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 3
        if((posX + 1 < nivel) && (posY - 1 >= 0)){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY - 1);
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
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
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 5
        if(posX + 1 < nivel){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY);
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 6
        if((posX - 1 >= 0) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            
            sensor = (posX - 1) + ":" + (posY + 1);
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
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
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log('Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
  
        }

        celda = null;
        //Sensor 8
        if((posX + 1 < nivel) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            
            sensor = (posX + 1) + ":" + (posY + 1);
            celda = document.getElementById(sensor);
            //console.log(celda.getAttribute("data-block-type") + '(' + i + ') Plantando Sensor en: ' + sensor);

            if(celda.getAttribute("data-block-type") !== 'B'){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    //senText = document.createTextNode('1');
                    
                    senText = document.createElement("span");
                    senText.innerHTML = '1';
                    senText.classList.add('invisible');
                    
                }else{
                    //senText = document.createTextNode(parseInt(prevText) + 1);
                    senText = document.createElement("span");
                    senText.innerHTML = parseInt(prevText) + 1;
                    senText.classList.add('invisible');
                }

                var cln = divSen.cloneNode(true);
                
                cln.appendChild(senText);
                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);
                celda.setAttribute("data-block-type","S");
                celda.setAttribute("data-block-status","C"); //C: Close, O:Open

                //console.log(celda.classList.contains("bomb-block") + ' Sensor Plantado en: ' + sensor);

            }else{
                //console.log(celda.classList.contains("bomb-block") + 'Sensor No Plantado sobre la bomba en: ' + sensor);
            }
        }

    },

    getNearBlocks: function(posX, posY){

        var nivel = App.estado.nivel;
        //console.log(posX + ':' + posY);

        //Marcar Sensores alrededor de la Bomba
        //1 2 3
        //4 * 5
        //6 7 8
        var arrNearBlocks = [];
        var i = 0;
        //Sensor en 1
        if((posX - 1 >= 0) && (posY - 1 >= 0)){ //Validar Límites del Tablero
            nId = (posX - 1) + ":" + (posY - 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 1');
        }
        //Sensor en 2
        if(posY - 1 >= 0){ //Validar Límites del Tablero
            nId = (posX) + ":" + (posY - 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 2');
        }
        //Sensor 3
        if((posX + 1 < nivel) && (posY - 1 >= 0)){ //Validar Límites del Tablero
            nId = (posX + 1) + ":" + (posY - 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 3');
        }
        //Sensor 4
        if(posX - 1 >= 0){ //Validar Límites del Tablero
            nId = (posX - 1) + ":" + (posY);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 4');
        }
        //Sensor 5
        if(posX + 1 < nivel){ //Validar Límites del Tablero
            nId = (posX + 1) + ":" + (posY);
            App.exploreBlock(nId);
            //console.log('Near Block 5');
        }
        //Sensor 6
        if((posX - 1 >= 0) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            nId = (posX - 1) + ":" + (posY + 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 6');
        }
        //Sensor 7
        if(posY + 1 < nivel){ //Validar Límites del Tablero
            nId = (posX) + ":" + (posY + 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 7');
        }
        //Sensor 8
        if((posX + 1 < nivel) && (posY + 1 < nivel)){ //Validar Límites del Tablero
            nId = (posX + 1) + ":" + (posY + 1);
            arrNearBlocks[i] = nId;
            i++;
            //console.log('Near Block 8');
        }

        return arrNearBlocks;
    },

    setEstadoClosed: function(addOpen){
        //console.log(parseInt(App.estado.currentClosed) + '-' + parseInt(addOpen));
        App.estado.currentClosed = (parseInt(App.estado.currentClosed) - parseInt(addOpen));
    },

    setEstadoMarks: function(addMarks){
        //console.log(parseInt(App.estado.currentMarks) + '+' + parseInt(addMarks));
        App.estado.currentMarks = (parseInt(App.estado.currentMarks) + parseInt(addMarks));
    },

    setEstadoAction: function(strAction){
        App.estado.currentAction = strAction;
        if(strAction === 'explore'){
            App.htmlElements.exploreBtn.classList.add('btn-active');
            App.htmlElements.markBtn.classList.remove('btn-active');
        }else{
            App.htmlElements.exploreBtn.classList.remove('btn-active');
            App.htmlElements.markBtn.classList.add('btn-active');
        }
    },

    initHandlers: function(){
        App.initClickBtns();
    },

    initClickBtns: function(){
        App.htmlElements.exploreBtn.addEventListener('click', App.handleExploreBtn);
        App.htmlElements.markBtn.addEventListener('click', App.handleMarkBtn);
        App.htmlElements.resultPnl.addEventListener('click', App.handleResultPnl);
        App.htmlElements.restartBtn.addEventListener('click',App.handleRestartBtn);
    },
    handleRestartBtn: function(){
        location.reload();
    },
    handleExploreBtn: function (e) {
        App.setEstadoAction('explore');
    },

    handleMarkBtn: function (e) {
        App.setEstadoAction('mark');
    },

    handleResultPnl: function(){
        var modal = App.htmlElements.resultModalPnl;
        modal.style.display = "none";
    },

    handleExploreBlock: function (e) {

        App.estado.currentEploreMode = 'manual';

        App.estado.currentExploreBlock = this.id;

        if(App.estado.currentAction === 'explore'){
            App.exploreBlock();
        }else{
            if(parseInt(App.estado.currentMarks) > 0){
                App.markBlock();
            }else{
                App.setEstadoAction('explore');
            }
        }

        //console.log(App.estado.currentClosed);
        if(parseInt(App.estado.currentClosed) === 0 && App.estado.currentEstado === 'juega'){
            App.htmlElements.resultPnl.classList.add('winner-panel');

            var modal = App.htmlElements.resultModalPnl;
            modal.style.display = "block";

            App.stopCronometro();

            App.estado.currentEstado = 'gana' //juega, gana, pierde 

        }
    },

    markBlock: function(){

        var id = App.estado.currentExploreBlock;

        var divExpd = document.createElement('div'), text = document.createTextNode('');
        divExpd.appendChild(text);
        divExpd.className += 'mark-block';

        var celda = document.getElementById(id);
        var prevText = celda.textContent;

        if(celda.getAttribute("data-block-status") === "C"){
            celda.setAttribute("data-block-status","O"); //C: Close, O:Open
            var cln = divExpd.cloneNode(true);

            celda.removeChild(celda.childNodes[0]);
            celda.appendChild(cln);

            App.setEstadoMarks(-1);
            if(celda.getAttribute("data-block-type") !== 'B'){
                App.setEstadoClosed(+1);
            }
            
            App.htmlElements.markLbl.innerHTML = App.estado.currentMarks;
            App.htmlElements.closedLbl.innerHTML = App.estado.currentClosed;
        }

    },

    exploreBlock: function(){

        var id = App.estado.currentExploreBlock;

        var divExpd = document.createElement('div'), text = document.createTextNode('');
        divExpd.appendChild(text);
        

        var celda = document.getElementById(id);
        var prevText = celda.textContent;

        //console.log(prevText);

        if(celda.getAttribute("data-block-type") !== "B"){ //B: Bomb, S: Sensor, E: Empty
            if(celda.getAttribute("data-block-status") === "C"){

                var prevText = celda.textContent;
                var senText = '';
                if(prevText === ''){
                    senText = document.createTextNode('');
                }else{
                    senText = document.createTextNode(prevText);
                }

                if(celda.getAttribute("data-block-type") === "E"){
                    //Hole Graphic only for clicked Block
                    if(App.estado.currentEploreMode === 'manual'){
                        divExpd.className += 'explored-block';
                    }else{
                        divExpd.className += 'empty-block';
                    }
                }else{
                    divExpd.className += 'sensor-block';
                }                

                celda.setAttribute("data-block-status","O"); //C: Close, O:Open
                var cln = divExpd.cloneNode(true);
                cln.appendChild(senText);

                celda.removeChild(celda.childNodes[0]);
                celda.appendChild(cln);

                var arrId = id.split(":");
                arrNearBlocks = App.getNearBlocks(parseInt(arrId[0]), parseInt(arrId[1]));
                //console.log(arrNearBlocks);
        
                //console.log(arrId[0] + ':' + arrId[1]);
                if(prevText === ''){
                    //App.exploreNears(arrId[0],arrId[1]);
                    arrNearBlocks.forEach(function(cValue){ 
                        App.estado.currentEploreMode = 'auto';
                        App.estado.currentExploreBlock = cValue;
                        App.exploreBlock();
                    });
                }

                App.setEstadoClosed(+1);
                App.htmlElements.closedLbl.innerHTML = App.estado.currentClosed;

            }
        }else{

            App.chainExplosion();

        }
        
        return true;
    },

    chainExplosion: function(){

        var divBom = document.createElement('div'), text = document.createTextNode('');
        divBom.appendChild(text);
        divBom.className += 'bomb-explosion-block';

        var nivel = parseInt(App.estado.nivel);

        for (var x = 0; x < nivel; x++) {
            for (var y = 0; y < nivel; y++) {
    
                celda = document.getElementById(x + ':' + y);
                if(celda.getAttribute("data-block-type") === "B"){

                    celda.setAttribute("data-block-status","O"); //C: Close, O:Open
                    var cln = divBom.cloneNode(true);
                    //cln.appendChild(senText);
        
                    celda.removeChild(celda.childNodes[0]);
                    celda.appendChild(cln);

                }

            }
        }

        App.htmlElements.resultPnl.classList.add('explosion-panel');

        var modal = App.htmlElements.resultModalPnl;
        modal.style.display = "block";

        App.stopCronometro();

        App.estado.currentEstado = 'pierde' //juega, gana, pierde 

    }

    //

}

console.log('1');
App.init();