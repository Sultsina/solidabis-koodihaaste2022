import { Restaurant, VotingResult } from "../data";

export const restaurant: Restaurant = {
  id: "123",
  name: "McDonalds",
  openingHours: "6-23",
  dishes: [],
};

export const votingResult: VotingResult = {
  name: "McDonalds",
  restaurantid: restaurant.id,
  votes: 1,
  city: "Helsinki",
};
