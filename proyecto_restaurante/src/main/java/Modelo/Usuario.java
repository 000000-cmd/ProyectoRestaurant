package Modelo;

public class Usuario {
    private int id;  // Agregué el atributo id para el manejo del identificador del usuario
    private String nombreUsuario;
    private String contraHash;  // Almacena la contraseña hasheada
    private String rol;

    // Constructor vacío
    public Usuario() {
    }

    // Constructor con parámetros
    public Usuario(String nombreUsuario, String contraHash, String rol) {
        this.nombreUsuario = nombreUsuario;
        this.contraHash = contraHash;
        this.rol = rol;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContraHash() {
        return contraHash;
    }

    public void setContraHash(String contraHash) {
        this.contraHash = contraHash;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
