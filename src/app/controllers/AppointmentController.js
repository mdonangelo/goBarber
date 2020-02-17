import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import { startOfHour, parseISO, isBefore } from 'date-fns';

import * as Yup from 'yup';

class AppointmentController{

  async index(req, res){

    const {page = 1} = req.query;

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include:[
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    });

    return res.json(appointment);
  }

  async store(req, res){
    // Schema validation
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const { provider_id, date } = req.body;

    // Verificar se o usuário é provider
    const isProvider = await User.findOne(
      {
        where:
          {
            id: provider_id,
            provider: true
          }
        }
    );

    if(!isProvider){
      return res.status(401).json(
        {
          error: 'You need create appointments with provider.'
        }
      );
    }

    // Verificar se data é válida >= hoje
    // Transformar em data javascript e apenas pegar hora, não minutos
    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.status(400).json({
        error: 'Past dates are not permitted.'
      });
    }

    // Verificar se horário está vago
    const checkAvailability = await Appointment.findOne(
      { where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }}
    );

    if(checkAvailability){
      return res.status(400).json({
        error: 'Appointment date is not available.'
      });
    }

    // Cadastrar agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    return res.json(appointment);
  }

}

export default new AppointmentController();
