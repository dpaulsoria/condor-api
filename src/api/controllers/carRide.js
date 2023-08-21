require("dotenv").config();
const {
  successResponse,
  errorResponse,
  validationResponse,  
} = require("../utils/responseApi");
const { User, CarRide } = require("../models");
const carRideValidation = require("../validations/carRide");
const moment = require("moment");
const { Op } = require("sequelize");
const {MAX_MINUTES_BEFORE} = require('../../config/constants')

const get = async (req, res) => {
  try {
    let date = moment().subtract(MAX_MINUTES_BEFORE, 'minutes').toISOString()     
    const carRide = await CarRide.findOne({
      where: { id: req.params.id,
        [Op.and]: [
          { 
            requestDate: {
              [Op.gte]: date
            }, 
          }          
        ] 
      },
    }); 
    res.status(200).json(carRide);
  } catch (err) { 
    return res.status(400).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const rows = await CarRide.findAll({
      where: { urbanization: req.params.urbanization, 
        [Op.or]: [
          { passenger: req.params.user },
          { driver: req.params.user }
        ],   
      },
      order: [
        ['requestDate', 'DESC']
      ],
      limit: 10
    }); 
    res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getAllAvailiable = async (req, res) => {
  try {   
    let date = moment().subtract(MAX_MINUTES_BEFORE, 'minutes').toISOString() 
    const rows = await CarRide.findAll({
      where: { 
        urbanization: req.params.urbanization, 
        [Op.and]: [
          {
            status: req.params.status,
            requestDate: {
              [Op.gte]: date
            }, 
          }          
        ] 
      },
      order: [
        ['requestDate', 'DESC']
      ],
      limit: 30,
      include: [
        {
          model: User,                     
        }
      ]
    }); 
    res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    var bodyTmp = req.body;  
    bodyTmp.requestDate = moment().toISOString();
    const savedCarRide = await CarRide.create(bodyTmp);
    return res.status(201).json({ carRide: savedCarRide });
  } catch (err) {  
    return res.status(400).json({ error: err.message });
  }
};

const deleteRegister = async (req, res) => { 
  try {
    const idValue = req.params.id;
    const result = await CarRide.destroy({ where: { id: idValue } }); 
    if (result != 1)
      return res
        .status(400)
        .json(
          validationResponse([`Error id=${idValue}`])
        );
    return res
      .status(200)
      .json(successResponse(`Success id=${idValue}`, {}, 200));
  } catch (err) { 
    return res.status(400).json({ error: err.message });
  }
};


const configDriver = async (req, res) => { 
  try {
    const idValue = req.params.id;
    const bodyValue = req.body;
    const carRide = await CarRide.findOne({
      where: { id: idValue },
    });      
    let fieldsUpdate = {
      driver: bodyValue.driver,
      status: bodyValue.status
    };
    if(bodyValue.asDriver)
      fieldsUpdate.observationsDriver = bodyValue.observationsDriver
    await carRide.update(fieldsUpdate)
    return res
      .status(200)
      .json(successResponse(`Success id=${idValue}`, carRide, 200));
  } catch (err) { 
    return res.status(400).json({ error: err.message });
  }
};

const giveGrade = async (req, res) => { 
  try {
    const idValue = req.params.id;
    const bodyValue = req.body; 
    const carRide = await CarRide.findOne({ where: { id: idValue } });    
    let user = {}
    if(carRide.finalComments === null)
        carRide.finalComments = {}
    
    if(bodyValue.autor === 'Passenger') {                      
      carRide.finalComments.ratingPassenger = bodyValue.rating ?? ''
      carRide.finalComments.commentPassenger = bodyValue.comment ?? ''             
      user = await User.findOne({ where: { username: carRide.driver, 
        codeUrbanization: carRide.urbanization}  })
      user.pointsDriver = parseInt(user.pointsDriver) + parseInt(bodyValue.rating)      
    } else {
      carRide.finalComments.ratingDriver = bodyValue.rating ?? ''
      carRide.finalComments.commentDriver = bodyValue.comment ?? '' 
      user = await User.findOne({ where: { username: carRide.passenger, 
        codeUrbanization: carRide.urbanization}  })
      user.pointsPassenger = parseInt(user.pointsPassenger) + parseInt(bodyValue.rating)
    } 
    user.careers = parseInt(user.careers) + 1
    carRide.changed("finalComments",true)
    await carRide.save()      
    await user.save()

    return res
      .status(200)
      .json(successResponse(`Success id=${idValue}`, carRide, 200));
  } catch (err) {  
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  get,
  deleteRegister,
  configDriver,
  giveGrade,
  getAll,
  getAllAvailiable
};
