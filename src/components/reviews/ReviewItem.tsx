import React from 'react';

type ReviewItemProps = {
  reviewer: string;
  rating: number;
  comment: string;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ reviewer, rating, comment }) => {
  return (
    <div className="review-item">
      <h3>{reviewer}</h3>
      <p>Rating: {rating}/5</p>
      <p>{comment}</p>
    </div>
  );
};

export default ReviewItem;
