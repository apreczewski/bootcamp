import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(request, response) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      tile: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    // Validation schema
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { date } = request.body;

    const dateToCreateMeetup = startOfHour(parseISO(date));

    if (isBefore(dateToCreateMeetup, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted.' });
    }

    const checkMeetup = await Meetup.findAll({
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

    const { originalname: name, filename: path } = request.file;

    const file = await File.create({
      name,
      path,
    });

    return response.json(file);
  }
}

export default new MeetupController();
