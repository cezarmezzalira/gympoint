import { format, addMonths } from 'date-fns';
import * as Yup from 'yup';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: ['created_at'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
      ],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid values!' });
    }

    const { student_id, plan_id } = req.body;

    // find if student has a registration
    const registration = await Registration.findOne({
      where: { student_id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // if student has a registration, returns error...
    if (registration) {
      return res.status(400).json({
        error: `Student ${registration.student.name} has been registered until ${registration.end_date}`,
      });
    }

    // find the plan
    const plan = await Plan.findByPk(plan_id);

    // if no plan found, return an error
    if (!plan) {
      return res.status(400).json({
        error: 'Invalid Plan',
      });
    }

    const start_date = new Date();
    // Add duration plan to end_date
    const end_date = addMonths(start_date, plan.duration);

    const totalPrice = plan.price * plan.duration;

    const addRegistration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: totalPrice,
    });

    // After create a registration, an email has sent to Student
    const student = await Student.findByPk(student_id, {
      attributes: ['name', 'email'],
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula do aluno',
      template: 'registration',
      context: {
        name: student.name,
        startDate: format(start_date, 'dd/MM/yyyy'),
        planName: `${plan.title} (${plan.duration}) ${
          plan.duration === 1 ? 'mês' : 'meses'
        }`,
        endDate: `${format(end_date, 'dd/MM/yyyy')} (${plan.duration}) ${
          plan.duration === 1 ? 'mês' : 'meses'
        }`,
        price: `${totalPrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
      },
    });

    return res.json(addRegistration);
  }

  // Await req.params.student_id and req.body.plan_id
  async update(req, res) {
    const schemaBody = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .required(),
    });

    const schemaParams = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid plan!' });
    }

    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid student!' });
    }

    const { student_id } = req.params;
    const { plan_id } = req.body;

    // find if student has a registration
    const registration = await Registration.findOne({
      where: { student_id },
    });

    if (!registration) {
      return res.status(400).json({
        error: `Student has not been registered!`,
      });
    }
    // find the plan
    const plan = await Plan.findByPk(plan_id);

    // if no plan found, return an error
    if (!plan) {
      return res.status(400).json({
        error: 'Invalid Plan',
      });
    }

    const start_date = new Date();
    // Add duration plan to end_date
    const end_date = addMonths(start_date, plan.duration);

    const totalPrice = plan.price * plan.duration;

    const { price } = await registration.update({
      plan_id,
      start_date,
      end_date,
      price: totalPrice,
    });

    return res.json({ plan_id, start_date, end_date, price });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new RegistrationController();
