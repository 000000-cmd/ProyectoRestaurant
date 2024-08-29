package Controlador;

import Modelo.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/userCtrl")
public class UsuarioServlet extends HttpServlet {
    private String message;
    private UsuarioControlador userDao;

    @Override
    public void init() throws ServletException {
        try {
            // Realiza el lookup del DataSource usando JNDI
            Context initContext = new InitialContext();
            DataSource ds = (DataSource) initContext.lookup("java:/comp/env/jdbc/restaurante");
            message = "DataSource Obtenido!";
            // Inicializa el UsuarioControlador con el DataSource obtenido
            userDao = new UsuarioControlador(ds);
        } catch (NamingException e) {
            throw new ServletException("No se pudo obtener el DataSource", e);
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");

        // Hello
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>" + message + "</h1>");
        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        switch (action) {
            case "register":
                handleRegister(request, response);
                break;
            case "delete":
                handleDelete(request, response);
                break;
            case "updatePassword":
                handleUpdatePassword(request, response);
                break;
            case "login":
                handleLogin(request, response);
                break;
            case "insertUser":
                handleInsertUser(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Acción no soportada en POST");
                break;
        }
    }



    private void handleRegister(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String nombreUsuario = request.getParameter("username");
        String password = request.getParameter("password");
        String rol = request.getParameter("role");

        if (nombreUsuario == null || password == null || rol == null ||
                nombreUsuario.isEmpty() || password.isEmpty() || rol.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Todos los campos son obligatorios");
            return;
        }

        boolean isRegistered = userDao.register(nombreUsuario, password, rol);

        if (isRegistered) {
            response.sendRedirect("login.jsp?success=registration_complete");
        } else {
            response.sendRedirect("register.jsp?error=registration_failed");
        }
    }

    private void handleDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");

        if (username == null || username.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "El nombre de usuario es obligatorio");
            return;
        }

        boolean isDeleted = userDao.deleteUserByUsername(username);

        if (isDeleted) {
            response.getWriter().println("Usuario eliminado con éxito");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Error al eliminar el usuario");
        }
    }

    private void handleUpdatePassword(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String newPassword = request.getParameter("newPassword");

        if (username == null || newPassword == null ||
                username.isEmpty() || newPassword.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Todos los campos son obligatorios");
            return;
        }

        Usuario usuario = userDao.getUserByUsername(username);
        if (usuario != null) {
            boolean isUpdated = userDao.updatePassword(usuario.getId(), newPassword);
            if (isUpdated) {
                response.getWriter().println("Contraseña actualizada con éxito");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().println("Error al actualizar la contraseña");
            }
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Usuario no encontrado");
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if (username == null || password == null ||
                username.isEmpty() || password.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Todos los campos son obligatorios");
            return;
        }

        Usuario usuario = userDao.authenticate(username, password);

        if (usuario != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", usuario);
            response.sendRedirect("home.jsp");
        } else {
            response.sendRedirect("login.jsp?error=invalid_credentials");
        }
    }

    private void handleInsertUser(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String nombreUsuario = request.getParameter("username");
        String password = request.getParameter("password");
        String rol = request.getParameter("role");

        if (nombreUsuario == null || password == null || rol == null ||
                nombreUsuario.isEmpty() || password.isEmpty() || rol.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Todos los campos son obligatorios");
            return;
        }

        try {
            boolean isInserted = userDao.register(nombreUsuario, password, rol);

            if (isInserted) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().println("Usuario insertado con éxito");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().println("Error al insertar el usuario");
            }
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace(); // You can log this to a file in production
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Ocurrió un error al insertar el usuario");
        }
    }
}


