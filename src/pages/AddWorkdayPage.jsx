import Calendar from "react-calendar";
import "../css/Calendar.css";

function AddWorkdayPage() {
  const onClickDay = () => {
    alert("Clicked day!");
  };

  return (
    <Calendar
      className={"react-calendar"}
      onClickDay={onClickDay}
      view="month"
    ></Calendar>
  );
}

export default AddWorkdayPage;
