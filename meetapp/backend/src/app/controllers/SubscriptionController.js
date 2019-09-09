import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(request, response) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: request.userId },
      include: [
        {
          model: Meetup,
          required: true,
          date: {
            [Op.gt]: request.body.date ? request.body.date : new Date(),
          },
        },
      ],
      order: [[Meetup, 'date']],
    });

    return response.json(subscriptions);
  }

  async store(request, response) {
    const user = await User.findByPk(request.userId);
    const meetup = await Meetup.findByPk(request.params.id, {
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

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return response.json(subscription);
  }
}

export default new SubscriptionController();
