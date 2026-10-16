import React from "react";
import "./App.css";

function App() {
  const PeopleApp = React.lazy(() => import('peopleListMicroFront/PeopleApp'))

  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <React.Suspense fallback={<p>Loading people...</p>}>
            <PeopleApp />
          </React.Suspense>
        </div>
      </section>
    </>
  );
}

export default App;
