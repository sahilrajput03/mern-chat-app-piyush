import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';

interface UserType {
  name: string;
  email: string;
  password: string;
  pic: string;
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body as UserType;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the fields');
  }

  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400);
    throw new Error('User Already Exits');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed To Create the User');
  }
});

module.exports = { registerUser };