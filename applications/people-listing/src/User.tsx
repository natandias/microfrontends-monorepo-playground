import { useParams } from "react-router";

const User = () => {
  const { name = "" } = useParams();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "auto"
    }}>
      <h2>You are looking at {`${name.slice(0, 1).toUpperCase()}${name.slice(1)}`}!</h2>
      <p>🫪</p>
    </div>
  );
};

export default User;
