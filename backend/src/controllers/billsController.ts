import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest, BillFeedQuery, VoteDTO } from '../types';

export const getBillsFeed = asyncHandler(async (req: Request, res: Response) => {
  const { state, district, page = '1', limit = '20', level }: BillFeedQuery = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const where: any = {};

  if (level) {
    where.level = level;
  }

  if (state) {
    where.OR = [
      { level: 'federal' },
      { level: 'state', state: state.toUpperCase() },
    ];
  }

  // Fetch bills
  const [bills, total] = await Promise.all([
    prisma.bill.findMany({
      where,
      orderBy: { lastActionDate: 'desc' },
      skip,
      take: limitNum,
      select: {
        id: true,
        title: true,
        summary: true,
        aiSummary: true,
        status: true,
        introducedDate: true,
        lastActionDate: true,
        sponsor: true,
        level: true,
        state: true,
        chamber: true,
        billNumber: true,
        upvotes: true,
        downvotes: true,
      },
    }),
    prisma.bill.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      bills,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const getBillById = asyncHandler(async (req: Request, res: Response) => {
  const { billId } = req.params;

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      amendments: {
        orderBy: { upvotes: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  res.json({
    success: true,
    data: { bill },
  });
});

export const voteBill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { billId } = req.params;
  const { voteType }: VoteDTO = req.body;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  if (!['upvote', 'downvote'].includes(voteType)) {
    throw new AppError('Invalid vote type', 400);
  }

  // Check if bill exists
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  // Check existing vote
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_billId: {
        userId,
        billId,
      },
    },
  });

  // Handle vote logic
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Remove vote (toggle off)
      await prisma.$transaction([
        prisma.vote.delete({
          where: { id: existingVote.id },
        }),
        prisma.bill.update({
          where: { id: billId },
          data: {
            [voteType === 'upvote' ? 'upvotes' : 'downvotes']: {
              decrement: 1,
            },
          },
        }),
      ]);

      return res.json({
        success: true,
        message: 'Vote removed',
        data: { voteType: null },
      });
    } else {
      // Change vote
      await prisma.$transaction([
        prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        }),
        prisma.bill.update({
          where: { id: billId },
          data: {
            upvotes: {
              [voteType === 'upvote' ? 'increment' : 'decrement']: 1,
            },
            downvotes: {
              [voteType === 'downvote' ? 'increment' : 'decrement']: 1,
            },
          },
        }),
      ]);

      return res.json({
        success: true,
        message: 'Vote updated',
        data: { voteType },
      });
    }
  } else {
    // Create new vote
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId,
          billId,
          voteType,
        },
      }),
      prisma.bill.update({
        where: { id: billId },
        data: {
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: {
            increment: 1,
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Vote recorded',
      data: { voteType },
    });
  }
});

export const saveBill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { billId } = req.params;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  // Check if bill exists
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  // Check if already saved
  const existing = await prisma.savedBill.findUnique({
    where: {
      userId_billId: {
        userId,
        billId,
      },
    },
  });

  if (existing) {
    throw new AppError('Bill already saved', 400);
  }

  await prisma.savedBill.create({
    data: {
      userId,
      billId,
    },
  });

  res.json({
    success: true,
    message: 'Bill saved successfully',
  });
});

export const unsaveBill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { billId } = req.params;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const savedBill = await prisma.savedBill.findUnique({
    where: {
      userId_billId: {
        userId,
        billId,
      },
    },
  });

  if (!savedBill) {
    throw new AppError('Bill not saved', 404);
  }

  await prisma.savedBill.delete({
    where: { id: savedBill.id },
  });

  res.json({
    success: true,
    message: 'Bill unsaved successfully',
  });
});
