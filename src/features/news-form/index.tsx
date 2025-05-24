import { useState } from "react";
import { TextEditor } from "./components/TextEditor";
import { FileUploader } from "./components/CustomInputFile";
import Button from "../../components/Button";

export default function NewsForm() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="flex gap-4 justify-between">
        <div className="w-full">
          <p className="text-sm font-medium">Judul</p>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-5"
            value={title}
            placeholder="Judul Berita"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextEditor value={value} setValue={setValue} />
        </div>
        <FileUploader />
      </div>
      <div className="flex justify-between mt-20">
        <Button variant="primary" className="bg-danger hover:border-danger">Hapus</Button>
        <div className="flex gap-4 justify-end">
          <Button variant="outline">Batal</Button>
          <Button>Simpan</Button>
        </div>
      </div>
    </div>
  );
}
