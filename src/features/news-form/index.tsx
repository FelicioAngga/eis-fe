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
import { usePermissionAccess } from "../../hooks/useAccessRight";
import parse from "html-react-parser";
import { BiChevronLeft } from "react-icons/bi";

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
  const { getPermissionAccess } = usePermissionAccess();

  const { mutateAsync: addNews, isPending: isCreating } = useCreateNews();
  const { mutateAsync: updateNews, isPending: isUpdating } = useUpdateNews();
  const { mutateAsync: deleteNews } = useDeleteNews();

  async function handleSubmit() {
    if (!title || !value || !previewUrl) {
      showAlert({
        title: "Gagal menyimpan berita",
        type: "error",
        message: "Judul dan konten berita dan Gambar tidak boleh kosong.",
      })
      return;
    }

    const file64 = selectedFile ? await fileToBase64(selectedFile) : newsDetail?.data?.thumbnail || "";
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
      <div
        onClick={() => navigate("/news-event")}
        className="mb-2 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
      >
        <BiChevronLeft className="text-2xl" />
        <p className="text-sm font-semibold">Kembali</p>
      </div>
      <div className="flex justify-between gap-4">
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">Judul</p>
          {getPermissionAccess("news").write ? (
            <input
              className="w-full px-3 py-2 mb-5 border border-gray-300 rounded-lg"
              value={title}
              placeholder="Judul Berita"
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <p className="mb-5 text-lg font-semibold">{title}</p>
          )}
          {getPermissionAccess("news").write ? (
            <TextEditor value={value} setValue={setValue} />
          ) : (
            <div className="mb-2 text-sm font-medium">{parse(value)}</div>
          )}
        </div>
        {getPermissionAccess("news").write ? <FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
          : (
            <div className="flex items-center justify-center overflow-hidden rounded-lg w-80 h-80">
              <img src={previewUrl || ""} className="object-cover w-full" />
            </div>
        )}
      </div>
      {getPermissionAccess("news").write && (
        <div className="flex justify-between mt-20">
          {id ? <Button onClick={handleDelete} variant="primary" className="bg-danger hover:border-danger">Hapus</Button> : <div></div>}
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate("/news-event")} variant="outline">Batal</Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>Simpan</Button>
          </div>
        </div>
      )}
    </div>
  );
}
