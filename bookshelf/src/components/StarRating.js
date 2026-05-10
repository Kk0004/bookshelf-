import React, { useState } from 'react';
import './StarRating.css';

export default function StarRating({ rating = 0, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating size-${size} ${readonly ? 'readonly' : 'interactive'}`}>
      {stars.map(star => {
        const filled = readonly
          ? star <= Math.round(rating)
          : star <= (hovered || rating);
        return (
          <span
            key={star}
            className={`star ${filled ? 'filled' : ''}`}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange && onChange(star)}
          >
            ★
          </span>
        );
      })}
      {readonly && rating > 0 && (
        <span className="rating-value">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}
