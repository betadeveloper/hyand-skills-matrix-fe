import { Box } from '@mui/material';
import InformationCard from '../../components/information-card/InformationCard';
import { DonutSmall, Group, TrackChanges } from '@mui/icons-material/';
import head from '../../assets/images/head.jpg';
import { Endpoint } from '../../routes/endpoint.tsx';
import { get } from '../../api/api.ts';
import { useEffect, useState } from 'react';

const MainPage = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    get('http://localhost:8080/api/owners/currentEmployee').then((response: any) => {
      setOwners(response);
    });

    localStorage.setItem('selectedNavItem', 'Home');
  }, []);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 150,
          backgroundImage: `url(${head})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <InformationCard
        IconComponent={DonutSmall}
        title={'Goals'}
        buttonText={'View details'}
        linkEndpoint={Endpoint.GOALS}
      />
      <InformationCard
        IconComponent={TrackChanges}
        title={'Progress'}
        buttonText={'View details'}
        linkEndpoint={Endpoint.STATISTICS}
      />
      <InformationCard IconComponent={Group} title={'Owners'} buttonText={''} owners={owners}></InformationCard>
    </>
  );
};

export default MainPage;
