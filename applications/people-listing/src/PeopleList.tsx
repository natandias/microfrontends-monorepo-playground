import { Link } from "react-router";

const PeopleList = () => {
  return (
    <>
      <div style={{width: "10em", margin: "auto"}}>
        <ul>
          <li>
            <Link to="/people/natan">Natan</Link>
          </li>
          <li>
            <Link to="/people/clarice">Clarice</Link>
          </li>
          <li>
            <Link to="/people/dezim">Dezim</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PeopleList;
