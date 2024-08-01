const video = document.getElementById('video');
const videoWrapper = document.getElementById('videoWrapper');
console.log(video);

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
    startVideo();
}).catch(err => console.error('Error loading models: ', err));

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error('Error accessing webcam: ', err));
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    videoWrapper.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections ); 
    }, 100);
});



async function captureFace() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
        const faceData = detections.map(d => Array.from(d.descriptor));
        const licensePlate = document.getElementById('licensePlate').value;

        console.log('Captured face data:', { descriptors: faceData, licensePlate: licensePlate });

        if (!licensePlate) {
            Toastify({
                text: "Chưa nhập biển số",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
            }).showToast();
            return;
        }

        // Gửi dữ liệu đến server để lưu trữ
        fetch('/scan/scanCar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descriptors: faceData, licensePlate: licensePlate })
        }).then(response => response.json())
          .then(data => console.log('Saved face data:', data))
          .catch(error => console.error('Error saving face data:', error));

        Toastify({
            text: "Face data has been saved!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
        }).showToast();
    } else {
        Toastify({
            text: "No faces in front of the camera!!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }
}

async function compareFace() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
        const faceData = detections.map(d => Array.from(d.descriptor));
        const licensePlate = document.getElementById('licensePlate').value;

        // Gửi dữ liệu đến server để so sánh
        fetch('/scan/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descriptors: faceData, licensePlate: licensePlate }) 
        }).then(response => response.json())
          .then(data => {
              console.log('Comparison result:', data);

              if (!licensePlate) {
                  Toastify({
                      text: "License plate not entered!",
                      duration: 3000,
                      close: true,
                      gravity: "top",
                      position: "right",
                      backgroundColor: "red",
                  }).showToast();
                  return;
              }

              if (data.results.length === 0) {
                  // Không tìm thấy khuôn mặt khớp trong cơ sở dữ liệu
                  Toastify({
                      text: "Face not scanned previously!",
                      duration: 3000,
                      close: true,
                      gravity: "top",
                      position: "right",
                      backgroundColor: "orange",
                  }).showToast();
              } else {
                  // Tìm thấy khuôn mặt khớp, kiểm tra khoảng cách
                  const matched = data.results.some(r => r.distance < 0.4 && r.licensePlate === licensePlate);

                  if (matched) {
                      Toastify({
                          text: "Face and license plate matched, you can take your vehicle!",
                          duration: 3000,
                          close: true,
                          gravity: "top",
                          position: "right",
                          backgroundColor: "green",
                      }).showToast();
                  } else {
                      Toastify({
                          text: "Face or license plate does not match!",
                          duration: 3000,
                          close: true,
                          gravity: "top",
                          position: "right",
                          backgroundColor: "red",
                      }).showToast();
                  }
              }
          })
          .catch(error => console.error('Error comparing face data:', error));

    } else {
        Toastify({
            text: "No faces in front of the camera!!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }
}
