import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 3em;
  display: grid;
  justify-items: center;
`;

const InputContainer = styled.div`
  > div {
    place-self: center;
  }
  margin-bottom: 2em;
`;

const ButtonContainer = styled.div`
  > div {
    place-self: center;
  }
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [city, setCity] = useState("");

  return (
    <Container>
      <InputContainer>
        <TextField
          data-testid="city"
          label="What city are you in?"
          variant="standard"
          onChange={(e) => setCity(e.currentTarget.value)}
        />
      </InputContainer>
      <ButtonContainer>
        <Button
          disabled={!city}
          data-testid="select-city"
          variant="contained"
          onClick={() => router.push(`/${city.toLowerCase()}`)}
        >
          Select
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Home;
