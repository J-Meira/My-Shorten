import { ReactNode } from 'react';

import {
  Box,
  Container as MuiContainer,
  ContainerProps,
  Paper,
  Grid,
  Typography,
} from '@mui/material';

import { useAppSelector } from '../redux/hooks';

interface Props {
  hasCard?: boolean;
  title?: string;
  subTitle?: string;
  size?: ContainerProps['maxWidth'];
  children: ReactNode;
}

export const Container = ({
  title,
  hasCard = false,
  subTitle,
  size = 'lg',
  children,
}: Props) => {
  const { isDark } = useAppSelector((state) => state.system);
  return (
    <MuiContainer
      maxWidth={size}
      sx={{
        paddingTop: 10,
        paddingBottom: 6,
      }}
    >
      {(title || subTitle) && (
        <Box mb={4}>
          {title && (
            <Typography variant='h2' fontWeight={600} fontSize={28}>
              {title}
            </Typography>
          )}
          {subTitle && <Typography fontSize={12}>{subTitle}</Typography>}
        </Box>
      )}
      {hasCard ? (
        <Paper
          sx={{
            padding: '2rem 1.2rem',
            backgroundColor: isDark ? '#10141D' : undefined,
            backgroundImage: isDark ? 'none' : undefined,
            borderRadius: '10px',
          }}
          elevation={4}
        >
          <Grid container spacing={2}>
            {children}
          </Grid>
        </Paper>
      ) : (
        children
      )}
    </MuiContainer>
  );
};
