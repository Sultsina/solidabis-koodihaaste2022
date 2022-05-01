import { fireEvent, render, screen } from "@testing-library/react";
import singletonRouter from "next/router";
import Home from "../../pages/index";

beforeEach(() => render(<Home />));

const city = "city";

describe("when selecting a city", () => {
  beforeEach(() => {
    const cityInput = screen.getByTestId("city").querySelector("input");
    fireEvent.change(cityInput!, { target: { value: city } });
    fireEvent.click(screen.getByTestId("select-city"));
  });

  it("should move to the city's page", () =>
    expect(singletonRouter).toMatchObject({
      asPath: `/${city}`,
      pathname: `/${city}`,
      query: {},
    }));
});
