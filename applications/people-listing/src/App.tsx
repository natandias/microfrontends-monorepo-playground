import PeopleList from "./PeopleList";

const App = () => {
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        margin: "15rem 5em"
      }}>
        <h1>People List Microfront</h1>
        <PeopleList />
      </div>
    </>
  );
};

export default App;
