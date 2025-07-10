import React, { useState, useEffect } from "react";
import InfoCardComponent from "../../Components/InfoCardComponent";
import CircularProgress from "../../Components/CircularProgress";
import AlertCard from "../../Components/AlertCard";
import ParticleAnimation from "../../Components/Particle/ParticleAnimation";
import BLT from "../../assets/Images/BLT.jpg";
import EquipmentOverview from "./EquipmentOverview";
import AlertBarGraph from "../../Components/AlertBarGraph";
import ComplianceBarGraph from "../../Components/ComplianceBarGraph";
import VisualizationPanel from "../../Components/VisualizationPanel";
import AlertSummaryBox from "../../Components/AlertSummaryBox";
import TrendAnalysisModal from "../../Components/TrendAnalysisModal";
import { parameterAPI } from "../../Services/api";
import { equipmentAPI } from "../../Services/api";
import { dashboardAPI } from "../../Services/api";
import HealthBar from "../../Components/HealthBar";

const IndustrialDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardOverview, setDashboardOverview] = useState(null);
  const [dashboardHealth, setDashboardHealth] = useState(null);

  console.log("IndustrialDashboard component loaded");

  useEffect(() => {
    const fetchBLTParameters = async () => {
      setLoading(true);
      try {
        // Fetch all equipment and find BLT
        const equipmentRes = await equipmentAPI.getAll();
        const bltEquipment = equipmentRes.data.find(
          (eq) => eq.name && eq.name.toLowerCase() === "blt"
        );
        console.log("BLT Equipment:", bltEquipment);
        if (!bltEquipment) {
          setParameters([]);
          setLoading(false);
          return;
        }
        // Fetch all parameters and filter for BLT
        const paramRes = await parameterAPI.getAll({ limit: 50 });
        console.log("All Parameters:", paramRes.data);
        const bltParameters = paramRes.data.filter(
          (param) => param.equipmentId?.toString() === bltEquipment._id?.toString()
        );
        console.log("Filtered BLT Parameters:", bltParameters);
        parameters.forEach(param => {
          console.log('Parameter:', param.displayName, 'Equipment:', param.equipment);
        });
        setParameters(bltParameters);
      } catch (err) {
        setParameters([]);
        console.error("Error fetching BLT parameters:", err);
      }
      setLoading(false);
    };
    fetchBLTParameters();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const overviewRes = await dashboardAPI.getOverview();
        setDashboardOverview(overviewRes.data);
        const healthRes = await dashboardAPI.getHealth();
        setDashboardHealth(healthRes.data);
      } catch (err) {
        setDashboardOverview(null);
        setDashboardHealth(null);
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleCardClick = (parameter) => {
    setSelectedParameter(parameter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParameter(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading BLT parameters...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl px-2 mx-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Left Parameters */}
          <div className="bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-5 h-5">⚙️</span>
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(0, Math.ceil(parameters.length/2)).map((param, index) => (
                <InfoCardComponent
                  key={param._id || index}
                  title={param.displayName}
                  amount={param.target + (param.unit ? ` ${param.unit}` : "")}
                  value={param.target}
                  ucl={param.ucl}
                  lcl={param.lcl}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Image + Compliance */}
          <div className="space-y-4 col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-2">
              <div className="relative w-full h-120 mx-auto">
                <img
                  src={BLT}
                  alt="BLT Diagram"
                  className="w-full h-full object-contain rounded-md"
                />
                <ParticleAnimation />
              </div>
              {/* Bottom Parameters below image */}
            </div>
              <div className="flex justify-around bg-white rounded-lg shadow-sm border p-4 mt-4">
                {/* Optionally show some parameters here if needed */}
              </div>

            {/* Visualization Panel */}
          </div>

          {/* Right Parameters */}
          <div className="bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-5 h-5">⚙️</span>
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(Math.ceil(parameters.length/2)).map((param, index) => (
                <InfoCardComponent
                  key={param._id || index}
                  title={param.displayName}
                  amount={param.target + (param.unit ? ` ${param.unit}` : "")}
                  value={param.target}
                  ucl={param.ucl}
                  lcl={param.lcl}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Right Alerts Section */}
          <div className="space-y- col-span-1">
            {/* Recent Alerts */}
            {/* <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-5 h-5">⚠️</span>
                Recent Alerts
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>BFT spout time • BF2 spout response time</div>
                <div>CSPT opening time • CSV2 open response time</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <AlertCard count="654" type="Total" color="green" />
                <AlertCard count="39" type="Open" color="yellow" />
                <AlertCard count="395" type="Closed" color="red" />
                <AlertCard count="6" type="Ack" color="blue" />
              </div>
            </div> */}
            <AlertSummaryBox />
            <div className="">
              {/* Alert Graph */}
              <div className="">
                <AlertBarGraph
                  data={dashboardOverview ? [
                    { name: "Charge", value: dashboardOverview.alertParameters || 0 },
                    { name: "Valve", value: dashboardOverview.activeParameters || 0 },
                    { name: "Cooling", value: dashboardOverview.normalParameters || 0 },
                    { name: "Hydraulic", value: dashboardOverview.totalParameters || 0 },
                  ] : undefined}
                />
              </div>
              <div className="">
                <ComplianceBarGraph value={dashboardOverview ? dashboardOverview.overallHealth : 0} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
              <div className="font-semibold text-center mb-2">Overall Health</div>
              <div className="flex items-center gap-2 mb-4">
                <span>{dashboardHealth?.overall?.healthPercentage || 0}%</span>
                <HealthBar percentage={dashboardHealth?.overall?.healthPercentage || 0} />
              </div>
            </div>
          </div>
          <div className="col-span-1 mt-37 ml-6">
            <VisualizationPanel />
          </div>
        </div>
      </div>
      <TrendAnalysisModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parameter={selectedParameter}
      />
    </div>
  );
};

export default IndustrialDashboard;
