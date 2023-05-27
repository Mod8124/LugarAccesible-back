import Comment from '../../db/models/commentModel';

export interface IPostCommentBody {
  [key: string]: string | number;
  place_id: string;
  author: string;
  rating: number;
  text: string;
}

interface IDelete {
  place_id: string;
  id: string;
}

export interface IEdit extends IDelete {
  [key: string]: string | number;
  author: string;
  rating: number;
  text: string;
}

export const getComments = async (place_id: string, user_id?: string) => {
  const comments = await Comment.findOne({ place_id }).lean();
  if (!comments) return [];

  // Check ownership for each comment and return an array of comments with the "owner" field
  const commentsWithOwnership =
    comments.comments?.map((comment) => ({
      ...comment,
      owner: (user_id && comment.user_id === user_id) || false,
    })) ?? [];

  return commentsWithOwnership;
};

export const getRating = async (place_id: string) => {
  const comment = await Comment.findOne({ place_id });
  if (!comment) {
    return 0;
  }

  const comments = comment.comments;

  if (comments && comments.length > 0) {
    const sum = comments.reduce((total, comment) => total + (comment.rating || 0), 0);
    const averageRating = sum / comments.length;
    return parseFloat(averageRating.toFixed(1));
  }

  return 0;
};

export const postComment = async (body: IPostCommentBody, user_id: string) => {
  const comments = await Comment.findOne({ place_id: body.place_id });
  if (!comments) {
    const newComment = await Comment.create({
      place_id: body.place_id,
      comments: [{ user_id, author: body.author, rating: body.rating, text: body.text }],
    });
    const updatedComments = await getComments(body.place_id, user_id);
    return updatedComments;
  } else {
    const postComment = await Comment.findOneAndUpdate(
      { place_id: body.place_id },
      {
        $push: { comments: { user_id, author: body.author, rating: body.rating, text: body.text } },
      },
      { new: true, upsert: true },
    );
    const updatedComments = await getComments(body.place_id, user_id);
    return updatedComments;
  }
};

export const editComment = async (body: IEdit, user_id: string) => {
  const comments = await Comment.findOne({ place_id: body.place_id });
  if (!comments) return [];

  const commentArray = comments.comments;
  if (!commentArray) return [];

  const commentIndex = commentArray.findIndex(
    (comment: any) => String(comment._id) === String(body.id),
  );
  if (commentIndex === -1) return null;

  if (commentArray[commentIndex].user_id !== user_id) throw Error('The user is not owner');
  commentArray[commentIndex].author = body.author;
  commentArray[commentIndex].rating = body.rating;
  commentArray[commentIndex].text = body.text;

  const savedComments = await comments.save();

  const updatedComments = await getComments(body.place_id, user_id);
  return updatedComments;
};

export const deleteComment = async (body: IDelete, user_id: string) => {
  await Comment.findOneAndUpdate(
    { place_id: body.place_id },
    { $pull: { comments: { _id: body.id } } },
    { new: true },
  );
  const updatedComments = await getComments(body.place_id, user_id);
  return updatedComments;
};
