import PeopleList from "./PeopleList";
import { Button } from "@repo/ui";

const App = () => {
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        margin: "15rem 5em"
      }}>
        <h1>People List Microfront</h1>
        <PeopleList />
        <Button>Contador compartilhado (@repo/ui)</Button>
      </div>
    </>
  );
};

export default App;
