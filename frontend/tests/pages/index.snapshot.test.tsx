import renderer from "react-test-renderer";
import Home from "../../pages/index";

jest.mock("@mui/material/Button", () => "button");
jest.mock("@mui/material/TextField", () => "textField");

it("renders correctly without input", () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});
