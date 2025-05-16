import React from "react";
import { FormProvider, FormProviderProps, SubmitHandler } from "react-hook-form";

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export interface FormStateProps {
  editable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}


interface FormProps {
  methods: Omit<FormProviderProps<any>, 'children'>;
  children: React.ReactNode;
  method?: RequestMethod;
  action?: string;
  style?: any;
  defaultEditable?: boolean;
  onSubmit: SubmitHandler<any>;
}

export const FormContext = React.createContext<FormStateProps>({
  editable: false,
  setIsEditable: () => {},
});


export default function Form(props: FormProps) {
  const [isEditable, setIsEditable] = React.useState(
    props.defaultEditable !== undefined ? props.defaultEditable : true,
  );
  const {methods, style, method = 'POST', children, action, onSubmit} = props;

  const value = React.useMemo<FormStateProps>(
    () => ({
      editable: isEditable && !methods.formState.isSubmitting,
      setIsEditable,
    }),
    [isEditable, methods.formState.isSubmitting],
  );

  return (
    <FormContext.Provider value={value}>
      <FormProvider {...methods}> 
        <form
          noValidate
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            ...style,
          }}
          method={method}
          action={action}
          onSubmit={(e) => {
            if (!action) {
              e.preventDefault();
              methods.handleSubmit(onSubmit)();
            }
          }}
        >
          {children}
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
}