package Controlador;

import Modelo.Usuario;
import org.mindrot.jbcrypt.BCrypt;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioControlador {
    private DataSource dataSource;

    // Constructor que recibe un DataSource para gestionar las conexiones a la base de datos
    public UsuarioControlador(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Metodo para autenticar a un usuario
    public Usuario authenticate(String username, String password) {
        Usuario usuario = null;
        String sql = "SELECT * FROM Usuarios WHERE nombre_usuario = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password");
                    if (verifyPassword(password, storedHash)) {
                        usuario = new Usuario();
                        usuario.setId(rs.getInt("id_usuario"));
                        usuario.setNombreUsuario(rs.getString("nombre_usuario"));
                        usuario.setContraHash(storedHash);
                        usuario.setRol(rs.getString("rol"));
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace(); // En producción, usar un sistema de logging
        }

        return usuario;
    }

    // Metodo para registrar un nuevo usuario
    public boolean register(String username, String password, String role) {
        String sql = "INSERT INTO Usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)";
        boolean isRegistered = false;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            String hashedPassword = hashPassword(password);
            stmt.setString(1, username);
            stmt.setString(2, hashedPassword);
            stmt.setString(3, role);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                isRegistered = true;
            }

        } catch (SQLException e) {
            e.printStackTrace(); // En producción, usar un sistema de logging
        }

        return isRegistered;
    }

    // Metodo para actualizar la contraseña de un usuario
    public boolean updatePassword(int userId, String newPassword) {
        String sql = "UPDATE Usuarios SET password = ? WHERE id_usuario = ?";
        boolean isUpdated = false;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            String hashedPassword = hashPassword(newPassword);
            stmt.setString(1, hashedPassword);
            stmt.setInt(2, userId);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                isUpdated = true;
            }

        } catch (SQLException e) {
            e.printStackTrace(); // En producción, usar un sistema de logging
        }

        return isUpdated;
    }

    // Metodo para eliminar un usuario por nombre de usuario
    public boolean deleteUserByUsername(String username) {
        String sql = "DELETE FROM Usuarios WHERE nombre_usuario = ?";
        boolean isDeleted = false;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                isDeleted = true;
            }

        } catch (SQLException e) {
            e.printStackTrace(); // En producción, usar un sistema de logging
        }

        return isDeleted;
    }

    // Metodo para obtener un usuario por nombre de usuario
    public Usuario getUserByUsername(String username) {
        Usuario usuario = null;
        String sql = "SELECT * FROM Usuarios WHERE nombre_usuario = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    usuario = new Usuario();
                    usuario.setId(rs.getInt("id_usuario"));
                    usuario.setNombreUsuario(rs.getString("nombre_usuario"));
                    usuario.setContraHash(rs.getString("password"));
                    usuario.setRol(rs.getString("rol"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace(); // En producción, usar un sistema de logging
        }

        return usuario;
    }

    // Metodo para hashear la contraseña usando BCrypt
    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    // Metodo para verificar la contraseña usando BCrypt
    private boolean verifyPassword(String inputPassword, String storedHash) {
        return BCrypt.checkpw(inputPassword, storedHash);
    }
}