import { useEffect, useState } from "react";
import { TextEditor } from "./components/TextEditor";
import { FileUploader } from "./components/CustomInputFile";
import Button from "../../components/Button";
import { useCreateNews, useDeleteNews, useNewsDetailQuery, useUpdateNews } from "../../api-hooks/news/api";
import { fileToBase64 } from "../../utils/base64";
import { useAlert } from "../../contexts/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export default function NewsForm() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: newsDetail } = useNewsDetailQuery(id || "")

  const { mutateAsync: addNews, isPending: isCreating } = useCreateNews();
  const { mutateAsync: updateNews, isPending: isUpdating } = useUpdateNews();
  const { mutateAsync: deleteNews, isPending: isDeleting } = useDeleteNews();

  async function handleSubmit() {
    if (!title || !value || !selectedFile || !previewUrl) {
      showAlert({
        title: "Gagal menyimpan berita",
        type: "error",
        message: "Judul dan konten berita dan Gambar tidak boleh kosong.",
      })
      return;
    }

    const file64 = await fileToBase64(selectedFile);
    const mutateAsync = id ? updateNews : addNews;
    const response = await mutateAsync({
      id: id ? +id : 0 ,
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

  async function handleDelete() {
    if (!id) return;
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus berita ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    const response = await deleteNews(+id);
    if (response.status === 200) {
      navigate("/news-event");
      showAlert({
        title: "Berhasil menghapus berita",
        type: "success",
        message: "Berita berhasil dihapus.",
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } else {
      showAlert({
        title: "Gagal menghapus berita",
        type: "error",
        message: response.message || "Terjadi kesalahan saat menghapus berita.",
      });
    }
  }

  useEffect(() => {
    if (newsDetail) {
      setTitle(newsDetail?.data?.title);
      setValue(newsDetail?.data?.content);
      if (newsDetail?.data?.thumbnail) {
        setPreviewUrl(newsDetail?.data?.thumbnail);
      }
    }
  }, [newsDetail])

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
        <FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
      </div>
      <div className="flex justify-between mt-20">
        {id ? <Button onClick={handleDelete} variant="primary" className="bg-danger hover:border-danger">Hapus</Button> : <div></div>}
        <div className="flex gap-4 justify-end">
          <Button onClick={() => navigate("/news-event")} variant="outline">Batal</Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>Simpan</Button>
        </div>
      </div>
    </div>
  );
}
