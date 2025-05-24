import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface TextEditorProps {
  value?: string;
  setValue?: (value: string) => void;
}

export const TextEditor = ({ setValue, value }: TextEditorProps) => {
  return (
    <div>
      <ReactQuill theme='snow' value={value} onChange={setValue} />
    </div>
  )
}