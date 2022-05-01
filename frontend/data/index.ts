interface Dish {
  name: string;
}

export interface Restaurant {
  id: string;
  name: string;
  openingHours: string;
  dishes: Dish[];
}

export interface VotingResult {
  restaurantid: string;
  city: string;
  name: string;
  votes: number;
}

export interface Vote {
  votedFor?: string;
}

export class ApiCallFailedError extends Error {
  constructor() {
    super();
    this.name = "ApiCallFailedError";
  }
}
