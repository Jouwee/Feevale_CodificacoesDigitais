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
import java.util.ArrayList;
import java.util.List;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Nicolas
 */
public class Query extends HttpServlet implements Servlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("query", "");
        request.getRequestDispatcher("jsp/Query.jsp").forward(request, response);
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String query = request.getParameter("query");
        
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            Connection connection = null;
            connection = DriverManager.getConnection(
                    "jdbc:oracle:thin:@localhost:1521:xe","system","root");
            
            
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
            request.setAttribute("result", g.toJson(l));
            
            System.out.println(g.toJson(l));
            
            connection.close();
        } catch(Exception e) {
            e.printStackTrace();
            request.setAttribute("exception", e);
        }
        
        request.setAttribute("query", query);
        request.getRequestDispatcher("jsp/Query.jsp").forward(request, response);
    }
}

