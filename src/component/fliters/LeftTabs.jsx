import React from "react";

const LeftTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="filter-left">
      {tabs.map(tab => (
        <div
          key={tab.key}
          className={`filter-tab ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default LeftTabs;