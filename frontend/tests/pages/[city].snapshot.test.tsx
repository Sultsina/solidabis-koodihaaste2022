import mockRouter from "next-router-mock";
import renderer from "react-test-renderer";
import City from "../../pages/[city]";
import { restaurant, votingResult } from "../testData";

jest.mock("@mui/material/Button", () => "button");
jest.mock("@mui/material/FormControl", () => "FormControl");
jest.mock("@mui/material/FormControlLabel", () => "FormControlLabel");
jest.mock("@mui/material/FormLabel", () => "FormLabel");
jest.mock("@mui/material/Paper", () => "Paper");
jest.mock("@mui/material/Radio", () => "Radio");
jest.mock("@mui/material/RadioGroup", () => "RadioGroup");
jest.mock("@mui/material/Table", () => "Table");
jest.mock("@mui/material/TableBody", () => "TableBody");
jest.mock("@mui/material/TableCell", () => "TableCell");
jest.mock("@mui/material/TableContainer", () => "TableContainer");
jest.mock("@mui/material/TableHead", () => "TableHead");
jest.mock("@mui/material/TableRow", () => "TableRow");

jest.mock("../../api/voting", () => ({
  getVote: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() =>
  renderer.act(() => mockRouter.setCurrentUrl(`/${restaurant.id}`))
);

it("renders correctly without restaurants", () => {
  const tree = renderer
    .create(<City restaurants={[]} votes={[]} yesterdaysVotes={[]} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly with no votes", () => {
  const tree = renderer
    .create(<City restaurants={[restaurant]} votes={[]} yesterdaysVotes={[]} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly with yesteredays votes", () => {
  const tree = renderer
    .create(
      <City
        restaurants={[restaurant]}
        votes={[]}
        yesterdaysVotes={[votingResult]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
