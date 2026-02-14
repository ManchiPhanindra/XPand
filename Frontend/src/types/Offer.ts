export interface Offer {
  _id: string;
  title: string;
  description: string;
  tag: string;
  duration: number;
  credits: number;
  prerequisites?: string;
  availability?: string;
  format?: 'One-on-One' | 'Group' | 'Review' | 'Other';
  userId: {
    _id: string;
    name: string;
    avatar?: string;
    giveScore: number;
    averageRating?: number;
    reviewCount?: number;
  };
}
