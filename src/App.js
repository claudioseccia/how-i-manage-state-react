import { useState, memo, createContext, useContext } from "react";
import { useQuery } from "react-query";

import './App.css';

/* 
//GIT: https://github.com/leighhalliday/managing-state-react
//1 LOCAL STATE
const App = () => {
  return (
    <div className="App">
      <CountryPicker />
      <CountryDetails />
    </div>
  );
}
const CountryPicker = () => {
  const [country, setCountry] = useState("CA");
  return <select value={country} onChange={(event) => setCountry(event.target.value)}>
    <option value="CA">Canada</option>
    <option value="CO">Colombia</option>
    <option value="IT">Italy</option>
  </select>
}

const CountryDetails = ({country}) => {
  return <h1>{country}</h1>
}

export default App; 

//***********************************************************
//2 LIFT THE STATE UP (to App.js - props drilling)
const App = () => {
  const [country, setCountry] = useState("CA");
  return (
    <div className="App">
      <CountryDetails country={country} />
      <CountryPicker country={country} setCountry={setCountry} />
    </div>
  );
}

const CountryDetails = ({country}) => {
  return <h1>{country}</h1>
}

const CountryPicker = ({country, setCountry}) => {
  return (
    <select value={country} onChange={(event) => setCountry(event.target.value)}>
      <option value="CA">Canada</option>
      <option value="CO">Colombia</option>
      <option value="IT">Italy</option>
    </select>
  );
}


//***********************************************************
//3 CONVERT LOCAL STATE TO GLOBAL STATE
const CountryContext = createContext();
const CountryProvider = ({children}) => {
  const [country, setCountry] = useState("CA");
  return (
  <CountryContext.Provider value={{country, setCountry}}>
    {children}
  </CountryContext.Provider>
  );
}

//here: everytime CountryProvider re-renders, also HomeContent re-renders, wheter or not it needs to
//so we use memo() wrapping everything inside it and everything will not re-render because HomeContent is the 
//first component rendered inside our provider
const HomeContent = memo(() => {
  return (
    <div className="App">
      <CountryDetails />
      <CountryPicker />
    </div>
  );
});


const App = () => {
  return (
    <CountryProvider>
      <HomeContent />
    </CountryProvider>
  );
}

const CountryDetails = () => {
  const {country} = useContext(CountryContext);
  return <h1>{country}</h1>
}

const CountryPicker = () => {
  const { country, setCountry } = useContext(CountryContext);
   
  return (
    <select value={country} onChange={(event) => setCountry(event.target.value)}>
      <option value="CA">Canada</option>
      <option value="CO">Colombia</option>
      <option value="IT">Italy</option>
    </select>
  );
}

*/

//***********************************************************
//4.
//once we are dealing with our global (application) state, using tools such as Context Api, Redux, MobX, Overmind, Zustand, Recoil etc... or local state in components (useState)
//we deal with External Data provider:
//we can load and save the data in our global (application) data (ex.Redux) but manage errors for: loading states, error states, actual data loaded, when we trigger updates to that state, caching issues etc...
//we can use libs such as: React-Query, SWR (or even Apollo Client, urql for GraphQL)
//here we use useQuery from React-Query to get the data from the server (here an example with: https://restcountries.eu/rest/v2/alpha/COUNTRYCODE, ex: https://restcountries.eu/rest/v2/alpha/ca)
//into CountryDetails

const CountryContext = createContext();
const CountryProvider = ({children}) => {
  const [country, setCountry] = useState("CA");
  return (
  <CountryContext.Provider value={{country, setCountry}}>
    {children}
  </CountryContext.Provider>
  );
}

//here: everytime CountryProvider re-renders, also HomeContent re-renders, wheter or not it needs to
//so we use memo() wrapping everything inside it and everything will not re-render because HomeContent is the 
//first component rendered inside our provider
const HomeContent = memo(() => {
  return (
    <div className="App">
      <CountryPicker />
      <CountryDetails />
    </div>
  );
});


const App = () => {
  return (
    <CountryProvider>
      <HomeContent />
    </CountryProvider>
  );
}

const fetchCountry = async(country) => {
  // alert(`https://restcountries.eu/rest/v2/alpha/${country}`);
  // alert(JSON.stringify(country.queryKey[1]));
  const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${country.queryKey[1]}`);
  const data = await response.json();
  return data;
}


const CountryDetails = () => {
  const {country} = useContext(CountryContext); //GET DATA FROM OUR GLOBAL STATE
  //useQuery([country] <-- country comes from our global context, multiple params could be passed in
  //returns data, boolean isLoading and error if an error is returned
  
  const { data, error, isLoading, isError  } = useQuery(["country",country], fetchCountry);
  
  if (isLoading) {  return (<span>loading... </span>) }
  if (isError && error) { return (<span>error occurred</span>) }
  return (
  <div>
    <h1>{country}</h1>
    <pre>
      {JSON.stringify(data,null,2)}
    </pre>
  </div>
  );
}

const CountryPicker = () => {
  const { country, setCountry } = useContext(CountryContext);
   
  return (
    <select value={country} onChange={(event) => setCountry(event.target.value)}>
      <option value="CA">Canada</option>
      <option value="CO">Colombia</option>
      <option value="IT">Italy</option>
    </select>
  );
}

export default App; 
