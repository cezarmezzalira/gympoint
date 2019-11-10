import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    const currentDay = new Date();
    const { id: student_id } = req.params;
    // query returns count of checkins on last 7 days
    const totalCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: { [Op.between]: [subDays(currentDay, 7), currentDay] },
      },
    });

    // if totalCheckins exceeds 5, returns an error message
    if (totalCheckins.count >= 5) {
      return res
        .status(400)
        .json({ error: 'You Exceed the number of checkins this week.' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new CheckinController();
