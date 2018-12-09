<%@ page contentType="text/html"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory,
javax.xml.parsers.DocumentBuilder,org.w3c.dom.*"
%>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="./static/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="./static/css/main.css">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <!-- Buscaminas Board -->
                    <div class="js-app-titulo"></div>
                    <input class="btn btn-explore js-btn-explore" type="button" value="Explorar">
                    <input class="btn btn-mark js-btn-mark" type="button" value="Marcar">
                    <label>Quedan:</label><span class="js-lbl-marks"></span>
                    <input class="btn btn-small js-btn-restart" type="button" value="Reiniciar">
                    <span class="js-cron-minutos">0</span>:<span class="js-cron-segundos">0</span>
                    <div class="js-app-estatus">Jugando<label>Cerradas:</label><span class="js-lbl-closed"></span></div>
                    <div class="modal1 js-modal-panel-result">
                        <div class="modal1-content js-panel-result"></div>
                    </div>
                    <div class="js-panel-guardar">
                        <form action='api/resultado' method="POST">
                            <input type='text' class="js-input-tiempo" name='tiempo' id='tiempo' value='' readonly />
                            <label for="nombre">Nick</label><input type='text' name='nombre' id='nombre' value='' />
                            <input type='submit' value='Guardar' />
                        </form>
                    </div>
                    <div class="minesweeper-container"></div>
                </div>
                <hr>
            </div>
        </div>
    <script src="./static/js/main.js"></script>
    <!--NVH-->
    </body>
</html>