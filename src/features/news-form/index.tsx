import { useState } from "react";
import { TextEditor } from "./components/TextEditor";
import { FileUploader } from "./components/CustomInputFile";
import Button from "../../components/Button";
import { useCreateNews } from "../../api-hooks/news/api";
import { fileToBase64 } from "../../utils/base64";
import { useAlert } from "../../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function NewsForm() {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutateAsync, isPending } = useCreateNews();

  async function handleSubmit() {
    if (!title || !value || !selectedFile) {
      showAlert({
        title: "Gagal menyimpan berita",
        type: "error",
        message: "Judul dan konten berita dan Gambar tidak boleh kosong.",
      })
      return;
    }

    const file64 = await fileToBase64(selectedFile);
    const response = await mutateAsync({
      title,
      content: value,
      thumbnail: file64,
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil menyimpan berita",
        type: "success",
        message: "Berita berhasil disimpan.",
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/news-event");
    } else {
      showAlert({
        title: "Gagal menyimpan berita",
        type: "error",
        message: response.message || "Terjadi kesalahan saat menyimpan berita.",
      });
    }
  }

  return (
    <div>
      <div className="flex gap-4 justify-between">
        <div className="w-full">
          <p className="text-sm font-medium mb-2">Judul</p>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-5"
            value={title}
            placeholder="Judul Berita"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextEditor value={value} setValue={setValue} />
        </div>
        <FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      </div>
      <div className="flex justify-between mt-20">
        <Button variant="primary" className="bg-danger hover:border-danger">Hapus</Button>
        <div className="flex gap-4 justify-end">
          <Button variant="outline">Batal</Button>
          <Button onClick={handleSubmit} disabled={isPending}>Simpan</Button>
        </div>
      </div>
    </div>
  );
}
