import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      username: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const userExists = await User.findOne({
      where: { username: req.body.username },
    });

    if (userExists) {
      res.status(400).json({ error: 'User already exists.' });
    }

    const { id, username, name, provider } = await User.create(req.body);

    return res.json({
      id,
      username,
      name,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      username: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { username, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (username !== user.username) {
      const userExists = await User.findOne({
        where: { username },
      });

      if (userExists) {
        res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      username,
      name,
      provider,
    });
  }
}

export default new UserController();