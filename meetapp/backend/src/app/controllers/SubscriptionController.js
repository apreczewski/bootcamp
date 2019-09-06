// import { Op } from 'sequelize';
import { format, parseISO, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Notification from '../schemas/Notification';

class SubscriptionController {
  async index(request, response) {
    return response.json(request.userId);
  }

  async store(request, response) {
    const user = await User.findByPk(request.userId);
    const meetup = await Meetup.findByPk(request.body.meetup_id, {
      include: [User],
    });

    if (meetup.id === user.id) {
      return response.status(400).json({ error: 'Meetup already exists.' });
    }

    if (meetup.past) {
      return response
        .status(400)
        .json({ error: "Can't subscribe to past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return response
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time." });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    const formattedDate = format(
      startOfHour(parseISO(meetup.date)),
      "dd'/'MM'/'yyyy'-'H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `New subscripted in ${meetup.title}-${formattedDate}', user: '${user.name}`,
      user: user.id,
    });

    return response.json(subscription);
  }
}

export default new SubscriptionController();
