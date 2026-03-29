import mongoose from 'mongoose';

const validateObjectId = (...paramNames) => {
  return (req, res, next) => {
    for (const param of paramNames) {
      const id = req.params[param];
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: `Invalid ${param}: "${id}" is not a valid ID`,
        });
      }
    }
    next();
  };
};

export default validateObjectId;