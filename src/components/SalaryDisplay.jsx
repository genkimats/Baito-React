import { Paper } from "@mui/material";
import CountUp from "react-countup";

function SalaryDisplay(props) {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          display: "grid",
          paddingX: 0,
          height: "fit-content",
          minWidth: 235,
          justifyItems: "center",
        }}
      >
        <CountUp
          duration={1}
          end={props.salary}
          className="monthly-salary"
          prefix="¥ "
        />
      </Paper>
    </>
  );
}

export default SalaryDisplay;
