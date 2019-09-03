import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
// import ptBR from 'date-fns/locale/pt-BR';

import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(request, response) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    // Validation schema
    if (!(await schema.isValid(request.query))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { date, title, description, location } = request.query;

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

    const { originalname: name, filename: path } = request.file;

    const file = await File.create({
      name,
      path,
    });

    console.log(file);

    const meetup = await Meetup.create({
      date,
      file_id: 18,
      user_id: 1,
      title,
      description,
      location,
    });

    console.log(meetup);

    return response.json(meetup);
  }
}

export default new MeetupController();
