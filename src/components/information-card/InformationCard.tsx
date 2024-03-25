import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface InformationCardProps {
  IconComponent: React.ElementType<SvgIconProps>;
  title: string;
  buttonText: string;
}

export default function InformationCard({ IconComponent, title, buttonText }: InformationCardProps) {
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent color="secondary" />
            <Typography variant="h5" fontWeight={'Bold'}>
              {title}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" color="secondary">
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
