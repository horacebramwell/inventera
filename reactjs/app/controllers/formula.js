const { Formula, Unit, User } = require('../../db/models');
const { uuid } = require('uuidv4');

const include = [
  {
    model: Unit,
    as: 'unit',
    attributes: ['id', 'name', 'abbr'],
  },
];

exports.getAll = async (req, res, next) => {
  try {
    const formulas = await Formula.findAll({
      include,
    });
    res.status(200).json(formulas);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const formula = await Formula.findByPk(req.params.id, {
      include,
    });
    res.status(200).json(formula);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const formula = await Formula.create({
      id: uuid(),
      ...req.body,
    });
    res.status(201).json(formula);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const formula = await Formula.findByPk(req.params.id);
    await formula.update(req.body);
    res.status(200).json(formula);
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const formula = await Formula.findByPk(req.params.id);
    await formula.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};