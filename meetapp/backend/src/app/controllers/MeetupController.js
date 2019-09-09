import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO, isBefore } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(request, response) {
    const where = {};
    const page = request.query.page || 1;

    if (request.query.date) {
      const searchDate = parseISO(
        request.query.date ? request.query.date : new Date()
      );

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      attributes: ['id', 'date', 'past', 'title', 'description', 'location'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          required: true,
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    meetups.forEach((meetup, index) => {
      if (meetup.past) {
        meetups.splice(index);
      }
    });

    return response.json(meetups);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      file_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { date } = request.body;

    if (isBefore(parseISO(date), new Date())) {
      return response.status(400).json({ error: 'Meetup date invalid.' });
    }

    const meetup = await Meetup.create({
      ...request.body,
      user_id: request.userId,
    });

    return response.json(meetup);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      title: Yup.string().required(),
      file_id: Yup.number(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(request.params.id);

    if (meetup.user_id !== request.userId) {
      return response.status(401).json({ error: 'Not authorized.' });
    }

    if (isBefore(parseISO(request.body.date), new Date())) {
      return response.status(400).json({ error: 'Meetup date invalid.' });
    }

    if (meetup.past) {
      return response.status(400).json({ error: "Can't update past meetups." });
    }

    await meetup.update(request.body);

    return response.json(meetup);
  }

  async delete(request, response) {
    const meetup = await Meetup.findByPk(request.params.id);

    if (meetup.user_id !== request.userId) {
      return response.status(400).json({ error: "Don't have this meetup" });
    }

    if (meetup.past) {
      return response.status(400).json({ error: "Can't delete past meetups." });
    }

    await meetup.destroy();

    return response.send();
  }
}

export default new MeetupController();
