type InputTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label?: string;
};

export function InputTextArea({ error, label, ...props }: InputTextAreaProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium">
          {label}{" "}
          {props.required && (
            <span className="font-semibold text-danger">*</span>
          )}
        </label>
      )}
      <textarea {...props} className={`border ${error ? "border-danger" : "border-primary-200"} px-3 py-2 rounded text-sm font-medium w-full`} />
      {error && <p className="text-danger text-xs font-medium mt-0.5">{error}</p>}
    </div>
  );
}