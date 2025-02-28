import React, { useState } from "react";
import "./SearchForm.css"; // Optional CSS file for styling

const SearchForm = ({ onSearch }) => {
  // Define available fields and conditions
  const availableFields = [
    "Giá chào hợp đồng (Triệu VNĐ)",
    "Mặt tiền (m)",
    "Diện tích thực tế (m)",
    "Mô tả",
    "Quận huyện",
    "Tỉnh thành",
  ];

  const conditionTypes = {
    number: ["=", ">", "<", ">=", "<=", "between"],
    text: ["contains", "starts with", "ends with"],
  };

  // State to manage search conditions
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle adding a new condition
  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: "", condition: "", value: "", value2: "" }, // value2 is for "between"
    ]);
  };

  // Handle removing a condition
  const removeCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  // Handle updating a condition
  const updateCondition = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert conditions to query parameters
    const queryParams = conditions
      .map((cond) => {
        if (cond.condition === "between") {
          return `${cond.field}_gte=${cond.value}&${cond.field}_lte=${cond.value2}`;
        } else if (cond.condition === "contains") {
          return `${cond.field}_regex=${encodeURIComponent(cond.value)}`;
        } else {
          return `${cond.field}=${encodeURIComponent(cond.value)}`;
        }
      })
      .join("&");
try {
      const response = await fetch(`/api/listings/search?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      onSearch(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    if (onSearch) {
      onSearch(conditions); // Pass conditions to parent component
    }
  };

  return (
    <div className="search-form">
      <h3>Search Listings</h3>
      <form onSubmit={handleSubmit}>
        {conditions.map((cond, index) => (
          <div key={index} className="condition-row">
            {/* Field Selection */}
            <select
              value={cond.field}
              onChange={(e) => updateCondition(index, "field", e.target.value)}
            >
              <option value="">Select Field</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>

            {/* Condition Selection */}
            <select
              value={cond.condition}
              onChange={(e) =>
                updateCondition(index, "condition", e.target.value)
              }
              disabled={!cond.field}
            >
              <option value="">Select Condition</option>
              {cond.field &&
                conditionTypes[
                  [
                    "Giá chào hợp đồng (Triệu VNĐ)",
                    "Mặt tiền (m)",
                    "Diện tích thực tế (m)",
                  ].includes(cond.field)
                    ? "number"
                    : "text"
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            {/* Value Input (Single Input) */}
            {cond.condition !== "between" ? (
              <input
                type="text"
                placeholder="Enter value"
                value={cond.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
                disabled={!cond.condition}
              />
            ) : (
              // Two Inputs for "between" condition
              <>
                <input
                  type="number"
                  placeholder="Min value"
                  value={cond.value}
                  onChange={(e) =>
                    updateCondition(index, "value", e.target.value)
                  }
                  disabled={!cond.condition}
                />
                <span> - </span>
                <input
                  type="number"
                  placeholder="Max value"
                  value={cond.value2}
                  onChange={(e) =>
                    updateCondition(index, "value2", e.target.value)
                  }
                  disabled={!cond.condition}
                />
              </>
            )}

            {/* Remove Button */}
            <button type="button" onClick={() => removeCondition(index)}>
              ❌
            </button>
          </div>
        ))}

        {/* Add Condition Button */}
        <button type="button" className="add-condition" onClick={addCondition}>
          ➕ Add Condition
        </button>

        {/* Submit Button */}
        <button type="submit" className="search-btn">
          🔍 Search
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
