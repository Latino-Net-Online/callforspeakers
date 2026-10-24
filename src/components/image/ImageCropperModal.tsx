import { useRef } from "react";
import { CircleStencil, Cropper, CropperRef } from "react-advanced-cropper";
import ReactModal from "react-modal";
import "./ImageCropperModal.scss";

interface ImageCropperModalProps {
  show: boolean;
  image?: string;
  onChange: (cropper: CropperRef) => void;
  onClose: (cropper: CropperRef | null) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  show,
  image,
  onChange,
  onClose,
}) => {
  const cropperRef = useRef<CropperRef>(null);

  const handleClick = () => {
    onClose(cropperRef.current);
  };

  return (
    <div>
      <ReactModal
        isOpen={show}
        contentLabel="Minimal Modal Example"
        className="center"
        style={{ content: { width: "40%" } }}
        appElement={document.getElementById('root') as HTMLElement}
      >
        <div className="modal-cropper">
          <div style={{ width: "100%", height: "auto", maxWidth: 450 }}>
            {image && (
              <Cropper
                ref={cropperRef}
                className="upload-example__cropper"
                src={image}
                onChange={onChange}
                stencilProps={{
                  aspectRatio: 1 / 1,
                  movable: true,
                  resizable: true,
                }}
                stencilComponent={CircleStencil}
              />
            )}
          </div>
        </div>
        <div className="upload-example__button-wrapper">
          <button className="upload-example__button" onClick={handleClick}>
            Cortar foto
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default ImageCropperModal;
