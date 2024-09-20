const User = require("../models/user");

const signup = async (req, res) => {
   //validaciones realizadas en el schema de mongoose
   try {
      const user = await User.create(req.body);
      const token = await user.createJWT();

      res.status(201).json({ msg: "User created successfully", token: token });

   } catch (error) {
      return res.status(500).json(error.message);
   }
};

const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email: email }).exec();

      if (!user) {
         return res.status(404).json({ msg: "Email does not match" });
      }

      if (!(await user.comparePassword(password))) {
         return res.status(404).json({ msg: "Password does not match" });
      }
      const token = await user.createJWT();

      return res
         .status(200)
         .json({ msg: `${user.name} successfully logged in`, token: token });
   } catch (error) {
      return res.status(500).json(error.message);
   }
};

module.exports = { signup, login };
