import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};

// {
//   "name" : "listing test",
//   "description" :"testdescript" ,
//   "monthlyrent" : "12344",
//   "securitydeposit": "50",
//   "sevendaysfreetrial": "true" ,
//   "freerelocation": "false",
//   "maintenance" : "false",
//   "freeupgrade": "true",
//   "avaiablefrorent" : "3",
//   "imageUrls": ["chjeinw", "cedwfrc"],
//   "userRef": "dfuuytreertyuihcd"

// }