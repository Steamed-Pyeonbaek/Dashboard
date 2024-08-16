// src/Dashboard.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);

const Dashboard: React.FC = () => {
  const [lineData, setLineData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [barData, setBarData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // 데이터 확인
        console.log(jsonData); // 데이터 구조 확인

        // 필요한 데이터 추출: 4번째 행부터 시작
        const dataRows = jsonData.slice(4); // 실제 데이터는 5번째 행부터 시작
        const years: string[] = [];
        const scope1: number[] = [];
        const scope2: number[] = [];
        const totalEmissions: number[] = [];
        const energyUsage: number[] = [];
        const fixedCombustion: number[] = [];
        const mobileCombustion: number[] = [];
        const processEmissions: number[] = [];
        const electricity: number[] = [];
        const steam: number[] = [];

        dataRows.forEach((row: any) => {
          if (row[0] && row[2] && row[5]) {
            // Year, Scope 1, Total Emissions이 존재하는 경우만 추가
            years.push(row[0]); // Year
            scope1.push(row[2] || 0); // Scope 1
            scope2.push(row[5] || 0); // Scope 2
            totalEmissions.push(row[9] || 0); // Total Emissions
            energyUsage.push(row[10] || 0);

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

        // 라인 차트 데이터 설정
        setLineData({
          labels: years,
          datasets: [
            {
              label: "Scope 1 (간접배출)",
              data: scope1,
              borderColor: "rgba(255, 99, 132, 1)",
              fill: false,
            },
            {
              label: "Scope 2 (직접배출)",
              data: scope2,
              borderColor: "rgba(54, 162, 235, 1)",
              fill: false,
            },
            {
              label: "총 배출량",
              data: totalEmissions,
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
            {
              label: "연도별 에너지사용량(TJ)",
              data: energyUsage,
              borderColor: "rgba(153, 102, 255, 1)",
              fill: false,
            },
          ],
        });

        // 스택형 바 차트 데이터 설정
        setBarData({
          labels: years,
          datasets: [
            {
              label: "고정연소",
              data: fixedCombustionPercent,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "이동연소",
              data: mobileCombustionPercent,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "공정배출",
              data: processEmissionsPercent,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "전력",
              data: electricityPercent,
              backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
            {
              label: "스팀",
              data: steamPercent,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <h1>온실가스 배출량 대시보드</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

      {lineData.labels.length > 0 && (
        <div>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Scope별 배출량(tCO2eq)",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "배출량 (tCO2eq)",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {barData.labels.length > 0 && (
        <div>
          <Bar
            data={{
              labels: barData.labels,
              datasets: barData.datasets,
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "영역별 배출량(tCO2eq)",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: "Percentage (%)",
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
