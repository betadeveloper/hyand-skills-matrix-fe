import { Box } from '@mui/material';
import InformationCard from '../../components/information-card/InformationCard';
import { DonutSmall, TrackChanges, Group } from '@mui/icons-material/';
import head from '../../assets/images/head.jpg';

const MainPage = () => {
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
      <InformationCard IconComponent={DonutSmall} title={'Goals'} buttonText={'View details'} />
      <InformationCard IconComponent={TrackChanges} title={'Progress'} buttonText={'View details'} />
      <InformationCard IconComponent={Group} title={'Owners'} buttonText={'View details'} />
    </>
  );
};

export default MainPage;
