import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(request, response) {
    
    const { id, name, email, provider } = await User.create(request.body);
    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
