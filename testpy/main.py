
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk
import numpy as np
from tensorflow.keras.models import load_model

MODEL_PATH = "mnist_model.h5"
model = load_model(MODEL_PATH)

def preprocess_image_for_mnist(pil_img):
    img = pil_img.convert('L').resize((28,28))
    arr = np.array(img).astype('float32')
    if arr.mean() > 127:
        arr = 255 - arr
    arr = arr / 255.0
    arr = arr.reshape(1, 784)
    return arr

class App:
    def __init__(self, root):
        self.root = root
        root.title("MNIST Recognizer (Tkinter)")

        self.canvas = tk.Label(root)
        self.canvas.pack()

        self.btn_load = tk.Button(root, text="Load Image", command=self.load_image)
        self.btn_load.pack()

        self.btn_predict = tk.Button(root, text="Predict", command=self.predict)
        self.btn_predict.pack()

        self.lbl = tk.Label(root, text="Result: -", font=("Helvetica", 16))
        self.lbl.pack()

        self.pil_img = None

    def load_image(self):
        path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.bmp;*.jpeg")])
        if not path:
            return
        pil = Image.open(path)
        self.pil_img = pil
        display = pil.copy().resize((200,200))
        imgtk = ImageTk.PhotoImage(display)
        self.canvas.configure(image=imgtk)
        self.canvas.image = imgtk

    def predict(self):
        if self.pil_img is None:
            self.lbl.config(text="Result: load image first")
            return
        arr = preprocess_image_for_mnist(self.pil_img)
        preds = model.predict(arr)
        cls = int(np.argmax(preds, axis=1)[0])
        prob = float(np.max(preds))
        self.lbl.config(text=f"Result: {cls} ({prob:.2f})")

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
