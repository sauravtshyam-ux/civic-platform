import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config/env';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest, RegisterDTO, LoginDTO } from '../types';
import districtService from '../services/districtService';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, zipCode }: RegisterDTO = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Lookup district if ZIP code provided
  let district = null;
  let state = null;
  if (zipCode && districtService.isValidZipCode(zipCode)) {
    const districtInfo = await districtService.lookupByZipCode(zipCode);
    district = districtInfo.district;
    state = districtInfo.state;
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      zipCode,
      district,
      state,
    },
  });

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        zipCode: user.zipCode,
        district: user.district,
        state: user.state,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginDTO = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        zipCode: user.zipCode,
        district: user.district,
        state: user.state,
      },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      zipCode: true,
      district: true,
      state: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
});
