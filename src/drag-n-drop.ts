const dropFileZone = document.querySelector<HTMLElement>(
  ".upload-zone_dragover"
)!;
const statusText = document.querySelector<HTMLElement>(".form-upload__status")!;
const sizeText = document.querySelector<HTMLElement>("#uploadForm_Size")!;
const progressBar =
  document.querySelector<HTMLProgressElement>("#progressBar")!;
const uploadInput = document.querySelector<HTMLInputElement>(
  ".form-upload__input"
)!;

const setStatus = (statusText: string, statusContainer: HTMLElement) => {
  statusContainer.textContent = statusText;
};

const uploadUrl = "/unicorns";

["dragover", "drop"].forEach((event) => {
  document.addEventListener(event, (e) => {
    e.preventDefault();
    return false;
  });
});

dropFileZone.addEventListener("dragenter", () => {
  dropFileZone.classList.add("_active");
});

dropFileZone.addEventListener("dragleave", () => {
  dropFileZone.classList.remove("_active");
});

dropFileZone.addEventListener("drop", (event: DragEvent) => {
  dropFileZone.classList.remove("_active");

  const file = event.dataTransfer?.files[0];
  if (!file) return;

  if (file.type.startsWith("image/")) {
    uploadInput.files = event.dataTransfer.files;
    processingUploadFile(file, sizeText, statusText, progressBar);
  } else {
    setStatus("Можно загружать только изображения", statusText);
  }

  uploadInput.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file && file.type.startsWith("image/")) {
      processingUploadFile(file, sizeText, statusText, progressBar);
    } else {
      setStatus("Можно загружать только изображения", statusText);
    }
  });
});

export function processingUploadFile(
  file: File,
  sizeText: HTMLElement,
  statusText: HTMLElement,
  progressBar: HTMLProgressElement
) {
  if (file) {
    const dropZoneData = new FormData();
    const xhr = new XMLHttpRequest();

    dropZoneData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);

      progressBar.value = percentLoaded;

      sizeText.textContent = `${event.loaded} из ${event.total} МБ`;
      setStatus(`Загружено ${percentLoaded}% | `, statusText);
    });

    xhr.onload = () => {
      setStatus(
        xhr.status === 200 ? "Все загружено" : "Oшибка загрузки",
        statusText
      );

      sizeText.style.display = "none";
    };

    xhr.open("POST", uploadUrl, true);
    xhr.send(dropZoneData);
  }
}

export {};
