const RightPanels = ({ tabs, activeTab, filters, setFilters }) => {
  const active = tabs.find(t => t.key === activeTab);
  const ActiveComponent = active?.component;

  return (
    <div className="filter-right">
      {ActiveComponent && (
        <ActiveComponent filters={filters} setFilters={setFilters} />
      )}
    </div>
  );
};

export default RightPanels;