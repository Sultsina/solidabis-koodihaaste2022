import { ApiCallFailedError, Restaurant } from "../data";

export const getRestaurants = async (city: string): Promise<Restaurant[]> =>
  fetch(`http://localhost:8080/api/v1/restaurants/${city}`, {
    credentials: "include",
  })
    .then((response) => {
      if (response.status !== 200) throw new ApiCallFailedError();
      return response;
    })
    .then((response) => response.json())
    .then((result) =>
      result.restaurants.filter(
        (restaurant: Restaurant) =>
          true /*restaurant.openingHours.match(/^\d/)*/
      )
    );
