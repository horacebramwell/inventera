const { User, Unit, Category, Material, Supplier } = require('../../db/models');
const { uuid } = require('uuidv4');

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Unit,
          as: 'units',
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
        },
        {
          model: Material,
          as: 'materials',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
            {
              model: Unit,
              as: 'unit',
              attributes: ['id', 'name'],
            },
            {
              model: Supplier,
              as: 'supplier',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create({
      id: uuid(),
      ...req.body,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
