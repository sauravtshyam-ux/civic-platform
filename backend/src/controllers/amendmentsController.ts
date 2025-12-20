import { Response } from 'express';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest, CreateAmendmentDTO, VoteDTO } from '../types';
import aiSummaryService from '../services/aiSummaryService';

export const createAmendment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { billId } = req.params;
  const { content }: CreateAmendmentDTO = req.body;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  if (!content || content.trim().length < 10) {
    throw new AppError('Amendment content must be at least 10 characters', 400);
  }

  // Check if bill exists
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  // Clean amendment text using AI
  const cleanedContent = await aiSummaryService.cleanAmendmentText(content);

  // Check if content was flagged
  if (cleanedContent.includes('[FLAGGED:')) {
    throw new AppError('Amendment content violates community guidelines', 400);
  }

  // Create amendment
  const amendment = await prisma.amendment.create({
    data: {
      billId,
      userId,
      content,
      cleanedContent,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: { amendment },
  });
});

export const getAmendments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { billId } = req.params;

  const amendments = await prisma.amendment.findMany({
    where: { billId },
    orderBy: { upvotes: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: { amendments },
  });
});

export const voteAmendment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: amendmentId } = req.params;
  const { voteType }: VoteDTO = req.body;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  if (!['upvote', 'downvote'].includes(voteType)) {
    throw new AppError('Invalid vote type', 400);
  }

  // Check if amendment exists
  const amendment = await prisma.amendment.findUnique({
    where: { id: amendmentId },
  });

  if (!amendment) {
    throw new AppError('Amendment not found', 404);
  }

  // Check existing vote
  const existingVote = await prisma.amendmentVote.findUnique({
    where: {
      userId_amendmentId: {
        userId,
        amendmentId,
      },
    },
  });

  // Handle vote logic (similar to bill voting)
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Remove vote
      await prisma.$transaction([
        prisma.amendmentVote.delete({
          where: { id: existingVote.id },
        }),
        prisma.amendment.update({
          where: { id: amendmentId },
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
        prisma.amendmentVote.update({
          where: { id: existingVote.id },
          data: { voteType },
        }),
        prisma.amendment.update({
          where: { id: amendmentId },
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
      prisma.amendmentVote.create({
        data: {
          userId,
          amendmentId,
          voteType,
        },
      }),
      prisma.amendment.update({
        where: { id: amendmentId },
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
