import { useState } from 'react';
import TiptapEditor from './components/TiptapEditor';
import './styles/editor.css';

function App() {
  const [seatData] = useState([
    { code: 'A01', passenger: 'Nguyễn Văn A', status: 'Booked' },
    { code: 'A02', passenger: 'Trần Thị B', status: 'Booked' },
    { code: 'A03', passenger: 'Lê Văn C', status: 'Available' },
    { code: 'A04', passenger: 'Phạm Thị D', status: 'Booked' },
    { code: 'A05', passenger: 'Hoàng Văn E', status: 'Booked' },
    { code: 'B01', passenger: 'Đặng Thị F', status: 'Available' },
    { code: 'B02', passenger: 'Vũ Văn G', status: 'Booked' },
  ]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tiptap Dynamic Data Table Demo</h1>
        <p className="subtitle">
          "Bảng dữ liệu - Số lượng cột phụ thuộc vào lượng data param trả về"
        </p>
      </header>

      <div className="demo-info">
        <div className="info-card">
          <h3>Current Data Source:</h3>
          <pre className="data-preview">
            {JSON.stringify(seatData, null, 2)}
          </pre>
        </div>
      </div>

      <div className="editor-container">
        <TiptapEditor seatData={seatData} />
      </div>

    </div>
  );
}

export default App;
