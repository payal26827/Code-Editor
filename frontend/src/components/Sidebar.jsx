function Sidebar({
  codes = [],
  selectCode,
  deleteCode,
  selectedId,
}) {
  return (
    <aside className="sidebar">

      <h2 className="saved-title">
        Saved Codes
      </h2>

      <div className="saved-codes-list">

        {codes.length === 0 ? (
          <p className="no-codes">
            No saved codes
          </p>
        ) : (
          codes.map((item) => (
            <div
              key={item._id}
              className={`code-card ${
                selectedId === item._id
                  ? "selected"
                  : ""
              }`}
              onClick={() => selectCode(item)}
            >

              <div className="code-card-info">

                <h3>
                  {item.title}
                </h3>

                <span>
                  {item.language === "cpp"
                    ? "C++"
                    : item.language}
                </span>

              </div>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCode(item._id);
                }}
              >
                🗑️
              </button>

            </div>
          ))
        )}

      </div>

    </aside>
  );
}

export default Sidebar;