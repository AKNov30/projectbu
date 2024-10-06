import React from 'react';
import Swal from 'sweetalert2';

// AlertSave Component
export const AlertSave = ({
    title,
    confirmText,
    onConfirm,
    children,
    successMessage,
}) => {
    const showSaveAlert = () => {
        Swal.fire({
            title: title || "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: confirmText || "Save",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
                Swal.fire(successMessage || "Saved!", "", "success");
            }
        });
    };

    return (
        <span onClick={showSaveAlert} style={{ cursor: 'pointer' }}>
            {children}
        </span>
    );
};

// AlertDelete Component
export const AlertDelete = ({
    onDelete,
    children,
    title,
    text,
    confirmText,
    successTitle,
    successText
}) => {
    const showDeleteAlert = () => {
        Swal.fire({
          title: title || "Are you sure?",
          text: text || "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: confirmText || "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            onDelete(); // เรียกใช้ callback หากผู้ใช้ยืนยันการลบ
            Swal.fire({
              title: successTitle || "Deleted!",
              text: successText || "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      };

    return <span onClick={showDeleteAlert} style={{ cursor: 'pointer' }}>{children}</span>;
};
