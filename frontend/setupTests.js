import "jest-styled-components";
import "@testing-library/jest-dom";

require("jest-fetch-mock").enableMocks();

jest.mock("next/router", () => require("next-router-mock"));
