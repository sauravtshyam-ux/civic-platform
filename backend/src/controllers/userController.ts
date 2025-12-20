import { Response } from 'express';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest, UpdateProfileDTO } from '../types';
import districtService from '../services/districtService';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
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
      _count: {
        select: {
          votes: true,
          savedBills: true,
          amendments: true,
        },
      },
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

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const { firstName, lastName, zipCode, district, state }: UpdateProfileDTO = req.body;

  // If ZIP code is updated, lookup district
  let updatedDistrict = district;
  let updatedState = state;

  if (zipCode && districtService.isValidZipCode(zipCode)) {
    const districtInfo = await districtService.lookupByZipCode(zipCode);
    updatedDistrict = districtInfo.district;
    updatedState = districtInfo.state;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      zipCode,
      district: updatedDistrict,
      state: updatedState,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      zipCode: true,
      district: true,
      state: true,
    },
  });

  res.json({
    success: true,
    data: { user },
  });
});
