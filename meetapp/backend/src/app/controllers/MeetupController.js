import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
// import ptBR from 'date-fns/locale/pt-BR';

import Meetup from '../models/Meetup';

class MeetupController {
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
}

export default new MeetupController();
