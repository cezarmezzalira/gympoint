import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid values!' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists!' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    const { id: studentId } = req.params;

    const { email: studentEmail } = req.body;

    const student = await Student.findByPk(studentId);

    if (typeof studentEmail !== 'undefined' && studentEmail !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: studentEmail },
      });
      if (studentExists) {
        return res.status(400).json({ error: 'E-mail used for other student' });
      }
    }

    const { id, name, email, age, height, weight } = await student.update(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }
}

export default new StudentController();
