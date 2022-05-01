import { ApiCallFailedError, Vote, VotingResult } from "../data";

export const getVote = async (): Promise<string | undefined> =>
  fetch("http://localhost:8080/api/v1/vote", {
    credentials: "include",
  })
    .then(async (response) => {
      if (response.status !== 200) throw new ApiCallFailedError();
      return response;
    })
    .then((response) => response.json())
    .then((result: Vote) => result.votedFor);

export const getVotingResults = async (
  city: string,
  date?: Date
): Promise<VotingResult[]> =>
  fetch(
    `http://localhost:8080/api/v1/results${
      date ? `/${date.toISOString().split("T")[0]}` : ""
    }`,
    {
      credentials: "include",
    }
  )
    .then((response) => {
      if (response.status !== 200) throw new ApiCallFailedError();
      return response;
    })
    .then((response) => response.json())
    .then((result) =>
      result.results.filter(
        (result: VotingResult) => result.city.toLowerCase() === city
      )
    );

export const submitVote = async (restaurant: string) =>
  fetch(`http://localhost:8080/api/v1/vote/${restaurant}`, {
    method: "POST",
    mode: "no-cors",
    credentials: "include",
  });
