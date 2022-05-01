import fetchMock from "jest-fetch-mock";
import { getRestaurants } from "../../api/restaurants";
import { ApiCallFailedError, Restaurant } from "../../data";
import { restaurant } from "../testData";

beforeEach(() => fetchMock.resetMocks());

let result: Restaurant[];
let requestURL: string;
let request: RequestInit | undefined;
const city = "city";

describe("getRestaurants", () => {
  describe("when API returns HTTP 200", () => {
    beforeEach(async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          restaurants: [restaurant],
        }),
        {
          status: 200,
        }
      );
      result = await getRestaurants(city);
      const call = fetchMock.mock.calls[0];
      requestURL = call[0] as string;
      request = call[1];
    });

    test("calls the correct API endpoint", () =>
      expect(requestURL).toBe(
        `http://localhost:8080/api/v1/restaurants/${city}`
      ));

    test("uses correct options", () =>
      expect(request).toStrictEqual({ credentials: "include" }));

    it("returns restaurants", () => expect(result).toStrictEqual([restaurant]));
  });

  describe("when API returns HTTP 400", () => {
    beforeEach(() => fetchMock.mockResponseOnce("", { status: 400 }));

    it("should throw", async () =>
      await expect(getRestaurants(city)).rejects.toEqual(
        new ApiCallFailedError()
      ));
  });

  describe("when API call cannot be completed", () => {
    const error = new Error();
    beforeEach(() => fetchMock.mockRejectedValue(error));

    it("should throw", async () =>
      await expect(getRestaurants(city)).rejects.toEqual(error));
  });
});
