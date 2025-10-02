const MotService = require("../Service/motService");

class MotController {
  // 📌 POST /auth/forgot-password
  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const result = await MotService.sendResetEmail(email);
      res.json(result);
    } catch (err) {
      console.error("Erreur forgotPassword:", err.message);
      res.status(400).json({ message: err.message });
    }
  }

  // 📌 POST /auth/reset-password/:token
  static async resetPassword(req, res) {
    const { token } = req.params;
    const { mot_de_passe } = req.body;

    try {
      const result = await MotService.resetPassword(token, mot_de_passe);
      res.json(result);
    } catch (err) {
      console.error("Erreur resetPassword:", err.message);
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = MotController;
