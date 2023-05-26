import Feedback from '../../db/models/feedbackModel';
import { IBodyPost } from '@/interfaces/index';

export const addFeedback = async (object: IBodyPost) => {
  const create = await Feedback.create(object);
  return create;
};
