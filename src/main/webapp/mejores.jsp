
<%@ page contentType="text/html"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory,
javax.xml.parsers.DocumentBuilder,org.w3c.dom.*"
%>
<%
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
DocumentBuilder db = dbf.newDocumentBuilder();
Document doc = db.parse("/usr/local/db_data/resultados.xml");
 
NodeList nl= doc.getElementsByTagName("nombre");
NodeList n2= doc.getElementsByTagName("tiempo");
%>

<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="./static/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="./static/css/main.css">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <center>
                        <a href="/buscaminas" title="Jugar">
                            <img style="width: 30%;" src="../../static/graphics/SVG/BM-Title.svg">
                        </a>
                    </center>
                </div>
                <div class="col-12">
                    <center>
                        <h2>Registro de tiempos del Juego</h2>
                        <table width="500" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <th>Nick</th>
                                <th>Tiempo (Minutos:Segundos)</th>
                            </tr>
                                <%
                                for(int i=0; i < nl.getLength(); i++)
                                {
                                %>
                            <tr>
                                <td style="text-align: center;"><%= nl.item(i).getFirstChild().getNodeValue() %></td>
                                <td style="text-align: center;"><%= n2.item(i).getFirstChild().getNodeValue() %></td>
                            </tr>
                                <%
                                }
                                %>
                        </table>
                    </center>
                </div>
            </div>
        </div>
    <!--NVH-->
    </body>
</html>