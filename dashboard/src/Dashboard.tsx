// src/Dashboard.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
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

                // 데이터 시작 행 찾기 (Year 셀 병합 고려)
                const dataStartIndex = jsonData.findIndex((row: any[]) =>
                    row.some(cell => typeof cell === 'string' && cell.trim() === "Year")
                );
                if (dataStartIndex === -1) throw new Error("Year column not found");

                // 데이터 행을 시작하는 인덱스 (Year 행 다음부터 시작)
                const dataRows = jsonData.slice(dataStartIndex + 1);

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

                dataRows.forEach((row: any[], rowIndex) => {
                    // 병합된 셀을 고려하여 필요한 열에 데이터가 있는지 확인
                    const year = row[0] || (rowIndex > 0 ? years[rowIndex - 1] : null); // 병합된 셀 고려
                    const fixed = row[2];
                    const mobile = row[3];
                    const process = row[4];
                    const sc1 = row[5];
                    const elec = row[6];
                    const stm = row[7];
                    const sc2 = row[8];
                    const sc3 = row[9];
                    const total = row[10];

                    if (year && sc1 && sc2 && sc3 && total) {
                        years.push(year); // Year
                        fixedCombustion.push(Number(fixed) || 0);  // Fixed Combustion
                        mobileCombustion.push(Number(mobile) || 0); // Mobile Combustion
                        processEmissions.push(Number(process) || 0); // Process Emissions
                        scope1.push(Number(sc1) || 0); // Scope 1 Subtotal
                        electricity.push(Number(elec) || 0); // Electricity
                        steam.push(Number(stm) || 0); // Steam
                        scope2.push(Number(sc2) || 0); // Scope 2 Subtotal
                        scope3.push(Number(sc3) || 0); // Scope 3
                        totalEmissions.push(Number(total) || 0); // Total Emissions
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
    <h1 style={{ fontSize: "24px" }}>Carbon Emissions Dashboard</h1>
    <a href="/sample.xlsx" download>
    <FontAwesomeIcon 
            icon={faFileDownload} 
            size="2x" 
            style={{
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: '#666666',
              cursor: 'pointer'
            }} 
          />
    </a>
    <p>Please fill out the Excel file according to the format above and upload it.</p>
    <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
  
    {totalEmissions.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <h3>Total Carbon Emissions</h3>
          <h2>{totalEmissions.toLocaleString()} tCO2e</h2>
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