import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Link } from 'react-router-dom';
import { Endpoint } from '../../routes/endpoint.tsx';

interface InformationCardProps {
  IconComponent: React.ElementType<SvgIconProps>;
  title: string;
  buttonText?: string;
  linkEndpoint?: Endpoint;
  content?: unknown;
  owners?: Array<{ id: number; firstName: string; lastName: string }>;
}

export default function InformationCard({
  IconComponent,
  title,
  content,
  buttonText,
  linkEndpoint,
  owners
}: Readonly<InformationCardProps>) {
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent color="primary" />
            <Typography variant="h5" fontWeight={'Bold'}>
              {title}
            </Typography>
          </Box>
          <Box>
            <Typography>{content as React.ReactNode}</Typography>
          </Box>
          {owners && owners.length > 0 && (
            <Box>
              {owners.map((owner) => (
                <Link to={`/employee/${owner.id}`} key={owner.id}>
                  <Typography key={owner.id} fontWeight={500}>{`${owner.firstName} ${owner.lastName}`}</Typography>
                </Link>
              ))}
            </Box>
          )}
        </CardContent>
        <CardActions>
          {linkEndpoint && (
            <Button size="small" color="primary" component={Link} to={linkEndpoint}>
              {buttonText}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
