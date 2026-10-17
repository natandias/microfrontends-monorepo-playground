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
        margin: "10rem 5em"
      }}>
        <app-header app-title="People Listing Microfront"></app-header>
        <h1>People List Microfront</h1>
        <PeopleList />
        <Button>Contador compartilhado (@repo/ui)</Button>
      </div>
    </>
  );
};

export default App;
