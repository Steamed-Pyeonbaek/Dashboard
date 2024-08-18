// src/Dashboard.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
// import { calculateNewValue } from "@testing-library/user-event/dist/utils";

Chart.register(...registerables);


const Dashboard: React.FC = () => {
  const [totalEmissions, setTotalEmissions] = useState<number[]>([]);
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
        try {
          const binaryStr = e.target?.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
          // 데이터 시작 행 찾기
          const dataStartIndex = jsonData.findIndex((row: any[]) => row[0] === "Year");
          if (dataStartIndex === -1) throw new Error("Year column not found");
  
          // 실제 데이터는 "Year" 행 다음부터 시작
          const dataRows = jsonData.slice(dataStartIndex + 2);
          
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
            if (row[0] && row[4] && row[7] && row[8] && row[9]) {
              years.push(row[0]); // Year
              fixedCombustion.push(Number(row[1]) || 0);
              mobileCombustion.push(Number(row[2]) || 0);
              processEmissions.push(Number(row[3]) || 0);
              scope1.push(Number(row[4]) || 0); // Scope 1 Subtotal
              electricity.push(Number(row[5]) || 0);
              steam.push(Number(row[6]) || 0);
              scope2.push(Number(row[7]) || 0); // Scope 2 Subtotal
              scope3.push(Number(row[8]) || 0); // Scope 3
              totalEmissions.push(Number(row[9]) || 0); // Total
            }
          });
  
          // 가장 최근 년도의 데이터
          const latestIndex = years.length - 1;
  
          // 원형 차트 데이터 설정
          setPieData({
            labels: ['Scope 1', 'Scope 2', 'Scope 3'],
            datasets: [{
              data: [scope1[latestIndex], scope2[latestIndex], scope3[latestIndex]],
              backgroundColor: ['#4CAF50', '#2196F3', '#9C27B0'],
            }],
          });
  
          // 막대 차트 데이터 설정
          setBarData({
            labels: years,
            datasets: [{
              data: totalEmissions,
              backgroundColor: '#4CAF50',
            }],
          });
  
          // 카테고리 데이터 설정
          const latestTotal = totalEmissions[latestIndex];
          setCategoryData([
            { name: 'Fixed Combustion', value: `${fixedCombustion[latestIndex].toFixed(1)} tCO2e (${((fixedCombustion[latestIndex] / latestTotal) * 100).toFixed(1)}%)` },
            { name: 'Mobile Combustion', value: `${mobileCombustion[latestIndex].toFixed(1)} tCO2e (${((mobileCombustion[latestIndex] / latestTotal) * 100).toFixed(1)}%)` },
            { name: 'Process Emissions', value: `${processEmissions[latestIndex].toFixed(1)} tCO2e (${((processEmissions[latestIndex] / latestTotal) * 100).toFixed(1)}%)` },
            { name: 'Electricity', value: `${electricity[latestIndex].toFixed(1)} tCO2e (${((electricity[latestIndex] / latestTotal) * 100).toFixed(1)}%)` },
            { name: 'Steam', value: `${steam[latestIndex].toFixed(1)} tCO2e (${((steam[latestIndex] / latestTotal) * 100).toFixed(1)}%)` },
          ]);
  
          // 총 배출량 설정
          setTotalEmissions([totalEmissions[latestIndex]]);
  
        } catch (error) {
          console.error("Error processing file:", error);
          alert("Error processing file. Please check the file format and try again.");
        }
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
  
        { totalEmissions.length > 0 && (
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