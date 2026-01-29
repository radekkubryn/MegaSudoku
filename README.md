# 🧩 Mega Sudoku

Mega Sudoku is a modern, high-performance web application designed for Sudoku enthusiasts. Whether you are a beginner looking to learn the ropes or a grandmaster seeking a challenge, Mega Sudoku provides a seamless and engaging experience directly in your browser.

![Mega Sudoku Header](https://github.com/user-attachments/assets/fd6eb74e-2992-4fec-b167-3d1fb585f5ac)

## 🌟 About the Game

Mega Sudoku is a sleek, responsive, and performance-driven Sudoku web application. This project brings the classic logic puzzle into the modern era with a clean UI and robust functionality.

## 📚 Demo
http://f0oc40484w04404w4w88oosk.91.241.5.172.sslip.io/

### Key Features
- **Dynamic Difficulty**: Choose between Easy, Medium, and Hard levels.
- **Built-in Solver**: Stuck on a difficult board? The application uses an efficient backtracking algorithm to find solutions.
- **Responsive Design**: Optimized for desktop, tablet, and smartphone experiences.
- **Clean UI**: A premium user interface with smooth animations and a distraction-free environment.
- **Timer & Language Support**: Track your time and toggle between English and Polish.

## 🛠️ Tech Stack

This project leverages modern technologies to ensure speed and reliability:
- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Docker](https://www.docker.com/), [Nginx](https://www.nginx.com/)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/get-started) (optional, for containerized run)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/radekkubryn/Sudoku.git
   cd Sudoku
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running with Docker

You can easily run the application using Docker:

1. **Build the image**:
   ```bash
   docker build -t sudoku-app .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 8080:80 --name sudoku-container sudoku-app
   ```
   Access the app at [http://localhost:8080](http://localhost:8080).

## 🧠 The Logic

At its core, the application utilizes an efficient **backtracking algorithm** to:
1. Generate fully valid Sudoku grids.
2. Selectively remove digits while ensuring each puzzle has exactly one unique solution.
3. Provide an instant solving mechanism for any valid board state.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
**Author**: [radekkubryn](https://github.com/radekkubryn)  
**License**: Distributed under the MIT License.
