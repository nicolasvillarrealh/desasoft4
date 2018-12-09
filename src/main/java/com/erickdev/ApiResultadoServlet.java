package com.erickdev;

import java.io.IOException;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.*;

import java.io.*;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;
import javax.xml.*;

@WebServlet(name="apiresultadoServlet", urlPatterns={"/api/resultado"}, loadOnStartup=1)
public class ApiResultadoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static Logger log = LoggerFactory.getLogger(ApiResultadoServlet.class);
    private Gson gson = new Gson();

    public ApiResultadoServlet() {}

    @Override
    public void init() {
        log.debug("ApiResultadoServlet init...");
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Loging endpoint
        log.debug("ApiResultadoServlet service...");

        //String name = "Mejores", version="V0.1";
        //request.setAttribute("name", name); // Esto estará disponible como ${name}   
        //request.setAttribute("version", version); // Esto estará disponible como ${version}   
        //request.getRequestDispatcher("/mejores.jsp").forward(request, response);

        String nombre = request.getParameter("nombre");
        String tiempo = request.getParameter("tiempo");

        try{

            Element root;
            DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = builderFactory.newDocumentBuilder();
            Document doc = docBuilder.newDocument();
            File file = new File("/usr/local/db_data/resultados.xml");
            if (file.exists()){

            //DocumentBuilderFactory fact = DocumentBuilderFactory.newInstance();
            //DocumentBuilder builder = fact.newDocumentBuilder();

                doc = docBuilder.parse(file);
                root = doc.getDocumentElement();
                String sr = root.getNodeName();


            //root = node.getNodeName();
            }else{

                root = doc.createElement("resultados");
                doc.appendChild(root);
            }

            Element childR = doc.createElement("resultado");
            root.appendChild(childR);

            Element childNombre = doc.createElement("nombre");
            childR.appendChild(childNombre);

            Element childTiempo = doc.createElement("tiempo");
            childR.appendChild(childTiempo);

            Text textNombre = doc.createTextNode(nombre);
            childNombre.appendChild(textNombre);

            Text textTiempo = doc.createTextNode(tiempo);
            childTiempo.appendChild(textTiempo);

            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer();

            transformer.setOutputProperty(OutputKeys.INDENT, "yes");

            StringWriter sw = new StringWriter();
            StreamResult result = new StreamResult(sw);
            DOMSource source = new DOMSource(doc);
            transformer.transform(source, result);
            String xmlString = result.getWriter().toString(); //sw.toString();

            FileWriter fw = new FileWriter(file, false);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(xmlString);

            //System.out.println(xmlString);

            bw.flush();
            bw.close();

            //request.getRequestDispatcher("/buscaminas.jsp").forward(request, response);

            // Redirect call to another url
            response.sendRedirect("/buscaminas/mejores");

        }catch(Exception ex){
            System.out.println(ex);
        }
    }

    

}
