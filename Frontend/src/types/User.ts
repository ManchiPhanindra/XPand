export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  credits: number;
  skillsOffered?: string[];
  skillsWanted?: string[];
  totalHoursGiven: number;
  totalHoursReceived: number;
  giveScore: number;
  averageRating?: number;
  reviewCount?: number;
}
