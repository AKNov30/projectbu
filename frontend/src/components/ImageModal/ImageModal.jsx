import React from 'react';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-image-container" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Slip" className="modal-image" style={{ objectFit: 'contain' }} />
                <button onClick={onClose} className="close-button">ปิด</button>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-image-container {
                    position: relative;
                    max-width: 90%; /* กำหนดขนาดให้เล็กกว่าหน้าจอ */
                    max-height: 90%; /* กำหนดขนาดให้เล็กกว่าหน้าจอ */
                }
                .modal-image {
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    border-radius: 8px;
                    object-fit: contain; /* ควบคุมให้รูปภาพคงสัดส่วนเดิม */
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-size: 14px;
                    border-radius: 4px;
                }
                .close-button:hover {
                    background-color: lightgray;
                }
            `}</style>
        </div>
    );
};

export default ImageModal;
