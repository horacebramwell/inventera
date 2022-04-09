const { ProductionBoard, Production } = require('../../db/models');

exports.getAll = async (req, res, next) => {
  try {
    const boards = await ProductionBoard.findAll({
      include: [
        {
          model: Production,
          as: 'productions',
        },
      ],
      attributes: ['id', 'name'],
    });
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};
