import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { NextPage } from "next";
import { VotingResult } from "../data";

interface Props {
  votes: VotingResult[];
}

const VoteTable: NextPage<Props> = ({ votes }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Restaurant</TableCell>
          <TableCell>Votes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {votes.map((vote) => (
          <TableRow key={vote.restaurantid}>
            <TableCell>{vote.name}</TableCell>
            <TableCell>{vote.votes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default VoteTable;
