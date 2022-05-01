import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getRestaurants } from "../api/restaurants";
import { getVote, getVotingResults, submitVote } from "../api/voting";
import VoteTable from "../components/voteTable";
import { Restaurant, VotingResult } from "../data";

const Container = styled.div`
  margin-top: 3em;
  margin-left: 1.5em;
  margin-right: 1.5em;
  margin-bottom: 2em;
  display: grid;
  justify-items: center;
  grid-template-columns: 100%;

  @media screen and (min-width: 1024px) {
    grid-template-columns: 50% 50%;
  }
`;

const Restaurants = styled.section`
  @media screen and (min-width: 1024px) {
    grid-row-end: span 2;
  }
`;

const Title = styled.h1``;

const A = styled.a`
  cursor: pointer;
  color: blue;
  &:hover {
    text-decoration: underline;
    color: darkblue;
  }
`;

const Info = styled.div``;

const Name = styled.span`
  text-transform: capitalize;
`;

export interface Props {
  restaurants: Restaurant[];
  votes: VotingResult[];
  yesterdaysVotes: VotingResult[];
}

const Dishes = styled.div<{ visible: boolean }>`
  font-size: 0.8em;
  margin-left: 2.5em;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.2s ease-out;
  ${({ visible }) =>
    visible
      ? `
      transition: max-height 1s ease-in;
      max-height: 500px;
    `
      : ""}
`;

const Dish = styled.div<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled
      ? `
    color: rgba(0, 0, 0, 0.38);
  `
      : ""}
`;

const Divider = styled.div`
  margin-bottom: 1.5em;
`;

const NoRestaurantsContainer = styled.div`
  margin-top: 3em;
  margin-left: 1.5em;
  margin-right: 1.5em;
  margin-bottom: 2em;
  display: grid;
  justify-items: center;
`;

const ResultsContainer = styled.div`
  display: grid;
  justify-items: center;
  padding-left: 2em;
  padding-right: 2em;
`;

const CityPage: NextPage<Props> = ({ restaurants, votes, yesterdaysVotes }) => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [hoveringOver, setHoveringOver] = useState("");
  const { city } = router.query;

  useEffect(() => {
    getVote().then((savedVote) => {
      if (savedVote) {
        setRestaurant(savedVote);
        setSelectedRestaurant(savedVote);
      }
    });
  }, []);

  const submit = async () =>
    submitVote(restaurant).then(() => {
      const newSelectedRestaurant =
        restaurant === selectedRestaurant ? "" : restaurant;
      setSelectedRestaurant(newSelectedRestaurant);
      router.replace(router.asPath);
    });

  if (restaurants.length === 0)
    return (
      <NoRestaurantsContainer>
        <Title>
          No Restaurants for <Name>{city}</Name>
        </Title>
        <Info>
          Is the city name correct? Switch to another city{" "}
          <Link href="/" passHref>
            <A>here</A>
          </Link>
        </Info>
      </NoRestaurantsContainer>
    );

  return (
    <Container>
      <Restaurants>
        <Title>
          Restaurants for <Name>{city}</Name>
        </Title>
        <FormControl disabled={!!selectedRestaurant}>
          <FormLabel id="restaurants">My vote goes for...</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(e) => setRestaurant(e.currentTarget.value)}
            value={restaurant}
          >
            {restaurants.map((restaurant) => (
              <div key={restaurant.id}>
                <FormControlLabel
                  data-testid={restaurant.id}
                  value={restaurant.id}
                  label={restaurant.name}
                  control={<Radio />}
                  onMouseOver={() => setHoveringOver(restaurant.id)}
                  onMouseOut={() => setHoveringOver("")}
                />
                <Dishes visible={hoveringOver === restaurant.id}>
                  {restaurant.dishes.map((dish) => (
                    <Dish disabled={!!selectedRestaurant} key={dish.name}>
                      {dish.name}
                    </Dish>
                  ))}
                </Dishes>
              </div>
            ))}
          </RadioGroup>
          <Divider />
          <Button
            data-testid="submit-vote"
            variant="contained"
            disabled={!restaurant || !!selectedRestaurant}
            onClick={submit}
          >
            Select
          </Button>
          <Divider />
          <Button
            data-testid="remove-vote"
            variant="contained"
            disabled={!selectedRestaurant}
            onClick={submit}
          >
            Remove my vote
          </Button>
        </FormControl>
        <Divider />
      </Restaurants>
      <ResultsContainer>
        <h2>Results</h2>
        {votes.length > 0 ? (
          <VoteTable votes={votes}></VoteTable>
        ) : (
          <Info>No votes yet</Info>
        )}
        <Divider />
        <h2>Yesterdays votes</h2>
        {yesterdaysVotes.length > 0 ? (
          <VoteTable votes={yesterdaysVotes}></VoteTable>
        ) : (
          <Info>No votes yesterday</Info>
        )}
      </ResultsContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const city = context.params!.city as string;
  const restaurantsResult = await getRestaurants(city).catch(() => []);
  const votingResults = await getVotingResults(city).catch(() => []);
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdaysResults = await getVotingResults(city, yesterday).catch(
    () => []
  );
  return {
    props: {
      restaurants: restaurantsResult,
      votes: votingResults,
      yesterdaysVotes: yesterdaysResults,
    },
  };
};

export default CityPage;
