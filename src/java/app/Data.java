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

public class Data extends HttpServlet implements Servlet {

    /** Conexão */
    private Connection connection;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse resp) throws ServletException, IOException {
        String view = request.getParameter("view");
        try {
            if (connection == null) {
                conectDatabase();
            }
            String where = "";
            if (!request.getParameter("where").equals("undefined")) {
                where = " WHERE " + request.getParameter("where");
            }
            request.setAttribute("result", buildResultMap("SELECT * FROM " + view + where));
        } catch(Exception e) {
            e.printStackTrace();
            request.setAttribute("exception", e);
        }
        request.getRequestDispatcher("jsp/Data.jsp").forward(request, resp);
    }

    /**
     * Conecta com a base de dados
     */
    private void conectDatabase() {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            connection = null;
            connection = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","system","root");
        } catch(Exception e) {
            e.printStackTrace();
        }
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