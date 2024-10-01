import React, { forwardRef, useState } from "react";

const FileUploadModal = forwardRef(
  ({ onFileSelect, selectedFile, setSelectedFile }, ref) => {
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file.name);
        onFileSelect(true); // Indique qu'un fichier a été sélectionné
      }
    };

    const handleFileDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        setSelectedFile(files[0].name);
      }
    };

    const closeModal = () => {
      if (ref.current) {
        ref.current.close();
      }
    };
    const cancelClose = () => {
      setSelectedFile(null);
      onFileSelect(false);
      if (ref.current) {
        ref.current.close();
      }
    };

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box p-6 bg-base-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">
            Télécharger un fichier
          </h3>

          {/* Zone de drag-and-drop */}
          <div
            className="border-4 border-dashed border-gray-300 rounded-lg p-10 bg-base-100 text-center cursor-pointer relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
            <p className="text-lg font-semibold text-gray-500">
              Glissez votre fichier ici
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ou cliquez pour sélectionner un fichier
            </p>

            {/* Input caché pour le fichier */}
            <input
              type="file"
              id="file-input"
              accept="image/*"
              className="file-input file-input-bordered w-full opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleFileSelect}
            />

            <div
              className="absolute inset-0"
              onClick={() => document.getElementById("file-input").click()}
            ></div>
          </div>

          {/* Affichage du fichier sélectionné */}
          {selectedFile && (
            <div id="file-preview" className="mt-4 text-center text-primary">
              Fichier sélectionné : {selectedFile}
            </div>
          )}

          <div className="modal-action flex justify-between mt-6">
            <button
              className="btn btn-primary flex-1 mr-2"
              onClick={closeModal}
            >
              Charger
            </button>
            <button className="btn btn-outline flex-1" onClick={cancelClose}>
              Annuler
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Fermer</button>
        </form>
      </dialog>
    );
  }
);

// ! A enlever en prod :
console.error = (message, ...args) => {
  if (!message.includes("validateDOMNesting")) {
    console.error(message, ...args);
  }
};

FileUploadModal.displayName = "FileUploadModal";

export default FileUploadModal;
