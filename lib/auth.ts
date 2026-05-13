// Sistema de autenticación simple para el administrador

const ADMIN_PASSWORD = "carrorojo.Nlas11" // Contraseña por defecto

export const auth = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("luxara_admin_auth") === "true"
  },

  login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("luxara_admin_auth", "true")
      return true
    }
    return false
  },

  logout() {
    localStorage.removeItem("luxara_admin_auth")
  },
}
