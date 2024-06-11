import { useEffect } from "react";

const Wiki = () => {

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Wiki');
  }, []);
  
  return <h1>Wiki</h1>;
};

export default Wiki;
