import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string.require(),
      email: Yup.string()
        .email()
        .require(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Validation schema
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    // Get email of datebase
    const checkUser = await User.findOne({
      where: {
        email: request.body.email,
      },
    });

    // Test if email exist
    if (checkUser) {
      return response
        .status(400)
        .json({ error: 'Email aleready exists on datebase' });
    }

    // Create user in database
    const { id, name, email, provider } = User.create(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
