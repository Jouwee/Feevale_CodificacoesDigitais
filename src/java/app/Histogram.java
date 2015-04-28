/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package app;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Nicolas
 */
public class Histogram extends HttpServlet implements Servlet {

    private Connection connection;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String query = request.getParameter("query");
        
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            connection = null;
            connection = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","system","root");
            
            request.setAttribute("errosPorMes", buildResultMap("SELECT TO_CHAR(DATACRI, 'YYYY-MM') AS X, COUNT(*) FROM ITEMPED WHERE TIPO = 1 GROUP BY TO_CHAR(DATACRI, 'YYYY-MM') ORDER BY TO_CHAR(DATACRI, 'YYYY-MM')"));
            request.setAttribute("revisaoVsNumeroErros", buildResultMap("SELECT * FROM HISTOGRAMA_REVISAO "));

            
            connection.close();
        } catch(Exception e) {
            e.printStackTrace();
            request.setAttribute("exception", e);
        }
        
        request.setAttribute("query", query);
        request.getRequestDispatcher("jsp/Histogram.jsp").forward(request, response);
    }
    
    private String buildResultMap(String query) throws Exception {
            PreparedStatement statement = connection.prepareStatement(query);
        ResultSet resultSet = statement.executeQuery();
        ResultSetMetaData rsmd = resultSet.getMetaData();
        List l = new ArrayList();
        while (resultSet.next()) {
            List m = new ArrayList();
            for (int i = 0; i < rsmd.getColumnCount(); i++) {
                m.add(resultSet.getString(i + 1));
            }
            l.add(m);
        }

        Gson g = new GsonBuilder().create();
        return g.toJson(l);
    }
}

