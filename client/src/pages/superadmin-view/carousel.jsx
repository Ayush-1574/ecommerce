import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeatureImages,
  addFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import {
  Images,
  UploadCloud,
  Trash2,
  X,
  RefreshCw,
  Eye,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

function ConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-sm"
        style={{
          background: "#1a1730",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(239,68,68,0.15)" }}
        >
          <Trash2 className="w-6 h-6" style={{ color: "#f87171" }} />
        </div>
        <h3 className="text-base font-bold text-white text-center mb-2">
          Remove Banner?
        </h3>
        <p
          className="text-sm text-center mb-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          This banner will be removed from the carousel immediately. Shoppers
          will no longer see it.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ open, images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex, open]);

  if (!open || !images?.length) return null;

  const img = images[current];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.image}
          alt={`Banner ${current + 1}`}
          className="w-full max-h-[70vh] object-contain bg-black"
        />
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
        >
          <X className="w-5 h-5" />
        </button>
        {/* Nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
              className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % images.length)}
              className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <div
          className="text-center py-3 text-sm"
          style={{ background: "#0f0c29", color: "rgba(255,255,255,0.5)" }}
        >
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

function CarouselPage() {
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );

  const [imageFile, setImageFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Auto-upload to Cloudinary when file is picked
  useEffect(() => {
    if (!imageFile) return;
    const upload = async () => {
      setUploading(true);
      try {
        const data = new FormData();
        data.append("my_file", imageFile);
        const res = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          data
        );
        if (res?.data?.success) {
          setUploadedUrl(res.data.result.url);
          toast.success("Image uploaded! Click 'Add to Carousel' to publish.");
        } else {
          toast.error("Upload failed");
        }
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    upload();
  }, [imageFile]);

  const handleAddToCarousel = async () => {
    if (!uploadedUrl) {
      toast.error("Please upload an image first");
      return;
    }
    setAdding(true);
    const result = await dispatch(addFeatureImage(uploadedUrl));
    setAdding(false);
    if (addFeatureImage.fulfilled.match(result)) {
      toast.success("Banner added to carousel!");
      setImageFile(null);
      setUploadedUrl("");
      if (inputRef.current) inputRef.current.value = "";
    } else {
      toast.error("Failed to add banner");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const result = await dispatch(deleteFeatureImage(confirmId));
    setConfirmId(null);
    if (deleteFeatureImage.fulfilled.match(result)) {
      toast.success("Banner removed");
    } else {
      toast.error("Failed to remove banner");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Images className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Carousel Banners
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Manage the hero banner images users see on the home page
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(getFeatureImages())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Upload card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Plus className="w-4 h-4" style={{ color: "#f59e0b" }} />
          Add New Banner
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Drop zone */}
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-all"
              style={{
                borderColor: imageFile
                  ? "rgba(245,158,11,0.5)"
                  : "rgba(255,255,255,0.12)",
                background: imageFile
                  ? "rgba(245,158,11,0.04)"
                  : "rgba(255,255,255,0.02)",
                minHeight: "180px",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {uploading ? (
                <>
                  <div
                    className="w-10 h-10 rounded-full border-2 border-transparent mb-3 animate-spin"
                    style={{
                      borderTopColor: "#f59e0b",
                      borderRightColor: "rgba(245,158,11,0.3)",
                    }}
                  />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Uploading...
                  </p>
                </>
              ) : imageFile ? (
                <>
                  <FileImage className="w-10 h-10 mb-3" style={{ color: "#f59e0b" }} />
                  <p className="text-sm font-medium text-white">{imageFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Click to replace
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud
                    className="w-10 h-10 mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  />
                  <p className="text-sm text-white font-medium mb-1">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    PNG, JPG, WEBP — recommended size 1440×600px
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Preview + Add Button */}
          <div className="flex flex-col gap-4">
            {uploadedUrl ? (
              <div className="rounded-xl overflow-hidden relative flex-1">
                <img
                  src={uploadedUrl}
                  alt="Preview"
                  className="w-full object-cover rounded-xl"
                  style={{ maxHeight: "160px" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-xs text-white font-medium">Preview</span>
                </div>
                <button
                  onClick={() => {
                    setImageFile(null);
                    setUploadedUrl("");
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                className="flex-1 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  minHeight: "120px",
                }}
              >
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Preview will appear here
                </p>
              </div>
            )}

            <button
              onClick={handleAddToCarousel}
              disabled={!uploadedUrl || adding || uploading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background:
                  uploadedUrl && !adding
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "rgba(255,255,255,0.08)",
                boxShadow:
                  uploadedUrl && !adding
                    ? "0 4px 14px rgba(245,158,11,0.35)"
                    : "none",
                color:
                  uploadedUrl && !adding
                    ? "white"
                    : "rgba(255,255,255,0.3)",
                cursor: uploadedUrl && !adding ? "pointer" : "not-allowed",
              }}
            >
              {adding ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: "rgba(255,255,255,0.8)",
                    }}
                  />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Carousel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Current Banners */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Images className="w-4 h-4" style={{ color: "#f59e0b" }} />
          Current Banners
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(245,158,11,0.15)",
              color: "#f59e0b",
            }}
          >
            {featureImageList?.length || 0} active
          </span>
        </h2>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-48 animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : !featureImageList?.length ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <ImageOff
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "rgba(255,255,255,0.1)" }}
            />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              No banners yet. Upload one above to get started.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureImageList.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden group transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                  >
                    <button
                      onClick={() => {
                        setPreviewIndex(index);
                        setPreviewOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => setConfirmId(item.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        color: "#f87171",
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                  {/* Slide # badge */}
                  <div
                    className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-lg"
                    style={{
                      background: "rgba(0,0,0,0.65)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    Slide {index + 1}
                  </div>
                </div>

                {/* Card footer */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p
                    className="text-xs truncate max-w-[60%]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    ID: {item.id.slice(0, 12)}…
                  </p>
                  <button
                    onClick={() => setConfirmId(item.id)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: "rgba(248,113,113,0.6)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                      e.currentTarget.style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(248,113,113,0.6)";
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
      <PreviewModal
        open={previewOpen}
        images={featureImageList}
        startIndex={previewIndex}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}

export default CarouselPage;
