import fetchMock from "jest-fetch-mock";
import { getVote, getVotingResults, submitVote } from "../../api/voting";
import { ApiCallFailedError, VotingResult } from "../../data";
import { votingResult } from "../testData";

beforeEach(() => fetchMock.resetMocks());

let requestURL: string;
let request: RequestInit | undefined;
const city = "helsinki";
const restaurantId = "restaurantId";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01").getTime());

describe("getVote", () => {
  let result: string | undefined;

  describe("when API returns HTTP 200", () => {
    beforeEach(async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ votedFor: restaurantId }), {
        status: 200,
      });
      result = await getVote();
      const call = fetchMock.mock.calls[0];
      requestURL = call[0] as string;
      request = call[1];
    });

    test("calls the correct API endpoint", () =>
      expect(requestURL).toBe("http://localhost:8080/api/v1/vote"));

    test("uses correct options", () =>
      expect(request).toStrictEqual({ credentials: "include" }));

    it("returns voting results", () => expect(result).toEqual(restaurantId));
  });

  describe("when API returns HTTP 400", () => {
    beforeEach(() => fetchMock.mockResponseOnce("", { status: 400 }));

    it("should throw", async () =>
      await expect(getVote()).rejects.toEqual(new ApiCallFailedError()));
  });

  describe("when API call cannot be completed", () => {
    const error = new Error();
    beforeEach(() => fetchMock.mockRejectedValue(error));

    it("should throw", async () =>
      await expect(getVote()).rejects.toEqual(error));
  });
});

describe("getVotingResults", () => {
  let result: VotingResult[];

  describe("when API returns HTTP 200", () => {
    beforeEach(async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          results: [votingResult],
        }),
        {
          status: 200,
        }
      );
      result = await getVotingResults(city);
      const call = fetchMock.mock.calls[0];
      requestURL = call[0] as string;
      request = call[1];
    });

    test("calls the correct API endpoint", () =>
      expect(requestURL).toBe(`http://localhost:8080/api/v1/results`));

    test("uses correct options", () =>
      expect(request).toStrictEqual({ credentials: "include" }));

    it("returns voting results", () =>
      expect(result).toStrictEqual([votingResult]));
  });

  describe("when specifying a date", () => {
    beforeEach(async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          results: [votingResult],
        }),
        {
          status: 200,
        }
      );
      result = await getVotingResults(city, new Date());
      const call = fetchMock.mock.calls[0];
      requestURL = call[0] as string;
      request = call[1];
    });

    test("calls the correct API endpoint", () =>
      expect(requestURL).toBe(
        "http://localhost:8080/api/v1/results/2020-01-01"
      ));
  });

  describe("when API returns HTTP 400", () => {
    beforeEach(() => fetchMock.mockResponseOnce("", { status: 400 }));

    it("should throw", async () =>
      await expect(getVotingResults(city)).rejects.toEqual(
        new ApiCallFailedError()
      ));
  });

  describe("when API call cannot be completed", () => {
    const error = new Error();
    beforeEach(() => fetchMock.mockRejectedValue(error));

    it("should throw", async () =>
      await expect(getVotingResults(city)).rejects.toEqual(error));
  });
});

describe("submitVote", () => {
  describe("when API returns HTTP 200", () => {
    beforeEach(async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ votedFor: restaurantId }), {
        status: 200,
      });
      await submitVote(restaurantId);
      const call = fetchMock.mock.calls[0];
      requestURL = call[0] as string;
      request = call[1];
    });

    test("calls the correct API endpoint", () =>
      expect(requestURL).toBe(
        `http://localhost:8080/api/v1/vote/${restaurantId}`
      ));

    test("uses correct options", () =>
      expect(request).toStrictEqual({
        method: "POST",
        mode: "no-cors",
        credentials: "include",
      }));
  });

  describe("when API call cannot be completed", () => {
    const error = new Error();
    beforeEach(() => fetchMock.mockRejectedValue(error));

    it("should throw", async () =>
      await expect(submitVote(restaurantId)).rejects.toEqual(error));
  });
});
