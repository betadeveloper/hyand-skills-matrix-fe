import { useEffect } from "react";

const Feedback = () => {
  
  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Feedback');
  },[])

  return <h1>Feedback</h1>;
};

export default Feedback;
