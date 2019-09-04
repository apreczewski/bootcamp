import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
// import ptBR from 'date-fns/locale/pt-BR';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(request, response) {
    const checkUser = await User.findByPk(request.userId);

    if (!checkUser) {
      return response.status(400).json({ error: 'User fails' });
    }

    const meetups = await Meetup.findAll({
      where: { user_id: request.userId, canceled_at: null },
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

    const { file_id, date, title, description, location } = request.body;

    const dateToCreateMeetup = startOfHour(parseISO(date));

    if (isBefore(dateToCreateMeetup, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted.' });
    }

    const checkMeetup = await Meetup.findOne({
      where: {
        date: dateToCreateMeetup,
        user_id: request.userId,
        canceled_at: null,
      },
    });

    if (checkMeetup) {
      return response
        .status(400)
        .json({ error: 'Appointment date is not available.' });
    }

    const meetup = await Meetup.create({
      date,
      file_id,
      user_id: request.userId,
      title,
      description,
      location,
    });

    return response.json(meetup);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(request.params.id);

    if (!meetup) {
      return response.status(400).json({
        error: "Don't have this meetup",
      });
    }

    const hourStart = startOfHour(parseISO(meetup.date));

    if (isBefore(hourStart, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted.' });
    }

    const { date, title, description, location } = await meetup.update(
      request.body
    );

    return response.json({ date, title, description, location });
  }

  async delete(request, response) {
    const meetup = await Meetup.findByPk(request.params.id);

    if (!meetup) {
      return response.status(400).json({
        error: "Don't have this meetup",
      });
    }

    const hourStart = startOfHour(parseISO(meetup.date));

    if (isBefore(hourStart, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted.' });
    }

    await meetup.destroy(request.body);

    return response.json({
      masssage: `Delete this meetup ${request.params.id}`,
    });
  }
}

export default new MeetupController();
