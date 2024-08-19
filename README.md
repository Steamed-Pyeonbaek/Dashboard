# green up
### Carbon Emission Reduction Consulting AI Service Based on Carbon Inventory

![greenup Logo](https://github.com/user-attachments/assets/988463c0-0289-4333-9dcc-6ed9893138e5)

With the growing interest in reducing carbon emissions and protecting the environment, accurate management of carbon emissions and effective reduction strategies are required for both businesses and individuals.

green up reflects the rapidly increasing demand for carbon neutrality and ESG (Environmental, Social, and Governance) management, supporting SMEs (Small and Medium-sized Enterprises) in systematically managing their carbon emissions and establishing effective reduction plans.

Based on the carbon emission data provided by users, green up creates a carbon inventory and proposes reduction measures through **a dashboard and AI consulting feature using Solar LLM**. green up aims to help SMEs facing complex ESG challenges.

# Table of Contents
1. [Current Development Status](#current-development-status)
    1. [Dashboard Page](#dashboard-page)
2. [Future Development Directions](#future-development-directions)
3. [Technology Stack](#technology-stack)
4. [How to Use green up](#how-to-use-green-up)
    1. [Install green up](#install-green-up)
    2. [Run green up](#run-green-up)
5. [Demo Video](#demo-video)
6. [Team Members and Roles](#team-members-and-roles)

## Current Development Status

Currently, both the **AI Chat Page** and the **Dashboard Page** have been implemented. Essential features for each page have been completed. Future development will involve adding detailed features to the **Dashboard Page** and refactoring to ensure smooth integration with the **AI Chat Page**.

### 1. Dashboard Page

After analyzing the data provided by the user via an uploaded Excel file, the AI directs the user to the dashboard page to visually confirm the analysis results. The dashboard page offers the following features:

1. Total Carbon Emissions: Displays the total carbon emissions calculated from the uploaded data. This value sums all emissions within the Scope 1, 2, and 3 categories.
2. Pie Chart: Visually shows emissions within Scope 1, 2, and 3. Scope 1 includes direct emissions from stationary combustion, mobile combustion, and process emissions. Scope 2 includes indirect emissions from electricity and steam use.
3. Bar Chart: Visualizes the change in total annual carbon emissions. This helps users easily understand the trend of carbon emissions over time.
4. Emissions by Category: Provides detailed emissions for each category, such as stationary combustion, mobile combustion, process emissions, electricity use, and steam use. Each item is displayed in tCO2e (tonnes of CO2 equivalent).
5. PDF Report Download: Allows users to download the analysis results in PDF format.

## Future Development Directions

-Connect AI Chat Page to Dashboard Page<br/> 
-DashBoard Data-Based Report Generation (PDF)<br/> 
-Reflect dashboard data LLM<br/> 
-SBTi-based Target Emissions Recommendation and Setting System<br/> 
-Automatically build inventory linked to open banking API


## Technology Stack

- **React**
- **TypeScript**

## How to Use green up

### 1. Install green up

'''git clone https://github.com/your-repo/greenup.git
cd greenup
'''


### 2. Run green up

'''npm install
npm start
'''


Once the server is running, you can open the green up web page in your browser by navigating to http://localhost:3000.

## Demo Video

https://github.com/user-attachments/assets/88d45e6b-e065-4e74-ba61-eb13f9c55ad7


## Team Members and Roles

| [<img src="https://github.com/Drizzle03.png" width="100px">](https://github.com/Drizzle03) | [<img src="https://github.com/seulnan.png" width="100px">](https://github.com/seulnan) | [<img src="https://github.com/junekyu02.png" width="100px">](https://github.com/junekyu02) | [<img src="https://github.com/jakepro657.png" width="100px">](https://github.com/jakepro657) |
| :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
| [Yuna Pyeon](https://github.com/Drizzle03) | [nanseul Kim](https://github.com/seulnan) | [junekyu Baek](https://github.com/junekyu02) | [Yubin Kim](https://github.com/jakepro657) |
| PM <br> Design | Frontend | Backend | AI |
