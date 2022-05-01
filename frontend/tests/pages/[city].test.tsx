import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GetServerSidePropsResult } from "next";
import { submitVote } from "../../api/voting";
import City, { getServerSideProps, Props } from "../../pages/[city]";
import { restaurant, votingResult } from "../testData";

const mockGetVotingResults = jest.fn();
const mockGetVote = jest.fn();

jest.mock("../../api/voting", () => ({
  getVotingResults: jest.fn((...args) => mockGetVotingResults(...args)),
  submitVote: jest.fn().mockResolvedValue({}),
  getVote: jest.fn((...args) => mockGetVote(...args)),
}));

const mockGetRestaurants = jest.fn();

jest.mock("../../api/restaurants", () => ({
  getRestaurants: jest.fn((...args) => mockGetRestaurants(...args)),
}));

describe("user interaction", () => {
  beforeEach(() => {
    mockGetRestaurants.mockResolvedValue([restaurant]);
    mockGetVote.mockResolvedValue(undefined);
    mockGetVotingResults.mockImplementation((_city, date) =>
      date ? Promise.resolve([]) : Promise.resolve([votingResult])
    );
    render(<City restaurants={[restaurant]} votes={[]} yesterdaysVotes={[]} />);
  });

  it("should fetch restaurants to get a voter ID and possible existing vote", () =>
    expect(mockGetVote).toHaveBeenCalled());

  it("should show the voting button as disabled", () =>
    expect(screen.getByTestId("submit-vote")).toBeDisabled());

  it("should show the remove vote button as disabled", () =>
    expect(screen.getByTestId("remove-vote")).toBeDisabled());

  describe("when voting for a restaurant", () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId(restaurant.id), {
        target: { checked: true },
      });
      fireEvent.click(screen.getByTestId("submit-vote"));
      await waitFor(() =>
        expect(screen.getByTestId("submit-vote")).toBeDisabled()
      );
    });

    it("should disable the voting button", () =>
      expect(screen.getByTestId("submit-vote")).toBeDisabled());

    it("should enable the remove vote button", () =>
      expect(screen.getByTestId("remove-vote")).not.toBeDisabled());

    it("should call the correct API", () =>
      expect(submitVote).toHaveBeenCalledWith(restaurant.id));

    describe("when removing a vote", () => {
      beforeEach(async () => {
        fireEvent.click(screen.getByTestId("remove-vote"));
        await waitFor(() =>
          expect(screen.getByTestId("remove-vote")).toBeDisabled()
        );
      });

      it("should enable the voting button", () =>
        expect(screen.getByTestId("submit-vote")).not.toBeDisabled());

      it("should disable the remove vote button", () =>
        expect(screen.getByTestId("remove-vote")).toBeDisabled());

      it("should call the correct API", () =>
        expect(submitVote).toHaveBeenCalledWith(restaurant.id));
    });
  });
});

describe("getServerSideProps", () => {
  let response: GetServerSidePropsResult<Props>;
  beforeEach(() => {
    mockGetRestaurants.mockResolvedValue([restaurant]);
    mockGetVotingResults.mockImplementation((_city, date) =>
      date ? Promise.resolve([]) : Promise.resolve([votingResult])
    );
  });

  describe("when API returns data", () => {
    beforeEach(async () => {
      const context = {
        res: {
          setHeader: jest.fn(),
        },
        params: { city: "city" },
      };
      // @ts-ignore
      response = await getServerSideProps(context);
    });

    it("should set the data as props", () =>
      expect(response).toEqual(
        expect.objectContaining({
          props: {
            restaurants: [restaurant],
            votes: [votingResult],
            yesterdaysVotes: [],
          },
        })
      ));
  });

  describe("when restaurants query fails", () => {
    beforeEach(async () => {
      const context = {
        res: {
          setHeader: jest.fn(),
        },
        params: { city: "city" },
      };
      mockGetRestaurants.mockRejectedValue("oh no");
      // @ts-ignore
      response = await getServerSideProps(context);
    });

    it("should return an empty array of restaurants", () =>
      expect(response).toEqual(
        expect.objectContaining({
          props: {
            restaurants: [],
            votes: [votingResult],
            yesterdaysVotes: [],
          },
        })
      ));
  });

  describe("when voting results query fails", () => {
    beforeEach(async () => {
      const context = {
        res: {
          setHeader: jest.fn(),
        },
        params: { city: "city" },
      };
      mockGetVotingResults.mockRejectedValue("oh no");
      // @ts-ignore
      response = await getServerSideProps(context);
    });

    it("should return an empty array of votes", () =>
      expect(response).toEqual(
        expect.objectContaining({
          props: {
            restaurants: [restaurant],
            votes: [],
            yesterdaysVotes: [],
          },
        })
      ));
  });
});
