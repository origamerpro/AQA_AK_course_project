import { STATUS_CODES } from 'data/statusCodes';
import { generateCommentData } from './generateCommentData.data';

export const positiveTestCasesForAddComment = [
  {
    name: 'Valid comment',
    comment: generateCommentData(),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'Valid comment - 250 chars',
    comment: generateCommentData(244),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'Valid comment - 1 chars',
    comment: generateCommentData(1),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
];

export const negativeTestCasesForAddComment = [
  {
    name: 'Empty comment',
    comment: generateCommentData(0),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'Too long comment',
    comment: generateCommentData(251),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect request body',
  },
];

export const negativeTestCasesForAddCommentWithoutToken = [
  {
    name: 'Missing auth token',
    comment: generateCommentData(),
    invalidToken: '',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
    isSuccess: false,
    errorMessage: 'Not authorized',
  },
  {
    name: 'Invalid auth token',
    comment: generateCommentData(),
    invalidToken: 'invalid_token',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
    isSuccess: false,
    errorMessage: 'Invalid access token',
  },
];
