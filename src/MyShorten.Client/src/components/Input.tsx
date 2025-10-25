import { ReactNode, useState } from 'react';
import { Field, FieldProps } from 'formik';

import {
  GridProps,
  Grid,
  TextFieldProps,
  TextField,
  IconButton,
  InputAdornment as MuiInputAdornment,
  Typography,
  MenuItem,
} from '@mui/material';

import {
  MdVisibility as VisibilityIcon,
  MdVisibilityOff as VisibilityOffIcon,
} from 'react-icons/md';
import { defaultGrid } from './defaultGrid';
import { IOption } from '../@types';

export type IInputProps = TextFieldProps & {
  className?: string;
  grid?: GridProps;
  localControl?: boolean;
  name: string;
  noGrid?: boolean;
  model?: 'icon' | 'password' | 'select';
  readOnly?: boolean;
};

interface IIconProps {
  action?: () => void;
  actionTitle?: string;
  icon?: ReactNode;
  label?: ReactNode;
  start?: boolean;
}

interface ISelectProps {
  defaultOption?: string;
  menuOptions?: boolean;
  options?: IOption[];
}

type Props = IInputProps & IIconProps & ISelectProps;

const InputAd = ({
  action,
  actionTitle,
  icon,
  label,
  start,
}: IIconProps) => (
  <MuiInputAdornment position={start ? 'start' : 'end'}>
    {label && <Typography variant='caption'>{label}</Typography>}
    <IconButton
      aria-label={`input action ${actionTitle || ''}`}
      onClick={action}
      edge={start ? false : 'end'}
      tabIndex={-1}
      title={actionTitle}
    >
      {icon}
    </IconButton>
  </MuiInputAdornment>
);

const commonProps: TextFieldProps = {
  InputLabelProps: {
    shrink: true,
  },
  fullWidth: true,
  margin: 'normal',
  size: 'small',
  variant: 'outlined',
};

const Basic = ({
  helperText,
  name,
  readOnly,
  ...rest
}: Omit<
  IInputProps,
  'className' | 'grid' | 'noGrid' | 'model' | 'localControl'
>) => (
  <TextField
    {...rest}
    {...commonProps}
    error={!!helperText}
    helperText={helperText}
    id={name}
    name={name}
    InputProps={{
      readOnly,
    }}
  />
);

const Password = ({
  helperText,
  name,
  ...rest
}: Omit<
  IInputProps,
  'className' | 'grid' | 'noGrid' | 'model' | 'localControl'
>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...rest}
      {...commonProps}
      error={!!helperText}
      helperText={helperText}
      id={name}
      name={name}
      InputProps={{
        endAdornment: (
          <InputAd
            action={() => setShowPassword(!showPassword)}
            actionTitle={showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
            icon={
              showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />
            }
          />
        ),
      }}
      type={showPassword ? 'text' : 'password'}
    />
  );
};

const Icon = ({
  action,
  actionTitle,
  helperText,
  icon,
  name,
  readOnly,
  start,
  ...rest
}: Omit<
  Props,
  'className' | 'grid' | 'noGrid' | 'model' | 'localControl'
>) => {
  const adornment = (
    <InputAd
      action={action}
      actionTitle={actionTitle}
      icon={icon}
      start={start}
    />
  );

  return (
    <TextField
      {...rest}
      {...commonProps}
      error={!!helperText}
      helperText={helperText}
      id={name}
      name={name}
      InputProps={{
        readOnly,
        endAdornment: !start && adornment,
        startAdornment: start && adornment,
      }}
    />
  );
};

const Select = ({
  helperText,
  name,
  readOnly,
  menuOptions,
  defaultOption,
  options,
  ...rest
}: Omit<
  Props,
  'className' | 'grid' | 'noGrid' | 'model' | 'localControl'
>) => (
  <TextField
    {...rest}
    {...commonProps}
    error={!!helperText}
    helperText={helperText}
    id={name}
    name={name}
    InputProps={{
      readOnly,
    }}
    select
    SelectProps={!menuOptions ? { native: true } : undefined}
  >
    {defaultOption &&
      (menuOptions ? (
        <MenuItem value={-1}>{defaultOption}</MenuItem>
      ) : (
        <option value={-1}>{defaultOption}</option>
      ))}
    {options &&
      options.map((op) =>
        menuOptions ? (
          <MenuItem key={`${op.value}-${op.label}`} value={op.value}>
            {op.label}
          </MenuItem>
        ) : (
          <option key={`${op.value}-${op.label}`} value={op.value}>
            {op.label}
          </option>
        ),
      )}
  </TextField>
);

const RenderInput = ({
  className,
  grid = defaultGrid,
  noGrid,
  model,
  action,
  actionTitle,
  icon,
  start,
  defaultOption,
  menuOptions,
  options,
  ...rest
}: Omit<Props, 'localControl'>) => {
  const getGrid = {
    ...defaultGrid,
    ...grid,
    md: grid.md || grid.lg || defaultGrid.lg,
  };

  const render = (() => {
    switch (model) {
      case 'icon':
        return (
          <Icon
            action={action}
            actionTitle={actionTitle}
            icon={icon}
            start={start}
            {...rest}
          />
        );
      case 'password':
        return <Password {...rest} />;
      case 'select':
        return (
          <Select
            defaultOption={defaultOption}
            menuOptions={menuOptions}
            options={options}
            {...rest}
          />
        );
      default:
        return <Basic {...rest} />;
    }
  })();

  return noGrid ? (
    render
  ) : (
    <Grid item className={className} {...getGrid}>
      {render}
    </Grid>
  );
};

export const Input = ({
  helperText,
  localControl = false,
  name = '',
  onBlur,
  onChange,
  ...rest
}: Props) => {
  return localControl ? (
    <RenderInput
      {...rest}
      onBlur={onBlur}
      name={name}
      helperText={helperText}
      onChange={onChange}
    />
  ) : (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const { touched, error } = meta;
        return (
          <RenderInput
            {...rest}
            {...field}
            name={name}
            helperText={touched && error ? error : undefined}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
            onBlur={(e) => {
              field.onBlur(e);
              onBlur?.(e);
            }}
            {...rest}
          />
        );
      }}
    </Field>
  );
};
