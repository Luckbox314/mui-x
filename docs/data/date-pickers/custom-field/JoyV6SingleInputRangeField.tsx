import * as React from 'react';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input, { InputProps } from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { useClearableField, usePickerContext } from '@mui/x-date-pickers/hooks';
import { FieldType } from '@mui/x-date-pickers-pro/models';

const joyTheme = extendJoyTheme();

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  enableAccessibleFieldDOMStructure?: boolean;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const JoyField = React.forwardRef(
  (props: JoyFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      // Should be ignored
      enableAccessibleFieldDOMStructure,

      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      endDecorator,
      startDecorator,
      slotProps,
      inputRef,
      ...other
    } = props;

    return (
      <FormControl disabled={disabled} id={id} sx={{ minWidth: 350 }} ref={ref}>
        <FormLabel>{label}</FormLabel>
        <Input
          ref={ref}
          disabled={disabled}
          startDecorator={
            <React.Fragment>
              {startAdornment}
              {startDecorator}
            </React.Fragment>
          }
          endDecorator={
            <React.Fragment>
              {endAdornment}
              {endDecorator}
            </React.Fragment>
          }
          slotProps={{
            ...slotProps,
            root: { ...slotProps?.root, ref: containerRef },
            input: { ...slotProps?.input, ref: inputRef },
          }}
          {...other}
        />
      </FormControl>
    );
  },
) as JoyFieldComponent;

interface JoySingleInputDateRangeFieldProps
  extends DateRangePickerFieldProps<false> {}

type JoySingleInputDateRangeFieldComponent = ((
  props: JoySingleInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: FieldType };

const JoySingleInputDateRangeField = React.forwardRef(
  (props: JoySingleInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...other } = props;

    const pickerContext = usePickerContext();

    const textFieldProps: JoySingleInputDateRangeFieldProps = useSlotProps({
      elementType: FormControl,
      externalSlotProps: slotProps?.textField,
      externalForwardedProps: other,
      ownerState: props as any,
    });

    const fieldResponse = useSingleInputDateRangeField<
      false,
      JoySingleInputDateRangeFieldProps
    >({ ...textFieldProps, enableAccessibleFieldDOMStructure: false });

    /* If you don't need a clear button, you can skip the use of this hook */
    const processedFieldProps = useClearableField({
      ...fieldResponse,
      slots,
      slotProps,
    });

    return (
      <JoyField
        {...processedFieldProps}
        ref={ref}
        endDecorator={
          <IconButton
            onClick={() => pickerContext.setOpen((prev) => !prev)}
            variant="plain"
            color="neutral"
            sx={{ marginLeft: 2.5 }}
          >
            <DateRangeIcon color="action" />
          </IconButton>
        }
      />
    );
  },
) as JoySingleInputDateRangeFieldComponent;

JoySingleInputDateRangeField.fieldType = 'single-input';

const JoySingleInputDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps<false>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DateRangePicker
        {...props}
        ref={ref}
        slots={{ ...props.slots, field: JoySingleInputDateRangeField }}
      />
    );
  },
);

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode({ mode }: { mode: 'light' | 'dark' }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function JoyV6SingleInputRangeField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoySingleInputDateRangePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
