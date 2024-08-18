// src/Dashboard.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Dashboard: React.FC = () => {
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [pieData, setPieData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [barData, setBarData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [categoryData, setCategoryData] = useState<any>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // 필요한 데이터 추출: 4번째 행부터 시작
        const dataRows = jsonData.slice(4); // 실제 데이터는 5번째 행부터 시작
        const years: string[] = [];
        const scope1: number[] = [];
        const scope2: number[] = [];
        const scope3: number[] = [];
        const totalEmissions: number[] = [];
        const fixedCombustion: number[] = [];
        const mobileCombustion: number[] = [];
        const processEmissions: number[] = [];
        const electricity: number[] = [];
        const steam: number[] = [];

        dataRows.forEach((row: any) => {
          if (row[0] && row[2] && row[5] && row[8] && row[9]) {
            // Year, Scope 1, Total Emissions이 존재하는 경우만 추가
            years.push(row[0]); // Year
            scope1.push(row[2] || 0); // Scope 1
            scope2.push(row[5] || 0); // Scope 2
            scope3.push(row[8] || 0); // Scope 3
            totalEmissions.push(row[9] || 0); // Total Emissions

            // 스택형 바 차트 데이터 추가
            fixedCombustion.push(row[3] || 0);
            mobileCombustion.push(row[4] || 0);
            processEmissions.push(row[6] || 0);
            electricity.push(row[7] || 0);
            steam.push(row[8] || 0);
          }
        });

        // 연도별 총 배출량 계산
        const calculatedTotalEmissions = fixedCombustion.map(
          (val, index) =>
            val +
            mobileCombustion[index] +
            processEmissions[index] +
            electricity[index] +
            steam[index]
        );

        // 퍼센트 계산
        const fixedCombustionPercent = fixedCombustion.map(
          (val, index) => (val / calculatedTotalEmissions[index]) * 100
        );
        const mobileCombustionPercent = mobileCombustion.map(
          (val, index) => (val / calculatedTotalEmissions[index]) * 100
        );
        const processEmissionsPercent = processEmissions.map(
          (val, index) => (val / calculatedTotalEmissions[index]) * 100
        );
        const electricityPercent = electricity.map(
          (val, index) => (val / calculatedTotalEmissions[index]) * 100
        );
        const steamPercent = steam.map(
          (val, index) => (val / calculatedTotalEmissions[index]) * 100
        );

        // 예시 데이터 (실제 데이터 처리 로직으로 대체해야 함)
        setTotalEmissions(68024.49);
        setPieData({
          labels: ['Scope 1', 'Scope 2', 'Scope 3'],
          datasets: [{
            data: [scope1, scope2, scope3],
            backgroundColor: ['#4CAF50', '#2196F3', '#9C27B0'],
          }],
        });
        setBarData({
          labels: ['2020', '2021', '2022', '2023', '2024'],
          datasets: [{
            data: [100, 90, 70, 80, 60],
            backgroundColor: '#4CAF50',
          }],
        });
        setCategoryData([
          { name: 'Fixed Combustion', value: fixedCombustionPercent },
          { name: 'Mobile Combustion', value: mobileCombustionPercent },
          { name: 'Process Emissions', value: processEmissionsPercent },
          { name: 'Electricity', value: electricityPercent },
          { name: 'Steam', value: steamPercent },
        ]);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: "24px" }}>탄소 배출량 대시보드</h1>
      <a href="/sample.xlsx" download>
        예시 엑셀 파일 다운로드
      </a>
      <p>위 형식에 맞춰 엑셀 파일을 작성한 후 업로드하세요.</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

      {totalEmissions > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div>
            <h2>Total Carbon Emissions</h2>
            <h1>{totalEmissions.toLocaleString()} tCO2e</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '50%' }}>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
            <div style={{ width: '50%' }}>
              <h3>Annual Carbon Emissions Statistics</h3>
              <p>Current reduction rate of 34%</p>
              <p>Cut by 60% by 2030</p>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h3>Category</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {categoryData.map((item: any, index: number) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;